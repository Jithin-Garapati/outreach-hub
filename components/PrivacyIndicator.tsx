import { Student } from '@/lib/types';

interface PrivacyIndicatorProps {
  student: Student;
  isVisible: boolean;
}

export default function PrivacyIndicator({ student, isVisible }: PrivacyIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="mb-5 bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Privacy-First AI</h4>
          <p className="text-xs text-gray-700">
            Only non-personal information is sent to AI. Your student's identity remains protected.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Data Sent to AI */}
        <div className="bg-white rounded-md p-3 border border-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-gray-900">Sent to AI</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-700">
                Country: <span className="font-medium">{student.Country || 'Not specified'}</span>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-700">
                Program: <span className="font-medium">{student.Program_of_Interest__c || 'Not specified'}</span>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-700">
                Status: <span className="font-medium">{student.Status || 'Unknown'}</span>
              </span>
            </div>
            {student.Last_Interaction_Log__c && (
              <div className="flex items-start gap-2">
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-700">
                  Last Interaction: <span className="font-medium">Summary only</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Data Protected */}
        <div className="bg-white rounded-md p-3 border border-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-gray-900">Protected</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-500">×</span>
              <span className="text-xs text-gray-700">
                Name: <span className="font-medium text-gray-900">Hidden</span>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-500">×</span>
              <span className="text-xs text-gray-700">
                Phone: <span className="font-medium text-gray-900">Hidden</span>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-500">×</span>
              <span className="text-xs text-gray-700">
                Email: <span className="font-medium text-gray-900">Hidden</span>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-500">×</span>
              <span className="text-xs text-gray-700">
                All PII: <span className="font-medium text-gray-900">Protected</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-gray-100 border border-gray-300 rounded-md p-2">
        <p className="text-xs text-gray-900 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          AI processes context only. Student identity is never compromised.
        </p>
      </div>
    </div>
  );
}
