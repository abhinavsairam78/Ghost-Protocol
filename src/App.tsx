import { useEffect, useState } from 'react';
import { loadProgress, saveProgress, type ReportEnding } from './saveProgress';
import { firstCase } from './cases/firstCase';
import './App.css';

type DesktopApp = 'files' | 'messages' | 'calendar' | 'evidence';
const appTitles: Record<DesktopApp, string> = {
  files: 'Files',
  messages: 'Messages',
  calendar: 'Calendar',
  evidence: 'Evidence',
};

export default function App() {
  const [activeApp, setActiveApp] = useState<DesktopApp>('files');
  const [initialProgress] = useState(loadProgress);

  const [openedDocumentId, setOpenedDocumentId] = useState(
    initialProgress.openedDocumentId ?? null,
  );
  const [savedEvidenceIds, setSavedEvidenceIds] = useState(
    initialProgress.savedEvidenceIds ?? [],
  );
  const [testedTheoryId, setTestedTheoryId] = useState(
    initialProgress.testedTheoryId ?? null,
  );
  const [includeRevision, setIncludeRevision] = useState(
    initialProgress.includeRevision ?? false,
  );
  const [includeDraft, setIncludeDraft] = useState(
    initialProgress.includeDraft ?? false,
  );
  const [reportEnding, setReportEnding] = useState<ReportEnding | null>(
    initialProgress.reportEnding ?? null,
  );

  useEffect(() => {
    saveProgress({
      openedDocumentId,
      savedEvidenceIds,
      testedTheoryId,
      includeRevision,
      includeDraft,
      reportEnding,
    });
  }, [
    openedDocumentId,
    savedEvidenceIds,
    testedTheoryId,
    includeRevision,
    includeDraft,
    reportEnding,
  ]);

  const { document: caseDocument, message, meeting, theories, recoveredDraft, endings, briefing, } = firstCase;
  const revisionSaved = savedEvidenceIds.includes(meeting.revisionId);
  const draftSaved = savedEvidenceIds.includes(recoveredDraft.id);
  const testedTheory = theories.find((theory) => theory.id === testedTheoryId);
  function saveEvidence(id: string) {
    setSavedEvidenceIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  }
  function restartCase() {
    const confirmed = window.confirm(
      'Restart this case? Your collected evidence and report will be cleared.',
    );
    if (!confirmed) return;

    setActiveApp('files');
    setOpenedDocumentId(null);
    setSavedEvidenceIds([]);
    setTestedTheoryId(null);
    setIncludeRevision(false);
    setIncludeDraft(false);
    setReportEnding(null);
  }
  const messageUnlocked = openedDocumentId === message.unlockAfterOpening;
  const messageCount = Number(messageUnlocked) + Number(revisionSaved);

  return (
    <main className="desktop">
      <h1>Ghost Protocol</h1>
      <section className="case-briefing" aria-labelledby="case-title">
        <h2 id="case-title">{briefing.title}</h2>
        <p>{briefing.summary}</p>
        <p><strong>Objective:</strong> {briefing.objective}</p>
        {openedDocumentId === null && <p>{briefing.firstlead}</p>}
      </section>
      <button type="button" onClick={restartCase}>
        Restart Case
      </button>

      <nav className="taskbar" aria-label="Desktop apps">
        <button type="button" aria-pressed={activeApp === 'files'}
          onClick={() => setActiveApp('files')}>
          Files
        </button>
        <button type="button" aria-pressed={activeApp === 'messages'}
          onClick={() => setActiveApp('messages')}>
          Messages{messageCount > 0 ? ` (${messageCount})` : ''}
        </button>
        <button type="button" aria-pressed={activeApp === 'calendar'}
          onClick={() => setActiveApp('calendar')}>
          Calendar
        </button>
        <button type="button" aria-pressed={activeApp === 'evidence'}
          onClick={() => setActiveApp('evidence')}>
          Evidence{savedEvidenceIds.length > 0 ? ` (${savedEvidenceIds.length})` : ''}
        </button>
      </nav>

      <div
        className="app-window"
        data-app={activeApp}
        role="region"
        aria-labelledby="app-window-title"
      >
        <header className="window-titlebar">
          <h2 id="app-window-title">{appTitles[activeApp]}</h2>
        </header>

        {activeApp === 'files' ? (
          <section>
            <button onClick={() => setOpenedDocumentId(caseDocument.id)}>
              {caseDocument.title}
            </button>
            {openedDocumentId === caseDocument.id && (
              <article className="open-document">
                <h3>{caseDocument.title}</h3>
                <p>{caseDocument.text}</p>
              </article>
            )}
          </section>
        ) : activeApp === 'messages' ? (
          <section>
            <p>{messageUnlocked ? message.text : 'No messages.'}</p>
            {revisionSaved && (
              <article>
                <h3>{recoveredDraft.title}</h3>
                <p>{recoveredDraft.text}</p>
                <button
                  type="button"
                  disabled={draftSaved}
                  onClick={() => saveEvidence(recoveredDraft.id)}
                >
                  {draftSaved ? 'Evidence saved' : 'Save draft as evidence'}
                </button>
              </article>
            )}
          </section>
        ) : activeApp === 'calendar' ? (
          <section>
            <h3>{meeting.title}</h3>
            <p>Scheduled for {meeting.currentTime}</p>

            <details>
              <summary>Revision history</summary>
              <p>
                {meeting.changedBy} moved this meeting from{' '}
                {meeting.originalTime} to {meeting.currentTime}.
              </p>
              <button
                disabled={revisionSaved}
                onClick={() => saveEvidence(meeting.revisionId)}
              >
                {revisionSaved ? 'Evidence saved' : 'Save as evidence'}
              </button>
              {revisionSaved && !draftSaved && (
                <div>
                  <p role="status">A recovered draft is available in Messages.</p>
                  <button
                    type="button"
                    onClick={() => setActiveApp('messages')}
                  >
                    Open Messages
                  </button>
                </div>
              )}
            </details>
          </section>
        ) : (
          <section>
            {revisionSaved ? (
              <article>
                <h3>{meeting.title} · Calendar revision</h3>
                <p>
                  {meeting.changedBy} moved the meeting from{' '}
                  {meeting.originalTime} to {meeting.currentTime}.
                </p>
              </article>
            ) : (
              <p>No evidence collected yet.</p>
            )}
            {draftSaved && (
              <article>
                <h3>{recoveredDraft.title}</h3>
                <p>{recoveredDraft.text}</p>
              </article>
            )}
            <h3>Test a theory</h3>
            {!revisionSaved && <p>Save the calender revision to test a theory.</p>}

            {theories.map((theory) => (
              <button
                key={theory.id}
                type="button"
                disabled={!revisionSaved}
                onClick={() => setTestedTheoryId(theory.id)}
              >
                {theory.claim}
              </button>
            ))}

            <p role="status">
              {testedTheory?.id === 'protect-the-archive' && draftSaved
                ? 'Supported. The revision confirms the timing change, and the draft explains Miras stated reason.'
                : testedTheory?.feedback}
            </p>
            <h3>Case report</h3>
            <p>Attach the evidence you want to submit.</p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!revisionSaved || !includeRevision) return;

                setReportEnding(
                  draftSaved && includeDraft ? 'supported' : 'partial',
                );
              }}
            >
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={includeRevision}
                    disabled={!revisionSaved}
                    onChange={(event) => {
                      setIncludeRevision(event.target.checked);
                      setReportEnding(null);
                    }}
                  />
                  Calender revision
                </label>
              </div>

              <div>
                <label>
                  <input
                    type='checkbox'
                    checked={includeDraft}
                    disabled={!draftSaved}
                    onChange={(event) => {
                      setIncludeDraft(event.target.checked);
                      setReportEnding(null);
                    }}
                  />
                  Recovered draft
                </label>
              </div>

              <button type='submit' disabled={!revisionSaved || !includeRevision}>
                submit report
              </button>
            </form>

            <p role="status">{reportEnding ? endings[reportEnding] : ''}</p>
          </section>
        )}
      </div>
    </main>
  );
}