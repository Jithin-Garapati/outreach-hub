import * as XLSX from 'xlsx';
import { Student } from './types';

// Header mapping for flexible CSV/Excel parsing
const headerMap: { [key: string]: string } = {
  'First Name': 'FirstName',
  'FirstName': 'FirstName',
  'Last Name': 'LastName',
  'LastName': 'LastName',
  'Email': 'Email',
  'Phone': 'Phone',
  'Mobile': 'Phone',
  'Company / Account': 'Company',
  'Company': 'Company',
  'Lead Source': 'LeadSource',
  'LeadSource': 'LeadSource',
  'Lead Status': 'Status',
  'Status': 'Status',
  'Country': 'Country',
  'Program_of_Interest__c': 'Program_of_Interest__c',
  'Program of Interest': 'Program_of_Interest__c',
  'Last Interaction': 'Last_Interaction_Log__c',
  'Last_Interaction_Log__c': 'Last_Interaction_Log__c',
  'Last Interaction Log': 'Last_Interaction_Log__c',
};

// Parse Excel file
export const parseExcelFile = async (file: File): Promise<Student[]> => {
  const XLSX = await import('xlsx');
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

      if (jsonData.length < 2) {
        resolve([]);
        return;
      }

      const rawHeaders = jsonData[0].map((h: any) => String(h).trim());
      const studentsData: Student[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        const student: any = createEmptyStudent();

        rawHeaders.forEach((rawHeader, index) => {
          const mappedHeader = headerMap[rawHeader];
          if (mappedHeader) {
            let value = row[index] !== undefined && row[index] !== null ? String(row[index]).trim() : '';
            
            if (mappedHeader === 'Phone' && value) {
              value = value.replace(/\D/g, '');
            }
            
            student[mappedHeader] = value;
          }
        });

        if (student.FirstName || student.LastName || student.Email) {
          studentsData.push(student as Student);
        }
      }

      resolve(studentsData);
    };
    reader.readAsArrayBuffer(file);
  });
};

// Parse CSV/TSV file
export const parseCSVFile = async (file: File): Promise<Student[]> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      
      if (lines.length < 2) {
        resolve([]);
        return;
      }

      const firstLine = lines[0];
      const delimiter = firstLine.includes('\t') ? '\t' : ',';
      
      const rawHeaders = firstLine.split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
      const studentsData: Student[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        
        const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
        const student: any = createEmptyStudent();
        
        rawHeaders.forEach((rawHeader, index) => {
          const mappedHeader = headerMap[rawHeader];
          if (mappedHeader) {
            let value = values[index] || '';
            
            if (mappedHeader === 'Phone' && value) {
              value = value.replace(/\D/g, '');
            }
            
            student[mappedHeader] = value;
          }
        });
        
        if (student.FirstName || student.LastName || student.Email) {
          studentsData.push(student as Student);
        }
      }

      resolve(studentsData);
    };
    reader.readAsText(file);
  });
};

// Create empty student object
const createEmptyStudent = () => ({
  FirstName: '',
  LastName: '',
  Email: '',
  Phone: '',
  Company: '',
  LeadSource: '',
  Status: '',
  Country: '',
  Program_of_Interest__c: '',
  Last_Interaction_Log__c: ''
});

// Apply template to message
export const applyTemplate = (template: string, student: Student): string => {
  return template
    .replace('{name}', student.FirstName || 'there')
    .replace('{program}', student.Program_of_Interest__c || 'your program')
    .replace('{country}', student.Country || 'your country');
};

// Generate log entry for Salesforce
export const generateLog = (student: Student): string => {
  const timestamp = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  let action = 'Sent follow-up message';
  let subject = 'Follow-up on Application';

  if (student.Status === 'New' || !student.Last_Interaction_Log__c) {
    action = 'Sent initial welcome message';
    subject = 'Welcome to INTO SLU - Application Support';
  }

  const program = student.Program_of_Interest__c || 'their program of interest';
  const log = `Subject: ${subject}\n[${timestamp}] ${action} via WhatsApp regarding ${program}${student.Program_of_Interest__c ? ' program' : ''}. Student engaged, awaiting response.`;

  return log;
};

// Open WhatsApp with pre-filled message
export const sendToWhatsApp = (phone: string, message: string): boolean => {
  if (!phone) {
    alert('No phone number available for this student.');
    return false;
  }

  const cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone) {
    alert('Invalid phone number format.');
    return false;
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
  return true;
};
