import { BiologicalClue, RegionInfo, VennRegionId } from '../types';

export const VENN_REGIONS: Record<VennRegionId, RegionInfo> = {
  only_animals: {
    id: 'only_animals',
    label: 'Csak Állatok',
    shortName: 'Állatok',
    kingdoms: ['animals'],
    color: '#2563eb', // Blue
    bgLight: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-900 dark:text-blue-200 border-blue-400',
    borderClass: 'border-blue-500',
    description: 'Kizárólag az állatok világára jellemző sajátságok (pl. idegszövet, aktív helyváltoztatás izomszövettel).',
  },
  only_plants: {
    id: 'only_plants',
    label: 'Csak Virágos növények',
    shortName: 'Növények',
    kingdoms: ['plants'],
    color: '#16a34a', // Green
    bgLight: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-400',
    borderClass: 'border-emerald-500',
    description: 'Kizárólag a virágos növényekre jellemző sajátosságok (pl. fotoszintézis, szállítószövetek: fa- és háncsrész, virág és termés).',
  },
  only_fungi: {
    id: 'only_fungi',
    label: 'Csak Gombák',
    shortName: 'Gombák',
    kingdoms: ['fungi'],
    color: '#d97706', // Amber/Orange
    bgLight: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-400',
    borderClass: 'border-amber-500',
    description: 'Kizárólag a gombák országára érvényes bélyegek (pl. hifákból álló gombafonalak, micélium, antibiotikum termelés).',
  },
  animals_plants: {
    id: 'animals_plants',
    label: 'Állatok ÉS Virágos növények',
    shortName: 'Állatok ∩ Növények',
    kingdoms: ['animals', 'plants'],
    color: '#0d9488', // Teal
    bgLight: 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-900 dark:text-teal-200 border-teal-400',
    borderClass: 'border-teal-500',
    description: 'Állatokban és virágos növényekben közös, de a gombákra NEM érvényes (pl. valódi szövetes és szerves szerveződés).',
  },
  animals_fungi: {
    id: 'animals_fungi',
    label: 'Állatok ÉS Gombák',
    shortName: 'Állatok ∩ Gombák',
    kingdoms: ['animals', 'fungi'],
    color: '#7c3aed', // Purple/Violet
    bgLight: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-900 dark:text-purple-200 border-purple-400',
    borderClass: 'border-purple-500',
    description: 'Állatokban és gombákban közös, de a virágos növényekre NEM igaz (pl. heterotróf táplálkozás, glikogén raktározás).',
  },
  plants_fungi: {
    id: 'plants_fungi',
    label: 'Virágos növények ÉS Gombák',
    shortName: 'Növények ∩ Gombák',
    kingdoms: ['plants', 'fungi'],
    color: '#ca8a04', // Yellow-green / Olive
    bgLight: 'bg-lime-500/10 hover:bg-lime-500/20 text-lime-900 dark:text-lime-200 border-lime-400',
    borderClass: 'border-lime-500',
    description: 'Növényekre és gombákra közös, de az állatokra NEM igaz (pl. sejtfal megléte, helyhez kötött életmód, lévő vakuólumok).',
  },
  all_three: {
    id: 'all_three',
    label: 'Mindhárom csoport (Metszet)',
    shortName: 'Közös mindháromban',
    kingdoms: ['animals', 'plants', 'fungi'],
    color: '#dc2626', // Crimson/Coral
    bgLight: 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-950 dark:text-rose-200 border-rose-400',
    borderClass: 'border-rose-500',
    description: 'Mindhárom élőlénycsoportra igaz alapvető eukarióta bélyegek (pl. sejtmag, biológiai oxidáció/sejtlégzés, mitokondrium).',
  },
};

