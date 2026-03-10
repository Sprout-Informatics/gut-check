# When Bugs Go Bad: How Antibiotics Can Pave the Way for Opportunistic Bacteria and Deadly Infections

This is an interactive simulation that teaches you why *Clostridioides difficile (C. diff)* infections keep coming back — and why the solution isn't more antibiotics.

## What is this?

Spore Wars is a browser-based simulation where you manage a patient's gut microbiome. You'll make treatment decisions — antibiotics, microbiome therapy, or watchful waiting — and see how those choices play out in real time through population dynamics charts and a patient health score.

The goal: achieve a **durable cure** without killing your patient or trapping them in an endless cycle of *C. difficile* recurrence.

## The biology

Your gut is home to trillions of bacteria, collectively called the **microbiome**. Most of these are considered **commensals**, meaning they exist in a symbiotic relationship with their host (us). They compete for space and nutrients within your gut, helping you digest, modulating your immune system, and keep dangerous organisms in check in various ways.

*C. difficile* is a species of bacteria and an opportunistic pathogen. Some strains of *C. difficile* can produce a toxin which causes infection. In a healthy gut, commensal bacteria suppress C. diff through competitive exclusion — there's simply no room for it to grow.

However, when **antibiotics** wipe out the commensals, an ecological niche opens up. *C. difficile* **spores** (like eggs--a dormant form of bacteria) germinate, the **vegetative** ("awakened") cells multiply rapidly, and toxins produced by pathogenic strains of *C. difficile* damage the intestinal lining, causing severe diarrhea, inflammation, and in serious cases, death.

## A vicious cycle

The standard treatment for a *C. difficile* infection is *more antibiotics*: The antibiotics kill the active *C. difficile* and the patient feels better. But the antibiotics also wipe out the recovering commensals, leaving the gut empty again. *C. difficile* spores, which are resistant to antibiotics, survive. When the course of antibiotics ends, the spores germinate into that empty niche and the infection returns.

Up to 35% of patients who get a first *C. difficile* infection will have a recurrence, and after a first recurrence, the risk of further recurrences rises to 60%.

## Treating the problem at its source

If antibiotics can't break the cycle, what can? Since *C. difficile* infection is caused by a **dysbiosis** (imbalance) in the gut, the answer is to restore a healthy ecosystem.

