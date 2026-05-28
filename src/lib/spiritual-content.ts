export interface SpiritualTeaching {
  id: string;
  title: string;
  titleHi: string;
  tradition: string;
  traditionEmoji: string;
  icon: string;
  source: string;
  summary: string;
  content: string;
  keyPoints: string[];
  practicalExercises: string[];
  relatedTexts: string[];
  relatedConcepts: string[];
}

export interface HeritageSite {
  id: string;
  name: string;
  nameLocal: string;
  location: string;
  country: string;
  tradition: string;
  traditionEmoji: string;
  description: string;
  significance: string;
  history: string;
  unesco: boolean;
  coordinates?: string;
  yearBuilt?: string;
}

export const SPIRITUAL_TEACHINGS: SpiritualTeaching[] = [
  {
    id: "eight-limbs-of-yoga",
    title: "The Eight Limbs of Yoga",
    titleHi: "अष्टाङ्ग योग",
    tradition: "Hinduism",
    traditionEmoji: "🙏",
    icon: "🧘",
    source: "Yoga Sutras of Patanjali (~400 CE)",
    summary: "Patanjali's systematic path to self-realization through eight progressive stages — from ethical conduct to cosmic absorption.",
    content: `The Yoga Sutras of Patanjali, composed around 400 CE, present the most systematic framework for spiritual practice in Hindu philosophy. The Ashtanga (eight-limbed) path is not a linear sequence but an integrated system where each limb supports all others.

## The Eight Limbs

**Yama** (restraints) and **Niyama** (observances) form the ethical foundation. Without them, physical practice becomes mere exercise. **Asana** (posture) prepares the body for stillness. **Pranayama** (breath control) bridges body and mind. **Pratyahara** (sense withdrawal) turns attention inward. **Dharana** (concentration) focuses the mind. **Dhyana** (meditation) sustains that focus. **Samadhi** (absorption) dissolves the boundary between self and object of meditation.

The genius of Patanjali's system is its comprehensiveness — it addresses body, breath, mind, and spirit as an integrated whole. Modern yoga, focused primarily on asana, captures only one-eighth of the original teaching.`,
    keyPoints: [
      "Yama: Non-violence, truthfulness, non-stealing, celibacy, non-possessiveness",
      "Niyama: Purity, contentment, discipline, self-study, surrender to God",
      "Asana: Steady, comfortable posture for meditation",
      "Pranayama: Regulation of breath to calm the mind",
      "Pratyahara: Withdrawal of senses from external objects",
      "Dharana: Single-pointed concentration",
      "Dhyana: Uninterrupted flow of awareness",
      "Samadhi: Complete absorption — the meditator, meditation, and object become one",
    ],
    practicalExercises: [
      "Begin each day with 5 minutes of ethical self-reflection (Yama/Niyama)",
      "Practice a comfortable seated posture for 10 minutes daily (Asana)",
      "Observe your natural breath without changing it for 5 minutes (Pranama)",
      "Choose one sense and practice withdrawing attention from it (Pratyahara)",
      "Focus on a single object — candle flame, mantra, or breath — for 5 minutes (Dharana)",
    ],
    relatedTexts: ["Yoga Sutras of Patanjali", "Hatha Yoga Pradipika", "Bhagavad Gita"],
    relatedConcepts: ["yoga", "atman", "moksha"],
  },
  {
    id: "five-pillars-of-islam",
    title: "The Five Pillars of Islam",
    titleHi: "अर्कान अल-इस्लाम",
    tradition: "Islam",
    traditionEmoji: "☪️",
    icon: "🕌",
    source: "Quran and Hadith",
    summary: "The five foundational acts of worship that define Muslim life — declaration of faith, prayer, charity, fasting, and pilgrimage.",
    content: `The Five Pillars (Arkan al-Islam) are the framework of Muslim life. They are not optional practices but the minimum obligations that define a Muslim's relationship with God and community.

## The Five Pillars

**Shahada** (declaration of faith): 'There is no god but Allah, and Muhammad is His messenger.' This is not merely a statement but a commitment that shapes every aspect of life.

**Salah** (prayer): Five daily prayers at fixed times, facing Mecca. Each prayer is a direct conversation with God — a spiritual ascension (mi'raj) available to every believer.

**Zakat** (charity): 2.5% of wealth given annually to the poor. Not charity but purification — recognizing that all wealth ultimately belongs to God.

**Sawm** (fasting): During Ramadan, Muslims fast from dawn to sunset. Not mere hunger but a training of the soul — developing empathy, discipline, and gratitude.

**Hajj** (pilgrimage): Once in a lifetime, every able Muslim must visit Mecca. The ultimate expression of unity — all pilgrims wear simple white garments, erasing all distinctions of wealth, race, and status.`,
    keyPoints: [
      "Shahada: The declaration that anchors all other practices",
      "Salah: Five daily prayers as spiritual discipline",
      "Zakat: Economic justice through mandatory sharing",
      "Sawm: Self-discipline through fasting",
      "Hajj: Universal equality before God",
    ],
    practicalExercises: [
      "Practice mindful prayer — focus entirely on the words and their meaning",
      "Give regularly to those in need, even in small amounts",
      "Fast one day a week outside Ramadan to maintain the spiritual discipline",
      "Read the Quran daily, even if only a few verses",
      "Practice gratitude — name three blessings from God each morning",
    ],
    relatedTexts: ["Quran", "Hadith collections", "Fiqh manuals"],
    relatedConcepts: ["tawhid", "salah", "khilafah"],
  },
  {
    id: "noble-eightfold-path",
    title: "The Noble Eightfold Path",
    titleHi: "अरियो अट्ठङ्गिको मग्गो",
    tradition: "Buddhism",
    traditionEmoji: "☸️",
    icon: "☸️",
    source: "Sutta Pitaka (~3rd century BCE)",
    summary: "The Buddha's complete path to the cessation of suffering — wisdom, ethics, and meditation practiced simultaneously.",
    content: `The Noble Eightfold Path is the Fourth of the Four Noble Truths — the practical method for ending suffering. It is not a sequence of steps but eight interconnected factors that must be cultivated together.

## The Three Trainings

**Wisdom (Prajna):** Right View — understanding the nature of reality (impermanence, suffering, non-self). Right Intention — renunciation, goodwill, and harmlessness.

**Ethics (Sila):** Right Speech — no lying, divisive speech, harsh speech, or idle chatter. Right Action — no killing, stealing, or sexual misconduct. Right Livelihood — earning a living without causing harm.

**Meditation (Samadhi):** Right Effort — preventing unwholesome states, cultivating wholesome ones. Right Mindfulness — clear awareness of body, feelings, mind, and phenomena. Right Concentration — deep, focused, unified awareness.

The Buddha compared the Eightfold Path to a lute — the strings must be neither too tight nor too loose. Similarly, each factor must be balanced with the others for the path to be effective.`,
    keyPoints: [
      "Right View: Understanding the Four Noble Truths",
      "Right Intention: Cultivating renunciation, goodwill, harmlessness",
      "Right Speech: Truthful, harmonious, gentle, meaningful communication",
      "Right Action: Ethical conduct in all dealings",
      "Right Livelihood: Earning without causing suffering",
      "Right Effort: Balanced energy in practice",
      "Right Mindfulness: Present-moment awareness",
      "Right Concentration: Deep meditative absorption",
    ],
    practicalExercises: [
      "Practice mindful speech — pause before speaking, ask: Is it true? Kind? Necessary?",
      "Observe your breath for 10 minutes daily (Right Mindfulness)",
      "Before sleep, review your day — where did you cause harm? Where did you help?",
      "Practice metta (loving-kindness) meditation — wish well for yourself, loved ones, neutral people, difficult people, all beings",
      "Examine your livelihood — does your work cause unnecessary suffering?",
    ],
    relatedTexts: ["Dhammapada", "Sutta Pitaka", "Visuddhimagga"],
    relatedConcepts: ["four-noble-truths", "nirvana", "dependent-origination"],
  },
  {
    id: "contemplative-prayer",
    title: "Contemplative Prayer",
    titleHi: "चिंतन प्रार्थना",
    tradition: "Christianity",
    traditionEmoji: "✝️",
    icon: "🙏",
    source: "Desert Fathers and Mothers (3rd-5th century CE)",
    summary: "The Christian tradition of silent, wordless prayer — resting in God's presence beyond thought and language.",
    content: `Contemplative prayer (also called Christian meditation or the prayer of silence) is the oldest form of Christian prayer, practiced by the Desert Fathers and Mothers of the 3rd-5th centuries. It is not thinking about God but being with God.

## The Practice

The anonymous author of 'The Cloud of Unknowing' (14th century) taught that God cannot be reached through thought but only through love. A 'cloud of unknowing' separates us from God — we must let go of all concepts and rest in naked faith.

Thomas Merton, the 20th century Trappist monk, wrote: 'Contemplation is the highest expression of man's intellectual and spiritual life.' It is not escape from reality but the deepest engagement with reality.

The practice is simple: Sit in silence. Choose a sacred word (like 'God', 'Jesus', 'Love', 'Peace'). When thoughts arise, gently return to the word. Not as a mantra but as a symbol of your intention to be open to God's presence.

This tradition connects Christianity to the universal contemplative traditions found in all religions — the recognition that the deepest encounter with the Divine transcends words and concepts.`,
    keyPoints: [
      "Silence is not absence but the fullest presence of God",
      "Let go of words, images, and concepts — rest in unknowing",
      "The sacred word is not a technique but a gesture of openness",
      "Thoughts are not failures — gently return to silence each time",
      "Regular practice transforms consciousness over time",
    ],
    practicalExercises: [
      "Sit in silence for 20 minutes, twice daily",
      "Choose a sacred word that expresses your intention toward God",
      "When thoughts arise, gently return to your sacred word",
      "Practice Centering Prayer in a group if possible",
      "Read the mystics: Teresa of Avila, John of the Cross, Meister Eckhart",
    ],
    relatedTexts: ["The Cloud of Unknowing", "Interior Castle (Teresa of Avila)", "New Seeds of Contemplation (Merton)"],
    relatedConcepts: ["agape", "grace"],
  },
  {
    id: "tefillin-and-prayer",
    title: "Tefillin and Jewish Prayer",
    titleHi: "תְּפִלִּין",
    tradition: "Judaism",
    traditionEmoji: "✡️",
    icon: "✡️",
    source: "Torah, Deuteronomy 6:8",
    summary: "The practice of binding sacred texts to the body during prayer — physically connecting the word of God to mind and heart.",
    content: `Tefillin (phylacteries) are small leather boxes containing Torah passages, bound to the arm and head during weekday morning prayers. This practice, commanded in Deuteronomy 6:8, literally fulfills: 'You shall bind them as a sign upon your hand, and they shall be as frontlets between your eyes.'

## Body and Soul Connected

The arm tefillin is placed on the non-dominant arm, close to the heart — binding God's word to action and emotion. The head tefillin is placed between the eyes — binding God's word to thought and understanding.

Jewish prayer is structured around three daily services: **Shacharit** (morning), **Mincha** (afternoon), and **Ma'ariv** (evening). The **Amidah** (standing prayer) is the central prayer — a series of blessings standing before God.

The **Shema** ('Hear, O Israel, the Lord our God, the Lord is One') is the foundational declaration of Jewish faith, recited twice daily. It is not merely heard but lived — the first words upon waking and the last words before sleep.

Jewish prayer emphasizes community — a **minyan** (quorum of ten) is required for certain prayers. The individual's prayer is always embedded in the collective prayer of Israel.`,
    keyPoints: [
      "Tefillin physically connect Torah to body, mind, and heart",
      "Three daily prayer services structure the day around God",
      "The Shema is the foundational declaration of monotheism",
      "Prayer requires kavanah — intention and concentration",
      "Community prayer (minyan) elevates individual prayer",
    ],
    practicalExercises: [
      "Set aside fixed times for prayer each day",
      "Practice kavanah — focus entirely on the words of prayer",
      "Study the meaning of the prayers in your native language",
      "Pray with a community when possible",
      "Begin and end each day with gratitude to God",
    ],
    relatedTexts: ["Torah", "Siddur (prayer book)", "Talmud"],
    relatedConcepts: ["tikkun-olam", "mitzvah"],
  },
  {
    id: "gurbani-and-nitnem",
    title: "Gurbani and Nitnem",
    titleHi: "ਗੁਰਬਾਨੀ · ਨਿਤਨੇਮ",
    tradition: "Sikhism",
    traditionEmoji: "🙏",
    icon: "📖",
    source: "Guru Granth Sahib and Sikh Rehat Maryada",
    summary: "The daily practice of reciting the Guru's word — five prescribed prayers that structure the Sikh's day around divine remembrance.",
    content: `Nitnem (daily discipline) consists of five prescribed prayers recited at specific times: **Japji Sahib** (morning), **Jaap Sahib** (morning), **Tav-Prasad Savaiye** (morning), **Rehras Sahib** (evening), and **Kirtan Sohila** (bedtime).

## The Living Word

Gurbani (the Guru's word) is not merely scripture but the living Guru. In 1708, Guru Gobind Singh declared the Granth Sahib as the eternal Guru — the word itself is the teacher. Reciting Gurbani is not reading about God but conversing with God.

The **Japji Sahib**, composed by Guru Nanak, opens with the **Mool Mantar** — the foundational statement of Sikh theology. It then unfolds through 38 pauris (stanzas) exploring the nature of God, the path to liberation, and the qualities of the enlightened being.

Sikh prayer is always accompanied by **simran** (remembrance of God's name) and **seva** (selfless service). Knowledge without practice is empty; practice without knowledge is blind.`,
    keyPoints: [
      "Five daily prayers (Nitnem) structure the spiritual day",
      "Gurbani is the living Guru — the word itself teaches",
      "Japji Sahib is the foundational morning prayer",
      "Simran (remembrance) accompanies all practice",
      "Seva (service) is the expression of prayer in action",
    ],
    practicalExercises: [
      "Begin each day with Japji Sahib — even a few stanzas",
      "Practice simran — repeat 'Waheguru' (Wonderful God) throughout the day",
      "Read one page of Guru Granth Sahib daily with understanding",
      "Perform one act of seva (selfless service) each day",
      "End each day with Kirtan Sohila before sleep",
    ],
    relatedTexts: ["Guru Granth Sahib", "Dasam Granth", "Sikh Rehat Maryada"],
    relatedConcepts: ["naam-japna", "seva"],
  },
  {
    id: "zuangzi-and-naturalness",
    title: "Zhuangzi and Naturalness",
    titleHi: "莊子",
    tradition: "Taoism",
    traditionEmoji: "☯️",
    icon: "🦋",
    source: "Zhuangzi (~3rd century BCE)",
    summary: "Zhuangzi's teachings on spontaneity, freedom from convention, and the relativity of all perspectives — the playful wisdom of Taoism.",
    content: "Zhuangzi (c. 369-286 BCE) is the great literary genius of Taoism. While Laozi speaks in aphorisms, Zhuangzi tells stories — paradoxical, humorous, profound. His teachings challenge every fixed idea about reality, knowledge, and the self.\n\nThe famous butterfly dream: 'Once Zhuangzi dreamed he was a butterfly, fluttering happily. When he woke, he wondered: Am I Zhuangzi who dreamed I was a butterfly, or a butterfly dreaming I am Zhuangzi?' This is not skepticism but liberation from fixed identity.\n\nZhuangzi's concept of 'naturalness' (ziran) means acting spontaneously, without forcing. The skilled butcher cuts the ox without thinking — his knife finds the spaces between joints. This is wu wei in action.\n\nHe teaches the relativity of all perspectives: What is good from one angle is bad from another. The 'useless' tree lives longest because no one cuts it down. The 'useless' person is free from society's demands.\n\nZhuangzi's ultimate teaching: Let go of the need to be right, to be useful, to be important. Float freely on the river of life. This is true freedom.",
    keyPoints: [
      "Reality is perspectival — no single viewpoint is absolute",
      "Identity is fluid — the butterfly dream dissolves fixed self",
      "Naturalness (ziran) means acting spontaneously without forcing",
      "Uselessness is a form of freedom",
      "Humor and paradox are vehicles for wisdom",
    ],
    practicalExercises: [
      "Question your fixed beliefs — what if the opposite were true?",
      "Practice doing nothing (wu wei) — sit and watch without intervening",
      "Find value in what society considers useless",
      "Approach problems with playfulness rather than anxiety",
      "Spend time in nature and observe its effortless wisdom",
    ],
    relatedTexts: ["Zhuangzi", "Tao Te Ching", "Liezi"],
    relatedConcepts: ["wu-wei", "tao", "yin-yang"],
  },
];

