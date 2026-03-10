'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PageContext } from '@/components/shell/PageContext';

interface FeedbackForm {
  topic: string;
  description: string;
  type: 'Request' | 'Issue' | 'Suggestion';
  urgency: 'Low' | 'Medium' | 'High';
  contactInfo: string;
  suggestedChange?: string;
  fileAttachment?: {
    filename: string;
    type: string;
    data: string;
  } | null;
}

function FeedbackContent() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const typeParam = searchParams.get('type') || 'Request';
  const sourceParam = searchParams.get('source') || '';
  const queryParam = searchParams.get('query') || '';
  const categoryGuessParam = searchParams.get('category_guess') || '';
  const roleFilterParam = searchParams.get('role_filter') || '';
  const topicParam = searchParams.get('topic') || '';

  const normalizeType = (value: string): FeedbackForm['type'] => {
    if (value === 'Issue' || value === 'Suggestion') return value;
    return 'Request';
  };

  const getDefaultTopic = () => {
    if (topicParam) return topicParam;
    if (sourceParam === 'search' && queryParam) return `Request for: "${queryParam}"`;
    if (sourceParam === 'category' && categoryGuessParam) return `Content for ${categoryGuessParam}`;
    if (sourceParam === 'home') return 'General content request';
    return 'Feedback';
  };

  const getContextPill = () => {
    if (sourceParam === 'search' && queryParam) return `From search: "${queryParam}"`;
    if (sourceParam === 'category' && categoryGuessParam) return `From category: ${categoryGuessParam}`;
    if (sourceParam === 'home') return 'From home page';
    if (sourceParam === 'article') return 'From article';
    if (sourceParam === 'footer') return 'From footer';
    return null;
  };

  const [formData, setFormData] = useState<FeedbackForm>({
    topic: getDefaultTopic(),
    description: '',
    type: normalizeType(typeParam),
    urgency: 'Medium',
    contactInfo: '',
    suggestedChange: '',
    fileAttachment: null,
  });
  const [fileError, setFileError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const readFileAsBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          const base64 = result.split(',')[1] ?? '';
          resolve(base64);
        } else {
          reject(new Error('Could not read file'));
        }
      };
      reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

  const contextPill = getContextPill();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFormData((prev) => ({ ...prev, fileAttachment: null }));
      setFileError(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFormData((prev) => ({ ...prev, fileAttachment: null }));
      setFileError('Please upload a file smaller than 5MB.');
      return;
    }

    try {
      const base64 = await readFileAsBase64(file);
      setFormData((prev) => ({
        ...prev,
        fileAttachment: { filename: file.name, type: file.type, data: base64 },
      }));
      setFileError(null);
    } catch (error) {
      console.error(error);
      setFormData((prev) => ({ ...prev, fileAttachment: null }));
      setFileError('Could not read the selected file. Please try another one.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.topic,
          description: formData.description,
          suggestedChange: formData.suggestedChange,
          urgency: formData.urgency,
          contactInfo: formData.contactInfo || undefined,
          source: sourceParam,
          type: formData.type,
          query: queryParam || undefined,
          categoryGuess: categoryGuessParam || undefined,
          roleFilter: roleFilterParam || undefined,
          fileAttachment: formData.fileAttachment ?? undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setReferenceId(data.referenceId || 'FB-' + Date.now());
        setFormData({
          topic: getDefaultTopic(),
          description: '',
          type: normalizeType(typeParam),
          urgency: 'Medium',
          contactInfo: '',
          suggestedChange: '',
          fileAttachment: null,
        });
        setFileError(null);

        // fire feedback funnel analytics
        fetch("/api/analytics/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: sourceParam,
            type: formData.type,
            query: queryParam || undefined,
            categoryGuess: categoryGuessParam || undefined,
            roleFilter: roleFilterParam || undefined,
          }),
        }).catch((err) => console.error("feedback analytics failed", err));
      } else {
        throw new Error(data.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FeedbackForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[#E6F2E6] rounded-lg shadow-sm border border-[#00A651] p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#00A651] mb-4">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#4D2C0A] mb-2">Feedback Submitted</h2>
            <p className="text-[#333333] mb-6">
              Thank you for your feedback! We&apos;ll review your submission and get back to you if needed.
              {referenceId && (
                <span className="block mt-2 font-mono text-sm bg-white px-2 py-1 rounded">
                  Reference: {referenceId}
                </span>
              )}
            </p>
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#00A651] hover:bg-[#008842] transition-colors"
              >
                Back to Home
              </Link>
              <br />
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-[#333333] bg-white hover:bg-gray-50 transition-colors"
              >
                Submit Another Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageContext nav={null} />
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Feedback', href: '/feedback' },
            ]}
          />

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-[#4D2C0A]">Share Your Feedback</h1>
            <p className="mt-2 text-[#333333]">
              Help us improve the knowledge base by sharing your thoughts, requests, or reporting issues.
            </p>
            {contextPill && (
              <div className="mt-4 inline-flex items-center rounded-full bg-[#00A651]/10 px-4 py-2 text-sm font-medium text-[#00A651]">
                {contextPill}
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="bg-[#FEF3E2] border border-[#F5A623] rounded-lg p-4">
              <p className="text-sm text-[#92400E] mb-2">
                <strong>Looking for something specific?</strong> Search first to see if it already exists:
              </p>
              <SearchBar />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-[#4D2C0A] mb-2">
                  Topic *
                </label>
                <input
                  type="text"
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  placeholder="What is this feedback about?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4D2C0A] mb-2">
                  Feedback Type *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'Request', label: 'Content Request', desc: 'Request new content or topics' },
                    { value: 'Issue', label: 'Issue Report', desc: 'Report incorrect or broken content' },
                    { value: 'Suggestion', label: 'Suggestion', desc: 'Suggest improvements' },
                  ].map((type) => (
                    <label key={type.value} className="relative">
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={(e) => handleInputChange('type', e.target.value as FeedbackForm['type'])}
                        className="sr-only peer"
                      />
                      <div className="p-3 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-[#00A651] peer-checked:bg-[#E6F2E6] hover:bg-gray-50 transition-colors">
                        <div className="text-sm font-medium text-[#4D2C0A]">{type.label}</div>
                        <div className="text-xs text-[#333333] mt-1">{type.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#4D2C0A] mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={
                    formData.type === 'Request'
                      ? 'What information would you like to see? Please be as specific as possible.'
                      : formData.type === 'Issue'
                        ? 'Describe the issue you found. What should it say instead?'
                        : 'What improvements would you suggest?'
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="suggestedChange" className="block text-sm font-medium text-[#4D2C0A] mb-2">
                  Suggested Change (optional)
                </label>
                <textarea
                  id="suggestedChange"
                  value={formData.suggestedChange}
                  onChange={(e) => handleInputChange('suggestedChange', e.target.value)}
                  placeholder="If you have a specific suggestion for how to improve this, please describe it here."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4D2C0A] mb-2">
                  Urgency
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' },
                  ].map((urgency) => (
                    <label key={urgency.value} className="flex items-center">
                      <input
                        type="radio"
                        name="urgency"
                        value={urgency.value}
                        checked={formData.urgency === urgency.value}
                        onChange={(e) => handleInputChange('urgency', e.target.value as FeedbackForm['urgency'])}
                        className="mr-2 text-[#00A651] focus:ring-[#00A651]"
                      />
                      <span className="text-sm text-[#333333]">{urgency.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="contactInfo" className="block text-sm font-medium text-[#4D2C0A] mb-2">
                  Contact Information (optional)
                </label>
                <input
                  type="text"
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                  placeholder="Your email or Slack handle"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent"
                />
                <p className="mt-1 text-xs text-[#333333]">
                  We&rsquo;ll only contact you if we need clarification about your feedback.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4D2C0A] mb-2">Attach a file (optional)</label>
                <input
                  type="file"
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="w-full text-sm text-[#4D2C0A] file:mr-3 file:rounded-full file:border-0 file:bg-[#00A651] file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-white hover:file:bg-[#008b44]"
                />
                {formData.fileAttachment && (
                  <p className="mt-1 text-xs text-[#4D2C0A]">
                    Attached: <span className="font-medium">{formData.fileAttachment.filename}</span>
                  </p>
                )}
                {fileError && <p className="mt-1 text-xs text-red-600">{fileError}</p>}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Link
                  href="/"
                  className="px-6 py-2 border border-[#00A651] text-sm font-medium text-[#00A651] bg-white rounded-md hover:bg-[#E6F2E6] transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-transparent text-sm font-medium text-white bg-[#F5A623] rounded-md hover:bg-[#d48a0e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8 bg-[#F2E2C1] rounded-lg p-6">
            <h3 className="text-lg font-medium text-[#4D2C0A] mb-3">Other Ways to Share Feedback</h3>
            <div className="space-y-2 text-sm text-[#333333]">
              <p>• Talk to your manager or team lead</p>
              <p>• Post in the #knowledge-base Slack channel</p>
              <p>• Email the operations team at ops@villageenterprise.org</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A651]"></div>
        </div>
      }
    >
      <FeedbackContent />
    </Suspense>
  );
}
