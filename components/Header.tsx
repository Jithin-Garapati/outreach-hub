interface HeaderProps {
  hasStudents: boolean;
  onReset: () => void;
}

export default function Header({ hasStudents, onReset }: HeaderProps) {
  return (
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
        {hasStudents && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Upload New File
          </button>
        )}
      </div>
    </header>
  );
}
