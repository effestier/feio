import type { SacredText, SacredVerse } from "./sacred-types";
import { ALL_EXTENDED_VERSES } from "./sacred-extended";
export { TRADITIONS } from "./sacred-types";

export const SACRED_TEXTS: SacredText[] = [
  {
    id: "bhagavad-gita",
    title: "Bhagavad Gita",
    titleHi: "भगवद्गीता",
    tradition: "hindu",
    traditionLabel: "Hinduism",
    description: "The Song of God — a 700-verse dialogue between Prince Arjuna and Lord Krishna on the battlefield of Kurukshetra, covering duty, devotion, knowledge, and liberation.",
    language: "Sanskrit",
    period: "~500 BCE – 200 BCE",
    totalChapters: 18,
    totalVerses: 700,
    icon: "🙏",
  },
  {
    id: "upanishads",
    title: "Principal Upanishads",
    titleHi: "उपनिषद्",
    tradition: "hindu",
    traditionLabel: "Hinduism",
    description: "The philosophical climax of the Vedas — dialogues exploring the nature of Brahman (ultimate reality), Atman (self), and the path to moksha (liberation).",
    language: "Sanskrit",
    period: "~800 BCE – 200 BCE",
    totalChapters: 13,
    totalVerses: 500,
    icon: "🙏",
  },
  {
    id: "rigveda",
    title: "Rigveda",
    titleHi: "ऋग्वेद",
    tradition: "hindu",
    traditionLabel: "Hinduism",
    description: "The oldest of the four Vedas — 1,028 hymns of praise to the cosmic forces, composed in archaic Vedic Sanskrit. The foundation of Hindu sacred literature.",
    language: "Vedic Sanskrit",
    period: "~1500 BCE – 1200 BCE",
    totalChapters: 10,
    totalVerses: 1028,
    icon: "🙏",
  },
  {
    id: "ramayana",
    title: "Ramayana",
    titleHi: "रामायण",
    tradition: "hindu",
    traditionLabel: "Hinduism",
    description: "Valmiki's epic of Lord Rama — the ideal king, husband, and dharmic being. 24,000 verses of adventure, devotion, and cosmic justice.",
    language: "Sanskrit",
    period: "~500 BCE – 100 BCE",
    totalChapters: 7,
    totalVerses: 24000,
    icon: "🙏",
  },
  {
    id: "dhammapada",
    title: "Dhammapada",
    titleHi: "धम्मपद",
    tradition: "buddhist",
    traditionLabel: "Buddhism",
    description: "Verses of the Buddha — 423 sayings on ethics, mind, and the path to Nirvana. The most beloved collection of Buddhist wisdom.",
    language: "Pali",
    period: "~3rd century BCE",
    totalChapters: 26,
    totalVerses: 423,
    icon: "☸️",
  },
  {
    id: "guru-granth-sahib",
    title: "Guru Granth Sahib",
    titleHi: "गुरु ग्रन्थ साहिब",
    tradition: "sikh",
    traditionLabel: "Sikhism",
    description: "The eternal Guru of the Sikhs — 1,430 pages of devotional poetry by six Sikh Gurus and fifteen Hindu and Muslim saints. A monument to spiritual unity.",
    language: "Punjabi (Gurmukhi)",
    period: "1469 – 1708 CE",
    totalChapters: 31,
    totalVerses: 5894,
    icon: "🙏",
  },
  {
    id: "bible",
    title: "Holy Bible (KJV)",
    titleHi: "बाइबिल",
    tradition: "christian",
    traditionLabel: "Christianity",
    description: "The King James Version — the foundational text of Christianity, containing the Old and New Testaments. A masterpiece of English prose and spiritual revelation.",
    language: "English (from Hebrew/Greek)",
    period: "~1611 CE (translation)",
    totalChapters: 1189,
    totalVerses: 31102,
    icon: "✝️",
  },
  {
    id: "quran",
    title: "Holy Quran",
    titleHi: "क़ुरआन",
    tradition: "islamic",
    traditionLabel: "Islam",
    description: "The literal word of Allah, revealed to Prophet Muhammad ﷺ over 23 years. 114 surahs of guidance, law, and spiritual illumination.",
    language: "Arabic",
    period: "610 – 632 CE",
    totalChapters: 114,
    totalVerses: 6236,
    icon: "☪️",
  },
  {
    id: "torah",
    title: "Torah",
    titleHi: "תּוֹרָה",
    tradition: "jewish",
    traditionLabel: "Judaism",
    description: "The Five Books of Moses — the foundational text of Judaism. Genesis through Deuteronomy: creation, covenant, law, and the journey to the Promised Land.",
    language: "Hebrew",
    period: "~1200 BCE (traditional)",
    totalChapters: 187,
    totalVerses: 5852,
    icon: "✡️",
  },
  {
    id: "tao-te-ching",
    title: "Tao Te Ching",
    titleHi: "道德经",
    tradition: "taoist",
    traditionLabel: "Taoism",
    description: "The Classic of the Way and Virtue — Laozi's 81 chapters on the Tao, the nameless source of all. The foundational text of Taoist philosophy.",
    language: "Chinese",
    period: "~6th – 4th century BCE",
    totalChapters: 81,
    totalVerses: 81,
    icon: "☯️",
  },
  {
    id: "yasna",
    title: "Avesta (Yasna)",
    titleHi: "अवेस्ता",
    tradition: "zoroastrian",
    traditionLabel: "Zoroastrianism",
    description: "The sacred scripture of Zoroastrianism — hymns of the Gathas attributed to Zarathustra, plus liturgical texts. The oldest revealed religion's primary text.",
    language: "Avestan",
    period: "~1500 – 500 BCE",
    totalChapters: 72,
    totalVerses: 1000,
    icon: "🔥",
  },
  {
    id: "agamas",
    title: "Jain Agamas",
    titleHi: "आगम",
    tradition: "jain",
    traditionLabel: "Jainism",
    description: "The canonical scriptures of Jainism — the teachings of Mahavira as transmitted by his disciples. Covering ethics, cosmology, and the path to kevala jnana.",
    language: "Ardhamagadhi Prakrit",
    period: "~6th – 3rd century BCE",
    totalChapters: 45,
    totalVerses: 10000,
    icon: "🙏",
  },
];

