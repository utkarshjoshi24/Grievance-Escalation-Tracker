/**
 * Default Category Hierarchy Configuration
 * Defines default tiers, public role titles, and SLA hours
 */
const DEFAULT_HIERARCHIES = [
  {
    category: 'Academic',
    levels: [
      { levelNumber: 1, roleTitle: 'Course Instructor / Class Advisor', slaHours: 24 },
      { levelNumber: 2, roleTitle: 'Head of Department (HOD)', slaHours: 48 },
      { levelNumber: 3, roleTitle: 'Dean of Academic Affairs', slaHours: 72 },
      { levelNumber: 4, roleTitle: 'Vice Chancellor / Ombudsperson', slaHours: 96 },
    ],
  },
  {
    category: 'Hostel',
    levels: [
      { levelNumber: 1, roleTitle: 'Hostel Warden / Resident Advisor', slaHours: 24 },
      { levelNumber: 2, roleTitle: 'Chief Warden / Hostel Administrator', slaHours: 48 },
      { levelNumber: 3, roleTitle: 'Dean of Student Welfare (DSW)', slaHours: 72 },
      { levelNumber: 4, roleTitle: 'Campus Director', slaHours: 96 },
    ],
  },
  {
    category: 'Harassment',
    levels: [
      { levelNumber: 1, roleTitle: 'Internal Complaints Committee (ICC) Officer', slaHours: 12 },
      { levelNumber: 2, roleTitle: 'Presiding Officer - ICC', slaHours: 24 },
      { levelNumber: 3, roleTitle: 'Institutional Executive Committee', slaHours: 48 },
      { levelNumber: 4, roleTitle: 'Governing Body / Ombudsperson', slaHours: 72 },
    ],
  },
  {
    category: 'Infrastructure',
    levels: [
      { levelNumber: 1, roleTitle: 'Facility Supervisor / Maintenance Lead', slaHours: 24 },
      { levelNumber: 2, roleTitle: 'Estate & Works Officer', slaHours: 48 },
      { levelNumber: 3, roleTitle: 'Registrar / Campus Operations', slaHours: 72 },
    ],
  },
  {
    category: 'Faculty Conduct',
    levels: [
      { levelNumber: 1, roleTitle: 'Department Grievance Committee', slaHours: 24 },
      { levelNumber: 2, roleTitle: 'Head of Department (HOD)', slaHours: 48 },
      { levelNumber: 3, roleTitle: 'Dean of Faculty / Academic Affairs', slaHours: 72 },
      { levelNumber: 4, roleTitle: 'Institutional Disciplinary Board', slaHours: 96 },
    ],
  },
  {
    category: 'Other',
    levels: [
      { levelNumber: 1, roleTitle: 'Student Helpdesk Officer', slaHours: 24 },
      { levelNumber: 2, roleTitle: 'Associate Dean of Student Welfare', slaHours: 48 },
      { levelNumber: 3, roleTitle: 'Dean of Student Welfare', slaHours: 72 },
    ],
  },
];

module.exports = DEFAULT_HIERARCHIES;
