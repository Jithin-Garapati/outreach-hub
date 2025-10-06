import { useState } from 'react';
import { Student, MessageTemplate } from '@/lib/types';
import { messageTemplates } from '@/lib/constants';
import { applyTemplate, generateLog, sendToWhatsApp } from '@/lib/utils';
import PrivacyIndicator from './PrivacyIndicator';

interface MessageWorkspaceProps {
  student: Student;
  customMessage: string;
  onMessageChange: (message: string) => void;
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

export default function MessageWorkspace({
  student,
  customMessage,
  onMessageChange,
  selectedTemplate,
  onTemplateSelect,
}: MessageWorkspaceProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleTemplateClick = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (!template) return;

    const message = applyTemplate(template.content, student);
    onMessageChange(message);
    onTemplateSelect(templateId);
  };

  const handleSendToWhatsApp = () => {
    sendToWhatsApp(student.Phone, customMessage);
  };

  const handleCopyLog = async () => {
    const log = generateLog(student);
    try {
      await navigator.clipboard.writeText(log);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setAiError(null);

    try {
      const messageType = student.Status === 'New' || !student.Last_Interaction_Log__c 
        ? 'initial' 
        : 'followup';

      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentInfo: {
            firstName: student.FirstName || 'there',
            country: student.Country || 'your country',
            program: student.Program_of_Interest__c || 'your program',
            status: student.Status || 'Unknown',
          },
          lastInteraction: student.Last_Interaction_Log__c || undefined,
          messageType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate message');
      }

      onMessageChange(data.message);
      onTemplateSelect(''); // Clear template selection when using AI
    } catch (error: any) {
      console.error('AI Generation Error:', error);
      setAiError(error.message || 'Failed to generate AI message. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* AI Mode Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Message Generation
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {aiEnabled ? 'AI-powered personalized messages' : 'Template-based messages'}
          </p>
        </div>
        <button
          onClick={() => setAiEnabled(!aiEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            aiEnabled ? 'bg-gray-900' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              aiEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Privacy Indicator - Only show when AI is enabled */}
      <PrivacyIndicator student={student} isVisible={aiEnabled} />

      {/* AI Mode */}
      {aiEnabled && (
        <div className="mb-5">
          <div className="bg-gray-50 border-2 border-gray-300 rounded-md p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  AI-Powered Message Generation
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-900 text-xs rounded-full font-medium">
                    Smart
                  </span>
                </h4>
                <p className="text-xs text-gray-700 mb-3">
                  Generate a contextually-aware, personalized message that considers the student's 
                  {student.Last_Interaction_Log__c 
                    ? ' program, country, and previous interactions' 
                    : ' program and country'}
                  . The AI creates natural, engaging outreach while keeping personal information private.
                </p>
                <button
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                  className="px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Smart Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          {aiError && (
            <div className="mt-3 bg-gray-100 border border-gray-400 rounded-md p-3">
              <p className="text-sm text-gray-900">{aiError}</p>
            </div>
          )}
        </div>
      )}

      {/* Template Mode */}
      {!aiEnabled && (
        <>
          <h3 className="text-xs font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Message Templates
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {messageTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template.id)}
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
        </>
      )}

      {/* Message Editor */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Your Message
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={aiEnabled ? "Click 'Generate AI Message' to create a personalized message..." : "Select a template or write your own message..."}
          rows={6}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-gray-900 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSendToWhatsApp}
          disabled={!customMessage}
          className="flex-1 bg-gray-900 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Send via WhatsApp
        </button>
        <button
          onClick={handleCopyLog}
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
          {generateLog(student)}
        </div>
      </div>
    </div>
  );
}