// Bhagavad Gita — Chapter 1, Verses 1-10 (real content)
export const GITA_CHAPTER_1: SacredVerse[] = [
  {
    chapter: 1,
    verse: 1,
    sanskrit: "धृतराष्ट्र उवाच | धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः | मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||1||",
    transliteration: "dhṛtarāṣṭra uvāca | dharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ | māmakāḥ pāṇḍavāś caiva kim akurvata sañjaya ||1||",
    english: "Dhritarashtra said: O Sanjaya, what did my sons and the sons of Pandu do, assembled together on the holy field of Kurukshetra, eager for battle?",
    commentary: "The Mahabharata opens with the blind king Dhritarashtra asking his charioteer Sanjaya to describe the battle. The field of Kurukshetra is called 'dharmakshetra' — the field of dharma — because it is where righteousness would ultimately prevail.",
    source: "bhagavad-gita",
  },
  {
    chapter: 1,
    verse: 2,
    sanskrit: "सञ्जय उवाच | दृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा | आचार्यमुपसंगम्य राजा वचनमब्रवीत् ||2||",
    transliteration: "sañjaya uvāca | dṛṣṭvā tu pāṇḍavānīkaṁ vyūḍhaṁ duryodhanas tadā | ācāryam upasaṅgamya rājā vacanam abravīt ||2||",
    english: "Sanjaya said: Having seen the army of the Pandavas arrayed in battle formation, King Duryodhana approached his teacher (Drona) and spoke these words.",
    commentary: "Duryodhana, the eldest of the Kauravas, sees the Pandava army and immediately feels anxiety. He approaches Dronacharya not out of respect, but to subtly blame him for the strength of the opposing forces.",
    source: "bhagavad-gita",
  },
  {
    chapter: 1,
    verse: 3,
    sanskrit: "पश्यैतां पाण्डुपुत्राणामाचार्य महतीं चमूम् | व्यूढां द्रुपदपुत्रेण तव शिष्येण धीमता ||3||",
    transliteration: "paśyaitāṁ pāṇḍu-putrāṇām ācārya mahatīṁ camūm | vyūḍhāṁ drupada-putreṇa tava śiṣyeṇa dhīmatā ||3||",
    english: "Behold, O Teacher, this mighty army of the sons of Pandu, arrayed by the son of Drupada (Dhrishtadyumna), your intelligent disciple.",
    commentary: "Duryodhana points out that Drona's own student, Dhrishtadyumna, leads the Pandava army — a subtle accusation that Drona's teaching has armed the enemy.",
    source: "bhagavad-gita",
  },
  {
    chapter: 1,
    verse: 4,
    sanskrit: "अत्र शूरा महेष्वासा भीमार्जुनसमा युधि | युयुधानो विराटश्च द्रुपदश्च महारथः ||4||",
    transliteration: "atra śūrā maheṣvāsā bhīmārjuna-samā yudhi | yuyudhāno virāṭaś ca drupadaś ca mahārathaḥ ||4||",
    english: "Here are heroes, mighty archers, equal in battle to Bhima and Arjuna: Yuyudhana, Virata, and Drupada, the great chariot warrior.",
    commentary: "Despite his anxiety, Duryodhana acknowledges the strength of the Pandava warriors — a grudging recognition of dharma's defenders.",
    source: "bhagavad-gita",
  },
  {
    chapter: 1,
    verse: 5,
    sanskrit: "धृष्टकेतुश्चेकितानः काशिराजश्च वीर्यवान् | पुज्यश्च शैभ्यश्च युधामन्युश्च विक्रान्तः ||5||",
    transliteration: "dhṛṣṭaketuś cekitānaḥ kāśirājaś ca vīryavān | pujaś ca śaibhyaś ca yudhāmanyuś ca vikrāntaḥ ||5||",
    english: "Dhrishtaketu, Cekitana, and the valiant king of Kasi, Purujit, Kuntibhoja, and the heroic Shaibya.",
    commentary: "The enumeration of warriors continues, showing the vast coalition assembled on the side of dharma.",
    source: "bhagavad-gita",
  },
  {
    chapter: 1,
    verse: 6,
    sanskrit: "युधामन्युश्च विक्रान्त उत्तमौजाश्च वीर्यवान् | सौभद्रो द्रौपदेयाश्च सर्व एव महारथाः ||6||",
    transliteration: "yudhāmanyuś ca vikrānta uttamaujāś ca vīryavān | saubhadro draupadeyāś ca sarva eva mahārathāḥ ||6||",
    english: "The strong Yudhamanyu, the brave Uttamauja, the son of Subhadra (Abhimanyu), and the sons of Draupadi — all of them great chariot warriors.",
    commentary: "Abhimanyu, son of Arjuna and Subhadra, and the five sons of Draupadi represent the next generation of dharmic warriors.",
    source: "bhagavad-gita",
  },
  {
    chapter: 1,
    verse: 7,
    sanskrit: "अस्माकं तु विशिष्टा ये तान्निबोध द्विजोत्तम | नायका मम सैन्यस्य संज्ञार्थं तान्ब्रवीमि ते ||7||",
    transliteration: "asmākaṁ tu viśiṣṭā ye tān nibodha dvijottama | nāyakā mama sainyasya saṁjñārthāṁ tān bravīmi te ||7||",
    english: "But know also the principal warriors on our side, O best of the Brahmanas. I shall tell you the leaders of my army for your information.",
    commentary: "Duryodhana shifts from praising the enemy to listing his own commanders — a classic display of ego and competitive spirit.",
    source: "bhagavad-gita",
  },
  {
    chapter: 1,
    verse: 8,
    sanskrit: "भवान्भीष्मश्च कर्णश्च कृपश्च समितिञ्जयः | अश्वत्थामा विकर्णश्च सौमदत्तिस्तथैव च ||8||",
    transliteration: "bhavān bhīṣmaś ca karṇaś ca kṛpaś ca samitiñjayaḥ | aśvatthāmā vikarṇaś ca saumadattis tathaiva ca ||8||",
    english: "Yourself (Drona), Bhishma, Karna, Kripa who is ever victorious in battle, Ashvatthama, Vikarna, and the son of Somadatta (Bhurishrava).",
    commentary: "The great warriors on the Kaurava side — Bhishma the grandsire, Karna the rival of Arjuna, Drona the teacher, and Ashvatthama the brahmin warrior.",
    source: "bhagavad-gita",
  },
  {
    chapter: 1,
    verse: 9,
    sanskrit: "अन्ये च बहवः शूरा मदर्थे त्यक्तजीविताः | नानाशस्त्रप्रहरणाः सर्वे युद्धविशारदाः ||9||",
    transliteration: "anye ca bahavaḥ śūrā mad-arthe tyakta-jīvitāḥ | nānā-śastra-praharaṇāḥ sarve yuddha-viśāradāḥ ||9||",
    english: "And many other heroes, all skilled in warfare, armed with various weapons, have given up their lives for my sake.",
    commentary: "Duryodhana boasts of the loyalty of his warriors — yet his attachment to 'my sake' reveals the ego that is the root of adharma.",
    source: "bhagavad-gita",
  },
  {
    chapter: 1,
    verse: 10,
    sanskrit: "अपर्याप्तं तदस्माकं बलं भीष्माभिरक्षितम् | पर्याप्तं त्विदमेतेषां बलं भीमाभिरक्षितम् ||10||",
    transliteration: "aparyāptaṁ tad asmākaṁ balaṁ bhīṣmābhirakṣitam | paryāptaṁ tv idam eteṣāṁ balaṁ bhīmābhirakṣitam ||10||",
    english: "Our army, protected by Bhishma, is unlimited; but their army, protected by Bhima, is limited. (Or: Our army is insufficient though protected by Bhishma, while their army, protected by Bhima, is sufficient.)",
    commentary: "This verse has dual interpretation — Duryodhana either boasts of his army's strength or reveals his anxiety. The ambiguity is deliberate: the Mahabharata shows how ego and insecurity are two sides of the same coin.",
    source: "bhagavad-gita",
  },
];

