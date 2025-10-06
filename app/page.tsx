'use client';

import { useState } from 'react';
import { Student } from '@/lib/types';
import { parseExcelFile, parseCSVFile } from '@/lib/utils';
import Header from '@/components/Header';
import UploadArea from '@/components/UploadArea';
import StudentList from '@/components/StudentList';
import StudentDetails from '@/components/StudentDetails';
import MessageWorkspace from '@/components/MessageWorkspace';

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadArea, setShowUploadArea] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    let studentsData: Student[] = [];

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      studentsData = await parseExcelFile(file);
    } else {
      studentsData = await parseCSVFile(file);
    }

    console.log('Parsed students:', studentsData);
    setStudents(studentsData);
    setShowUploadArea(false);
    if (studentsData.length > 0) {
      setSelectedStudent(studentsData[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    await processFile(file);
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setCustomMessage('');
    setSelectedTemplate('');
  };

  const resetApp = () => {
    setStudents([]);
    setSelectedStudent(null);
    setCustomMessage('');
    setSelectedTemplate('');
    setSearchTerm('');
    setShowUploadArea(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header hasStudents={students.length > 0} onReset={resetApp} />

      <main className="max-w-[1920px] mx-auto p-6">
        {showUploadArea ? (
          <UploadArea
            onFileUpload={handleFileUpload}
            isDragging={isDragging}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[calc(100vh-140px)]">
            <StudentList
              students={students}
              selectedStudent={selectedStudent}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSelectStudent={handleSelectStudent}
            />

            <div className="lg:col-span-2 flex flex-col gap-5">
              {selectedStudent ? (
                <>
                  <StudentDetails student={selectedStudent} />
                  <MessageWorkspace
                    student={selectedStudent}
                    customMessage={customMessage}
                    onMessageChange={setCustomMessage}
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={setSelectedTemplate}
                  />
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
