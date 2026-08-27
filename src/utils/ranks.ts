import { DetectiveRank } from '../types';

export const DETECTIVE_RANKS: DetectiveRank[] = [
  {
    minScore: 0,
    maxScore: 3,
    title: 'Kezdő nyomozó',
    icon: '🕵️',
    description:
      'Még ismerkedsz a sejttan, szövettan és anyagcsere alapjaival. Tekintsd át a nyomozati kézikönyvet a rendszertani összefüggések elmélyítéséhez!',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    minScore: 4,
    maxScore: 6,
    title: 'Biológiai kutató',
    icon: '🔬',
    description:
      'Jó nyomon jársz! A főbb állat-, növény- és gombatulajdonságokat magabiztosan felismered, a határesetek és metszetek elemzésében van még fejlődési lehetőség.',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  {
    minScore: 7,
    maxScore: 9,
    title: 'Haladó kutató',
    icon: '🧬',
    description:
      'Kiváló éleslátás! Remekül átlátod az eukarióta csoportok közötti biológiai azonosságokat (sejtlégzés, sejtmag) és a különbségeket (sejtfal, fotoszintézis).',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    minScore: 10,
    maxScore: 999,
    title: 'Biológiai mesternyomozó',
    icon: '🏆',
    description:
      'Hibátlan nyomozás! A labor rendszere sikeresen újraindult. Mind a 10 biológiai állítást tökéletesen a megfelelő halmazba és metszetbe helyezted!',
    badgeClass: 'bg-gradient-to-r from-amber-400/30 via-emerald-400/30 to-cyan-400/30 text-amber-200 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]',
  },
];

export function getDetectiveRank(score: number, maxScore: number = 10): DetectiveRank {
  // Normalize if extended case (e.g. 18 points)
  const normalizedScore = maxScore === 10 ? score : Math.round((score / maxScore) * 10);

  if (normalizedScore >= 10) {
    return DETECTIVE_RANKS[3];
  } else if (normalizedScore >= 7) {
    return DETECTIVE_RANKS[2];
  } else if (normalizedScore >= 4) {
    return DETECTIVE_RANKS[1];
  } else {
    return DETECTIVE_RANKS[0];
  }
}

export function getEvaluationSummary(score: number, total: number): string {
  const percentage = Math.round((score / total) * 100);
  if (score === total) {
    return 'Tökéletes megoldás! Minden tulajdonság a helyére került, a labor vészhelyzete elhárult.';
  } else if (percentage >= 80) {
    return 'Nagyszerű teljesítmény! Az élőlények legfőbb sajátságait pontosan rendszerezted.';
  } else if (percentage >= 50) {
    return 'Kielégítő eredmény! A fő csoportokat felismered, de érdemes átnézni a közös metszeteket (pl. heterotrófia, sejtfal).';
  } else {
    return 'A vizsgálat további kutatást igényel. Ismételd át a három élőlénycsoport jellemzőit a Kézikönyvben!';
  }
}
