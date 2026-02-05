'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, XCircle, AlertTriangle, CheckCircle, Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ClassificationBadge from '@/components/ClassificationBadge';
import TriggerPill from '@/components/TriggerPill';
import ChatGPTResponse from '@/components/ChatGPTResponse';
import ConsumerAnalysis from '@/components/ConsumerAnalysis';
import { getRecordById, getFullAnswer, records, Classification } from '@/lib/data';

export default function BetfairCDetailPage() {
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
        router.push(`/betfair-c/detail/${prevRecord.id}`);
      } else if (e.key === 'ArrowRight' && nextRecord) {
        router.push(`/betfair-c/detail/${nextRecord.id}`);
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

  const getClassificationIcon = (cls: Classification) => {
    switch (cls) {
      case 'CRITICAL':
        return <XCircle size={18} className="text-critical" />;
      case 'WARNING':
        return <AlertTriangle size={18} className="text-warning" />;
      case 'OPPORTUNITY':
        return <CheckCircle size={18} className="text-opportunity" />;
    }
  };

  if (!record) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center pb-20 lg:pb-0">
          <div className="text-center">
            <p className="text-text-muted">Record not found</p>
            <Link href="/betfair-c/list" className="mt-4 inline-block text-sm text-text hover:underline">
              ← Back to list
            </Link>
          </div>
        </main>
        <div className="lg:hidden">
          <Navigation basePath="/betfair-c" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20 lg:pb-6">
        {/* Navigation bar */}
        <div className="border-b border-border bg-surface">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
            <Link
              href="/betfair-c/list"
              className="flex items-center gap-1 text-sm text-text-muted hover:text-text"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>
            <span className="text-xs text-text-muted">Record #{record.id}</span>
            <div className="flex items-center gap-2">
              {prevRecord && (
                <Link
                  href={`/betfair-c/detail/${prevRecord.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-text-muted hover:border-text-muted hover:text-text"
                >
                  <ChevronLeft size={18} />
                </Link>
              )}
              {nextRecord && (
                <Link
                  href={`/betfair-c/detail/${nextRecord.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded border border-border text-text-muted hover:border-text-muted hover:text-text"
                >
                  <ChevronRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          {/* Header with classification */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-4">
            <div className="flex items-start gap-3">
              {getClassificationIcon(record.classification)}
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <ClassificationBadge classification={record.classification} />
                  <span className="text-xs text-text-muted">{record.category_name}</span>
                </div>
                <h1 className="text-lg font-medium text-text">{record.question_text}</h1>
                <p className="mt-2 text-sm text-text-muted">{record.classification_reason}</p>
              </div>
            </div>
          </div>

          {/* Analytics metrics */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-surface p-3 text-center">
              <p className={`text-2xl font-bold ${record.mention ? 'text-opportunity' : 'text-text-muted'}`}>
                {record.mention ? 'Yes' : 'No'}
              </p>
              <p className="text-xs text-text-muted">Mentioned?</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3 text-center">
              {(() => {
                const pos = record.ranking_list?.findIndex(b => b.toLowerCase() === 'betfair');
                if (pos !== undefined && pos >= 0) {
                  return (
                    <>
                      <p className="text-2xl font-bold text-opportunity">#{pos + 1}</p>
                      <p className="text-xs text-text-muted">of {record.ranking_list?.length}</p>
                    </>
                  );
                }
                return (
                  <>
                    <p className="text-2xl font-bold text-text-muted">-</p>
                    <p className="text-xs text-text-muted">No ranking</p>
                  </>
                );
              })()}
            </div>
            <div className="rounded-lg border border-border bg-surface p-3 text-center">
              <p className="text-2xl font-bold text-text">{record.triggers_detected.length}</p>
              <p className="text-xs text-text-muted">Triggers</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3 text-center">
              <p className="text-2xl font-bold text-text">{record.citations.length}</p>
              <p className="text-xs text-text-muted">Citations</p>
            </div>
          </div>

          {/* Full Ranking - right after the stats */}
          {record.ranking_list && record.ranking_list.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs text-text-muted">Ranking:</span>
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
          )}

          {/* Triggers */}
          {record.triggers_detail.length > 0 && (
            <div className="mb-6 rounded-xl border border-border bg-surface">
              <div className="border-b border-border p-4">
                <h2 className="text-sm font-medium text-text">Detected Triggers ({record.triggers_detail.length})</h2>
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

          {/* Ranking position */}
          {record.ranking_list && record.ranking_list.length > 0 && (
            <div className="mb-6 rounded-xl border border-border bg-surface p-4">
              <h2 className="mb-3 text-sm font-medium text-text">Ranking Position</h2>
              <div className="flex flex-wrap gap-2">
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

          {/* ChatGPT Response */}
          <div className="mb-6 rounded-xl border border-border bg-surface">
            <div className="border-b border-border p-4">
              <h2 className="text-sm font-medium text-text">LLM Response</h2>
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
          <div className="mb-6">
            <ConsumerAnalysis record={record} />
          </div>

          {/* Citations */}
          {record.citations.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <h2 className="mb-3 text-sm font-medium text-text">Cited Sources ({record.citations.length})</h2>
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
          )}
        </div>
      </main>

      <div className="hidden lg:block">
        <Footer />
      </div>

      <div className="lg:hidden">
        <Navigation basePath="/betfair-c" />
      </div>
    </div>
  );
}
