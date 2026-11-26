export const firstCase = {
    document: {
        id: 'last-note',
        title: 'last-note.txt',
        text: 'I left at 9:17. Check the calender.',
    },
    message: {
        unlockAfterOpening: 'last-note',
        text: 'If you found the note, check who moved thee meeting.',
    },
    meeting: {
        revisionId: 'archive-handoff-revision',
        title: 'Archive handoff',
        originalTime: '9:00 AM',
        currentTime: '9:30 AM',
        changedBy: 'Mira Sen',
    },
    recoveredDraft: {
        id: 'mira-recovered-draft',
        title: 'Recovered draft from Mira',
        text: 'I mvoed the handoff to give you time to copy the archive. Keep the copy with you. Someone has been deleting the originals.',
    },
    endings: {
        partial: 'The report confirms Mira moved the handoff. Her reason remains unknown.',
        supported: 'The report confirms Mira moved the handoff. Her recovered draft says she wanted to give the laptop owner time to copy the archive. The owners whereabouts are still unkown.',
    },
    theories: [
        {
            id: 'meeting-moved',
            claim: 'Mira sen moved the archive handoff',
            feedback: 'Supported. The calender revision records Mira Sen as the editor',
        },
        {
            id: 'protect-the-archive',
            claim: 'Mira Sen moved the handoff to delay the laptop owner.',
            feedback: 'Inconclusive. The revision shows who changed the time, but gives no reason.',
        },
    ],
    briefing: {
        title: 'Case 01 - The Missing Archivist',
        summary:
            'The archivist didnt return after leaving for a scheduled handoff. Their laptop was still on when it was found.',
        objective:
            'Find out what changed before the handoff and submit a report with evidence.',
        firstlead: 'Start in Files. Open last-note.txt'
    },
};
