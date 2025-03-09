// Mock data for the mentorship articles

export interface MentorshipArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  authorTitle?: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
}

// Using more reliable image sources
const mentorshipArticles: MentorshipArticle[] = [
  {
    id: '1',
    title: 'Finding Internships in Your Field',
    summary: 'Learn strategies for securing internships that align with your career goals.',
    content: `Finding the right internship can significantly impact your career trajectory. Start by identifying companies that work in your field of interest. Leverage your university's career services office and online platforms like LinkedIn and Handshake. Don't forget to customize your resume and cover letter for each application, highlighting relevant coursework and projects. Network with alumni who work in your target companies, as employee referrals often receive priority consideration. Prepare for interviews by researching the company thoroughly and practicing responses to common questions. Finally, once you receive an offer, negotiate professionally to ensure the experience will be valuable for your career development.`,
    author: 'Sarah Johnson',
    authorTitle: 'Career Advisor',
    date: '2025-02-15',
    readTime: '5 min',
    category: 'Internships',
    imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '2',
    title: 'Building Your Professional Network',
    summary: 'Effective networking strategies for university students and recent graduates.',
    content: `Building a strong professional network is essential for long-term career success. Start by creating a compelling LinkedIn profile that highlights your education, skills, and projects. Attend industry events, career fairs, and alumni mixers to meet professionals in your field. When meeting new contacts, focus on building genuine relationships rather than immediate job opportunities. Follow up with connections by sending personalized messages referencing your conversation. Join professional organizations related to your field to expand your network and access industry resources. Consider finding a mentor who can provide guidance and introduce you to their network. Remember that networking is a two-way street—look for opportunities to help others as well. Consistent, authentic relationship building over time will create a strong foundation for your career development.`,
    author: 'Michael Carter',
    authorTitle: 'Network Specialist',
    date: '2025-02-28',
    readTime: '7 min',
    category: 'Networking',
    imageUrl: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '3',
    title: 'Preparing for Technical Interviews',
    summary: 'Essential tips and practice strategies for technical interviews in STEM fields.',
    content: `Technical interviews can be challenging, but with proper preparation, you can approach them with confidence. Start by mastering the fundamentals of your field—whether that's algorithms, data structures, laboratory techniques, or design principles. Practice explaining complex concepts clearly, as communication skills are just as important as technical knowledge. Use resources like LeetCode, HackerRank, or field-specific practice platforms to solve problems similar to those you might encounter in interviews. Consider participating in mock interviews with peers or mentors who can provide constructive feedback. Research the company thoroughly to understand their products, services, and technical challenges. Prepare thoughtful questions to ask your interviewers. During the interview, talk through your thought process as you solve problems, and don't be afraid to ask clarifying questions. Remember that interviewers are evaluating not just your current knowledge but your problem-solving approach and ability to learn.`,
    author: 'Dr. Aisha Patel',
    authorTitle: 'Technical Recruiter',
    date: '2025-03-05',
    readTime: '10 min',
    category: 'Interviews',
    imageUrl: 'https://images.pexels.com/photos/5673488/pexels-photo-5673488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '4',
    title: 'Crafting a Standout Resume',
    summary: 'Tips to create a resume that gets noticed by recruiters and hiring managers.',
    content: `Your resume is often the first impression you make on potential employers, so it's crucial to make it count. Start with a clean, professional layout that's easy to scan. Include a concise summary or objective statement that highlights your career goals and key qualifications. Focus on achievements rather than just responsibilities—quantify your accomplishments with metrics when possible. Tailor your resume for each application by analyzing the job description and incorporating relevant keywords. Highlight technical skills, certifications, and educational experiences that are most relevant to the position. Don't forget to include relevant projects, internships, and extracurricular activities if you have limited work experience. Keep your resume to one page if you're early in your career, and ensure it's free of grammatical errors and inconsistencies. Finally, save your resume as a PDF to preserve formatting across different devices and systems.`,
    author: 'James Wilson',
    authorTitle: 'HR Director',
    date: '2025-01-20',
    readTime: '6 min',
    category: 'Job Search',
    imageUrl: 'https://images.pexels.com/photos/3760072/pexels-photo-3760072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

export const mentorshipService = {
  /**
   * Get all mentorship articles
   */
  getAllArticles: async (): Promise<MentorshipArticle[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mentorshipArticles;
  },
  
  /**
   * Get a specific article by ID
   */
  getArticleById: async (id: string): Promise<MentorshipArticle | undefined> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mentorshipArticles.find(article => article.id === id);
  },
};