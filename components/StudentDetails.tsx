import { Student } from '@/lib/types';

interface StudentDetailsProps {
  student: Student;
}

export default function StudentDetails({ student }: StudentDetailsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">
        {student.FirstName || 'N/A'} {student.LastName || 'N/A'}
      </h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-gray-500 mb-1">Email</p>
          <p className="font-medium text-gray-900">{student.Email || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Phone</p>
          <p className="font-medium text-gray-900">{student.Phone || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Country</p>
          <p className="font-medium text-gray-900">{student.Country || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Lead Source</p>
          <p className="font-medium text-gray-900">{student.LeadSource || 'N/A'}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-500 mb-1">Program of Interest</p>
          <p className="font-medium text-gray-900">{student.Program_of_Interest__c || 'N/A'}</p>
        </div>
      </div>

      {/* Recent Activity */}
      {student.Last_Interaction_Log__c && (
        <div className="mt-5 pt-5 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <p className="text-sm text-gray-700">{student.Last_Interaction_Log__c}</p>
          </div>
        </div>
      )}
    </div>
  );
}
