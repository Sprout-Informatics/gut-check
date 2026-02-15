interface LandingPageProps {
  onStart: () => void
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-gray-950 to-emerald-950/30" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-red-400 mb-4">
            An Interactive Microbiome Simulation
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-white">GUT</span>{' '}
            <span className="text-emerald-400">CHECK</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Why more antibiotics can make things worse &mdash; and how a
            radical idea changed everything.
          </p>
        </div>
      </header>

      {/* The Problem */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-6 text-lg leading-relaxed text-gray-300">
          <h2 className="text-3xl font-bold text-white mb-8">
            A Silent Epidemic
          </h2>
          <p>
            Every year, <em>Clostridioides difficile</em> infects nearly{' '}
            <strong className="text-white">500,000 Americans</strong> and kills roughly{' '}
            <strong className="text-white">30,000</strong>. It is the most common
            healthcare-associated infection in the United States. But the most
            alarming part isn't the first infection &mdash; it's what comes after.
          </p>
          <p>
            The standard treatment is straightforward: prescribe antibiotics to
            kill the pathogen. And it works &mdash; at first. Symptoms resolve.
            The patient goes home. Then, weeks later, the infection comes roaring
            back.
          </p>
          <p>
            Up to <strong className="text-white">35% of patients</strong> experience
            recurrence after their first episode. For those who recur once, the
            odds of it happening again climb to{' '}
            <strong className="text-white">60%</strong>. Some patients cycle
            through four, five, six rounds of antibiotics, each time hoping
            this course will be the last.
          </p>
          <p>It rarely is.</p>
        </div>
      </section>

      {/* The Trap */}
      <section className="bg-gray-900/60">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            The Antibiotic Trap
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-gray-300">
            <p>
              The human gut is home to trillions of bacteria &mdash; a dense,
              competitive ecosystem where hundreds of species vie for space and
              nutrients. In a healthy gut, this community acts as a living
              barrier: commensal bacteria physically crowd out pathogens like{' '}
              <em>C. difficile</em>, compete for resources, and produce
              antimicrobial compounds including secondary bile acids that
              suppress its growth.
            </p>
            <p>
              Antibiotics shatter this ecosystem. They don't just kill{' '}
              <em>C. difficile</em> &mdash; they kill the beneficial bacteria
              too. And here's the cruel trick:{' '}
              <em>C. difficile</em> produces <strong className="text-white">spores</strong>,
              dormant survival structures that antibiotics cannot touch.
            </p>

            <div className="my-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-3">💊</div>
                <h3 className="font-semibold text-amber-400 mb-2">Antibiotics Kill</h3>
                <p className="text-sm text-gray-400">
                  Both the pathogen <em>and</em> the protective commensal bacteria
                  are wiped out.
                </p>
              </div>
              <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-3">🦠</div>
                <h3 className="font-semibold text-red-400 mb-2">Spores Survive</h3>
                <p className="text-sm text-gray-400">
                  <em>C. difficile</em> spores lie dormant, impervious to
                  antibiotics, waiting.
                </p>
              </div>
              <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-5 text-center">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="font-semibold text-orange-400 mb-2">Recurrence</h3>
                <p className="text-sm text-gray-400">
                  With no competition, spores germinate and the infection
                  returns &mdash; often worse than before.
                </p>
              </div>
            </div>

            <p>
              Each round of antibiotics deepens the damage. The microbiome
              becomes more depleted, the window for <em>C. difficile</em> to
              re-establish grows wider, and the patient enters a vicious cycle
              where the treatment itself perpetuates the disease.
            </p>
          </div>
        </div>
      </section>

      {/* The Breakthrough */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">
          A Different Kind of Medicine
        </h2>
        <div className="space-y-6 text-lg leading-relaxed text-gray-300">
          <p>
            What if the answer wasn't to keep killing the pathogen, but to
            restore the ecosystem that keeps it in check?
          </p>
          <p>
            This was the question that drove{' '}
            <strong className="text-white">Seres Therapeutics</strong>, a
            Cambridge, Massachusetts biotech company founded on a deceptively
            simple insight: the microbiome itself is the medicine. Rather than
            designing a molecule to attack <em>C. difficile</em>, they set out
            to rebuild the bacterial community that naturally suppresses it.
          </p>
          <p>
            Their lead candidate, <strong className="text-white">SER-109</strong>,
            was a defined consortium of purified bacterial spores derived from
            healthy donor stool. Not a fecal transplant &mdash; a manufactured,
            quality-controlled therapeutic delivered as an oral capsule. The
            idea was radical for the pharmaceutical industry: treating a disease
            by restoring an ecology rather than targeting a pathogen.
          </p>

          <div className="my-10 border-l-4 border-emerald-500 bg-emerald-950/30 rounded-r-xl p-6">
            <p className="text-emerald-300 font-semibold mb-2">
              The ECOSPOR III Trial
            </p>
            <p className="text-gray-300">
              In a pivotal Phase 3 trial, SER-109 reduced recurrence of{' '}
              <em>C. difficile</em> infection to{' '}
              <strong className="text-white">12%</strong>, compared to{' '}
              <strong className="text-white">40%</strong> for placebo &mdash; a
              relative risk reduction of 68%. For patients trapped in the
              recurrence cycle, this was transformative.
            </p>
          </div>

          <p>
            In April 2023, the FDA approved SER-109 under the brand name{' '}
            <strong className="text-white">VOWST</strong><sup>&trade;</sup>,
            making it the first FDA-approved oral microbiome therapeutic. It
            marked a milestone not just for <em>C. difficile</em> treatment,
            but for the entire field of microbiome medicine &mdash; proof that
            restoring a damaged ecosystem could succeed where repeated courses
            of antibiotics could not.
          </p>
        </div>
      </section>

      {/* The Simulation */}
      <section className="bg-gray-900/60">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Experience It Yourself
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-gray-300 text-left mb-10">
            <p>
              <strong className="text-white">Gut Check</strong> is an
              interactive simulation that lets you manage a patient with
              recurrent <em>C. difficile</em> infection over 180 days. You'll
              decide when to prescribe antibiotics, when to administer
              microbiome therapy, and when to wait.
            </p>
            <p>
              You'll watch the gut ecosystem in real time &mdash; commensal
              bacteria competing with <em>C. difficile</em>, toxin levels
              rising and falling, patient health hanging in the balance. You'll
              discover firsthand why the instinct to "just give more
              antibiotics" is the very thing that fuels the recurrence cycle.
            </p>
            <p>
              And you'll see how restoring the microbiome &mdash; not
              eliminating the pathogen &mdash; is the key to a durable cure.
            </p>
          </div>

          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg shadow-emerald-900/40 transition-colors cursor-pointer"
          >
            Start the Simulation
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-6 py-10 text-center text-sm text-gray-600">
        <p>
          Gut Check is an educational simulation. It is not medical advice.
          Clinical decisions should always be made with a healthcare provider.
        </p>
      </footer>
    </div>
  )
}
