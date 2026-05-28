export interface DharmaConcept {
  id: string;
  name: string;
  nameOriginal: string;
  tradition: string;
  traditionEmoji: string;
  definition: string;
  deeperExplanation: string;
  relatedConcepts: string[];
  sourceTexts: string[];
  practicalApplication: string;
}

export const DHARMIC_CONCEPTS: DharmaConcept[] = [
  // HINDUISM
  {
    id: "dharma",
    name: "Dharma",
    nameOriginal: "धर्म",
    tradition: "Hinduism",
    traditionEmoji: "🙏",
    definition: "The cosmic law that upholds the universe, the moral order, and one's righteous duty. Dharma is the foundation of all existence.",
    deeperExplanation: "Dharma operates at multiple levels: Rita (cosmic order), Varnashrama Dharma (social duty), Svadharma (personal duty), and Sanatana Dharma (eternal truth). In the Mahabharata, dharma is described as 'that which sustains' — when dharma declines, the universe itself falters. Krishna teaches that it is better to perform one's own dharma imperfectly than another's perfectly.",
    relatedConcepts: ["karma", "moksha", "svadharma"],
    sourceTexts: ["Bhagavad Gita", "Manusmriti", "Mahabharata"],
    practicalApplication: "Act according to your nature and station in life. Fulfill your responsibilities without attachment to results. Let righteousness guide every decision.",
  },
  {
    id: "karma",
    name: "Karma",
    nameOriginal: "कर्म",
    tradition: "Hinduism",
    traditionEmoji: "🙏",
    definition: "The law of cause and effect — every action generates a force of energy that returns to us in kind. What we sow, we reap.",
    deeperExplanation: "Karma is not punishment but a neutral law of the universe, like gravity. It operates across lifetimes (Sanchita Karma — accumulated), manifests in this life (Prarabdha Karma — bearing fruit), and is being created now (Kriyamana Karma — current actions). The Bhagavad Gita's solution is Nishkama Karma — action without selfish desire.",
    relatedConcepts: ["dharma", "samsara", "moksha"],
    sourceTexts: ["Bhagavad Gita", "Upanishads", "Yoga Sutras"],
    practicalApplication: "Act with pure intention. Do your duty without clinging to outcomes. Transform every action into an offering to the Divine.",
  },
  {
    id: "moksha",
    name: "Moksha",
    nameOriginal: "मोक्ष",
    tradition: "Hinduism",
    traditionEmoji: "🙏",
    definition: "Liberation from the cycle of birth and death (samsara). The ultimate goal of Hindu spiritual life — union with the Absolute.",
    deeperExplanation: "Moksha is not annihilation but the realization of one's true nature as Brahman (the Absolute). Different paths lead to it: Jnana Yoga (knowledge), Bhakti Yoga (devotion), Karma Yoga (selfless action), and Raja Yoga (meditation). The Upanishads declare: 'Tat Tvam Asi' — Thou Art That. You are already liberated; you need only realize it.",
    relatedConcepts: ["dharma", "karma", "samsara", "brahman"],
    sourceTexts: ["Upanishads", "Bhagavad Gita", "Brahma Sutras"],
    practicalApplication: "Cultivate self-knowledge through meditation, study, and devotion. Reduce attachment to material identity. Recognize the divine spark within yourself and all beings.",
  },
  {
    id: "atman",
    name: "Atman",
    nameOriginal: "आत्मन्",
    tradition: "Hinduism",
    traditionEmoji: "🙏",
    definition: "The true Self — the eternal, unchanging consciousness that is the essence of every living being. Not the body, not the mind, but the witnessing awareness.",
    deeperExplanation: "The Mandukya Upanishad opens with: 'All this is Brahman. This Atman is Brahman.' The Atman is not born, does not die, is not slain when the body is slain. It is the knower of the field (Kshetrajna), the silent witness of all experience. Realizing Atman is realizing God.",
    relatedConcepts: ["brahman", "moksha", "samsara"],
    sourceTexts: ["Mandukya Upanishad", "Bhagavad Gita", "Chandogya Upanishad"],
    practicalApplication: "Practice self-inquiry: 'Who am I?' Observe your thoughts without identifying with them. Recognize that you are not the body, not the mind, but the awareness in which they appear.",
  },
  {
    id: "brahman",
    name: "Brahman",
    nameOriginal: "ब्रह्मन्",
    tradition: "Hinduism",
    traditionEmoji: "🙏",
    definition: "The ultimate reality — infinite, eternal, unchanging, the source and substance of all existence. Beyond all attributes, yet manifesting as all things.",
    deeperExplanation: "Brahman is described as Sat-Chit-Ananda — Being, Consciousness, and Bliss. It is Nirguna Brahman (without attributes) in its absolute form, and Saguna Brahman (with attributes) when manifest as Ishvara (God). The entire universe is Brahman's expression. There is nothing that is not Brahman.",
    relatedConcepts: ["atman", "moksha", "ishvara"],
    sourceTexts: ["Upanishads", "Brahma Sutras", "Bhagavad Gita"],
    practicalApplication: "See the divine in everything. Practice reverence for all life. Through meditation and devotion, dissolve the illusion of separation between self and the Absolute.",
  },
  {
    id: "yoga",
    name: "Yoga",
    nameOriginal: "योग",
    tradition: "Hinduism",
    traditionEmoji: "🙏",
    definition: "Union — the discipline of connecting the individual consciousness with the universal consciousness. Far more than physical exercise.",
    deeperExplanation: "Patanjali's Ashtanga (Eight Limbs): Yama (restraints), Niyama (observances), Asana (posture), Pranayama (breath control), Pratyahara (sense withdrawal), Dharana (concentration), Dhyana (meditation), Samadhi (absorption). The Gita teaches four yogas: Karma (action), Bhakti (devotion), Jnana (knowledge), and Raja (meditation). Yoga is the science of self-realization.",
    relatedConcepts: ["atman", "brahman", "moksha"],
    sourceTexts: ["Yoga Sutras of Patanjali", "Bhagavad Gita", "Hatha Yoga Pradipika"],
    practicalApplication: "Begin with ethical conduct and physical practice. Cultivate breath awareness and meditation. Let every action become yoga — a union with the Divine.",
  },
  {
    id: "ahimsa",
    name: "Ahimsa",
    nameOriginal: "अहिंसा",
    tradition: "Hinduism",
    traditionEmoji: "🙏",
    definition: "Non-violence — not merely the absence of harm, but the active practice of compassion, love, and reverence for all life.",
    deeperExplanation: "Ahimsa is the first of the Yamas (ethical restraints) and the highest dharma. It extends beyond physical non-violence to non-violence in thought, word, and intention. Gandhi said: 'Ahimsa is the strongest force in the universe.' It is not weakness but the greatest courage — the strength to love in the face of hatred.",
    relatedConcepts: ["dharma", "karuna", "prema"],
    sourceTexts: ["Yoga Sutras", "Mahabharata", "Manusmriti"],
    practicalApplication: "Practice harmlessness in thought, word, and deed. Choose compassion over anger. See the divine in every living being. Eat with awareness and gratitude.",
  },

  // BUDDHISM
  {
    id: "four-noble-truths",
    name: "Four Noble Truths",
    nameOriginal: "चत्वारि आर्यसत्यानि",
    tradition: "Buddhism",
    traditionEmoji: "☸️",
    definition: "The Buddha's first teaching: (1) Life involves suffering (Dukkha), (2) Suffering arises from craving (Samudaya), (3) Suffering can cease (Nirodha), (4) There is a path to cessation (Magga).",
    deeperExplanation: "Dukkha is not mere pain but the fundamental unsatisfactoriness of conditioned existence. Samudaya — craving (tanha) for pleasure, existence, and non-existence drives the cycle of suffering. Nirodha — cessation is possible, Nibbana is real. Magga — the Noble Eightfold Path is the way. These are not pessimistic but profoundly optimistic: suffering has a cause, and that cause can be removed.",
    relatedConcepts: ["eightfold-path", "nirvana", "dependent-origination"],
    sourceTexts: ["Dhammapada", "Sutta Pitaka", "Visuddhimagga"],
    practicalApplication: "Acknowledge suffering without denial. Investigate its root in craving and attachment. Follow the Eightfold Path. Cultivate mindfulness and wisdom.",
  },
  {
    id: "eightfold-path",
    name: "Noble Eightfold Path",
    nameOriginal: "अरियो अट्ठङ्गिको मग्गो",
    tradition: "Buddhism",
    traditionEmoji: "☸️",
    definition: "The path to the cessation of suffering: Right View, Right Intention, Right Speech, Right Action, Right Livelihood, Right Effort, Right Mindfulness, Right Concentration.",
    deeperExplanation: "The Eightfold Path is divided into three trainings: Wisdom (Prajna) — Right View and Intention; Ethics (Sila) — Right Speech, Action, and Livelihood; Meditation (Samadhi) — Right Effort, Mindfulness, and Concentration. It is not a linear sequence but a simultaneous cultivation — each factor supports all others.",
    relatedConcepts: ["four-noble-truths", "nirvana", "mindfulness"],
    sourceTexts: ["Dhammapada", "Sutta Pitaka", "Mahāsatipaṭṭhāna Sutta"],
    practicalApplication: "Begin with Right View — understand the nature of reality. Cultivate ethical conduct in daily life. Establish a regular meditation practice. Let wisdom guide every action.",
  },
  {
    id: "nirvana",
    name: "Nirvana",
    nameOriginal: "निब्बान",
    tradition: "Buddhism",
    traditionEmoji: "☸️",
    definition: "The extinguishing of the fires of greed, hatred, and delusion. The end of suffering and the cycle of rebirth. The supreme goal of Buddhist practice.",
    deeperExplanation: "Nirvana literally means 'blowing out' — not annihilation but the cessation of the conditions that produce suffering. It is described as the 'unborn, unbecome, unmade, unconditioned.' The Buddha said: 'There is, monks, an unborn, unbecome, unmade, unconditioned. If there were not, no escape would be discerned from what is born, become, made, conditioned.'",
    relatedConcepts: ["four-noble-truths", "eightfold-path", "dependent-origination"],
    sourceTexts: ["Dhammapada", "Sutta Pitaka", "Milinda Panha"],
    practicalApplication: "Nirvana is not distant — it is the cessation of craving in this very moment. Practice mindfulness to see things as they really are. Let go of attachment moment by moment.",
  },
  {
    id: "dependent-origination",
    name: "Dependent Origination",
    nameOriginal: "पटिच्चसमुप्पाद",
    tradition: "Buddhism",
    traditionEmoji: "☸️",
    definition: "Nothing exists independently — everything arises in dependence upon conditions. 'This being, that becomes. This not being, that does not become.'",
    deeperExplanation: "The Twelve Links of Dependent Origination: Ignorance → Volitional Formations → Consciousness → Name-and-Form → Six Sense Bases → Contact → Feeling → Craving → Clinging → Becoming → Birth → Aging and Death. Understanding this chain is the key to liberation — break any link and the chain of suffering dissolves.",
    relatedConcepts: ["four-noble-truths", "nirvana", "emptiness"],
    sourceTexts: ["Sutta Pitaka", "Visuddhimagga", "Mulamadhyamakakarika"],
    practicalApplication: "Observe how everything in your experience arises from conditions. See the interconnection of all things. This understanding dissolves the illusion of a separate self.",
  },

  // ISLAM
  {
    id: "tawhid",
    name: "Tawhid",
    nameOriginal: "توحيد",
    tradition: "Islam",
    traditionEmoji: "☪️",
    definition: "The absolute oneness of God — the central doctrine of Islam. There is no god but Allah. He is One, Unique, without partners or equals.",
    deeperExplanation: "Tawhid has three aspects: Tawhid al-Rububiyyah (Lordship — Allah alone creates and sustains), Tawhid al-Uluhiyyah (Worship — Allah alone deserves worship), and Tawhid al-Asma wa Sifat (Names and Qualities — Allah's attributes are unique). The Quran declares: 'Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.'",
    relatedConcepts: ["salah", "iman", "khilafah"],
    sourceTexts: ["Quran", "Hadith"],
    practicalApplication: "Direct all worship and devotion to Allah alone. Recognize His signs in creation. Maintain constant remembrance (dhikr) of God in all activities.",
  },
  {
    id: "salah",
    name: "Salah",
    nameOriginal: "صلاة",
    tradition: "Islam",
    traditionEmoji: "☪️",
    definition: "The five daily prayers — the second pillar of Islam. A direct connection between the worshiper and Allah, performed at dawn, noon, mid-afternoon, sunset, and night.",
    deeperExplanation: "Salah is not mere ritual but a mi'raj (spiritual ascension) for the believer. The Prophet ﷺ said: 'When any one of you stands to pray, he is conversing with his Lord.' Each prayer involves standing, bowing, prostrating, and sitting — a physical expression of submission (islam) to the Divine. The Quran says: 'Indeed, prayer prohibits immorality and wrongdoing.'",
    relatedConcepts: ["tawhid", "iman", "dhikr"],
    sourceTexts: ["Quran", "Hadith", "Fiqh manuals"],
    practicalApplication: "Establish the five prayers without delay. Pray with presence of mind and heart, not merely bodily movement. Use prayer as an anchor for your day and a shield against wrongdoing.",
  },
  {
    id: "khilafah",
    name: "Khilafah",
    nameOriginal: "خلافة",
    tradition: "Islam",
    traditionEmoji: "☪️",
    definition: "Vicegerency — the trust given to humanity to be God's representative on Earth, stewarding creation with justice, mercy, and wisdom.",
    deeperExplanation: "The Quran declares: 'I will create a vicegerent on earth.' Humans are not owners of creation but trustees (amanah). This carries immense responsibility — to care for the earth, establish justice, and reflect God's attributes of mercy and wisdom in all dealings. The Khalifah acts as a guardian, not a consumer, of the world.",
    relatedConcepts: ["tawhid", "adl", "amanah"],
    sourceTexts: ["Quran", "Hadith"],
    practicalApplication: "Treat the earth and all creatures as sacred trusts. Practice justice in all dealings. Be a source of mercy and benefit to others. Use resources wisely and with gratitude.",
  },

  // CHRISTIANITY
  {
    id: "agape",
    name: "Agape",
    nameOriginal: "ἀγάπη",
    tradition: "Christianity",
    traditionEmoji: "✝️",
    definition: "Unconditional, selfless love — the highest form of love in Christian theology. The love that God has for humanity and that humans are called to have for one another.",
    deeperExplanation: "Agape is not an emotion but a deliberate choice to will the good of another, regardless of their worthiness. Jesus said: 'Love your enemies, do good to those who hate you.' Paul's hymn to love (1 Corinthians 13) describes agape: patient, kind, not envious, not boastful, not self-seeking. It 'never fails.' This is the love that transforms the world.",
    relatedConcepts: ["grace", "communion", "kenosis"],
    sourceTexts: ["Bible (1 Corinthians 13)", "Gospel of John", "Gospel of Matthew"],
    practicalApplication: "Practice love without conditions. Forgive those who wrong you. Serve others without seeking reward. Let love be the motive behind every action.",
  },
  {
    id: "grace",
    name: "Grace",
    nameOriginal: "χάρις",
    tradition: "Christianity",
    traditionEmoji: "✝️",
    definition: "The unmerited favor of God — freely given, not earned by human effort. The divine assistance that transforms, heals, and saves.",
    deeperExplanation: "Grace is the heart of Christian theology. 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God' (Ephesians 2:8-9). Grace is not a reward for good behavior but God's unconditional love poured out on humanity. It operates in three ways: prevenient grace (before we seek), justifying grace (at conversion), and sanctifying grace (ongoing transformation).",
    relatedConcepts: ["agape", "faith", "redemption"],
    sourceTexts: ["Epistle to the Romans", "Epistle to the Ephesians", "Gospel of John"],
    practicalApplication: "Receive grace with humility and gratitude. Extend grace to others as freely as you have received it. Trust in God's mercy rather than your own merit.",
  },

  // JUDAISM
  {
    id: "tikkun-olam",
    name: "Tikkun Olam",
    nameOriginal: "תיקון עולם",
    tradition: "Judaism",
    traditionEmoji: "✡️",
    definition: "Repair of the world — the Jewish concept that humanity has a shared responsibility to heal, improve, and transform the world through acts of justice, kindness, and compassion.",
    deeperExplanation: "Originally a legal concept in the Mishnah, Tikkun Olam evolved in Kabbalistic thought into a cosmic mandate: at the moment of creation, divine light shattered and scattered into sparks embedded in all things. Human acts of holiness and justice 'raise the sparks' and restore the world to wholeness. Every mitzvah (commandment) is an act of repair.",
    relatedConcepts: ["mitzvah", "chesed", "tzedakah"],
    sourceTexts: ["Mishnah", "Talmud", "Zohar"],
    practicalApplication: "Engage in acts of justice and compassion. Work to repair what is broken in society. Every good deed contributes to the world's healing.",
  },
  {
    id: "mitzvah",
    name: "Mitzvah",
    nameOriginal: "מצווה",
    tradition: "Judaism",
    traditionEmoji: "✡️",
    definition: "A commandment from God — 613 in total, encompassing all aspects of life. Also used colloquially to mean a good deed or act of kindness.",
    deeperExplanation: "The 613 mitzvot include 248 positive commandments ('thou shalt') and 365 negative commandments ('thou shalt not'). They cover ritual, ethical, and civil law — from prayer and Sabbath observance to business ethics and treatment of the stranger. The Talmud teaches that the entire Torah can be summarized as: 'Love your neighbor as yourself.'",
    relatedConcepts: ["tikkun-olam", "torah", "chesed"],
    sourceTexts: ["Torah", "Talmud", "Shulchan Aruch"],
    practicalApplication: "Perform acts of lovingkindness daily. Study Torah and apply its wisdom. See every interaction as an opportunity for a mitzvah.",
  },

  // SIKHISM
  {
    id: "naam-japna",
    name: "Naam Japna",
    nameOriginal: "ਨਾਮ ਜਪਣਾ",
    tradition: "Sikhism",
    traditionEmoji: "🙏",
    definition: "The practice of repeating and meditating on the Divine Name. One of the three pillars of Sikh life, alongside honest work and sharing with others.",
    deeperExplanation: "Guru Nanak taught: 'Through Naam, the mind is purified, and liberation is attained.' Naam Japna is not mere repetition but the constant remembrance of God's presence in all things. It transforms consciousness from ego-centered to God-centered. The Mool Mantar — the foundational verse of Sikhism — is itself a meditation on the nature of the Divine Name.",
    relatedConcepts: ["seva", "vand-chhakna", "kirat-karni"],
    sourceTexts: ["Guru Granth Sahib", "Janamsakhis"],
    practicalApplication: "Begin each day with meditation on God's name. Maintain awareness of the Divine throughout daily activities. Let remembrance of God be the thread that connects all your actions.",
  },
  {
    id: "seva",
    name: "Seva",
    nameOriginal: "ਸੇਵਾ",
    tradition: "Sikhism",
    traditionEmoji: "🙏",
    definition: "Selfless service — the practice of serving others without expectation of reward. A fundamental expression of Sikh spirituality.",
    deeperExplanation: "Guru Nanak said: 'He who has no seva has no place in the Court of the Lord.' Seva is not charity but worship — serving humanity is serving God. It takes three forms: Tan (physical service), Man (mental service through prayer), and Dhan (material service). The langar (community kitchen) in every Gurdwara is a living expression of seva — feeding all without distinction.",
    relatedConcepts: ["naam-japna", "vand-chhakna", "hukam"],
    sourceTexts: ["Guru Granth Sahib", "Sikh Rehat Maryada"],
    practicalApplication: "Serve others without seeking recognition. Contribute your time, skills, and resources to community welfare. See every person as a manifestation of the Divine.",
  },

  // TAOISM
  {
    id: "wu-wei",
    name: "Wu Wei",
    nameOriginal: "無為",
    tradition: "Taoism",
    traditionEmoji: "☯️",
    definition: "Non-action or effortless action — acting in harmony with the natural flow of the Tao, without forcing or struggling against the current of life.",
    deeperExplanation: "Wu Wei is not passivity but the highest form of action — acting without the interference of ego, desire, or anxiety. Like water that finds its course without effort, the sage acts spontaneously in accord with the Tao. Laozi says: 'The Tao does nothing, yet nothing is left undone.' It is the art of being so aligned with reality that action flows naturally.",
    relatedConcepts: ["tao", "pu", "ziran"],
    sourceTexts: ["Tao Te Ching", "Zhuangzi"],
    practicalApplication: "Stop forcing outcomes. Act when action is needed, rest when rest is needed. Trust the natural flow of life. Cultivate inner stillness so that right action arises spontaneously.",
  },
  {
    id: "tao",
    name: "The Tao",
    nameOriginal: "道",
    tradition: "Taoism",
    traditionEmoji: "☯️",
    definition: "The Way — the nameless, formless source of all existence. The ultimate reality that cannot be spoken, yet from which all things emerge and to which all return.",
    deeperExplanation: "The Tao Te Ching opens: 'The Tao that can be told is not the eternal Tao.' The Tao is both the origin and the process of all things — not a creator God but the natural order itself. It is the 'uncarved block' (pu) — simple, whole, and complete. All of Taoist philosophy and practice is about aligning with the Tao rather than opposing it.",
    relatedConcepts: ["wu-wei", "yin-yang", "pu"],
    sourceTexts: ["Tao Te Ching", "Zhuangzi"],
    practicalApplication: "Observe nature and learn its rhythms. Simplify your life. Let go of rigid plans and expectations. Trust the process of life.",
  },
  {
    id: "yin-yang",
    name: "Yin and Yang",
    nameOriginal: "陰陽",
    tradition: "Taoism",
    traditionEmoji: "☯️",
    definition: "The complementary opposites that constitute all of reality — dark/light, feminine/masculine, passive/active, earth/heaven. Neither is superior; both are necessary.",
    deeperExplanation: "Yin-Yang is not duality but dynamic harmony. Each contains the seed of the other (the dots in the symbol). When yang reaches its peak, yin begins to arise, and vice versa. Health, wisdom, and virtue all come from balancing these forces within oneself and in relation to the world. The Taijitu (Yin-Yang symbol) represents the Tao in motion.",
    relatedConcepts: ["tao", "wu-wei", "five-elements"],
    sourceTexts: ["I Ching", "Tao Te Ching", "Huangdi Neijing"],
    practicalApplication: "Seek balance in all things — work and rest, activity and stillness, giving and receiving. Recognize that every extreme contains its opposite. Embrace change as natural.",
  },

  // ZOROASTRIANISM
  {
    id: "asha",
    name: "Asha",
    nameOriginal: "𐬀𐬴𐬀",
    tradition: "Zoroastrianism",
    traditionEmoji: "🔥",
    definition: "Truth, righteousness, and the cosmic order — the central concept of Zoroastrian ethics. The principle by which the universe operates and by which humans must live.",
    deeperExplanation: "Asha is the opposite of Druj (lie, disorder). It represents the right order of things — in nature, in society, and in the individual soul. Zarathustra taught that every person must choose between Asha and Druj in every thought, word, and deed. This cosmic choice between truth and falsehood is the foundation of Zoroastrian morality.",
    relatedConcepts: ["vohu-manah", "ahura-mazda", "free-will"],
    sourceTexts: ["Avesta", "Gathas"],
    practicalApplication: "Choose truth in all things. Live with integrity. Align your actions with the natural and moral order. Speak truth even when it is difficult.",
  },
  {
    id: "good-thoughts-good-words-good-deeds",
    name: "Good Thoughts, Good Words, Good Deeds",
    nameOriginal: "Humata, Hukhta, Hvarshta",
    tradition: "Zoroastrianism",
    traditionEmoji: "🔥",
    definition: "The threefold ethical foundation of Zoroastrianism — the path to Asha (righteousness) through purity of thought, speech, and action.",
    deeperExplanation: "Zarathustra's teaching is radically simple: the battle between good and evil is fought in every human heart, in every moment. Good Thoughts (Humata) — cultivate wisdom and compassion. Good Words (Hukhta) — speak truth and kindness. Good Deeds (Hvarshta) — act with justice and generosity. These three together constitute the righteous life.",
    relatedConcepts: ["asha", "free-will", "ahura-mazda"],
    sourceTexts: ["Gathas", "Avesta"],
    practicalApplication: "Guard your thoughts — they become words. Guard your words — they become actions. Guard your actions — they become your destiny. Begin with purity of mind.",
  },

  // JAINISM
  {
    id: "ahimsa-jain",
    name: "Ahimsa (Jain)",
    nameOriginal: "अहिंसा",
    tradition: "Jainism",
    traditionEmoji: "🙏",
    definition: "Non-violence elevated to the supreme moral principle — the first of the five vows. Jains extend ahimsa to all living beings, including insects and microorganisms.",
    deeperExplanation: "In Jainism, ahimsa is not just non-killing but non-harm in thought, word, and deed to every living being — from humans to the smallest organism. The vow of ahimsa extends to wearing a mouth cover (muhpatti) to avoid inhaling insects, filtering water, and walking carefully. It is the foundation from which all other Jain virtues flow.",
    relatedConcepts: ["anekantavada", "aparigraha", "kevala-jnana"],
    sourceTexts: ["Agamas", "Tattvartha Sutra"],
    practicalApplication: "Practice non-violence in thought, word, and deed. Be mindful of the impact of your actions on all living beings. Cultivate compassion for every creature.",
  },
  {
    id: "anekantavada",
    name: "Anekantavada",
    nameOriginal: "अनेकान्तवाद",
    tradition: "Jainism",
    traditionEmoji: "🙏",
    definition: "The doctrine of many-sidedness — truth is complex and can be perceived from multiple perspectives. No single viewpoint captures the whole truth.",
    deeperExplanation: "The parable of the blind men and the elephant illustrates Anekantavada: each man touches a different part and declares the elephant to be like a wall, a rope, a tree trunk, or a fan. Each is partially correct, but none has the whole truth. Jain philosophy teaches intellectual humility and respect for all perspectives while maintaining the pursuit of fuller understanding.",
    relatedConcepts: ["ahimsa-jain", "syadvada", "kevala-jnana"],
    sourceTexts: ["Tattvartha Sutra", "Agamas"],
    practicalApplication: "Listen to different perspectives with openness. Recognize that your understanding is partial. Seek the truth in opposing viewpoints. Practice intellectual humility.",
  },
];

export function getConceptById(id: string): DharmaConcept | undefined {
  return DHARMIC_CONCEPTS.find((c) => c.id === id);
}

export function getConceptsByTradition(tradition: string): DharmaConcept[] {
  return DHARMIC_CONCEPTS.filter((c) => c.tradition === tradition);
}

export function searchConcepts(query: string): DharmaConcept[] {
  const q = query.toLowerCase();
  return DHARMIC_CONCEPTS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.definition.toLowerCase().includes(q) ||
      c.deeperExplanation.toLowerCase().includes(q)
  );
}
