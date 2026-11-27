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
        vaultFinding: 'The East Vault log lists the Restoration Annex as the destination of the three missing record. The receiving signature is blank, so the log cannot confirm delivery or place the archivist at the Annex.',
        annexFinding: 'The Restoration Annex receipt confirms that records A-17, A-22, and A-31 arrived at 9:42 AM. It lists courier badge C-04. The archivists whereabout remain unknown',
        courierFinding:
            'The Annex clerk checked Tara Bose’s staff ID and recorded her delivering the three missing records at 9:42 AM using badge C-04.',
        completeFinding:
            'The records are accounted for. The last record placing the archivist in person is the 9:24 AM East Vault sign-in. Their whereabouts after that remain unknown.',
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
    annexReply: {
        id: 'restoration-annex-reply',
        title: 'Reply from the Restoration Annex',
        text: '9:42 AM - Recods A-17, A-22, and A-31 received. Courier badge: C-04. The receipt has no archivist signature. Our copy of the intake recod is attached below.',
    },
    courierRoster: {
        id: 'courier-roster',
        title: 'courier-roster.txt',
        text: 'C-02 - Nila Rao. C-04 - Dev Malik. C-07 - Tara Bose.',
        badge: 'C-04',
        choices: ['Nila Rao', 'Dev Malik', 'Tara Bose'],
        answer: 'Dev Malik',
        evidence: 'The courier roster assigns badge C-04 to Dev Malik. The Annex receipt records that badge for the 9:42 AM delivery.',
    },
    courierStatement: {
        id: 'dev-courier-statement',
        title: 'Statement from Dev Malik',
        text: 'C-04 is assigned to me. At 9:30 I lent it to Tara Bose because her badge would not scan. I stayed at the dispatch desk. I did not see who signed in at the Annex.',
    },
    annexSignIn: {
        id: 'annex-sign-in',
        title: 'annex-sign-in.txt',
        text: '9:42 AM - Tara Bose delivered A-17, A-22, and A-31. She presented badge C-04. I checked her staff ID before accepting the records. - Leena Shah, Annex intake clerk',
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
        {
            id: 'dev-delivered-records',
            claim: 'Dev Malik delivered the records himself.',
            feedback:
                'Inconclusive. The roster assigns C-04 to Dev, and the receipt records that badge. Neither records who wore it.',

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
