import { useState } from 'react';
import { firstCase } from './cases/firstCase';

type DesktopApp = 'files' | 'messages' | 'calendar' | 'evidence';

export default function App() {
  const [activeApp, setActiveApp] = useState<DesktopApp>('files');
  const [openedDocumentId, setOpenedDocumentId] = useState<string | null>(null);
  const [savedEvidenceId, setSavedEvidenceId] = useState<string | null>(null);

  const { document: caseDocument, message, meeting } = firstCase;
  const revisionSaved = savedEvidenceId === meeting.revisionId;
  const messageUnlocked = openedDocumentId === message.unlockAfterOpening;

  return (
    <main>
      <h1>Ghost Protocol</h1>

      <nav aria-label="Desktop apps">
        <button onClick={() => setActiveApp('files')}>Files</button>
        <button onClick={() => setActiveApp('messages')}>
          Messages{messageUnlocked ? ' (1)' : ''}
        </button>
        <button onClick={() => setActiveApp('calendar')}>Calendar</button>
        <button onClick={() => setActiveApp('evidence')}>
          Evidence{revisionSaved ? ' (1)' : ''}
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
              onClick={() => setSavedEvidenceId(meeting.revisionId)}
            >
              {revisionSaved ? 'Evidence saved' : 'Save as evidence'}
            </button>
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
        </section>
      )}
    </main>
  );
}