import BreathingTimer from "@/components/BreathingTimer";

export const metadata = {
  title: "Meditate — FEIO",
  description:
    "A meditation guide with breathing exercises, mantra suggestions, and instructions from the world's spiritual traditions.",
};

const TRADITIONS = [
  {
    name: "Hinduism",
    icon: "🙏",
    instruction:
      "Sit in a comfortable posture with spine erect. Close your eyes and focus on the space between the eyebrows (Ajna chakra). Practice pranayama — slow, rhythmic breathing. Meditate on the mantra Om (AUM), feeling its vibration in every cell.",
    mantra: "Om Namah Shivaya",
  },
  {
    name: "Buddhism",
    icon: "☸️",
    instruction:
      "Sit in the lotus or half-lotus position. Focus your attention on the breath at the nostrils. When thoughts arise, note them without judgment and return to the breath. Practice Vipassana — observing sensations as they arise and pass away.",
    mantra: "Om Mani Padme Hum",
  },
  {
    name: "Islam",
    icon: "☪️",
    instruction:
      "After performing Wudu (ablution), sit facing the Qibla. Begin with the remembrance of Allah (Dhikr). Repeat 'La ilaha illallah' with full concentration, letting the meaning penetrate your heart. Feel the presence of the Divine in every breath.",
    mantra: "La ilaha illallah",
  },
  {
    name: "Sikhism",
    icon: "🙏",
    instruction:
      "Sit in a clean, quiet place. Focus your mind on the Naam (Divine Name). Chant Waheguru with love and devotion, feeling the name dissolve the ego. Carry this awareness into every action throughout the day.",
    mantra: "Waheguru",
  },
  {
    name: "Christianity",
    icon: "✝️",
    instruction:
      "Find a quiet place and sit in stillness. Begin with the Lord's Prayer. Practice contemplative prayer — resting in God's presence without words. The Desert Fathers taught: 'Be still and know that I am God.' Let silence become your prayer.",
    mantra: "Maranatha (Come, Lord)",
  },
  {
    name: "Judaism",
    icon: "✡️",
    instruction:
      "Sit quietly and focus on the Shema — 'Hear, O Israel, the Lord our God, the Lord is One.' Practice Hitbonenut — deep contemplation on a verse of Torah. The tradition of Jewish meditation (Kabbalah) teaches focusing on the letters of God's Name.",
    mantra: "Shema Yisrael",
  },
];

export default function MeditatePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-widest text-gold bg-gold/10 rounded-full border border-gold/20">
          Inner Practice
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-4 tracking-tight">
          Meditate
        </h1>
        <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
          Every tradition teaches the art of inner stillness. Sit. Breathe. Be
          present. The Divine is not far — it dwells in the silence between
          thoughts.
        </p>
      </div>

      {/* Breathing Timer */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl text-charcoal mb-2">
            Breathing Exercise
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            A simple 4-4-4 rhythm to calm the mind and prepare for meditation.
            Follow the circle as it expands and contracts.
          </p>
        </div>

        <div className="bg-paper border border-charcoal/8 rounded-2xl py-12 px-6 max-w-md mx-auto">
          <BreathingTimer />
        </div>
      </section>

      {/* Meditation Instructions by Tradition */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl text-charcoal mb-2">
            Meditation by Tradition
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            Every path leads inward. Explore meditation practices from the
            world&apos;s great spiritual traditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TRADITIONS.map((t) => (
            <div
              key={t.name}
              className="bg-paper border border-charcoal/8 rounded-xl p-5 hover:border-gold/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{t.icon}</span>
                <h3 className="font-serif text-lg text-charcoal">{t.name}</h3>
              </div>
              <p className="text-sm text-ink leading-relaxed mb-4">
                {t.instruction}
              </p>
              <div className="border-t border-charcoal/5 pt-3">
                <p className="text-xs text-muted/70 uppercase tracking-wider mb-1">
                  Mantra
                </p>
                <p className="text-sm text-gold italic">{t.mantra}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mantra Suggestions */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl text-charcoal mb-2">
            Mantra Suggestions
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            A mantra is a sacred sound or phrase repeated during meditation. It
            focuses the mind and opens the heart to the Divine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { text: "Om (AUM)", origin: "Hinduism", meaning: "The primordial sound of creation" },
            { text: "Om Mani Padme Hum", origin: "Buddhism", meaning: "The jewel in the lotus" },
            { text: "Waheguru", origin: "Sikhism", meaning: "Wonderful Teacher / Wonderful God" },
            { text: "Allahu Akbar", origin: "Islam", meaning: "God is the Greatest" },
            { text: "Maranatha", origin: "Christianity", meaning: "\"Come, Lord\" — Aramaic" },
            { text: "Shalom", origin: "Judaism", meaning: "Peace — completeness and wholeness" },
          ].map((m) => (
            <div
              key={m.text}
              className="bg-paper border border-charcoal/8 rounded-xl p-4 text-center hover:border-gold/30 transition-all"
            >
              <p className="font-serif text-base text-charcoal mb-1">
                {m.text}
              </p>
              <p className="text-xs text-gold/70 mb-2">{m.origin}</p>
              <p className="text-xs text-muted italic">{m.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom note */}
      <div className="text-center py-8 border-t border-gold/10">
        <p className="text-sm text-muted/60 max-w-lg mx-auto">
          Meditation is a practice, not a destination. Start with five minutes
          daily. The journey of a thousand miles begins with a single breath.
        </p>
      </div>
    </div>
  );
}
