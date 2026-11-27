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

  const [openedDocumentId, setOpenedDocumentId] = useState<string | null>(
    initialProgress.openedDocumentId ?? null,
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    initialProgress.openedDocumentId ?? null,
  );
  const [savedEvidenceIds, setSavedEvidenceIds] = useState(
    initialProgress.savedEvidenceIds ?? [],
  );
  const [catalogueFeedback, setCatalogueFeedback] = useState('');
  const [testedTheoryId, setTestedTheoryId] = useState(
    initialProgress.testedTheoryId ?? null,
  );
  const [includeRevision, setIncludeRevision] = useState(
    initialProgress.includeRevision ?? false,
  );
  const [includeDraft, setIncludeDraft] = useState(
    initialProgress.includeDraft ?? false,
  );
  const [includeVaultLog, setIncludeVaultLog] = useState(
    initialProgress.includeVaultLog ?? false,
  );
  const [includeAnnexReceipt, setIncludeAnnexReceipt] = useState(
    initialProgress.includeAnnexReceipt ?? false,
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
      includeVaultLog,
      includeAnnexReceipt,
    });
  }, [
    openedDocumentId,
    savedEvidenceIds,
    testedTheoryId,
    includeRevision,
    includeDraft,
    reportEnding,
    includeVaultLog,
    includeAnnexReceipt,
  ]);

  const { document: caseDocument, message, meeting, theories, recoveredDraft, endings, briefing, archiveDocuments, catalogueCheck, vaultLog, annexReply, } = firstCase;

  function openDocument(id: string) {
    setSelectedDocumentId(id);

    if (id === caseDocument.id) {
      setOpenedDocumentId(id);
    }
  }
  const revisionSaved = savedEvidenceIds.includes(meeting.revisionId);
  const draftSaved = savedEvidenceIds.includes(recoveredDraft.id);
  const catalogueEvidenceSaved = savedEvidenceIds.includes(catalogueCheck.id);
  const archiveFiles = [caseDocument, ...archiveDocuments];
  if (catalogueEvidenceSaved) {
    archiveFiles.push(vaultLog);
  }

  const selectedDocument = archiveFiles.find(
    (file) => file.id === selectedDocumentId,
  );
  const vaultLogSaved = savedEvidenceIds.includes(vaultLog.id);
  const annexReplySaved = savedEvidenceIds.includes(annexReply.id);
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
    setSelectedDocumentId(null);
    setSavedEvidenceIds([]);
    setCatalogueFeedback('');
    setTestedTheoryId(null);
    setIncludeRevision(false);
    setIncludeDraft(false);
    setIncludeVaultLog(false);
    setReportEnding(null);
    setIncludeAnnexReceipt(false);
  }
  const messageUnlocked = openedDocumentId === message.unlockAfterOpening;
  const messageCount = Number(messageUnlocked) + Number(revisionSaved) + Number(vaultLogSaved);

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
          <section className="file-browser">
            <ul className="file-list" aria-label="Archive files">
              {archiveFiles.map((file) => (
                <li key={file.id}>
                  <button
                    type="button"
                    aria-pressed={selectedDocumentId === file.id}
                    onClick={() => openDocument(file.id)}
                  >
                    {file.title}
                  </button>
                </li>
              ))}
            </ul>

            {selectedDocument ? (
              <article className="open-document">
                <h3>{selectedDocument.title}</h3>
                <p>{selectedDocument.text}</p>
                {selectedDocument.id === 'printed-index' && (
                  <fieldset disabled={catalogueEvidenceSaved}>
                    <legend>{catalogueCheck.question}</legend>

                    {catalogueCheck.locations.map((location) => (
                      <button
                        key={location}
                        type="button"
                        onClick={() => {
                          if (location !== catalogueCheck.answer) {
                            setCatalogueFeedback('Check the three refence numbers again');
                            return;
                          }

                          saveEvidence(catalogueCheck.id);
                          setCatalogueFeedback('');
                        }}
                      >
                        {location}
                      </button>
                    ))}

                    <p role="status">
                      {catalogueEvidenceSaved ? 'Evidence saved.' : catalogueFeedback}
                    </p>
                  </fieldset>
                )}
                {selectedDocument.id === 'printed-index' && catalogueEvidenceSaved && (
                  <button type="button" onClick={() => openDocument(vaultLog.id)}>
                    Open recovered East Vault log
                  </button>
                )}
                {selectedDocument.id === vaultLog.id && (
                  <button
                    type="button"
                    disabled={vaultLogSaved}
                    onClick={() => saveEvidence(vaultLog.id)}
                  >
                    {vaultLogSaved ? 'Evidence saved' : 'Save log as evidence'}
                  </button>
                )}
                {selectedDocument.id === vaultLog.id && vaultLogSaved && !annexReplySaved && (
                  <button type="button" onClick={() => setActiveApp('messages')}>
                    Open the Annex reply in messages
                  </button>
                )}
              </article>
            ) : (
              <p>Select a file to read it.</p>
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
            {vaultLogSaved && (
              <article>
                <h3>{annexReply.title}</h3>
                <p>{annexReply.text}</p>
                <button
                  type="button"
                  disabled={annexReplySaved}
                  onClick={() => saveEvidence(annexReply.id)}
                >
                  {annexReplySaved ? 'Evidence saved' : 'Save Annex receipt as evidence'}
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
            {savedEvidenceIds.length === 0 && (
              <p>No evidence collected yet.</p>
            )}
            {revisionSaved && (
              <article>
                <h3>{meeting.title} · Calendar revision</h3>
                <p>
                  {meeting.changedBy} moved the meeting from{' '}
                  {meeting.originalTime} to {meeting.currentTime}.
                </p>
              </article>
            )}
            {draftSaved && (
              <article>
                <h3>{recoveredDraft.title}</h3>
                <p>{recoveredDraft.text}</p>
              </article>
            )}
            {catalogueEvidenceSaved && (
              <article>
                <h3>Catalogue cross-check</h3>
                <p>{catalogueCheck.evidence}</p>
              </article>
            )}
            {vaultLogSaved && (
              <article>
                <h3>East Vault transfer log</h3>
                <p>{vaultLog.text}</p>
              </article>
            )}
            {annexReplySaved && (
              <article>
                <h3>Restoration Annex intake receipt</h3>
                <p>{annexReply.text}</p>
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

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={includeVaultLog}
                    disabled={!vaultLogSaved}
                    onChange={(event) => {
                      setIncludeVaultLog(event.target.checked);
                      setReportEnding(null);
                    }}
                  />
                  East Vault transfer log
                </label>
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={includeAnnexReceipt}
                    disabled={!annexReplySaved}
                    onChange={(event) => {
                      setIncludeAnnexReceipt(event.target.checked);
                      setReportEnding(null);
                    }}
                  />
                  Restoration Annex receipt
                </label>
              </div>

              <button type='submit' disabled={!revisionSaved || !includeRevision}>
                submit report
              </button>
            </form>

            <div role="status">
              {reportEnding && (
                <>
                  <p>{endings[reportEnding]}</p>
                  {vaultLogSaved && includeVaultLog && (
                    <p>{endings.vaultFinding}</p>
                  )}
                  {annexReplySaved && includeAnnexReceipt && (
                    <p>{endings.annexFinding}</p>
                  )}
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}