export const HERITAGE_SITES: HeritageSite[] = [
  {
    id: "kashi-vishwanath",
    name: "Kashi Vishwanath Temple",
    nameLocal: "काशी विश्वनाथ मंदिर",
    location: "Varanasi, Uttar Pradesh",
    country: "India",
    tradition: "Hinduism",
    traditionEmoji: "🙏",
    description: "One of the twelve Jyotirlingas — the most sacred temples of Lord Shiva. Situated on the western bank of the Ganges, it is the spiritual heart of Hindu civilization.",
    significance: "Varanasi is considered the oldest continuously inhabited city in the world. The temple represents the cosmic axis (axis mundi) — the point where the divine intersects with the earthly. Bathing in the Ganges at Varanasi is believed to wash away all sins.",
    history: "The original temple was destroyed and rebuilt multiple times. The current structure was rebuilt in 1780 by Ahilya Bai Holkar of Indore. The Kashi Vishwanath Corridor, completed in 2021, connects the temple directly to the Ganges.",
    unesco: false,
    yearBuilt: "Ancient (current structure 1780)",
  },
  {
    id: "angkor-wat",
    name: "Angkor Wat",
    nameLocal: "អង្គរវត",
    location: "Siem Reap",
    country: "Cambodia",
    tradition: "Hinduism/Buddhism",
    traditionEmoji: "🙏",
    description: "The largest religious monument in the world — a massive temple complex originally dedicated to Vishnu, later transformed into a Buddhist temple.",
    significance: "Angkor Wat represents Mount Meru, the cosmic mountain at the center of the universe in Hindu-Buddhist cosmology. Its five towers symbolize the five peaks of Meru. The entire complex is a stone mandala — a map of the cosmos.",
    history: "Built by King Suryavarman II in the early 12th century as a Hindu temple, it gradually transformed into a Buddhist site by the end of the century. Abandoned in the 15th century, it was 'rediscovered' by French explorers in the 19th century.",
    unesco: true,
    yearBuilt: "12th century",
  },
  {
    id: "western-wall",
    name: "Western Wall (Kotel)",
    nameLocal: "הַכֹּתֶל הַמַּעֲרָבִי",
    location: "Jerusalem",
    country: "Israel",
    tradition: "Judaism",
    traditionEmoji: "✡️",
    description: "The holiest site where Jews are permitted to pray — a retaining wall of the Temple Mount, the site of the ancient Temple destroyed in 70 CE.",
    significance: "The Western Wall is the closest accessible point to the Holy of Holies — the innermost sanctum of the Temple where God's presence dwelt. It represents both the destruction of the Temple and the enduring hope for its rebuilding.",
    history: "Built by Herod the Great around 19 BCE as part of the expansion of the Second Temple. After the Temple's destruction by Rome in 70 CE, the wall became the primary site of Jewish prayer and mourning.",
    unesco: false,
    yearBuilt: "19 BCE",
  },
  {
    id: "meiji-jingu",
    name: "Meiji Jingu",
    nameLocal: "明治神宮",
    location: "Tokyo",
    country: "Japan",
    tradition: "Shinto",
    traditionEmoji: "⛩️",
    description: "A Shinto shrine dedicated to Emperor Meiji and Empress Shoken, set in a 170-acre forest in the heart of Tokyo — an oasis of nature within the world's largest metropolis.",
    significance: "Meiji Jingu represents the Shinto relationship between humans and nature. The forest was created from 100,000 trees donated from across Japan — every prefecture contributed. The shrine demonstrates that sacred space can exist within the modern world.",
    history: "Completed in 1920, the shrine was destroyed during World War II and rebuilt in 1958. The forest, now over a century old, has become a mature ecosystem — proof that human-created sacred landscapes can become genuine wilderness.",
    unesco: false,
    yearBuilt: "1920",
  },
  {
    id: "golden-temple",
    name: "Harmandir Sahib (Golden Temple)",
    nameLocal: "ਹਰਿਮੰਦਰ ਸਾਹਿਬ",
    location: "Amritsar, Punjab",
    country: "India",
    tradition: "Sikhism",
    traditionEmoji: "🙏",
    description: "The holiest Gurdwara of Sikhism — a golden temple surrounded by a sacred pool (Amrit Sarovar, 'Pool of Nectar'), symbolizing the Sikh vision of equality and devotion.",
    significance: "The temple has four entrances on all four sides, symbolizing that people of all castes, creeds, and backgrounds are welcome. The langar (community kitchen) feeds over 100,000 people daily — the largest free kitchen in the world.",
    history: "Founded by Guru Ram Das in 1577 and completed by Guru Arjan Dev in 1604. The temple was rebuilt multiple times after destruction by Mughal and Afghan invaders. Maharaja Ranjit Singh covered it in gold in the early 19th century.",
    unesco: false,
    yearBuilt: "1604",
  },
  {
    id: "hagia-sophia",
    name: "Hagia Sophia",
    nameLocal: "Αγία Σοφία / ایاصوفیه",
    location: "Istanbul",
    country: "Turkey",
    tradition: "Christianity/Islam",
    traditionEmoji: "☪️",
    description: "For nearly a millennium, the largest cathedral in the world — a masterpiece of Byzantine architecture that later became a mosque, museum, and mosque again.",
    significance: "Hagia Sophia represents the intersection of Christian and Islamic civilizations. Its massive dome (31m diameter) was an engineering marvel that influenced both church and mosque architecture for centuries.",
    history: "Built by Emperor Justinian I between 532-537 CE as the patriarchal cathedral of Constantinople. It served as the world's largest cathedral for nearly a millennium. After the Ottoman conquest in 1453, it was converted to a mosque. In 1934, Atatürk made it a museum; in 2020, it was reconverted to a mosque.",
    yearBuilt: "537 CE",
    unesco: true,
  },
];

