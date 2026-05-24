import { useState, useEffect } from 'react';
import { useAuth } from '@/app/AuthProvider';
import { useUserRole } from '@/hooks/useUserRole';
import { useT } from '@/app/LocaleProvider';
import { ChildHomePage } from './ChildHomePage';
import { TopicBrowser } from './TopicBrowser';
import { GradeSelect } from './GradeSelect';
import { CheckFeedbackCard } from './CheckFeedbackCard';
import { ProgressIndicator } from './ProgressIndicator';
import { SessionTimer } from './SessionTimer';
import { SessionEndSummary } from './SessionEndSummary';
import { HelpButton } from './HelpButton';
import { PracticeInputRouter } from './PracticeInputRouter';
import { OlyLogo } from '@/components/shared/OlyLogo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSessionDispatch } from '@/hooks/useSessionDispatch';
import { getSubjectMeta } from '@/lib/utils/subjectRegistry';
import type { Grade, TopicMetadata, TaskResultStatus } from '@/lib/engine/types';

export function SessionView() {
  const t = useT();
  const { signOut } = useAuth();
  const { role } = useUserRole();
  const isChild = role === 'child';
  const isAdmin = role === 'admin';

  const {
    grade,
    session,
    practiceQuestion,
    checkFeedback,
    taskResults,
    loading,
    aiEvaluation,
    handleGradeSelect,
    handleTopicSelect,
    handleAnswerSubmit,
    handleContinueAfterCheck,
    handleTimeExpired,
    handleReset,
  } = useSessionDispatch();

  const [showTopicBrowser, setShowTopicBrowser] = useState(false);

  // No grade selected
  if (!grade && !isChild) {
    return <GradeSelect onSelect={handleGradeSelect} />;
  }

  // Child home or topic browser (no active session)
  if (!session) {
    if (isChild && !showTopicBrowser) {
      return (
        <ChildHomePage
          grade={grade!}
          onSelectTopic={handleTopicSelect}
          onBrowseTopics={() => setShowTopicBrowser(true)}
        />
      );
    }
    return (
      <TopicBrowser
        grade={grade!}
        onSelectTopic={handleTopicSelect}
        onBack={isChild ? () => setShowTopicBrowser(false) : undefined}
      />
    );
  }

  // Session end
  if (session.state === 'END') {
    return (
      <SessionEndSummary
        session={session}
        taskResults={taskResults}
        aiEvaluation={aiEvaluation}
        onReset={handleReset}
        onRetry={() => {
          handleReset();
          if (session.matchedTopic) handleTopicSelect(session.matchedTopic);
        }}
      />
    );
  }

  // Active session
  const currentTask = session.practiceBatch[session.currentTaskIndex];
  const subjectMeta = session.matchedTopic
    ? getSubjectMeta(session.matchedTopic.subject)
    : null;

  return (
    <div className="min-h-screen session-bg-gradient">
      {/* Admin preview banner */}
      {isAdmin && (
        <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-sm flex items-center justify-between">
          <span>Nahled zakovskeho pohledu</span>
          <Button size="sm" variant="outline" onClick={handleReset}>
            {t('common.back')}
          </Button>
        </div>
      )}

      {/* Session header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-0 h-16 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 shadow-lg overflow-hidden">
        {/* Dekorativní hvězdičky */}
        <span className="pointer-events-none absolute left-[15%] top-[20%] text-white/20 text-lg select-none" style={{ animation: 'oli-star-1 18s ease-in-out infinite', animationDelay: '-4s' }}>✦</span>
        <span className="pointer-events-none absolute left-[50%] top-[60%] text-white/15 text-sm select-none" style={{ animation: 'oli-star-3 22s ease-in-out infinite', animationDelay: '-10s' }}>✦</span>
        <span className="pointer-events-none absolute right-[20%] top-[25%] text-white/20 text-base select-none" style={{ animation: 'oli-star-2 20s ease-in-out infinite', animationDelay: '-7s' }}>✦</span>

        {/* Levá část — zpět + předmět */}
        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm font-semibold text-white/90 hover:text-white transition-colors rounded-lg px-2 py-1.5 hover:bg-white/15"
          >
            <span className="text-base leading-none">←</span>
            {t('common.back')}
          </button>
          {subjectMeta && (
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-3 py-1">
              <span className="text-base leading-none">{subjectMeta.emoji}</span>
              <span className="text-xs font-bold text-white">{session.matchedTopic?.topic}</span>
            </div>
          )}
        </div>

        {/* Střed — logo */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10">
          <OlyLogo size="sm" onClick={handleReset} className="[&_*]:brightness-0 [&_*]:invert" />
        </div>

        {/* Pravá část — timer + odhlásit */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-3 py-1.5 text-white font-semibold">
            <SessionTimer
              startTime={session.startTime}
              maxSeconds={session.rules.maxTimeSeconds}
              countUp={isChild}
              onTimeExpired={handleTimeExpired}
            />
          </div>
          <button
            onClick={signOut}
            className="text-sm text-white/70 hover:text-white transition-colors rounded-lg p-1.5 hover:bg-white/20"
            title={t('common.signOut')}
          >
            ✕
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Progress */}
        <ProgressIndicator
          total={session.practiceBatch.length}
          current={session.currentTaskIndex}
          results={taskResults}
        />

        {/* Feedback overlay */}
        {checkFeedback && (
          <CheckFeedbackCard
            correct={checkFeedback.correct}
            correctAnswer={checkFeedback.correctAnswer}
            solutionSteps={checkFeedback.solutionSteps}
            hints={checkFeedback.hints}
            onContinue={handleContinueAfterCheck}
          />
        )}

        {/* Current task */}
        {currentTask && !checkFeedback && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{currentTask.question}</h2>

            <PracticeInputRouter
              task={currentTask}
              inputType={session.matchedTopic?.inputType ?? 'text'}
              onSubmit={handleAnswerSubmit}
              disabled={loading}
            />

            <HelpButton
              topic={session.matchedTopic}
              task={currentTask}
              onHelpUsed={() => {
                // Tracked in useSessionDispatch
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
