// src/data/siteData.js

// ============================================
// STATS SECTION
// ============================================
export const stats = [
  { icon: 'fas fa-briefcase', value: 10000, label: 'Jobs Posted', suffix: '' },
  { icon: 'fas fa-building', value: 5000, label: 'Companies', suffix: '' },
  { icon: 'fas fa-user-graduate', value: 25000, label: 'Candidates', suffix: '' },
  { icon: 'fas fa-chart-line', value: 95, label: 'Success Rate', suffix: '%' }
];

// ============================================
// FEATURED COMPANIES
// ============================================
export const featuredCompanies = [
  {
    id: 1,
    name: 'InnovateX',
    industry: 'Technology',
    location: 'Remote',
    tagline: 'Building next-generation software for global teams.',
    website: 'innovatex.com'
  },
  {
    id: 2,
    name: 'Design Studio',
    industry: 'Creative Agency',
    location: 'New York',
    tagline: 'Designing user-first digital products and brand experiences.',
    website: 'designstudio.com'
  },
  {
    id: 3,
    name: 'PeopleFirst',
    industry: 'HR Services',
    location: 'Bangalore',
    tagline: 'Connecting great talent with people-first organizations.',
    website: 'peoplefirst.io'
  }
];

// ============================================
// FEATURED JOBS
// ============================================
export const featuredJobs = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'InnovateX',
    location: 'Remote',
    salary: '$90k - $120k',
    type: 'Full-Time',
    tags: ['React', 'Node.js', 'Remote'],
    description: 'Build world-class web applications and collaborate with a fast-moving product team.',
    requirements: ['3+ years experience', 'React', 'REST APIs', 'Git'],
    benefits: ['Health insurance', 'Remote-friendly', 'Flexible schedule']
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Design Studio',
    location: 'New York',
    salary: '$75k - $95k',
    type: 'Part-Time',
    tags: ['Figma', 'UX', 'Product'],
    description: 'Design engaging user experiences across web and mobile products.',
    requirements: ['Figma', 'Portfolio', 'User research'],
    benefits: ['Flexible hours', 'Growth opportunities']
  },
  {
    id: 3,
    title: 'HR Coordinator',
    company: 'PeopleFirst',
    location: 'Bangalore',
    salary: '$45k - $55k',
    type: 'Full-Time',
    tags: ['HR', 'Recruitment', 'Admin'],
    description: 'Support hiring and employee onboarding for a high-growth organization.',
    requirements: ['Recruitment experience', 'Communication skills'],
    benefits: ['Health benefits', 'Paid time off']
  }
];

// ============================================
// DEFAULT JOBS (Includes Featured + More)
// ============================================
export const defaultJobs = [
  ...featuredJobs,
  {
    id: 4,
    title: 'Customer Support Specialist',
    company: 'ServiceWave',
    location: 'Hybrid',
    salary: '$35k - $45k',
    type: 'Full-Time',
    tags: ['Customer Service', 'Communication', 'CRM'],
    description: 'Deliver excellent support to customers and manage helpdesk tickets.',
    requirements: ['Customer-facing experience', 'Empathy', 'CRM knowledge'],
    benefits: ['Training', 'Team events']
  },
  {
    id: 5,
    title: 'Payroll Analyst',
    company: 'FinPath',
    location: 'Bangalore',
    salary: '$50k - $70k',
    type: 'Full-Time',
    tags: ['Payroll', 'Finance', 'Excel'],
    description: 'Manage payroll data and ensure accurate employee compensation.',
    requirements: ['Payroll systems', 'Attention to detail', 'Spreadsheets'],
    benefits: ['Health insurance', 'Career growth']
  }
];

// ============================================
// SERVICES CARDS
// ============================================
export const serviceCards = [
  {
    id: 1,
    badge: 'White-Collar',
    title: 'General White-Collar',
    icon: 'fas fa-briefcase',
    description: 'Flexible, growth-oriented, and skill-matching opportunities for professionals across industries.',
    tags: ['Flexible', 'Growth-Oriented', 'Skill-Matching']
  },
  {
    id: 2,
    badge: 'Payroll',
    title: 'Payroll Jobs Hiring',
    icon: 'fas fa-coins',
    description: 'Secure roles in payroll processing, compliance, accounts, and finance management.',
    tags: ['Payroll Processing', 'Compliance', 'Accounts']
  },
  {
    id: 3,
    badge: 'IT Sector',
    title: 'IT Sector Jobs',
    icon: 'fas fa-laptop-code',
    description: 'Developers, analysts, architects - all tech roles open across the IT industry.',
    tags: ['Developers', 'Analysts', 'Architects']
  },
  {
    id: 4,
    badge: 'Recruitment',
    title: 'Staffing / Recruitment Services',
    icon: 'fas fa-handshake',
    description: 'Fast, flexible hiring solutions for businesses and professionals looking for the perfect match.',
    tags: ['Fast Hiring', 'Flexible', 'Perfect Match']
  },
  {
    id: 5,
    badge: 'Non-Technical',
    title: 'Non-Technical Sector Jobs',
    icon: 'fas fa-users',
    description: 'Hiring in HR, operations, marketing, customer support, and more non-technical roles.',
    tags: ['HR', 'Operations', 'Marketing']
  },
  {
    id: 6,
    badge: 'Multi-Sector',
    title: 'Multi-Sector Hiring Drive',
    icon: 'fas fa-rocket',
    description: 'Explore openings in IT, payroll, staffing, non-technical, and more sectors all in one place.',
    tags: ['IT', 'Payroll', 'Staffing']
  }
];

