require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const HierarchyConfig = require('../models/HierarchyConfig');
const Grievance = require('../models/Grievance');
const EscalationLog = require('../models/EscalationLog');
const Notification = require('../models/Notification');
const DEFAULT_HIERARCHIES = require('../config/defaultHierarchy');
const { hashIdentifier } = require('./hashUtil');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grievance_tracker';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to database:', mongoUri);

    // 1. Seed Hierarchies
    console.log('[Seeder] Seeding Hierarchy Configurations...');
    for (const h of DEFAULT_HIERARCHIES) {
      await HierarchyConfig.findOneAndUpdate(
        { category: h.category },
        h,
        { upsert: true, new: true }
      );
    }
    console.log(`[Seeder] Seeded ${DEFAULT_HIERARCHIES.length} category hierarchies.`);

    // 2. Seed Default Users
    console.log('[Seeder] Seeding Default Users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password123!', salt);

    const defaultUsers = [
      {
        name: 'Alex Mercer',
        email: 'alex.student@university.edu',
        passwordHash,
        role: 'student',
        department: 'Computer Science',
      },
      {
        name: 'Dr. Robert Langdon',
        email: 'instructor@university.edu',
        passwordHash,
        role: 'authority',
        hierarchyLevel: 1,
        department: 'Computer Science',
      },
      {
        name: 'Dr. Sarah Jenkins',
        email: 'hod.cs@university.edu',
        passwordHash,
        role: 'authority',
        hierarchyLevel: 2,
        department: 'Computer Science',
      },
      {
        name: 'Prof. Arthur Vance',
        email: 'dean.academics@university.edu',
        passwordHash,
        role: 'authority',
        hierarchyLevel: 3,
        department: 'Academic Affairs',
      },
      {
        name: 'Campus Administrator',
        email: 'admin@university.edu',
        passwordHash,
        role: 'admin',
      },
    ];

    const seededUsers = {};
    for (const u of defaultUsers) {
      const user = await User.findOneAndUpdate(
        { email: u.email },
        u,
        { upsert: true, new: true }
      );
      seededUsers[u.role + (u.hierarchyLevel ? `_lvl${u.hierarchyLevel}` : '')] = user;
    }
    console.log('[Seeder] Seeded default users (Student, Authorities, Admin).');

    // 3. Seed Sample Grievances if empty
    const grievanceCount = await Grievance.countDocuments();
    if (grievanceCount === 0) {
      console.log('[Seeder] Seeding initial demo grievances...');
      const student = seededUsers.student;
      const studentHash = hashIdentifier(student._id.toString());

      const sampleGrievances = [
        {
          trackingToken: 'GET-2026-7812',
          title: 'Compiler Toolchain Outdated in OS Practical Lab 3',
          category: 'Academic',
          department: 'Computer Science',
          priority: 'HIGH',
          description:
            'Hardware workstations in Lab 3 have not had the LLVM / GCC toolchain updated for the semester project. Practical evaluations are failing due to compiler discrepancy.',
          isAnonymous: false,
          complainantId: student._id,
          submittedByHash: studentHash,
          currentLevel: 1,
          status: 'In-Review',
          slaDeadline: new Date(Date.now() + 18 * 3600 * 1000), // 18 hours remaining
          slaHoursTotal: 24,
        },
        {
          trackingToken: 'GET-2026-4091',
          title: 'Frequent Hot Water Disruptions in Hostel Block B',
          category: 'Hostel',
          department: 'Hostel Operations',
          priority: 'MEDIUM',
          description:
            'The solar geyser backup heater on the 3rd floor of Block B has been tripping the circuit breaker every morning between 6:00 AM and 8:30 AM.',
          isAnonymous: true,
          complainantId: null,
          submittedByHash: hashIdentifier('anon_hostel_student_01'),
          currentLevel: 2,
          status: 'Escalated',
          slaDeadline: new Date(Date.now() + 32 * 3600 * 1000),
          slaHoursTotal: 48,
        },
        {
          trackingToken: 'GET-2026-1945',
          title: 'Projector Display Artifacts in Main Auditorium Hall A',
          category: 'Infrastructure',
          department: 'General',
          priority: 'LOW',
          description:
            'Severe blue tint and flicker during technical symposium rehearsals in Auditorium Hall A.',
          isAnonymous: false,
          complainantId: student._id,
          submittedByHash: studentHash,
          currentLevel: 1,
          status: 'Resolved',
          slaDeadline: new Date(Date.now() - 5 * 3600 * 1000),
          slaHoursTotal: 24,
          resolutionRemarks: 'HDMI distribution amplifier replaced and calibrated by maintenance team.',
          resolvedAt: new Date(Date.now() - 4 * 3600 * 1000),
        },
      ];

      for (const g of sampleGrievances) {
        const createdGrievance = await Grievance.create(g);
        await EscalationLog.create({
          grievanceId: createdGrievance._id,
          fromLevel: 1,
          toLevel: g.currentLevel,
          reason: g.status === 'Escalated' ? 'SLA expired: Automatically escalated to Tier 2' : 'Initial submission',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000),
        });
      }

      console.log(`[Seeder] Seeded ${sampleGrievances.length} sample grievances with escalation logs.`);
    }

    console.log('[Seeder] Database successfully prepared!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error] Failed seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
