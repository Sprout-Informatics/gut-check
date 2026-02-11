# Purpose

Workshop Concept: "The Microbiome Game — Why More Antibiotics Can Make Things Worse"

## The Core Scientific Story (in simulation terms)

The simulation models a simplified gut ecosystem as a population dynamics problem. You'd track three populations over time: commensal bacteria (the "good guys"), C. difficile (opportunistic pathogen), and optionally a representation of overall gut diversity. The key dynamics are:

### Phase 1 — Healthy Baseline

The gut starts with high commensal diversity and abundance. C. diff spores may be present at low levels but are suppressed through competitive exclusion. Students see a balanced ecosystem.

### Phase 2 — Antibiotic Disruption

The student (or the simulation) administers antibiotics for a legitimate reason — UTI, respiratory infection, whatever. The antibiotics are non-selective: they wipe out commensals and C. diff vegetative cells alike, but C. diff spores survive. As commensals collapse, the competitive landscape opens up. Students watch the commensal population crash.

### Phase 3 — The C. diff Bloom

With the niche now vacant, C. diff spores germinate and expand rapidly. A fraction of simulated patients develop symptomatic CDI (diarrhea, inflammation — you can represent this as a "health score" declining). This is where the students face their first decision point.

### Phase 4 — The Antibiotic Trap

The intuitive move is to treat with antibiotics again (vancomycin or fidaxomicin). And it works — temporarily. C. diff vegetative cells die back, symptoms improve. But the antibiotics also suppress the already-weakened commensal recovery, so when the antibiotic course ends, the same void exists. C. diff comes roaring back. Students can try this cycle multiple times and watch the recurrence pattern emerge. This is the critical "aha" moment: the standard treatment perpetuates the root cause.

### Phase 5 — The Microbiome Therapeutic

Students now have access to the SER-109-like intervention: a bolus of commensal spores delivered to the gut. Instead of killing C. diff directly, it repopulates the niche. Commensals reestablish competitive exclusion, C. diff gets crowded out, and the ecosystem stabilizes. Students see durable resolution without recurrence.

## How the Interactivity Works

I'd structure the app around a patient dashboard where each student manages one or more simulated patients. At each decision point, they choose an intervention and then advance the simulation forward in time (maybe in weekly increments). Key interactive elements:

- **Treatment buttons**: "Give Antibiotics," "Give Microbiome Therapy," "Wait and Monitor"
- **Sliders or settings** for things like antibiotic intensity or commensal dose, so they can experiment with parameters
- **A live chart** showing population dynamics (stacked area or line chart of commensals vs. C. diff over time) — this is the centerpiece visual
- **A patient health score** that maps to the bacterial populations (high C. diff toxin production → declining health)
- **A recurrence counter** so they can see how many times their patient has relapsed

You could gamify it lightly: students try to get their patient to "durable cure" (no recurrence for X simulated weeks) in the fewest interventions, or with the best health score over time.