import { useRef } from 'react';

interface UploadAreaProps {
  onFileUpload: (file: File) => void;
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export default function UploadArea({
  onFileUpload,
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
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
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt,.tsv,.xlsx,.xls"
          onChange={handleFileChange}
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
  );
}
