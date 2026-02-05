'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import ClassificationBadge from '@/components/ClassificationBadge';
import TriggerPill from '@/components/TriggerPill';
import ChatGPTResponse from '@/components/ChatGPTResponse';
import ConsumerAnalysis from '@/components/ConsumerAnalysis';
import { getRecordById, getFullAnswer, records, Classification } from '@/lib/data';

export default function BetfairDDetailPage() {
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
        router.push(`/betfair-d/detail/${prevRecord.id}`);
      } else if (e.key === 'ArrowRight' && nextRecord) {
        router.push(`/betfair-d/detail/${nextRecord.id}`);
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

  const getStatusIcon = (cls: Classification) => {
    switch (cls) {
      case 'CRITICAL':
        return <AlertCircle size={20} className="text-critical" />;
      case 'WARNING':
        return <AlertTriangle size={20} className="text-warning" />;
      case 'OPPORTUNITY':
        return <CheckCircle size={20} className="text-opportunity" />;
    }
  };

  if (!record) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center pb-20 lg:pb-0">
          <div className="text-center">
            <p className="text-text-muted">Record not found</p>
            <Link href="/betfair-d/list" className="mt-4 inline-block text-sm text-text hover:underline">
              ← Back to list
            </Link>
          </div>
        </main>
        <div className="lg:hidden">
          <Navigation basePath="/betfair-d" />
        </div>
      </div>
    );
  }

  // Calculate ranking position
  const rankingPosition = record.ranking_list?.findIndex(b => b.toLowerCase() === 'betfair');
  const hasRanking = rankingPosition !== undefined && rankingPosition >= 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20 lg:pb-6">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/betfair-d/list"
              className="flex items-center gap-1 text-sm text-text-muted hover:text-text"
            >
              <ArrowLeft size={16} />
              Back to list
            </Link>
            <div className="flex items-center gap-2">
              {prevRecord && (
                <Link
                  href={`/betfair-d/detail/${prevRecord.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:border-text-muted hover:text-text"
                >
                  <ChevronLeft size={18} />
                </Link>
              )}
              {nextRecord && (
                <Link
                  href={`/betfair-d/detail/${nextRecord.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:border-text-muted hover:text-text"
                >
                  <ChevronRight size={18} />
                </Link>
              )}
            </div>
          </div>

          {/* Header Card */}
          <div className={`mb-6 rounded-2xl border p-6 ${
            record.classification === 'CRITICAL' ? 'border-critical/30 bg-critical/5' :
            record.classification === 'WARNING' ? 'border-warning/30 bg-warning/5' :
            'border-opportunity/30 bg-opportunity/5'
          }`}>
            <div className="flex items-start gap-4">
              {getStatusIcon(record.classification)}
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <ClassificationBadge classification={record.classification} />
                  <span className="text-xs text-text-muted">#{record.id}</span>
                </div>
                <h1 className="text-lg font-medium text-text">{record.question_text}</h1>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-xs text-text-muted">Mentioned?</p>
              <p className={`mt-1 text-lg font-bold ${record.mention ? 'text-opportunity' : 'text-text-muted'}`}>
                {record.mention ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-xs text-text-muted">Ranking</p>
              {hasRanking ? (
                <>
                  <p className="mt-1 text-lg font-bold text-opportunity">#{rankingPosition + 1}</p>
                  <p className="text-xs text-text-muted">of {record.ranking_list?.length}</p>
                </>
              ) : (
                <p className="mt-1 text-sm font-medium text-text-muted">No ranking</p>
              )}
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-xs text-text-muted">Category</p>
              <p className="mt-1 text-sm font-medium text-text">{record.category_name.split(' ')[0]}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-xs text-text-muted">Triggers</p>
              <p className="mt-1 text-lg font-bold text-text">{record.triggers_detected.length}</p>
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

          {/* Classification Reason */}
          <div className="mb-6 rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-2 text-sm font-medium text-text">Why this classification?</h2>
            <p className="text-sm text-text-muted">{record.classification_reason}</p>
          </div>

          {/* Triggers */}
          {record.triggers_detail.length > 0 && (
            <div className="mb-6 rounded-xl border border-border bg-surface">
              <div className="border-b border-border p-4">
                <h2 className="text-sm font-medium text-text">Detected Issues ({record.triggers_detail.length})</h2>
              </div>
              <div className="divide-y divide-border">
                {record.triggers_detail.map((trigger, i) => (
                  <div key={i} className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <TriggerPill trigger={trigger.trigger} type={trigger.type} />
                      <span className="text-xs text-text-muted">{trigger.reason}</span>
                    </div>
                    <p className="rounded-lg bg-border/30 p-3 text-sm italic text-text">
                      &ldquo;{trigger.context}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LLM Response */}
          <div className="mb-6 rounded-xl border border-border bg-surface">
            <div className="border-b border-border p-4">
              <h2 className="text-sm font-medium text-text">Full LLM Response</h2>
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
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-3 text-sm font-medium text-text">Sources Cited</h2>
              <div className="space-y-2">
                {record.citations.map((citation, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-text-muted"
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
        <Navigation basePath="/betfair-d" />
      </div>
    </div>
  );
}
