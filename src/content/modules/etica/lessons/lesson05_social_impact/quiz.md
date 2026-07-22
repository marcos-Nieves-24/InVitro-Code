# Quiz: Social Impact of AI

## Multiple Choice (5 questions)

**Q1.** According to the lesson, which type of employment has the highest automation risk?

A. Creative professions (artists, writers)
B. Social/emotional work (therapists, nurses)
C. Routine cognitive tasks (data entry, bookkeeping)
D. Technical expertise (software engineering, scientific research)

**Q2.** The estimated CO2 emissions from training GPT-3 were approximately:

A. 1.4 tons (equivalent to one round-trip flight)
B. 100 tons (equivalent to several homes' annual energy use)
C. 500 tons (equivalent to 5 cars driven for a year)
D. 5000 tons (equivalent to a small power plant)

**Q3.** In AI safety, "specification gaming" refers to:

A. AI systems that play games better than humans
B. AI systems that exploit loopholes in their objective function to achieve high reward without actually solving the intended problem
C. Designing specifications for AI training runs
D. AI systems that refuse to follow instructions

**Q4.** Which of the following is NOT a component of the environmental impact of AI?

A. Hardware manufacturing (GPUs, TPUs)
B. Training energy consumption
C. Inference energy consumption (each prediction)
D. Data labeling labor costs

**Q5.** The debate between the "displacement view" and the "replacement-and-creation view" concerns:

A. Whether AI will replace all human workers or only some
B. Whether AI will cause net job loss or create new jobs to replace automated ones
C. Whether AI will displace workers in developed or developing countries
D. Whether AI automation is inevitable or preventable

## Short Answer (2 questions)

**Q6.** Explain the concept of "alignment" in AI safety. Give a concrete example of a misaligned AI system.

**Q7.** How does AI contribute to the spread of misinformation? Describe at least two distinct mechanisms and propose one mitigation strategy for each.

## Coding Question (1 question)

**Q8.** (Conceptual — no coding) You are advising a government agency on AI regulation. Write a brief (150 words) explaining which social impact of AI you consider most urgent and why, and propose one specific policy intervention.

---

## Answer Key

**Q1.** C — Routine cognitive tasks have the highest automation risk because they are predictable and rule-based.

**Q2.** C — Approximately 500 tons of CO2, equivalent to 5 cars driven for a year.

**Q3.** B — Specification gaming occurs when AI systems find unexpected ways to maximize their reward function that do not correspond to the intended behavior.

**Q4.** D — Data labeling labor costs are not an environmental impact (though they have social/ethical dimensions).

**Q5.** B — The debate between whether AI will cause net job displacement or create enough new jobs to offset losses.

**Q6.** Alignment is the challenge of ensuring AI systems pursue goals that are consistent with human values. Example: A cleaning robot trained to "maximize cleanliness" might hide dirt under the rug (achieving high cleanliness scores by a narrow metric) rather than actually cleaning. Another example: A content moderation AI trained to minimize "toxic content" might over-censor legitimate political speech from minority groups.

**Q7.** Two mechanisms: (1) Generative AI (LLMs, deepfakes) can create convincing false content at scale, overwhelming fact-checking capacity. Mitigation: content provenance standards (C2PA watermarking). (2) Recommendation algorithms amplify engaging but false content because it generates more clicks. Mitigation: platform design changes that deprioritize engagement-based ranking in favor of accuracy-based ranking.

**Q8.** (Sample response) The most urgent social impact is the spread of AI-generated misinformation, because it threatens democratic institutions and public health. Unlike employment effects (which play out over decades) or environmental costs (which can be mitigated with renewable energy), misinformation can alter election outcomes and erode trust in institutions within days. I propose a mandatory content provenance requirement: any AI-generated content exceeding a certain public reach must include cryptographic provenance metadata identifying its origin. This is analogous to nutritional labels on food — it does not prevent creation of AI content but makes its nature transparent to consumers and platforms.
