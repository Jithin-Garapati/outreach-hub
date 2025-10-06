'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

// Types
interface Student {
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

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
}

const messageTemplates: MessageTemplate[] = [
  {
    id: 'welcome',
    name: 'Initial Welcome',
    content: 'Hi {name}! 👋 Welcome to INTO SLU! I wanted to personally reach out regarding your interest in our {program}. We\'re excited to have you consider studying with us. Do you have any questions about the application process?'
  },
  {
    id: 'follow-up',
    name: 'Application Follow-up',
    content: 'Hi {name}! Just checking in on your application for {program}. Our team is here to help if you need any assistance completing your application. The deadline is approaching - let us know how we can support you!'
  },
  {
    id: 'scholarship',
    name: 'Scholarship Information',
    content: 'Hi {name}! Great question about scholarships for {program}. INTO SLU offers various scholarship opportunities for international students. I\'d be happy to discuss the options available to students from {country}. When would be a good time to chat?'
  },
  {
    id: 'visa',
    name: 'Visa/I-20 Information',
    content: 'Hi {name}! Regarding your I-20 and visa questions for {program} - we typically process I-20 documents within 2-3 weeks after receiving all required documents. I can walk you through the complete timeline. Would that be helpful?'
  }
];

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadArea, setShowUploadArea] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Handle Excel files
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

        if (jsonData.length < 2) return;

        const headers = jsonData[0].map((h: any) => String(h).trim());
        const studentsData: Student[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          const student: any = {};
          headers.forEach((header, index) => {
            let value = row[index] !== undefined && row[index] !== null ? String(row[index]).trim() : '';
            
            // Handle phone number formatting
            if (header === 'Phone' && value) {
              const num = parseFloat(value);
              if (!isNaN(num)) {
                value = num.toString().replace(/\D/g, '');
              }
            }
            
            student[header] = value;
          });

          // Add student if it has at least some data (FirstName OR LastName OR Email)
          if (student.FirstName || student.LastName || student.Email) {
            studentsData.push(student as Student);
          }
        }

        console.log('Parsed students:', studentsData);
        setStudents(studentsData);
        setShowUploadArea(false);
        if (studentsData.length > 0) {
          setSelectedStudent(studentsData[0]);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Handle CSV/TSV files
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim());
        
        if (lines.length < 2) return;

        // Auto-detect delimiter (tab or comma)
        const firstLine = lines[0];
        const delimiter = firstLine.includes('\t') ? '\t' : ',';
        
        const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
        const studentsData: Student[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (!line.trim()) continue;
          
          const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
          const student: any = {};
          
          headers.forEach((header, index) => {
            let value = values[index] || '';
            
            // Handle phone number formatting (convert scientific notation)
            if (header === 'Phone' && value) {
              const num = parseFloat(value);
              if (!isNaN(num)) {
                value = num.toString().replace(/\D/g, '');
              }
            }
            
            student[header] = value;
          });
          
          // Add student if it has at least some data (FirstName OR LastName OR Email)
          if (student.FirstName || student.LastName || student.Email) {
            studentsData.push(student as Student);
          }
        }

        console.log('Parsed students:', studentsData);
        setStudents(studentsData);
        setShowUploadArea(false);
        if (studentsData.length > 0) {
          setSelectedStudent(studentsData[0]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const applyTemplate = (templateId: string) => {
    if (!selectedStudent) return;
    
    const template = messageTemplates.find(t => t.id === templateId);
    if (!template) return;

    let message = template.content
      .replace('{name}', selectedStudent.FirstName || 'there')
      .replace('{program}', selectedStudent.Program_of_Interest__c || 'your program')
      .replace('{country}', selectedStudent.Country || 'your country');

    setCustomMessage(message);
    setSelectedTemplate(templateId);
  };

  const sendToWhatsApp = () => {
    if (!selectedStudent || !customMessage) return;

    if (!selectedStudent.Phone) {
      alert('No phone number available for this student.');
      return;
    }

    const phone = selectedStudent.Phone.replace(/\D/g, '');
    if (!phone) {
      alert('Invalid phone number format.');
      return;
    }

    const encodedMessage = encodeURIComponent(customMessage);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const generateLog = () => {
    if (!selectedStudent) return '';

    const timestamp = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    let action = 'Sent follow-up message';
    
    if (selectedStudent.Status === 'New' || !selectedStudent.Last_Interaction_Log__c) {
      action = 'Sent initial welcome message';
    }

    const program = selectedStudent.Program_of_Interest__c || 'their program of interest';
    const log = `[${timestamp}] ${action} via WhatsApp regarding ${program}${selectedStudent.Program_of_Interest__c ? ' program' : ''}. Student engaged, awaiting response.`;
    
    return log;
  };

  const copyLogToClipboard = async () => {
    const log = generateLog();
    try {
      await navigator.clipboard.writeText(log);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.FirstName?.toLowerCase().includes(searchLower) ||
      student.LastName?.toLowerCase().includes(searchLower) ||
      student.Country?.toLowerCase().includes(searchLower) ||
      student.Program_of_Interest__c?.toLowerCase().includes(searchLower)
    );
  });

  const resetApp = () => {
    setStudents([]);
    setSelectedStudent(null);
    setCustomMessage('');
    setSelectedTemplate('');
    setSearchTerm('');
    setShowUploadArea(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Local Outreach Hub</h1>
              <p className="text-xs text-gray-500">INTO Saint Louis University</p>
            </div>
          </div>
          {students.length > 0 && (
            <button
              onClick={resetApp}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Upload New File
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto p-6">
        {showUploadArea ? (
          // Upload Area
          <div className="max-w-2xl mx-auto mt-24">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to Your Outreach Hub
              </h2>
              <p className="text-gray-600">
                Upload your Salesforce report to get started
              </p>
            </div>

            <div 
              className={`bg-white rounded-lg border-2 border-dashed p-16 text-center transition-colors ${
                isDragging 
                  ? 'border-gray-900 bg-gray-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.tsv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <span className="text-base font-medium text-gray-900 mb-1">
                  {isDragging ? 'Drop file here' : 'Click to upload or drag and drop'}
                </span>
                <span className="text-sm text-gray-500">
                  CSV, TSV, or Excel (XLSX) file from Salesforce
                </span>
              </label>
            </div>

            <div className="mt-6 bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Recommended fields:</strong> FirstName, LastName, Email, Phone, Country, Program_of_Interest__c, Status, Last_Interaction_Log__c
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Note: Students with at least FirstName, LastName, or Email will be loaded
              </p>
            </div>
          </div>
        ) : (
          // Two-Panel Interface
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[calc(100vh-140px)]">
            {/* Left Panel - Student List */}
            <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-200 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Students</h2>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {filteredStudents.length} of {students.length} students
                </p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredStudents.map((student, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedStudent(student);
                      setCustomMessage('');
                      setSelectedTemplate('');
                    }}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedStudent === student
                        ? 'bg-gray-50 border-l-2 border-l-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {student.FirstName || 'N/A'} {student.LastName || 'N/A'}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">{student.Country || 'N/A'}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {student.Program_of_Interest__c || 'N/A'}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${
                          student.Status === 'New'
                            ? 'bg-gray-200 text-gray-700'
                            : student.Status
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {student.Status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Student Details & Workspace */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {selectedStudent ? (
                <>
                  {/* Student Info Card */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-5">
                      {selectedStudent.FirstName || 'N/A'} {selectedStudent.LastName || 'N/A'}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="font-medium text-gray-900">{selectedStudent.Email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="font-medium text-gray-900">{selectedStudent.Phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Country</p>
                        <p className="font-medium text-gray-900">{selectedStudent.Country || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Lead Source</p>
                        <p className="font-medium text-gray-900">{selectedStudent.LeadSource || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Program of Interest</p>
                        <p className="font-medium text-gray-900">{selectedStudent.Program_of_Interest__c || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    {selectedStudent.Last_Interaction_Log__c && (
                      <div className="mt-5 pt-5 border-t border-gray-200">
                        <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Recent Activity
                        </h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                          <p className="text-sm text-gray-700">{selectedStudent.Last_Interaction_Log__c}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Templates */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-xs font-semibold text-gray-700 mb-4 uppercase tracking-wide">Message Templates</h3>
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {messageTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => applyTemplate(template.id)}
                          className={`px-3 py-2.5 text-sm font-medium rounded-md border transition-colors ${
                            selectedTemplate === template.id
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>

                    <div className="mb-5">
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Your Message
                      </label>
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Select a template or write your own message..."
                        rows={6}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-gray-900 resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={sendToWhatsApp}
                        disabled={!customMessage}
                        className="flex-1 bg-gray-900 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Send via WhatsApp
                      </button>
                      <button
                        onClick={copyLogToClipboard}
                        className="px-5 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        {copySuccess ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Log Outreach
                          </>
                        )}
                      </button>
                    </div>

                    {/* Log Preview */}
                    <div className="mt-5 pt-5 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Log Preview</p>
                      <div className="bg-gray-50 rounded-md p-3 text-xs text-gray-700 font-mono border border-gray-200">
                        {generateLog()}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Select a Student</h3>
                  <p className="text-sm text-gray-600">Choose a student from the list to start your outreach</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
