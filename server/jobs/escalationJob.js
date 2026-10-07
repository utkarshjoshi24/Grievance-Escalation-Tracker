const cron = require('node-cron');
const Grievance = require('../models/Grievance');
const HierarchyConfig = require('../models/HierarchyConfig');
const EscalationLog = require('../models/EscalationLog');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Evaluates active grievances against SLA deadlines and atomically escalates overdue tickets.
 */
const runEscalationCheck = async () => {
  try {
    const now = new Date();
    // Find active tickets that breached their SLA deadline
    const expiredGrievances = await Grievance.find({
      status: { $in: ['Pending', 'In-Review'] },
      slaDeadline: { $lte: now },
    });

    if (expiredGrievances.length === 0) {
      return { processed: 0 };
    }

    console.log(`[SLA Escalation Engine] Found ${expiredGrievances.length} tickets requiring escalation.`);

    for (const ticket of expiredGrievances) {
      try {
        const hierarchy = await HierarchyConfig.findOne({ category: ticket.category });
        const maxLevel = hierarchy?.levels?.length || 4;
        const fromLevel = ticket.currentLevel;

        if (fromLevel < maxLevel) {
          const nextLevel = fromLevel + 1;
          const nextTierConfig = hierarchy?.levels?.find((l) => l.levelNumber === nextLevel);
          const nextSlaHours = nextTierConfig?.slaHours || 48;
          const newDeadline = new Date(now.getTime() + nextSlaHours * 3600 * 1000);

          ticket.currentLevel = nextLevel;
          ticket.status = 'Escalated';
          ticket.slaDeadline = newDeadline;
          ticket.slaHoursTotal = nextSlaHours;
          await ticket.save();

          await EscalationLog.create({
            grievanceId: ticket._id,
            fromLevel,
            toLevel: nextLevel,
            reason: `SLA expired at Tier ${fromLevel}. Automatically escalated to Tier ${nextLevel} (${nextTierConfig?.roleTitle || 'Next Authority'})`,
            escalatedBy: null,
            timestamp: now,
          });

          if (ticket.complainantId) {
            await Notification.create({
              userId: ticket.complainantId,
              title: `Auto-Escalation: Tier ${nextLevel}`,
              message: `Grievance ${ticket.trackingToken} was automatically escalated to Tier ${nextLevel} due to resolution deadline expiry.`,
              type: 'ESCALATION',
              grievanceToken: ticket.trackingToken,
            });
          }

          // Notify next tier authorities
          try {
            const nextAuthorities = await User.find({
              role: 'authority',
              hierarchyLevel: nextLevel,
              $or: [
                { department: ticket.department },
                { department: 'General' },
                { department: 'Institutional General' },
                { department: null },
              ],
            });

            for (const authUser of nextAuthorities) {
              await Notification.create({
                userId: authUser._id,
                title: `Auto-Escalated Ticket: Tier ${nextLevel}`,
                message: `Grievance ${ticket.trackingToken} ("${ticket.title}") has breached Tier ${fromLevel} SLA and is now in your queue.`,
                type: 'ESCALATION',
                grievanceToken: ticket.trackingToken,
              });
            }
          } catch (nErr) {
            console.warn('[Escalation Job] Could not notify next tier authorities:', nErr.message);
          }

          console.log(`[SLA Engine] Ticket ${ticket.trackingToken} escalated from Level ${fromLevel} to ${nextLevel}.`);
        } else {
          // Already at top tier
          ticket.status = 'Overdue - Top Level';
          await ticket.save();

          await EscalationLog.create({
            grievanceId: ticket._id,
            fromLevel,
            toLevel: fromLevel,
            reason: `SLA expired at apex tier. Ticket marked as 'Overdue - Top Level' for executive audit.`,
            escalatedBy: null,
            timestamp: now,
          });

          if (ticket.complainantId) {
            await Notification.create({
              userId: ticket.complainantId,
              title: 'Apex SLA Breach Alert',
              message: `Grievance ${ticket.trackingToken} has breached top-tier SLA and has been flagged for institutional review.`,
              type: 'ALERT',
              grievanceToken: ticket.trackingToken,
            });
          }

          console.log(`[SLA Engine] Ticket ${ticket.trackingToken} marked as Overdue - Top Level.`);
        }
      } catch (err) {
        console.error(`[SLA Engine Error] Failed processing ticket ${ticket._id}:`, err.message);
      }
    }

    return { processed: expiredGrievances.length };
  } catch (error) {
    console.error('[SLA Engine Error] Cron execution failed:', error.message);
    return { error: error.message };
  }
};

/**
 * Initializes cron schedule: runs every 2 minutes
 */
const initEscalationJob = () => {
  cron.schedule('*/2 * * * *', async () => {
    console.log('[SLA Escalation Engine] Running periodic SLA audit check...');
    await runEscalationCheck();
  });
  console.log('[SLA Escalation Engine] Background cron worker scheduled (every 2 minutes).');
};

module.exports = {
  initEscalationJob,
  runEscalationCheck,
};