// ============================================
// ABOUT PAGE DATA
// ============================================
export const aboutItems = [
  {
    icon: 'fas fa-users',
    title: 'Community Focused',
    text: 'We provide support for both candidates and employers with a people-first mindset.'
  },
  {
    icon: 'fas fa-lightbulb',
    title: 'Innovative Matches',
    text: 'Our platform helps discover career opportunities that align with your skills and goals.'
  },
  {
    icon: 'fas fa-handshake',
    title: 'Trusted Partnerships',
    text: 'We work with verified employers to ensure quality job listings and trust.'
  },
  {
    icon: 'fas fa-rocket',
    title: 'Fast Results',
    text: 'Get matched with relevant openings quickly and confidently.'
  }
];

export const aboutWhy = [
  {
    icon: 'fas fa-globe',
    title: 'Global Reach',
    text: 'Connect with companies and candidates from across the world.'
  },
  {
    icon: 'fas fa-bolt',
    title: 'Smart Search',
    text: 'Powerful filters make job discovery fast and precise.'
  },
  {
    icon: 'fas fa-heart',
    title: 'Candidate Care',
    text: 'We support applicants with tips, guidance, and easy application flows.'
  },
  {
    icon: 'fas fa-award',
    title: 'Trusted Quality',
    text: 'We only promote roles from verified employers and reputable organizations.'
  }
];

export const aboutStats = [
  { value: '10+', label: 'Years Experience' },
  { value: '500+', label: 'Hiring Partners' },
  { value: '25k', label: 'Successful Matches' },
  { value: '95%', label: 'Satisfaction Rate' }
];

// ============================================
// WHY CHOOSE US
// ============================================
export const whyCards = [
  { icon: 'fas fa-shield-alt', title: 'Verified Companies', text: 'All employers are thoroughly verified.' },
  { icon: 'fas fa-rocket', title: 'Easy Job Search', text: 'Simple and intuitive job hunting process.' },
  { icon: 'fas fa-bolt', title: 'Real-Time Updates', text: 'Get instant notifications for new jobs.' },
  { icon: 'fas fa-graduation-cap', title: 'Career Resources', text: 'Access to resume tips and interview guides.' }
];

// ============================================
// TESTIMONIALS
// ============================================
export const testimonials = [
  {
    id: 1,
    quote: 'Connect2Job helped me land my dream role as a software engineer. The platform is intuitive and the job recommendations were spot on!',
    name: 'Sarah Johnson',
    title: 'Software Engineer',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=e91e63&color=fff&size=50'
  },
  {
    id: 2,
    quote: 'I was struggling to find the right job, but Connect2Job made it easy. Within a week, I had multiple interviews lined up!',
    name: 'Michael Chen',
    title: 'Marketing Manager',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=059669&color=fff&size=50'
  },
  {
    id: 3,
    quote: 'The best job portal I have ever used. The interface is clean, and the application process is seamless. Highly recommend!',
    name: 'Emily Rodriguez',
    title: 'UX Designer',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=dc2626&color=fff&size=50'
  }
];

// ============================================
// CONTACT INFORMATION
// ============================================
export const contactInfo = [
  { icon: 'fas fa-map-marker-alt', label: 'Location', value: 'Mysuru, India' },
  { icon: 'fas fa-phone', label: 'Phone', value: '+91 70190 45849' },
  { icon: 'fas fa-envelope', label: 'Email', value: 'info@connect2job.com' },
  { icon: 'fas fa-clock', label: 'Hours', value: 'Mon - Fri, 9 AM - 6 PM' }
];

// ============================================
// DEFAULT EXPORT
// ============================================
const siteData = {
  stats,
  featuredCompanies,
  featuredJobs,
  defaultJobs,
  serviceCards,
  aboutItems,
  aboutWhy,
  aboutStats,
  whyCards,
  testimonials,
  contactInfo,
};

export default siteData;