**Microbiome therapeutics** like [Vowst](https://www.fda.gov/vaccines-blood-biologics/vowst) (developed by [Seres Therapeutics](https://www.serestherapeutics.com/)) take a fundamentally different approach. Instead of killing *C. difficile* directly, they deliver a consortium of commensal bacterial spores to the gut. These spores engraft, multiply, and quickly reestablish a complex, healthy gut ecosystem, preventing *C. difficile* from proliferating.

In the simulation, you'll see this play out: after administering the microbiome therapeutic, commensal bacteria bloom and fill the gut niche within 1–2 weeks, driving *C. difficile* abundance and toxin levels down.

## How to play

1. **Observe** your patient's healthy gut at baseline — commensals are high, C. diff is suppressed
2. **Disrupt** the microbiome with antibiotics (simulating treatment for another infection) and watch what happens
3. **Decide** how to respond to the C. diff bloom: more antibiotics, microbiome therapy, or wait?
4. **Learn** from the outcomes — can you achieve a durable cure?

### Dashboard layout

The patient dashboard is organized into four main areas:

**Patient Status Row**
- **Patient Health bar** — color-coded health score (green → red) with a C. diff episode counter tracking how many times the infection has rebounded
- **Day counter** — the current simulation day, out of a maximum of 200

**Charts and Right Panel**
- **Population Dynamics chart** (left, two-thirds width) — stacked area chart showing commensal bacteria (green) and C. diff (red) competing for the gut niche (0–100 scale). The gap between their combined total and 100 represents depleted, unoccupied niche space.
- **Patient Health & Toxin chart** (left, lower) — health score (purple) and C. diff toxin level (orange, dashed). Toxin trails the C. diff bloom — it builds up as C. diff grows and decays as C. diff is cleared. If health hits zero, the patient dies.
- **Right panel** (one-third width, stacked top to bottom):
  - **Treatment Decisions** — buttons to administer interventions
  - **Time Controls** — buttons to advance the simulation
  - **Gut Sample — DNA Sequencing** — microbiome sampling panel

**Event Log** — a scrollable log of notable events (antibiotic courses, therapy doses, C. diff episodes, outcomes) as they occur during the simulation.

**Advanced Settings** — collapsible parameter sliders for educators who want to adjust simulation parameters such as antibiotic kill rates and C. diff virulence.

### Controls

**Treatment Decisions**
- **Give Antibiotics** — Kills bacteria broadly (commensals and C. diff alike). C. diff spores survive.
- **Give Microbiome Therapy** — Delivers a consortium of commensal and therapeutic spores that restore competitive exclusion.

**Time Controls** (below Treatment Decisions)
- **+1 Day** — Advance the simulation by a single day.
- **+1 Week** — Advance by seven days at once.
- **Auto-play** — Run the simulation forward automatically until you stop it or an outcome is reached.

### Microbiome Sampling and Sequence Generation

The **Gut Sample — DNA Sequencing** panel simulates taking a stool sample and sequencing the 16S rRNA gene to identify which bacteria are present.

**How it works:**
1. Click **Take Sample** at any point in the simulation.
2. The simulator draws **10 sequences** from the current gut community, weighted by bacterial abundance — more abundant species appear more often across the 10 sequences.
3. Each sequence is a real, full-length (~1,400 bp) 16S rRNA sequence from a type strain, sourced from the [RDP (Ribosomal Database Project)](https://rdp.cme.msu.edu/).
4. After administering microbiome therapy, therapeutic bacteria rapidly dominate subsequent samples, reflecting their bloom in the gut.

**BLAST workflow for students:**
1. Copy one or more FASTA sequences from the panel (individual "Copy" buttons, or "Copy All").
2. Go to [NCBI BLAST (blastn)](https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?PROGRAM=blastn&PAGE_TYPE=BlastSearch&LINK_LOC=blasthome).
3. Paste the sequence and click **BLAST**.
4. Examine the top hits — what organism does this sequence match?
5. Use the reference list below to determine whether the species is a host commensal, a microbiome therapeutic bacterium, or *C. diff*.

**Educator note:** A **"Reveal answers (educators only)"** toggle beneath the sequence list shows the identity and category of each sequence in the current sample, for classroom verification.

### Outcomes

- **Durable Cure** — C. diff stays suppressed and commensals recover. You win.
- **Patient Death** — Health reached zero from toxin damage. Act faster next time.
- **Chronic Infection** — The simulation timed out (200 days) with C. diff still active. Rethink your strategy.

---

## Bacterial species reference

Use this list when interpreting BLAST results. All sequences in the simulation are drawn from the species listed here.

**Host commensal bacteria**

- *Akkermansia muciniphila*
- *Bacteroides fragilis*
- *Bifidobacterium longum*
- *Blautia obeum*
- *Coprococcus eutactus*
- *Dorea formicigenerans*
- *Enterococcus faecalis*
- *Eubacterium rectale*
- *Faecalibacterium prausnitzii*
- *Lactobacillus acidophilus*
- *Prevotella copri*
- *Roseburia intestinalis*
- *Ruminococcus gnavus*

**Microbiome therapeutic bacteria**

- *Blautia hydrogenotrophica*
- *Clostridium hiranonis*
- *Clostridium scindens*

**Pathogenic bacteria**

- *Clostridioides difficile*

---

## Running locally

This simulation can be run locally. To do that, clone the repo to your local machine and run `npm`. If you don't have `npm` installed, install it:

```bash
npm install
```

Clone and run the app:

```bash
git clone https://github.com/Sprout-Informatics/spore-wars.git
cd spore-wars
npm run dev
```

## Key takeaways

1. **Antibiotics are a double-edged sword.** They treat infections but destroy the commensal ecosystem that prevents recurrence.
2. **C. diff exploits an empty niche.** The pathogen isn't unusually virulent — it's opportunistic. It wins when the competition is gone.
3. **Colonization resistance is the real defense.** A diverse, healthy microbiome is what keeps C. diff in check, not the absence of C. diff itself.
4. **Microbiome therapeutics restore the ecosystem.** Rather than killing the pathogen, they repopulate the gut with commensals that outcompete C. diff — breaking the cycle of recurrence.
