import { DetectiveRank } from '../types';

export const DETECTIVE_RANKS: DetectiveRank[] = [
  {
    minScore: 0,
    maxScore: 5,
    title: 'Kezdő nyomozó',
    icon: '🕵️',
    description:
      'Még ismerkedsz a sejttan, szövettan és anyagcsere alapjaival. Tekintsd át a nyomozati kézikönyvet a rendszertani összefüggések elmélyítéséhez!',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    minScore: 6,
    maxScore: 10,
    title: 'Haladó nyomozó',
    icon: '🧬',
    description:
      'Kiváló éleslátás! Remekül átlátod az eukarióta csoportok közötti biológiai azonosságokat és a különbségeket.',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    minScore: 11,
    maxScore: 15,
    title: 'Biológiai kutató',
    icon: '🔬',
    description:
      'Mélyreható biológiai tudás! A bonyolultabb halmazmetszetek és anyagcsere-sajátosságok sem fognak ki rajtad.',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  {
    minScore: 16,
    maxScore: 18,
    title: 'Biológiai mesternyomozó',
    icon: '🏆',
    description:
      'Mesterfokú rendszerezés! A laboratórium minden rejtélyét hibátlanul feltártad és az összes nyomot a helyére illesztetted!',
    badgeClass: 'bg-gradient-to-r from-amber-400/30 via-emerald-400/30 to-cyan-400/30 text-amber-200 border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]',
  },
];

export function getDetectiveRank(score: number, maxScore: number = 18): DetectiveRank {
  // Normalize if different question count is used
  const normalizedScore = maxScore === 18 ? score : Math.round((score / (maxScore || 18)) * 18);

  if (normalizedScore >= 16) {
    return DETECTIVE_RANKS[3]; // 16-18 Mester
  } else if (normalizedScore >= 11) {
    return DETECTIVE_RANKS[2]; // 11-15 Kutató
  } else if (normalizedScore >= 6) {
    return DETECTIVE_RANKS[1]; // 6-10 Haladó
  } else {
    return DETECTIVE_RANKS[0]; // 0-5 Kezdő
  }
}

export function getEvaluationSummary(score: number, total: number): string {
  const percentage = Math.round((score / total) * 100);
  if (score === total) {
    return 'Tökéletes megoldás! Minden tulajdonság a helyére került, a labor vészhelyzete elhárult.';
  } else if (percentage >= 85) {
    return 'Mesteri teljesítmény! Az élőlények legfőbb sajátságait és határeseteit pontosan rendszerezted.';
  } else if (percentage >= 60) {
    return 'Kiváló kutatói eredmény! A főbb csoportokat és összefüggéseket magabiztosan átlátod.';
  } else if (percentage >= 35) {
    return 'Haladó eredmény! A fő csoportokat felismered, de érdemes átnézni a közös metszeteket (pl. heterotrófia, sejtfal).';
  } else {
    return 'Kezdő szint! A vizsgálat további kutatást igényel. Ismételd át a három élőlénycsoport jellemzőit a Kézikönyvben!';
  }
}