// The exact 10 clues from the user's exam sheet
export const WORKSHEET_CLUES: BiologicalClue[] = [
  {
    id: 1,
    text: 'Heterotrófok.',
    correctRegion: 'animals_fungi',
    involvedKingdoms: ['animals', 'fungi'],
    difficulty: 'alap',
    category: 'Anyagcsere',
    explanation:
      'Az állatok és a gombák egyaránt heterotróf anyagcseréjűek, azaz kész szerves anyagokat vesznek fel környezetükből (az állatok bekebelezéssel/emésztéssel, a gombák felszívással). Ezzel szemben a virágos növények autotrófok (fotoszintetizálnak).',
    microscopeDetail: 'Szerves szénforrásra utaló biokémiai marker: Nincs autotróf szén-dioxid fixálás!',
  },
  {
    id: 2,
    text: 'Legtöbb fajuk szövetes szerveződésű.',
    correctRegion: 'animals_plants',
    involvedKingdoms: ['animals', 'plants'],
    difficulty: 'alap',
    category: 'Szövettan & Szerveződés',
    explanation:
      'A virágos növények és a legtöbb állat teste valódi szövetekből és szervekből épül fel. A gombák teste ezzel szemben telepes (fonalas / hifás / plektenchima) szerveződésű, valódi szöveteik nincsenek.',
    microscopeDetail: 'Szövettani preparátum: differenciálódott sejttársulások specifikus funkciókkal.',
  },
  {
    id: 3,
    text: 'Sejtfaluk van.',
    correctRegion: 'plants_fungi',
    involvedKingdoms: ['plants', 'fungi'],
    difficulty: 'alap',
    category: 'Sejttan',
    explanation:
      'A növényi sejteket cellulóztartalmú, a gombasejteket pedig kitintartalmú sejtfal veszi körül. Az állati sejteknek NINCS sejtfaluk (csak sejthártyájuk van), ami lehetővé teszi az alakváltoztatást és a rugalmas mozgást.',
    microscopeDetail: 'Szilárdító réteg a sejthártyán kívül: Növényeknél cellulóz, Gombáknál kitin.',
  },
  {
    id: 4,
    text: 'Fotoszintetizálnak.',
    correctRegion: 'only_plants',
    involvedKingdoms: ['plants'],
    difficulty: 'alap',
    category: 'Anyagcsere',
    explanation:
      'Kizárólag a növények rendelkeznek kloroplasztiszokkal (zöld színtestekkel), amelyek segítségével a napfény energiáját felhasználva szervetlen anyagokból (víz és CO2) szerves anyagot (cukrot) és oxigént állítanak elő. Az állatok és gombák nem tudnak fotoszintetizálni.',
    microscopeDetail: 'Klorofill pigment és zöld színtestek (kloroplasztiszok) jelenléte.',
  },
  {
    id: 5,
    text: 'Sok fajuk fonalakból álló telepeket alkot.',
    correctRegion: 'only_fungi',
    involvedKingdoms: ['fungi'],
    difficulty: 'alap',
    category: 'Szövettan & Szerveződés',
    explanation:
      'A gombák jellegzetes felépítése a gombafonalakból (hifákból) álló szövedék, a micélium (tenyésztest). Valódi szövetek helyett álszövetes (plektenchima) telepet hoznak létre (pl. a kalapos gombák termőtestje).',
    microscopeDetail: 'Hifa-hálózat és szövedék: Micélium és spóraképző szervek.',
  },
  {
    id: 6,
    text: 'Sejtjeikben van sejtmag.',
    correctRegion: 'all_three',
    involvedKingdoms: ['animals', 'plants', 'fungi'],
    difficulty: 'alap',
    category: 'Sejttan',
    explanation:
      'Mindhárom csoport az EUKARIÓTÁK (valódi sejtmagvasok) doménjébe tartozik! Sejtjeik örökítőanyagát (DNS) kettős maghártya határolja el a citoplazmától.',
    microscopeDetail: 'Eukarióta sejtstruktúra: Kettős membránnal körülvett sejtmag (nucleus) és sejtmagvacska.',
  },
  {
    id: 7,
    text: 'Képviselőik képesek biológiai oxidációra.',
    correctRegion: 'all_three',
    involvedKingdoms: ['animals', 'plants', 'fungi'],
    difficulty: 'alap',
    category: 'Anyagcsere',
    explanation:
      'Minden eukarióta csoportban (állatokban, növényekben és gombákban) jelen vannak a mitokondriumok, így képviselőik aerob körülmények között képesek a szerves anyagok oxigénnel történő lebontására és ATP termelésére (sejtlégzés / biológiai oxidáció).',
    microscopeDetail: 'Mitokondriális elektrontranszport lánc és ATP-szintetáz működése.',
  },
  {
    id: 8,
    text: 'Bizonyos csoportjai antibiotikumot termelnek.',
    correctRegion: 'only_fungi',
    involvedKingdoms: ['fungi'],
    difficulty: 'alap',
    category: 'Különleges Tulajdonság',
    explanation:
      'Számos gombafaj (pl. a Penicillium notatum ecsetpenész) olyan másodlagos anyagcseretermékeket állít elő, amelyek gátolják a baktériumok szaporodását. Alexander Fleming ezen gombákból fedezte fel a penicillint!',
    microscopeDetail: 'Baktericid és bakteriosztatikus mikotoxinok: pl. Penicillin, Cefalosporin szekréció.',
  },
  {
    id: 9,
    text: 'Idegszövettel rendelkezhetnek.',
    correctRegion: 'only_animals',
    involvedKingdoms: ['animals'],
    difficulty: 'alap',
    category: 'Szövettan & Szerveződés',
    explanation:
      'Az idegszövet és a neuronok ingerületvezető hálózata kizárólag az állatok világában alakult ki. Növényeknél és gombáknál nincsenek idegsejtek, sem ingerületvezető idegpályák.',
    microscopeDetail: 'Neuronok, dendritek, axonok és szinapszisok az ingerület gyors továbbítására.',
  },
  {
    id: 10,
    text: 'Anyagszállításukat szállítószövet végzi.',
    correctRegion: 'only_plants',
    involvedKingdoms: ['plants'],
    difficulty: 'alap',
    category: 'Szövettan & Szerveződés',
    explanation:
      'A virágos növényekben a víz és ásványi sók szállítását a fatest (xilém / vízszállító csövek), a szerves tápanyagok szállítását pedig a háncstest (floém / rostacsövek) végzi. Az állatoknál keringési rendszer/testfolyadék van (nem növényi szállítószövet), a gombáknál pedig a fonalakban áramlik a sejtplazma.',
    microscopeDetail: 'Xilém (vízszállító elemek: tracheák, tracheidák) és Floém (rostacsövek).',
  },
];

