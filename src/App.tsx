import { useEffect, useState } from 'react';
import { loadProgress, saveProgress, type ReportEnding } from './saveProgress';
import { firstCase } from './cases/firstCase';

type DesktopApp = 'files' | 'messages' | 'calendar' | 'evidence';

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
    <main>
      <h1>Ghost Protocol</h1>
      <section aria-labelledby="case-title">
        <h2 id="case-title">{briefing.title} </h2>
        <p>{briefing.summary}</p>
        <p><strong>Objective:</strong>{briefing.objective}</p>
        {openedDocumentId === null && <p>{briefing.firstlead}</p>}
      </section>
      <button type="button" onClick={restartCase}>
        Restart Case
      </button>

      <nav aria-label="Desktop apps">
        <button onClick={() => setActiveApp('files')}>Files</button>
        <button onClick={() => setActiveApp('messages')}>
          Messages{messageCount > 0 ? ' (${messagecount})' : ''}
        </button>
        <button onClick={() => setActiveApp('calendar')}>Calendar</button>
        <button onClick={() => setActiveApp('evidence')}>
          Evidence{savedEvidenceIds.length > 0 ? ` (${savedEvidenceIds.length})` : ''}
        </button>
      </nav>

      {activeApp === 'files' ? (
        <section>
          <button onClick={() => setOpenedDocumentId(caseDocument.id)}>
            {caseDocument.title}
          </button>
          {openedDocumentId === caseDocument.id && <p>{caseDocument.text}</p>}
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
          <h2>Calendar</h2>
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
          <h2>Evidence</h2>
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
    </main>
  );
}