// Bhagavad Gita — Chapter 2, Key Verses (the philosophical core)
export const GITA_CHAPTER_2_KEY: SacredVerse[] = [
  {
    chapter: 2,
    verse: 11,
    sanskrit: "श्रीभगवानुवाच | अशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे | गतासूनगतासूंश्च नानुशोचन्ति पण्डिताः ||11||",
    transliteration: "śrī-bhagavān uvāca | aśocyān anvaśocas tvaṁ prajñā-vādāṁś ca bhāṣase | gatāsūn agatāsūṁś ca nānuśocanti paṇḍitāḥ ||11||",
    english: "The Blessed Lord said: You grieve for those who should not be grieved for, yet you speak words of wisdom. The wise grieve neither for the living nor for the dead.",
    commentary: "Krishna's first teaching: true wisdom is not book-learning but understanding the eternal nature of the Self. The Atman neither lives nor dies.",
    source: "bhagavad-gita",
  },
  {
    chapter: 2,
    verse: 22,
    sanskrit: "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि | तथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही ||22||",
    transliteration: "vāsāṁsi jīrṇāni yathā vihāya navāni gṛhṇāti naro 'parāṇi | tathā śarīrāṇi vihāya jīrṇāny anyāni saṁyāti navāni dehī ||22||",
    english: "As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones.",
    commentary: "One of the most famous verses in the Gita — death is merely a change of clothes for the eternal Self.",
    source: "bhagavad-gita",
  },
  {
    chapter: 2,
    verse: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन | मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||47||",
    transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi ||47||",
    english: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of action. Never consider yourself the cause of the results, and never be attached to inaction.",
    commentary: "The most quoted verse of the Gita — Karma Yoga in a single line. Act with full effort, surrender the results to the Divine.",
    source: "bhagavad-gita",
  },
  {
    chapter: 2,
    verse: 48,
    sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय | सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ||48||",
    transliteration: "yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya | siddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate ||48||",
    english: "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called Yoga.",
    commentary: "Yoga is not merely physical postures — it is the balanced mind that acts without attachment to outcomes.",
    source: "bhagavad-gita",
  },
  {
    chapter: 2,
    verse: 50,
    sanskrit: "बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते | तस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम् ||50||",
    transliteration: "buddhi-yukto jahātīha ubhe sukṛta-duṣkṛte | tasmād yogāya yujyasva yogaḥ karmasu kauśalam ||50||",
    english: "A person engaged in devotional service rids himself of both good and bad reactions in this life. Therefore strive for Yoga, which is the art of all work.",
    commentary: "Yoga is skill in action — the art of performing every action as an offering to the Divine.",
    source: "bhagavad-gita",
  },
];

