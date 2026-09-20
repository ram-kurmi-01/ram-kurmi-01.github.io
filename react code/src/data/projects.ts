/**
 * Portfolio projects for showcase
 */
import passwordGeneratorImage from '../../Img/passwordGenerator.png';
import cardMatchingImage from '../../Img/CardMatching.png';
import libraryImage from '../../Img/library.jpg';
import practicRealWebsiteImage from '../../Img/practicRealWebsite.png';

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'library-management',
    title: 'Library Management System',
    description: 'Administrative system for managing books, members, and borrow/return workflows in a structured UI.',
    techStack: ['React', 'JavaScript'],
    image: libraryImage,
    liveUrl: 'https://library-management-by-rohit.netlify.app/',
  },
  {
    id: 'flingzz',
    title: 'FLINGZZ — Real-Time Social Platform',
    description:
      'A real-time social product built around authentication, messaging, and responsive interaction patterns with a production-oriented stack.',
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
  },
  {
    id: 'hotel-booking-platform',
    title: 'Hotel Booking Platform',
    description:
      'Full-stack booking system with role-based access, booking flows, and an operations dashboard focused on clarity.',
    techStack: ['React', 'TypeScript', 'Django', 'Redux'],
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80',
  },
  {
    id: 'attendance-management',
    title: 'Attendance Management Platform',
    description:
      'Multi-tenant attendance software with organization and employee hierarchies, secure login, and operational data handling.',
    techStack: ['Next.js', 'Redis', 'Node.js', 'Express.js', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80',
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Compact utility for generating secure passwords with configurable length and character sets.',
    techStack: ['React', 'JavaScript'],
    image: passwordGeneratorImage,
    liveUrl: 'https://password-genrator-by-rohit.netlify.app/',
  },
  {
    id: 'practic-real-website',
    title: 'Practice Website',
    description: 'Responsive practice build used to refine layout composition and frontend interactions.',
    techStack: ['React', 'JavaScript'],
    image: practicRealWebsiteImage,
    liveUrl: 'https://practic-real-website.netlify.app/',
  },
  {
    id: 'card-matching',
    title: 'Card Matching Game',
    description: 'Memory matching game built with React for interaction and state-management practice.',
    techStack: ['React', 'JavaScript'],
    image: cardMatchingImage,
  },
];
