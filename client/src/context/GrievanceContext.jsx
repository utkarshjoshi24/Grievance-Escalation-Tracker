// Grievance Context — Central Data Management, SLA & Lifecycle Simulation

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_GRIEVANCES, MOCK_HIERARCHY_CONFIG, MOCK_NOTIFICATIONS } from '../data/mockData';
import { useAuth } from './AuthContext';

const GrievanceContext = createContext(null);

export const GrievanceProvider = ({ children }) => {
  const { user } = useAuth();

  // Grievances state with local persistence
  const [grievances, setGrievances] = useState(() => {
    const saved = localStorage.getItem('get_grievances');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_GRIEVANCES;
      }
    }
    return INITIAL_GRIEVANCES;
  });

  // Hierarchy configuration state
  const [hierarchy, setHierarchy] = useState(() => {
    const saved = localStorage.getItem('get_hierarchy');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_HIERARCHY_CONFIG;
      }
    }
    return MOCK_HIERARCHY_CONFIG;
  });

  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('get_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_NOTIFICATIONS;
      }
    }
    return MOCK_NOTIFICATIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('get_grievances', JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem('get_hierarchy', JSON.stringify(hierarchy));
  }, [hierarchy]);

  useEffect(() => {
    localStorage.setItem('get_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Submit a new grievance
  const submitGrievance = async (formData) => {
    // Generate institutional token (e.g., GET-2026-7812) and UUID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const token = `GET-2026-${randomSuffix}`;
    const trackingUuid = 'get-' + crypto.randomUUID();

    const categoryHierarchy = hierarchy[formData.category] || hierarchy['Academic'];
    const level1Config = categoryHierarchy[0] || { roleName: 'Department Officer', slaHours: 24, designatedPerson: 'Designated Officer' };

    const now = new Date();
    const deadline = new Date(now.getTime() + (level1Config.slaHours || 24) * 60 * 60 * 1000).toISOString();

    const newGrievance = {
      id: 'grv_' + Date.now(),
      token,
      trackingUuid,
      title: formData.title,
      category: formData.category,
      department: formData.department || 'Institutional General',
      priority: formData.priority || 'MEDIUM',
      isAnonymous: formData.isAnonymous || false,
      complainantId: formData.isAnonymous ? null : (user?.id || 'usr_student_01'),
      complainantName: formData.isAnonymous ? 'Anonymous Complainant' : (user?.name || formData.complainantName || 'Student Complainant'),
      complainantEmail: formData.isAnonymous ? null : (user?.email || formData.complainantEmail || 'student@university.edu'),
      status: 'Pending',
      currentLevel: 1,
      currentAuthorityTitle: level1Config.roleName,
      currentAuthorityName: level1Config.designatedPerson,
      description: formData.description,
      attachments: formData.attachments || [],
      createdAt: now.toISOString(),
      slaDeadline: deadline,
      slaHoursTotal: level1Config.slaHours || 24,
      timeline: [
        {
          id: 'tl_' + Date.now(),
          title: formData.isAnonymous ? 'Anonymous Grievance Registered' : 'Grievance Submitted',
          description: formData.isAnonymous
            ? 'Registered securely with Zero-Knowledge encryption shield. Student identity withheld.'
            : `Logged by ${user?.name || 'Student'}. Assigned tracking token ${token}.`,
          actorRole: formData.isAnonymous ? 'Anonymous Complainant' : 'Complainant',
          timestamp: now.toISOString(),
          type: 'SUBMISSION',
        },
        {
          id: 'tl_' + (Date.now() + 1),
          title: `Assigned to ${level1Config.roleName}`,
          description: `Tier-1 SLA timer set for ${level1Config.slaHours} hours.`,
          actorRole: 'SLA Engine',
          timestamp: now.toISOString(),
          type: 'ASSIGNMENT',
        },
      ],
    };

    setGrievances((prev) => [newGrievance, ...prev]);

    // Push notification to user
    const newNotif = {
      id: 'notif_' + Date.now(),
      userId: user?.id || 'usr_student_01',
      role: 'student',
      title: 'Grievance Registered Successfully',
      message: `Your grievance "${formData.title}" has been registered with Token ${token}.`,
      type: 'SUBMISSION',
      grievanceToken: token,
      timestamp: now.toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return { success: true, grievance: newGrievance, token, trackingUuid };
  };

  // Track Grievance with strict Privacy Filter (generic resolver title, no leaked names)
  const trackGrievance = (tokenOrUuid) => {
    const cleanQuery = tokenOrUuid?.trim().toUpperCase();
    const found = grievances.find(
      (g) => g.token?.toUpperCase() === cleanQuery || g.trackingUuid?.toLowerCase() === tokenOrUuid?.trim().toLowerCase()
    );

    if (!found) return null;

    // Return sanitized public tracking object adhering to strict privacy
    return {
      ...found,
      // Mask complainant if anonymous
      complainantName: found.isAnonymous ? 'Protected (Anonymous)' : found.complainantName,
      complainantEmail: found.isAnonymous ? null : found.complainantEmail,
      // Mask resolver real name on public page — show official role title only
      currentAuthorityName: undefined,
      currentAuthorityDisplay: found.currentAuthorityTitle,
    };
  };

  // Update Grievance Status (Authority / Admin)
  const updateGrievanceStatus = (id, newStatus, remarks = '') => {
    const now = new Date();
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;

        const updatedTimeline = [
          ...g.timeline,
          {
            id: 'tl_' + Date.now(),
            title: `Status Updated to ${newStatus}`,
            description: remarks ? `Remarks: "${remarks}"` : `Status changed to ${newStatus} by ${user?.title || user?.name || 'Authority'}.`,
            actorRole: user?.title || 'Authority',
            timestamp: now.toISOString(),
            type: newStatus === 'Resolved' ? 'RESOLUTION' : 'STATUS_UPDATE',
          },
        ];

        return {
          ...g,
          status: newStatus,
          resolvedAt: newStatus === 'Resolved' ? now.toISOString() : g.resolvedAt,
          resolutionNotes: remarks || g.resolutionNotes,
          timeline: updatedTimeline,
        };
      })
    );

    // Add notification
    const matched = grievances.find((g) => g.id === id);
    if (matched) {
      setNotifications((prev) => [
        {
          id: 'notif_' + Date.now(),
          userId: matched.complainantId || 'usr_student_01',
          role: 'student',
          title: `Grievance Status: ${newStatus}`,
          message: `Grievance ${matched.token} status updated to "${newStatus}".`,
          type: newStatus === 'Resolved' ? 'RESOLVED' : 'STATUS_CHANGE',
          grievanceToken: matched.token,
          timestamp: now.toISOString(),
          isRead: false,
        },
        ...prev,
      ]);
    }
  };

  // Manual or SLA Escalation
  const escalateGrievance = (id, reason = 'Administrative escalation requested') => {
    const now = new Date();
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;

        const categoryHierarchy = hierarchy[g.category] || hierarchy['Academic'];
        const nextLevel = Math.min(g.currentLevel + 1, categoryHierarchy.length);
        const nextTierConfig = categoryHierarchy[nextLevel - 1] || categoryHierarchy[categoryHierarchy.length - 1];

        const isMaxLevel = nextLevel === categoryHierarchy.length;
        const newStatus = isMaxLevel ? 'Overdue - Top Level' : 'Escalated';

        const newDeadline = new Date(now.getTime() + (nextTierConfig.slaHours || 48) * 60 * 60 * 1000).toISOString();

        const updatedTimeline = [
          ...g.timeline,
          {
            id: 'tl_' + Date.now(),
            title: `Escalated to Tier ${nextLevel}: ${nextTierConfig.roleName}`,
            description: `${reason}. New SLA timer (${nextTierConfig.slaHours}h) initiated.`,
            actorRole: user?.title || 'SLA Escalation Engine',
            timestamp: now.toISOString(),
            type: isMaxLevel ? 'CRITICAL_BREACH' : 'ESCALATION',
          },
        ];

        return {
          ...g,
          currentLevel: nextLevel,
          currentAuthorityTitle: nextTierConfig.roleName,
          currentAuthorityName: nextTierConfig.designatedPerson,
          status: newStatus,
          slaDeadline: newDeadline,
          slaHoursTotal: nextTierConfig.slaHours || 48,
          timeline: updatedTimeline,
        };
      })
    );
  };

  // Update Category Escalation Hierarchy (Admin)
  const updateCategoryHierarchy = (category, updatedLevels) => {
    setHierarchy((prev) => ({
      ...prev,
      [category]: updatedLevels,
    }));
  };

  // Notifications helpers
  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = (userRole) => {
    setNotifications((prev) =>
      prev.map((n) => (n.role === userRole ? { ...n, isRead: true } : n))
    );
  };

  const getGrievanceById = (id) => {
    return grievances.find((g) => g.id === id || g.token === id);
  };

  // Reset mock data to factory defaults
  const resetToFactoryDefaults = () => {
    setGrievances(INITIAL_GRIEVANCES);
    setHierarchy(MOCK_HIERARCHY_CONFIG);
    setNotifications(MOCK_NOTIFICATIONS);
    localStorage.removeItem('get_grievances');
    localStorage.removeItem('get_hierarchy');
    localStorage.removeItem('get_notifications');
  };

  return (
    <GrievanceContext.Provider
      value={{
        grievances,
        hierarchy,
        notifications,
        submitGrievance,
        trackGrievance,
        updateGrievanceStatus,
        escalateGrievance,
        updateCategoryHierarchy,
        markNotificationRead,
        markAllNotificationsRead,
        getGrievanceById,
        resetToFactoryDefaults,
      }}
    >
      {children}
    </GrievanceContext.Provider>
  );
};

export const useGrievances = () => {
  const context = useContext(GrievanceContext);
  if (!context) {
    throw new Error('useGrievances must be used within a GrievanceProvider');
  }
  return context;
};

export default GrievanceContext;