// Dhammapada — Key Verses
export const DHAMMAPADA_KEY: SacredVerse[] = [
  {
    chapter: 1,
    verse: 1,
    sanskrit: "",
    transliteration: "manopubbaṅgamā dhammā, manoseṭṭhā manomayā",
    english: "All that we are is the result of what we have thought. The mind is everything. What we think, we become.",
    commentary: "The opening verse of the Dhammapada establishes the primacy of mind in Buddhist philosophy. All experience begins with thought.",
    source: "dhammapada",
  },
  {
    chapter: 1,
    verse: 2,
    sanskrit: "",
    transliteration: "manasā ce duṭṭhena bhāsati vā karoti vā",
    english: "If one speaks or acts with a corrupt mind, suffering follows, as the wheel follows the hoof of the ox.",
    commentary: "The law of karma expressed through agricultural metaphor — suffering is as natural and inevitable as the wheel following the ox.",
    source: "dhammapada",
  },
  {
    chapter: 1,
    verse: 3,
    sanskrit: "",
    transliteration: "manasā ce pasannena bhāsati vā karoti vā",
    english: "If one speaks or acts with a serene mind, happiness follows, as a shadow that never departs.",
    commentary: "The mirror of verse 2 — purity of mind creates happiness that is as constant as one's own shadow.",
    source: "dhammapada",
  },
  {
    chapter: 3,
    verse: 43,
    sanskrit: "",
    transliteration: "na taṃ mātā pitā kayirā, aññe vāpi ñātakā",
    english: "Not a mother, nor a father, nor any other relative can do more for one than a well-directed mind.",
    commentary: "Self-mastery is the highest gift — no external help compares to the power of one's own trained mind.",
    source: "dhammapada",
  },
  {
    chapter: 8,
    verse: 100,
    sanskrit: "",
    transliteration: "sahassamapi ce vācā, anatthapadasaṃhitā",
    english: "Better than a thousand hollow words is one word that brings peace.",
    commentary: "Quality over quantity — a single word of wisdom outweighs volumes of empty speech.",
    source: "dhammapada",
  },
];

