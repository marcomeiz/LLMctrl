'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Copy, Check, ExternalLink, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import ClassificationBadge from '@/components/ClassificationBadge';
import TriggerPill from '@/components/TriggerPill';
import ChatGPTResponse from '@/components/ChatGPTResponse';
import ConsumerAnalysis from '@/components/ConsumerAnalysis';
import { getRecordById, getFullAnswer, records } from '@/lib/data';

export default function BetfairBDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);

  const id = params.id as string;
  const record = getRecordById(id);
  const fullAnswer = getFullAnswer(id);

  const currentIndex = records.findIndex(r => r.id === id);
  const prevRecord = currentIndex > 0 ? records[currentIndex - 1] : null;
  const nextRecord = currentIndex < records.length - 1 ? records[currentIndex + 1] : null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevRecord) {
        router.push(`/betfair-b/detail/${prevRecord.id}`);
      } else if (e.key === 'ArrowRight' && nextRecord) {
        router.push(`/betfair-b/detail/${nextRecord.id}`);
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
      <div className="flex min-h-screen bg-background">
        <div className="hidden lg:block">
          <Sidebar basePath="/betfair-b" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="lg:hidden">
            <Header />
          </div>
          <main className="flex flex-1 items-center justify-center pb-20 lg:pb-0">
            <div className="text-center">
              <p className="text-text-muted">Record not found</p>
              <Link href="/betfair-b/list" className="mt-4 inline-block text-sm text-text hover:underline">
                ← Back to list
              </Link>
            </div>
          </main>
          <div className="lg:hidden">
            <Navigation basePath="/betfair-b" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar basePath="/betfair-b" />
      </div>

      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <div className="lg:hidden">
          <Header />
        </div>

        {/* Desktop header with nav */}
        <header className="hidden border-b border-border bg-surface lg:block">
          <div className="flex h-12 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Link
                href="/betfair-b/list"
                className="flex items-center gap-1 text-sm text-text-muted hover:text-text"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </Link>
              <div className="h-4 w-px bg-border" />
              <span className="text-xs text-text-muted">Record #{record.id}</span>
            </div>
            <div className="flex items-center gap-2">
              {prevRecord && (
                <Link
                  href={`/betfair-b/detail/${prevRecord.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-text-muted hover:border-text-muted hover:text-text"
                  title="Previous (←)"
                >
                  <ChevronLeft size={18} />
                </Link>
              )}
              {nextRecord && (
                <Link
                  href={`/betfair-b/detail/${nextRecord.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-text-muted hover:border-text-muted hover:text-text"
                  title="Next (→)"
                >
                  <ChevronRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 pb-20 lg:pb-6">
          {/* Mobile navigation bar */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
            <Link
              href="/betfair-b/list"
              className="flex items-center gap-1 text-sm text-text-muted"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>
            <span className="text-xs text-text-muted">#{record.id}</span>
            <div className="flex items-center gap-2">
              {prevRecord && (
                <Link
                  href={`/betfair-b/detail/${prevRecord.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-text-muted"
                >
                  <ChevronLeft size={18} />
                </Link>
              )}
              {nextRecord && (
                <Link
                  href={`/betfair-b/detail/${nextRecord.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-text-muted"
                >
                  <ChevronRight size={18} />
                </Link>
              )}
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="grid gap-6 xl:grid-cols-3">
            {/* Main content - 2 columns */}
            <div className="space-y-6 xl:col-span-2">
              {/* Question card */}
              <div className="rounded-xl border border-border bg-surface p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h1 className="text-lg font-medium text-text">{record.question_text}</h1>
                  <ClassificationBadge classification={record.classification} />
                </div>
                <p className="text-sm text-text-muted">{record.classification_reason}</p>
              </div>

              {/* Triggers */}
              {record.triggers_detail.length > 0 && (
                <div className="rounded-xl border border-border bg-surface">
                  <div className="border-b border-border p-4">
                    <h2 className="text-sm font-medium text-text">
                      Detected Triggers ({record.triggers_detail.length})
                    </h2>
                  </div>
                  <div className="divide-y divide-border">
                    {record.triggers_detail.map((trigger, i) => (
                      <div key={i} className="p-4">
                        <div className="mb-2 flex items-center gap-3">
                          <TriggerPill trigger={trigger.trigger} type={trigger.type} />
                          <span className="text-xs text-text-muted">{trigger.reason}</span>
                        </div>
                        <p className="rounded-lg bg-border/30 p-3 text-sm italic leading-relaxed text-text">
                          &ldquo;{trigger.context}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Response */}
              <div className="rounded-xl border border-border bg-surface">
                <div className="border-b border-border p-4">
                  <h2 className="text-sm font-medium text-text">ChatGPT Response</h2>
                </div>
                <div className="p-4">
                  <ChatGPTResponse
                    question={record.question_text}
                    answer={fullAnswer || record.answer_preview}
                    onCopy={copyToClipboard}
                    copied={copied}
                  />
                </div>
              </div>

              {/* Análisis Interamplify */}
              <ConsumerAnalysis record={record} />
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Metadata */}
              <div className="rounded-xl border border-border bg-surface">
                <div className="border-b border-border p-4">
                  <h2 className="text-sm font-medium text-text">Metadata</h2>
                </div>
                <div className="divide-y divide-border">
                  <div className="p-4">
                    <span className="mb-1 block text-xs text-text-muted">Category</span>
                    <span className="text-sm font-medium text-text">{record.category_name}</span>
                  </div>
                  <div className="p-4">
                    <span className="mb-1 block text-xs text-text-muted">Brand Mentioned?</span>
                    <span className={`text-sm font-medium ${record.mention ? 'text-opportunity' : 'text-text-muted'}`}>
                      {record.mention ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="mb-1 block text-xs text-text-muted">Ranking Position</span>
                    {(() => {
                      const pos = record.ranking_list?.findIndex(b => b.toLowerCase() === 'betfair');
                      if (pos !== undefined && pos >= 0) {
                        return (
                          <span className="text-2xl font-bold text-opportunity">
                            #{pos + 1}
                            <span className="ml-1 text-sm font-normal text-text-muted">
                              of {record.ranking_list?.length}
                            </span>
                          </span>
                        );
                      }
                      return <span className="text-sm text-text-muted">No ranking</span>;
                    })()}
                  </div>
                  {record.ranking_list && record.ranking_list.length > 0 && (
                  <div className="p-4">
                    <span className="mb-1 block text-xs text-text-muted">Full Ranking (competitors)</span>
                    <div className="mt-2 space-y-1">
                      {record.ranking_list.map((brand, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 rounded px-2 py-1 text-sm ${
                            brand.toLowerCase() === 'betfair'
                              ? 'bg-opportunity/10 font-medium text-opportunity'
                              : 'text-text-muted'
                          }`}
                        >
                          <span className="w-5 text-center text-xs">{i + 1}.</span>
                          <span>{brand.charAt(0).toUpperCase() + brand.slice(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}
                </div>
              </div>

              {/* Citations */}
              {record.citations.length > 0 && (
                <div className="rounded-xl border border-border bg-surface">
                  <div className="border-b border-border p-4">
                    <h2 className="text-sm font-medium text-text">Cited Sources</h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      {record.citations.map((citation, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded border border-border px-3 py-2 text-xs text-text-muted"
                        >
                          <ExternalLink size={12} />
                          <span className="truncate">{citation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Help tip - desktop only */}
              <div className="hidden rounded-lg border border-border bg-surface p-4 lg:block">
                <div className="flex items-start gap-3">
                  <Info size={16} className="mt-0.5 shrink-0 text-text-muted" />
                  <p className="text-xs text-text-muted">
                    Use ← → arrow keys to navigate between records quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </main>

        <div className="hidden lg:block">
          <Footer />
        </div>

        {/* Mobile bottom navigation */}
        <div className="lg:hidden">
          <Navigation basePath="/betfair-b" />
        </div>
      </div>
    </div>
  );
}
