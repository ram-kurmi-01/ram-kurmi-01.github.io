/**
 * Experience / timeline entries
 */
export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'meditree',
    role: 'Software Engineer',
    company: 'MediTree Healthcare',
    period: '2022 – Present',
    bullets: [
      'Developed full-stack features using React.js, Angular, and Node.js with MySQL for database management.',
      'Published app on Google Play Store & App Store, managing the entire deployment pipeline.',
      'Built modules for authentication, appointment booking, image handling (Multer), and mailer services.',
      'Collaborated in an agile development environment, enhancing skills in version control, code reviews, and deployment processes using Git and GitHub.',
    ],
  },
  {
    id: 'galaxy-script',
    role: 'Full Stack Developer',
    company: 'Galaxy Script',
    period: '2018 – 2022',
    bullets: [
      'Developed expertise in building scalable full-stack applications using ReactJS and NodeJS.',
      'Developed and deployed web and mobile applications with strong front-end and back-end integration.',
      'Learned agile workflows and collaborative tools to enhance teamwork and project efficiency in real-world scenarios.',
    ],
  },
];