// Tao Te Ching — Key Verses (Chapter 1, 8, 25, 33, 81)
export const TAO_TE_CHING_KEY: SacredVerse[] = [
  {
    chapter: 1,
    verse: 1,
    sanskrit: "",
    transliteration: "道可道，非常道。名可名，非常名。",
    english: "The Tao that can be told is not the eternal Tao. The name that can be named is not the eternal name.",
    commentary: "The opening line of the Tao Te Ching establishes the fundamental paradox: ultimate reality transcends language and concept.",
    source: "tao-te-ching",
  },
  {
    chapter: 8,
    verse: 8,
    sanskrit: "",
    transliteration: "上善若水。水善利万物而不争。",
    english: "The highest good is like water. Water gives life to all things and does not compete.",
    commentary: "Water is the Tao's metaphor for the sage — it nourishes all, seeks the lowest place, and yet overcomes the hardest stone.",
    source: "tao-te-ching",
  },
  {
    chapter: 25,
    verse: 25,
    sanskrit: "",
    transliteration: "有物混成，先天地生。",
    english: "Something formless yet complete, born before heaven and earth. Silent and still, it stands alone and does not change.",
    commentary: "A description of the Tao itself — before creation, before naming, the source from which all things emerge.",
    source: "tao-te-ching",
  },
  {
    chapter: 33,
    verse: 33,
    sanskrit: "",
    transliteration: "知人者智，自知者明。",
    english: "Knowing others is intelligence; knowing yourself is true wisdom. Mastering others is strength; mastering yourself is true power.",
    commentary: "Self-knowledge surpasses all external knowledge. The sage's power comes from within, not from dominion over others.",
    source: "tao-te-ching",
  },
  {
    chapter: 81,
    verse: 81,
    sanskrit: "",
    transliteration: "信言不美，美言不信。善者不辩，辩者不善。",
    english: "True words are not beautiful; beautiful words are not true. The good do not argue; those who argue are not good.",
    commentary: "The final chapter — simplicity, truth, and non-contention as the essence of the Tao.",
    source: "tao-te-ching",
  },
];

// Bible — Key Verses
export const BIBLE_KEY: SacredVerse[] = [
  {
    chapter: 1,
    verse: 1,
    sanskrit: "",
    transliteration: "In the beginning God created the heaven and the earth.",
    english: "In the beginning God created the heaven and the earth.",
    commentary: "The opening declaration of Genesis — the foundational statement of creation that has shaped Western civilization.",
    source: "bible",
  },
  {
    chapter: 23,
    verse: 1,
    sanskrit: "",
    transliteration: "The LORD is my shepherd; I shall not want.",
    english: "The LORD is my shepherd; I shall not want.",
    commentary: "Psalm 23 — perhaps the most beloved passage in all of scripture. A declaration of absolute trust in divine providence.",
    source: "bible",
  },
  {
    chapter: 3,
    verse: 16,
    sanskrit: "",
    transliteration: "For God so loved the world, that he gave his only begotten Son.",
    english: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    commentary: "John 3:16 — the heart of Christian theology. God's love expressed through sacrifice.",
    source: "bible",
  },
];

