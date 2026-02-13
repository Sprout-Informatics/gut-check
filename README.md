# Gut Check: The Microbiome Game

An interactive simulation that teaches you why *Clostridioides difficile* (C. diff) infections keep coming back — and why the solution isn't more antibiotics.

## What is this?

Gut Check is a browser-based simulation where you manage a patient's gut microbiome. You'll make treatment decisions — antibiotics, microbiome therapy, or watchful waiting — and see how those choices play out in real time through population dynamics charts and a patient health score.

The goal: achieve a **durable cure** without killing your patient or trapping them in an endless cycle of recurrence.

## The biology

Your gut is home to trillions of bacteria, collectively called the **microbiome**. Most of these are **commensal bacteria** — they're not just harmless passengers, they actively protect you. They compete for space and nutrients, produce antimicrobial compounds, and generate secondary bile acids that keep dangerous organisms in check. This is called **colonization resistance**.

**C. difficile** is an opportunistic pathogen that lurks in the gut as dormant **spores**. In a healthy gut, commensal bacteria suppress C. diff through competitive exclusion — there's simply no room for it to grow. But when antibiotics wipe out the commensals, the ecological niche opens up. C. diff spores germinate, the vegetative cells multiply rapidly, and they produce **toxins** that damage the intestinal lining, causing severe diarrhea, inflammation, and in serious cases, death.

## The problem with antibiotics

Here's the paradox that this simulation demonstrates: the standard treatment for a C. diff infection is *more antibiotics* (vancomycin or fidaxomicin). And it works — temporarily. The antibiotics kill the active C. diff cells and the patient feels better. But they also wipe out the recovering commensals, leaving the gut empty again. C. diff spores, which are resistant to antibiotics, survive. When the antibiotic course ends, the spores germinate into that empty niche and the infection comes roaring back.

This is the **antibiotic trap**: each course of antibiotics treats the symptoms but perpetuates the root cause. Up to 35% of patients who get a first C. diff infection will have a recurrence, and after a first recurrence, the risk of further recurrences rises to 60%.

## The therapeutic gap

If antibiotics can't break the cycle, what can? The answer is to restore the ecosystem itself. **Microbiome therapeutics** like [Vowst (fecal microbiota spores, live — SER-109)](https://www.fda.gov/vaccines-blood-biologics/vowst) take a fundamentally different approach. Instead of killing C. diff directly, they deliver a consortium of commensal bacterial spores to the gut. These spores engraft, multiply, and reestablish competitive exclusion — crowding C. diff out of its niche and restoring colonization resistance.

In the simulation, you'll see this play out: after administering the microbiome therapeutic, commensal bacteria bloom and fill the gut niche within 1–2 weeks, driving C. diff abundance and toxin levels down to zero.

## How to play

1. **Observe** your patient's healthy gut at baseline — commensals are high, C. diff is suppressed
2. **Disrupt** the microbiome with antibiotics (simulating treatment for another infection) and watch what happens
3. **Decide** how to respond to the C. diff bloom: more antibiotics, microbiome therapy, or wait?
4. **Learn** from the outcomes — can you achieve a durable cure?

### Controls

- **Give Antibiotics** — Kills bacteria broadly (commensals and C. diff alike). C. diff spores survive.
- **Give Microbiome Therapy** — Delivers commensal spores that restore competitive exclusion.
- **Wait and Monitor** — Advance time without intervention.
- **+1 Day / +1 Week / Auto-play** — Control the pace of the simulation.

### Charts

- **Population Dynamics** (top) — Stacked area chart showing commensal bacteria (green) and C. diff (red) competing for the same gut niche (0–100 scale). The gap between their combined total and 100 represents depleted, unoccupied niche space.
- **Patient Health & Toxin** (bottom) — Health score (purple) and C. diff toxin level (orange, dashed). Toxin trails the C. diff bloom — it builds up as C. diff grows and decays as C. diff is cleared. If health hits zero, the patient dies.

### Outcomes

- **Durable Cure** — C. diff stays suppressed and commensals recover. You win.
- **Patient Death** — Health reached zero from toxin damage. Act faster next time.
- **Chronic Infection** — The simulation timed out with C. diff still active. Rethink your strategy.

## Running locally

```bash
npm install
npm run dev
```

## Key takeaways

1. **Antibiotics are a double-edged sword.** They treat infections but destroy the commensal ecosystem that prevents recurrence.
2. **C. diff exploits an empty niche.** The pathogen isn't unusually virulent — it's opportunistic. It wins when the competition is gone.
3. **Colonization resistance is the real defense.** A diverse, healthy microbiome is what keeps C. diff in check, not the absence of C. diff itself.
4. **Microbiome therapeutics restore the ecosystem.** Rather than killing the pathogen, they repopulate the gut with commensals that outcompete C. diff — breaking the cycle of recurrence.