// Additional advanced clues for extended detective cases
export const EXTENDED_CLUES: BiologicalClue[] = [
  {
    id: 11,
    text: 'Tartaléktápanyaguk jellemzően a glikogén.',
    correctRegion: 'animals_fungi',
    involvedKingdoms: ['animals', 'fungi'],
    difficulty: 'halado',
    category: 'Anyagcsere',
    explanation:
      'Az állatokban (máj, izmok) és a gombákban a felesleges szőlőcukor glikogén formájában raktározódik. A növények tartaléktápanyaga ezzel szemben a keményítő.',
    microscopeDetail: 'Alfa-1,4 és alfa-1,6 glikozidos kötésű elágazó poliszacharid (glikogén).',
  },
  {
    id: 12,
    text: 'Sejtfaluk fő építőanyaga a kitin.',
    correctRegion: 'only_fungi',
    involvedKingdoms: ['fungi'],
    difficulty: 'halado',
    category: 'Sejttan',
    explanation:
      'A gombák sejtfalának alapváza a kitin (ugyanaz a nitrogéntartalmú poliszacharid, ami az ízeltlábúak vázát is alkotja). A növények sejtfala cellulózból áll, az állati sejteknek nincs sejtfala.',
    microscopeDetail: 'N-acetil-glükózamin polimer (kitin molekulaláncok).',
  },
  {
    id: 13,
    text: 'Tartaléktápanyaguk a keményítő.',
    correctRegion: 'only_plants',
    involvedKingdoms: ['plants'],
    difficulty: 'halado',
    category: 'Anyagcsere',
    explanation:
      'A virágos növények a fotoszintézis során termelt glükózt keményítő formájában (amilóz és amilopektin) raktározzák (pl. burgonyagumóban, magvakban).',
    microscopeDetail: 'Lugol-oldattal kék színreakciót adó amiloplasztiszok.',
  },
  {
    id: 14,
    text: 'Aktív helyváltoztató mozgásra képesek izomszövettel.',
    correctRegion: 'only_animals',
    involvedKingdoms: ['animals'],
    difficulty: 'halado',
    category: 'Életmód & Funkciók',
    explanation:
      'Az aktív, izomzattal vezérelt helyváltoztatás kizárólag az állatok sajátossága. A növények és a legtöbb gomba helyhez kötött (szesszilis) életmódot folytat.',
    microscopeDetail: 'Aktin és miozin filamentumok által működtetett harántcsíkolt vagy simaizomszövet.',
  },
  {
    id: 15,
    text: 'Képesek ivartalan és ivaros szaporodásra is.',
    correctRegion: 'all_three',
    involvedKingdoms: ['animals', 'plants', 'fungi'],
    difficulty: 'mester',
    category: 'Életmód & Funkciók',
    explanation:
      'Mindhárom csoportban megtalálható az ivaros (gaméták, meiózis, megtermékenyítés) és az ivartalan szaporodás (növényeknél vegetatív szervekkel/dugványozás; gombáknál spóraképzés/bimbózás; állatoknál pl. bimbózás szivacsoknál/csalánozóknál vagy parthenogenezis).',
    microscopeDetail: 'Meiotikus ivaros rekombináció és mitotikus ivartalan szaporítóképletek.',
  },
  {
    id: 16,
    text: 'Sejtjeikben nincsenek plasztiszok (színtestek).',
    correctRegion: 'animals_fungi',
    involvedKingdoms: ['animals', 'fungi'],
    difficulty: 'halado',
    category: 'Sejttan',
    explanation:
      'Az állati és gombasejtekben nincsenek plasztiszok (sem kloroplasztisz, sem kromoplasztisz, sem leukoplasztisz). Plasztiszokkal kizárólag a növények rendelkeznek.',
    microscopeDetail: 'Színtest-mentes citoplazma: heterotróf szervesanyag-hasznosítás.',
  },
  {
    id: 17,
    text: 'Magvakkal és virágokkal szaporodnak.',
    correctRegion: 'only_plants',
    involvedKingdoms: ['plants'],
    difficulty: 'alap',
    category: 'Szövettan & Szerveződés',
    explanation:
      'A virág a virágos növények (zárvatermők és nyitvatermők) szaporító hajtása, amely a megtermékenyítés után magot és (zárvatermőknél) termést fejleszt.',
    microscopeDetail: 'Ivarlevelek (porzók, termő) és embrionális magképződés.',
  },
  {
    id: 18,
    text: 'Riboszómáik végzik a fehérjeszintézist.',
    correctRegion: 'all_three',
    involvedKingdoms: ['animals', 'plants', 'fungi'],
    difficulty: 'alap',
    category: 'Sejttan',
    explanation:
      'Minden élő sejtben – az állatokban, növényekben és gombákban is – 80S típusú eukarióta riboszómák és endoplazmatikus retikulum fordítja le az mRNS genetikai kódját fehérjékké.',
    microscopeDetail: 'Transzlációs apparátus: RNS-fehérje komplexek a citoszolban.',
  },
];
