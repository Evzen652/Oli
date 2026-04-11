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
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <OlyLogo size="sm" onClick={handleReset} />
          <Button variant="ghost" size="sm" onClick={handleReset}>
            {t('common.back')}
          </Button>
          {subjectMeta && (
            <Badge variant="secondary">
              {subjectMeta.emoji} {session.matchedTopic?.topic}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <SessionTimer
            startTime={session.startTime}
            maxSeconds={session.rules.maxTimeSeconds}
            countUp={isChild}
            onTimeExpired={handleTimeExpired}
          />
          <Button variant="ghost" size="sm" onClick={signOut}>
            {t('common.signOut')}
          </Button>
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
