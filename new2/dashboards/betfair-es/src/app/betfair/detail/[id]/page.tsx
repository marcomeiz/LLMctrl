'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClassificationBadge from '@/components/ClassificationBadge';
import TriggerPill from '@/components/TriggerPill';
import ChatGPTResponse from '@/components/ChatGPTResponse';
import ConsumerAnalysis from '@/components/ConsumerAnalysis';
import { getRecordById, getFullAnswer, getRecords } from '@/lib/data';

export default function BetfairDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);

  const id = params.id as string;
  const allRecords = getRecords();
  const record = getRecordById(id);
  const fullAnswer = getFullAnswer(id);

  // Find prev/next records
  const currentIndex = allRecords.findIndex(r => r.id === id);
  const prevRecord = currentIndex > 0 ? allRecords[currentIndex - 1] : null;
  const nextRecord = currentIndex < allRecords.length - 1 ? allRecords[currentIndex + 1] : null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevRecord) {
        router.push(`/betfair/detail/${prevRecord.id}`);
      } else if (e.key === 'ArrowRight' && nextRecord) {
        router.push(`/betfair/detail/${nextRecord.id}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevRecord, nextRecord, router]);

  const copyToClipboard = async () => {
    if (record && fullAnswer) {
      await navigator.clipboard.writeText(fullAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!record) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-text-muted">Record not found</p>
            <Link href="/betfair/list" className="mt-4 inline-block text-sm text-text hover:underline">
              ← Back to list
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pb-6">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          {/* Navigation header */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/betfair/list"
              className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>

            <div className="flex items-center gap-2">
              {prevRecord && (
                <Link
                  href={`/betfair/detail/${prevRecord.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-text-muted hover:border-text-muted hover:text-text"
                  title="Previous (←)"
                >
                  <ChevronLeft size={18} />
                </Link>
              )}
              {nextRecord && (
                <Link
                  href={`/betfair/detail/${nextRecord.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-text-muted hover:border-text-muted hover:text-text"
                  title="Next (→)"
                >
                  <ChevronRight size={18} />
                </Link>
              )}
            </div>
          </div>

          {/* Main content card */}
          <div className="rounded-lg border border-border bg-surface">
            {/* Header with classification */}
            <div className="flex items-start justify-between gap-4 border-b border-border p-4 sm:p-6">
              <h1 className="text-base font-medium text-text sm:text-lg">
                {record.question_text}
              </h1>
              <ClassificationBadge classification={record.classification} />
            </div>

            {/* Metadata */}
            <div className="grid gap-4 border-b border-border p-4 sm:grid-cols-2 sm:p-6">
              <div>
                <span className="text-xs text-text-muted">Category</span>
                <p className="text-sm font-medium text-text">{record.category_name}</p>
              </div>
              <div>
                <span className="text-xs text-text-muted">Brand Mentioned?</span>
                <p className={`text-sm font-medium ${record.mention ? 'text-opportunity' : 'text-text-muted'}`}>
                  {record.mention ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <span className="text-xs text-text-muted">Ranking Position</span>
                {(() => {
                  const pos = record.ranking_list?.findIndex(b => b.toLowerCase() === 'betfair');
                  if (pos !== undefined && pos >= 0) {
                    return (
                      <p className="text-lg font-bold text-opportunity">
                        #{pos + 1} <span className="text-sm font-normal text-text-muted">of {record.ranking_list?.length}</span>
                      </p>
                    );
                  }
                  return <p className="text-sm text-text-muted">No ranking</p>;
                })()}
              </div>
              <div>
                <span className="text-xs text-text-muted">Classification Reason</span>
                <p className="text-sm font-medium text-text">{record.classification_reason}</p>
              </div>
              {record.ranking_list && record.ranking_list.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="text-xs text-text-muted">Full Ranking</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {record.ranking_list.map((brand, i) => (
                      <span
                        key={i}
                        className={`rounded-full border px-3 py-1 text-sm ${
                          brand.toLowerCase() === 'betfair'
                            ? 'border-opportunity bg-opportunity/10 font-medium text-opportunity'
                            : 'border-border text-text-muted'
                        }`}
                      >
                        {i + 1}. {brand.charAt(0).toUpperCase() + brand.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Triggers - FULL CONTEXT, NEVER TRUNCATED */}
            {record.triggers_detail.length > 0 && (
              <div className="border-b border-border p-4 sm:p-6">
                <h2 className="mb-4 text-sm font-medium text-text">
                  Detected Triggers ({record.triggers_detail.length})
                </h2>
                <div className="space-y-4">
                  {record.triggers_detail.map((trigger, i) => (
                    <div
                      key={i}
                      className={`rounded-lg border p-4 ${
                        trigger.type === 'CRITICAL'
                          ? 'border-critical/20 bg-critical-bg/50'
                          : 'border-warning/20 bg-warning-bg/50'
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <TriggerPill trigger={trigger.trigger} type={trigger.type} />
                        <span className="text-xs text-text-muted">{trigger.reason}</span>
                      </div>
                      {/* FULL CONTEXT - NEVER TRUNCATED */}
                      <p className="text-sm leading-relaxed text-text">
                        &ldquo;{trigger.context}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Response - ChatGPT style chat with typing animation */}
            <div className="border-b border-border p-4 sm:p-6">
              <h2 className="mb-4 text-sm font-medium text-text">ChatGPT Response</h2>
              <ChatGPTResponse
                question={record.question_text}
                answer={fullAnswer || record.answer_preview}
                onCopy={copyToClipboard}
                copied={copied}
              />
            </div>

            {/* Interamplify Analysis */}
            <div className="border-b border-border p-4 sm:p-6">
              <ConsumerAnalysis record={record} />
            </div>

            {/* Citations */}
            {record.citations.length > 0 && (
              <div className="p-4 sm:p-6">
                <h2 className="mb-3 text-sm font-medium text-text">Cited Sources</h2>
                <div className="flex flex-wrap gap-2">
                  {record.citations.map((citation, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-text-muted"
                    >
                      <ExternalLink size={12} />
                      {citation}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
