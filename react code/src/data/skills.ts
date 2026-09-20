/**
 * Skills grouped by category for visualization
 */
export interface SkillGroup {
  category: string;
  items: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Front-End',
    items: ['ReactJS', 'AngularJS', 'Angular Material', 'NextJS', 'JavaScript', 'ES6'],
  },
  {
    category: 'Back-End',
    items: ['NodeJS', 'ExpressJS', 'FastAPI'],
  },
  {
    category: 'Database',
    items: ['MongoDB', 'MySQL', 'PostgreSQL'],
  },
  {
    category: 'Version Control',
    items: ['Git', 'GitHub'],
  },
  {
    category: 'Deployment & Testing',
    items: ['VPS', 'Render', 'Vercel', 'AWS', 'Postman'],
  },
  {
    category: 'Soft Skills',
    items: ['Adaptability', 'Client Communication', 'Requirement Analysis'],
  },
];

// Flat list for orbit or tag cloud
export const SKILLS_FLAT = SKILL_GROUPS.flatMap((g) => g.items);
