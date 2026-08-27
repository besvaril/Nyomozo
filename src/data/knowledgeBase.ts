export interface KingdomProfile {
  id: 'animals' | 'plants' | 'fungi';
  name: string;
  latinName: string;
  iconName: string;
  badgeColor: string;
  tagline: string;
  cellular: {
    cellType: string;
    cellWall: string;
    plastids: string;
    vacuole: string;
    organelles: string;
  };
  metabolism: {
    nutritionType: string;
    energySource: string;
    reserveNutrient: string;
    respiration: string;
  };
  organization: {
    bodyPlan: string;
    tissues: string;
    organs: string;
    transportSystem: string;
  };
  specialFeatures: string[];
  examTips: string[];
}

export const KINGDOM_PROFILES: Record<'animals' | 'plants' | 'fungi', KingdomProfile> = {
  animals: {
    id: 'animals',
    name: 'Állatok',
    latinName: 'Animalia',
    iconName: 'Bug',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800',
    tagline: 'Aktív mozgásra képes, heterotróf, sejtfal nélküli szövetes élőlények',
    cellular: {
      cellType: 'Eukarióta (valódi sejtmagvas, sejtmaghártyával)',
      cellWall: 'NINCS sejtfal (csak sejthártya / glikokalix) -> alakváltoztató képesség',
      plastids: 'Nincsenek plasztiszok (színtestek)',
      vacuole: 'Kisméretű, ideiglenes emésztő/kiválasztó vakuólumok',
      organelles: 'Mitokondriumok, lizoszómák, centroszóma (sejtközpont)',
    },
    metabolism: {
      nutritionType: 'Heterotróf (holozoikus: szilárd táplálék bekebelezése és belső emésztése)',
      energySource: 'Kész szerves vegyületek kémiai energiája',
      reserveNutrient: 'Glikogén (májban és izomszövetben raktározódik)',
      respiration: 'Aerob biológiai oxidáció (sejtlégzés a mitokondriumban)',
    },
    organization: {
      bodyPlan: 'Döntően szövetes és szervrendszeres szerveződés',
      tissues: '4 alapszövet: Hámszövet, Kötő- és támasztószövet, Izomszövet, Idegszövet',
      organs: 'Kifejezett szervek és szervrendszerek (keringési, ideg-, emésztő- stb.)',
      transportSystem: 'Keringési rendszer (nyílt vagy zárt érrendszer, testfolyadék/vér)',
    },
    specialFeatures: [
      'Idegszövet és reflexműködés a környezeti ingerek gyors feldolgozására',
      'Izomszövet (aktin-miozin) az aktív hely- és helyzetváltoztatáshoz',
      'Holozoikus (emésztőcsatornás) táplálkozás',
    ],
    examTips: [
      'Állatok + Növények közös: Szövetes felépítés, szervek megléte.',
      'Állatok + Gombák közös: Heterotróf anyagcsere, glikogén tartaléktápanyag, plasztiszok hiánya.',
      'Állatok egyedi: Idegszövet, izomszövet, sejtfal teljes hiánya.',
    ],
  },
  plants: {
    id: 'plants',
    name: 'Virágos növények',
    latinName: 'Plantae (Spermatophyta)',
    iconName: 'Flower2',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800',
    tagline: 'Fotoszintetizáló, autotróf, cellulóz sejtfallal és szállítószövettel bíró hajtásos élőlények',
    cellular: {
      cellType: 'Eukarióta (valódi sejtmag, lineáris kromoszómák)',
      cellWall: 'Cellulóz alapú szilárd sejtfal (plazmodezmákkal)',
      plastids: 'Plasztiszok jelen vannak: Kloroplasztisz (fotoszintézis), Kromoplasztisz, Leukoplasztisz',
      vacuole: 'Nagy központi sejtnedvvel telt vakuólum (turgornyomás fenntartása)',
      organelles: 'Mitokondriumok (sejtlégzéshez), Kloroplasztiszok, Diktioszómák',
    },
    metabolism: {
      nutritionType: 'Autotróf (fotoautotróf: fotoszintézissel saját szerves anyagot állít elő)',
      energySource: 'Fényenergia (napfény) fotonjai',
      reserveNutrient: 'Keményítő (amiloplasztiszokban: pl. magvak, gumók)',
      respiration: 'Aerob biológiai oxidáció (éjjel-nappal mitokondriumokban!)',
    },
    organization: {
      bodyPlan: 'Hajtásos és szövetes szerveződés (gyökér, szár, levél, virág, termés)',
      tissues: 'Osztódó (kambium, merisztéma) és Állandósult (bőr-, szállító-, alapszövet)',
      organs: 'Vegetatív szervek (gyökér, szár, levél) és Szaporító szervek (virág, mag, termés)',
      transportSystem: 'Szállítószövet-rendszer: Fa- (xilém) és Háncsrész (floém)',
    },
    specialFeatures: [
      'Fotoszintézis: szervetlen CO2-ból és vízből oxigént és szőlőcukrot készít',
      'Szállítószövetek (tracheák, tracheidák és rostacsövek kísérősejtekkel)',
      'Virág, mint módosult szaporítóhajtás és magvas szaporodás',
    ],
    examTips: [
      'Gyakori csapda: A növények NEM csak fotoszintetizálnak, hanem légzést (biológiai oxidációt) is végeznek mitokondriumukkal!',
      'Növények + Gombák közös: Sejtfal jelenléte, szesszilis (helyhez kötött) életforma.',
      'Növények egyedi: Fotoszintézis, keményítő raktározás, szállítószövetek, kloroplasztiszok.',
    ],
  },
  fungi: {
    id: 'fungi',
    name: 'Gombák',
    latinName: 'Fungi',
    iconName: 'Sparkles',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800',
    tagline: 'Heterotróf, kitin sejtfallal rendelkező, fonalas-telepes felépítésű lebontók és szimbionták',
    cellular: {
      cellType: 'Eukarióta (gyakran többmagvú sejtek / dikariotikus hifák)',
      cellWall: 'Kitin tartalmú szilárd sejtfal (nem cellulóz!)',
      plastids: 'NINCSEN SZÍNTEST / plasztisz (sosem fotoszintetizálnak)',
      vacuole: 'Kifejezett vakuólumok a fonalakban',
      organelles: 'Mitokondriumok, endoplazmatikus retikulum, Golgi-készülék',
    },
    metabolism: {
      nutritionType: 'Heterotróf (ozmotróf: külső emésztés enzimekkel + oldott tápanyagok felszívása)',
      energySource: 'Elhalt vagy élő szerves anyagok lebontása (szaprofita, parazita, mikorrhiza)',
      reserveNutrient: 'Glikogén és lipidek (zsírcseppek)',
      respiration: 'Aerob oxidáció és/vagy anaerob erjedés (pl. élesztőgombák)',
    },
    organization: {
      bodyPlan: 'Telepes szerveződés: gombafonalak (hifák) és micélium (tenyésztest)',
      tissues: 'Nincsenek valódi szövetek; helyettük álszövet (plektenchima) képezi a termőtestet',
      organs: 'Nincsenek valódi szervek; differenciálódott részek: tönk, kalap, lemezek/csövek',
      transportSystem: 'Nincs szállítószövet; a tápanyagok a hifák közötti pórusokon áramlanak',
    },
    specialFeatures: [
      'Gombafonalas (hifás) mikroszkopikus hálózat a talajban és faanyagban',
      'Antibiotikumok termelése más mikrobák (baktériumok) távoltartására',
      'Külső (extracelluláris) emésztés és szervesanyag-újrahasznosítás az ökoszisztémában',
    ],
    examTips: [
      'Gombák régen a növényekhez voltak sorolva, de anyagcseréjükben (heterotrófia, glikogén) az állatokhoz állnak közelebb!',
      'Gomba egyedi: Kitin sejtfal, hifás-telepes felépítés, antibiotikum-képzés, micélium.',
    ],
  },
};

