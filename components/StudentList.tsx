import { Student } from '@/lib/types';

interface StudentListProps {
  students: Student[];
  selectedStudent: Student | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectStudent: (student: Student) => void;
}

export default function StudentList({
  students,
  selectedStudent,
  searchTerm,
  onSearchChange,
  onSelectStudent,
}: StudentListProps) {
  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.FirstName?.toLowerCase().includes(searchLower) ||
      student.LastName?.toLowerCase().includes(searchLower) ||
      student.Country?.toLowerCase().includes(searchLower) ||
      student.Program_of_Interest__c?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
      <div className="p-5 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Students
        </h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
            onClick={() => onSelectStudent(student)}
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
  );
}
