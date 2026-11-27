export const firstCase = {
    document: {
        id: 'last-note',
        title: 'last-note.txt',
        text: 'I left at 9:17. Check the calender.',
    },
    archiveDocuments: [
        {
            id: 'handoff-procedure',
            title: 'handoff-procedure.txt',
            text: 'Bring the archive index to the handoff. The receiving archivist signs the transfer log before taking custody.',
        },
        {
            id: 'catalogue-log',
            title: 'catalogue-log.txt',
            text: 'Missing from the digital caalogue: A-17, A-22, A-31. Check the printed index for their storage location.',
        },
        {
            id: 'printed-index',
            title: 'printed-index',
            text: 'A-17 - East Vault. A-19 - North Vault. A-22 - East Vault. A-28 - West Vault. A-31 - East Vault.',
        },
    ],
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
    catalogueCheck: {
        id: 'catalogue-cross-check',
        question: 'Where were all three missing records stored?',
        locations: ['North Vault', 'East Vault', 'West Vault'],
        answer: 'East Vault',
        evidence: 'The printed index places all three missing records in the East Vault.',
    },
    vaultLog: {
        id: 'east-vault-log',
        title: 'east-vault-log.txt',
        text: '9:24 AM - Archivist signed in. 9:27 AM - Transfer logged for A-17, A-22, and A-31. Destination: Restoration Annex. Receiving signature: blank.',
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