// Quran — Key Verses
export const QURAN_KEY: SacredVerse[] = [
  {
    chapter: 1,
    verse: 1,
    sanskrit: "",
    transliteration: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    english: "In the name of Allah, the Most Gracious, the Most Merciful.",
    commentary: "The Bismillah — the opening of the Quran and the beginning of every chapter except one. It establishes Allah's primary attributes: mercy and compassion.",
    source: "quran",
  },
  {
    chapter: 1,
    verse: 2,
    sanskrit: "",
    transliteration: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    english: "All praise is due to Allah, Lord of all the worlds.",
    commentary: "Al-Fatiha, verse 2 — the most recited verse in the world, repeated in every unit of Muslim prayer. God as Rabb — sustainer, nurturer, and lord of all creation.",
    source: "quran",
  },
  {
    chapter: 2,
    verse: 255,
    sanskrit: "",
    transliteration: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    english: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.",
    commentary: "Ayat al-Kursi (The Throne Verse) — considered the greatest verse in the Quran. A comprehensive declaration of God's sovereignty, knowledge, and power.",
    source: "quran",
  },
];

// Guru Granth Sahib — Key Verses
export const GURU_GRANTH_KEY: SacredVerse[] = [
  {
    chapter: 1,
    verse: 1,
    sanskrit: "",
    transliteration: "ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ",
    english: "One Universal Creator God. The Name Is Truth. Creative Being Personified. No Fear. No Hatred.",
    commentary: "The Mool Mantar — the foundational verse of Sikh philosophy. It defines God as one, true, creative, fearless, and without enmity.",
    source: "guru-granth-sahib",
  },
  {
    chapter: 1,
    verse: 2,
    sanskrit: "",
    transliteration: "ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ",
    english: "Timeless Form. Beyond Birth. Self-Existent. By Guru's Grace.",
    commentary: "The continuation of the Mool Mantar — God is beyond time, beyond incarnation, self-existent, and realized through the Guru's grace.",
    source: "guru-granth-sahib",
  },
];

// Map text IDs to their key verses
export const KEY_VERSES: Record<string, SacredVerse[]> = {
  "bhagavad-gita": [...GITA_CHAPTER_1, ...GITA_CHAPTER_2_KEY],
  "dhammapada": DHAMMAPADA_KEY,
  "tao-te-ching": TAO_TE_CHING_KEY,
  "bible": BIBLE_KEY,
  "quran": QURAN_KEY,
  "guru-granth-sahib": GURU_GRANTH_KEY,
};

// Merge extended verses into KEY_VERSES
for (const [id, verses] of Object.entries(ALL_EXTENDED_VERSES)) {
  if (KEY_VERSES[id]) {
    KEY_VERSES[id] = [...KEY_VERSES[id], ...verses];
  } else {
    KEY_VERSES[id] = verses;
  }
}

export function getSacredText(id: string): SacredText | undefined {
  return SACRED_TEXTS.find((t) => t.id === id);
}

export function getTextVerses(textId: string): SacredVerse[] {
  return KEY_VERSES[textId] || [];
}

export function getDailyVerse(): { verse: SacredVerse; text: SacredText } {
  const allVerses: { verse: SacredVerse; text: SacredText }[] = [];
  for (const text of SACRED_TEXTS) {
    const verses = KEY_VERSES[text.id];
    if (verses) {
      for (const verse of verses) {
        allVerses.push({ verse, text });
      }
    }
  }
  // Deterministic daily selection based on date
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return allVerses[dayOfYear % allVerses.length];
}

export function searchVerses(query: string): { verse: SacredVerse; text: SacredText }[] {
  const q = query.toLowerCase();
  const results: { verse: SacredVerse; text: SacredText }[] = [];
  for (const text of SACRED_TEXTS) {
    const verses = KEY_VERSES[text.id];
    if (verses) {
      for (const verse of verses) {
        if (
          verse.english.toLowerCase().includes(q) ||
          verse.transliteration.toLowerCase().includes(q) ||
          verse.commentary?.toLowerCase().includes(q)
        ) {
          results.push({ verse, text });
        }
      }
    }
  }
  return results;
}
