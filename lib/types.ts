// Student data types
export interface Student {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Company: string;
  LeadSource: string;
  Status: string;
  Country: string;
  Program_of_Interest__c: string;
  Last_Interaction_Log__c: string;
}

// Message template types
export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
}

// AI Message Generation types
export interface AIMessageRequest {
  studentInfo: {
    firstName: string;
    country: string;
    program: string;
    status: string;
  };
  lastInteraction?: string;
  messageType: 'initial' | 'followup';
}

export interface AIMessageResponse {
  message: string;
  error?: string;
}