export interface Festival {
  id: string;
  name: string;
  tradition: string;
  date: string;
  description: string;
  significance: string;
}

export const SPIRITUAL_FESTIVALS: Festival[] = [
  { id: "diwali", name: "Diwali", tradition: "Hinduism / Jainism / Sikhism", date: "October-November", description: "The Festival of Lights — celebrating the victory of light over darkness, knowledge over ignorance, good over evil.", significance: "Marks Lord Rama's return to Ayodhya after defeating Ravana; also celebrates Lakshmi, the goddess of prosperity." },
  { id: "vesak", name: "Vesak (Buddha Day)", tradition: "Buddhism", date: "May (full moon)", description: "Celebrates the birth, enlightenment, and death (parinirvana) of the Buddha.", significance: "The most important Buddhist festival. Devotees visit temples, offer flowers and incense, and practice generosity." },
  { id: "ramadan", name: "Ramadan", tradition: "Islam", date: "9th month of Islamic calendar", description: "A month of fasting, prayer, reflection, and community. Muslims fast from dawn to sunset.", significance: "Commemorates the month when the Quran was first revealed to Prophet Muhammad." },
  { id: "easter", name: "Easter", tradition: "Christianity", date: "March-April", description: "Celebrates the resurrection of Jesus Christ — the central event of Christian faith.", significance: "The resurrection is the foundation of Christian hope — proof that death has been conquered and eternal life is offered to all." },
  { id: "passover", name: "Passover (Pesach)", tradition: "Judaism", date: "March-April", description: "Commemorates the liberation of the Israelites from slavery in Egypt.", significance: "The Exodus from Egypt is the defining event of Jewish identity — a story of God's deliverance and covenant with His people." },
  { id: "guru-nanak-jayanti", name: "Guru Nanak Jayanti", tradition: "Sikhism", date: "November (full moon)", description: "Celebrates the birth of Guru Nanak, the founder of Sikhism and the first of the ten Sikh Gurus.", significance: "Guru Nanak's message of one God, equality of all people, and selfless service laid the foundation for the Sikh faith." },
  { id: "maha-shivaratri", name: "Maha Shivaratri", tradition: "Hinduism", date: "February-March", description: "The Great Night of Shiva — a night of fasting, prayer, and meditation honoring Lord Shiva.", significance: "The night Shiva performed the cosmic dance of creation, preservation, and destruction. Devotees stay awake all night in meditation." },
  { id: "vaisakhi", name: "Vaisakhi", tradition: "Sikhism", date: "April 13-14", description: "Celebrates the creation of the Khalsa — the Sikh community of the initiated — by Guru Gobind Singh in 1699.", significance: "Vaisakhi marks the formal establishment of the Sikh identity with the Five Ks and the brotherhood of the Khalsa." },
  { id: "nowruz", name: "Nowruz", tradition: "Zoroastrianism / Persian culture", date: "March 20-21 (Spring Equinox)", description: "The Persian New Year — the most important Zoroastrian festival, celebrated for over 3,000 years.", significance: "Nowruz celebrates the triumph of light over darkness and the renewal of nature. The Haft-sin table displays seven symbolic items." },
  { id: "chinese-new-year", name: "Chinese New Year", tradition: "Taoism / Chinese folk religion", date: "January-February", description: "The most important Chinese festival, marking the beginning of the lunar new year.", significance: "Celebrates renewal, family reunion, and the warding off of evil spirits. Firecrackers and red decorations symbolize good fortune." },
];

export function getTeachingById(id: string): SpiritualTeaching | undefined {
  return SPIRITUAL_TEACHINGS.find((t) => t.id === id);
}

export function getHeritageSiteById(id: string): HeritageSite | undefined {
  return HERITAGE_SITES.find((s) => s.id === id);
}

export function getFestivalById(id: string): Festival | undefined {
  return SPIRITUAL_FESTIVALS.find((f) => f.id === id);
}
