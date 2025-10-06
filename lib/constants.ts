import { MessageTemplate } from './types';

export const messageTemplates: MessageTemplate[] = [
  {
    id: 'new-welcome',
    name: 'New Student Welcome',
    content: 'Hi {name}! Welcome to INTO SLU! Thank you for your interest in our {program}. We\'re excited to support you on your journey to study in the US. Do you have any questions about the application process or need help getting started?'
  },
  {
    id: 'new-application-help',
    name: 'Application Assistance',
    content: 'Hi {name}! I noticed you\'re interested in our {program}. Our application process is straightforward, and I\'m here to guide you through every step. Would you like me to send you the application checklist and key deadlines?'
  },
  {
    id: 'new-scholarship-info',
    name: 'Scholarship Opportunities',
    content: 'Hi {name}! Great news - INTO SLU offers scholarships specifically for international students from {country}! For the {program}, you may be eligible for up to 25% tuition reduction. Would you like me to share the scholarship application details?'
  },
  {
    id: 'new-campus-life',
    name: 'Campus Life & Support',
    content: 'Hi {name}! Beyond academics, INTO SLU offers incredible support for international students. From airport pickup to cultural adjustment programs, we ensure you feel at home in St. Louis. What aspect of student life are you most curious about?'
  },
  {
    id: 'new-next-steps',
    name: 'Next Steps Guidance',
    content: 'Hi {name}! Ready to move forward with your {program} application? I can help you prepare your documents and connect you with our admissions team. What\'s your timeline for starting your studies with us?'
  }
];