export const COMPARISON_TABLE_ROWS = [
  {
    criterion: 'Sejtfelépítés / Sejtmag',
    animals: 'Eukarióta (van sejtmag)',
    plants: 'Eukarióta (van sejtmag)',
    fungi: 'Eukarióta (van sejtmag)',
    isShared: true,
  },
  {
    criterion: 'Sejtfal megléte & anyaga',
    animals: 'NINCS sejtfal',
    plants: 'VAN (cellulóz)',
    fungi: 'VAN (kitin)',
    isShared: false,
  },
  {
    criterion: 'Anyagcsere / Táplálkozás',
    animals: 'Heterotróf (bekebelező)',
    plants: 'Autotróf (fotoszintetizáló)',
    fungi: 'Heterotróf (felszívó/ozmotróf)',
    isShared: false,
  },
  {
    criterion: 'Plasztiszok (színtestek)',
    animals: 'Nincsenek',
    plants: 'Vannak (kloroplasztisz stb.)',
    fungi: 'Nincsenek',
    isShared: false,
  },
  {
    criterion: 'Tartaléktápanyag',
    animals: 'Glikogén',
    plants: 'Keményítő',
    fungi: 'Glikogén',
    isShared: false,
  },
  {
    criterion: 'Szerveződési szint',
    animals: 'Valódi szövetes, szerves',
    plants: 'Valódi szövetes, szerves',
    fungi: 'Telepes (fonalas / hifás)',
    isShared: false,
  },
  {
    criterion: 'Anyagszállítás módja',
    animals: 'Keringési rendszer / testfolyadék',
    plants: 'Szállítószövet (xilém és floém)',
    fungi: 'Hifákban plazmaáramlás',
    isShared: false,
  },
  {
    criterion: 'Biológiai oxidáció (sejtlégzés)',
    animals: 'Képes rá (mitokondrium)',
    plants: 'Képes rá (mitokondrium)',
    fungi: 'Képes rá (mitokondrium)',
    isShared: true,
  },
  {
    criterion: 'Mozgás & Helyváltoztatás',
    animals: 'Aktív mozgás (izomszövet)',
    plants: 'Helyhez kötött (passzív/inger)',
    fungi: 'Helyhez kötött',
    isShared: false,
  },
];
