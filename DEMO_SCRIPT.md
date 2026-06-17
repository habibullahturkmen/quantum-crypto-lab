# Live Demo Script (~5 minutes)

**Cyber Experts — Quantum Computing vs Modern Cryptography**  
**Live app:** https://quantum.habibullahturkmen.com/  
**GitHub:** https://github.com/habibullahturkmen/quantum-crypto-lab

Use this after your slides. The app is written for a **non-technical audience** — each step has an “In simple terms” box, a plain **Takeaway**, and technical details hidden behind “Technical details.”

---

## Presenting to a non-technical audience

### Golden rules

1. **Use the lock analogy** — encryption is a lock, keys open it, quantum is a new kind of lock-picker.
2. **Read the Takeaway out loud** — it is written for the audience; you do not need to improvise.
3. **Skip “Technical details”** unless someone asks — click to expand only during Q&A.
4. **One idea per step** — do not explain GNFS, lattices, or qubits unless asked.
5. **Reassure them** — “The internet is not broken today. We are preparing for the future.”

### One-sentence story (say this at the start)

> “In five steps we’ll see how your data is locked online today, why normal computers can’t break it, why quantum computers change the story, what the new lock looks like, and who is already upgrading.”

### Analogies cheat sheet

| Term | Say this instead |
|------|------------------|
| RSA / encryption | A digital lock on your data |
| Ciphertext | Scrambled gibberish |
| Factoring | Finding the secret combination |
| Classical computer | A normal laptop or supercomputer |
| Quantum computer | A new type of machine that solves certain puzzles much faster |
| Shor’s algorithm | A quantum method for cracking the lock |
| PQC / Kyber | A new lock designed for the quantum era |
| TLS / HTTPS | The padlock in your browser |
| Harvest now, decrypt later | Spies save locked messages today to open later |

---

## Before you start (30 seconds)

> "We've explained the theory on our slides. Now we'll walk through five simple steps — think of it as a story about a lock on your data. Each step has a plain-English summary on screen. I'll read the takeaway at each step so you don't need to follow the technical parts."

- Open the live URL (or run locally with `pnpm dev`)
- Point at the **story banner** under the title — it tells the audience where they are
- Optional: switch to **dark mode** if the projector works better
- Keep the default message: `Hello, Cyber Experts!`

| Time | Slide topic (already presented) | App step |
|------|----------------------------------|----------|
| 0:00 | Demo intro | Overview |
| 0:30 | Modern Cryptography | Step 1 |
| 1:30 | Classical security / GNFS | Step 2 |
| 2:30 | Quantum threat / Shor's | Step 3 |
| 3:30 | Post-Quantum Cryptography | Step 4 |
| 4:15 | TLS, PKI, enterprise impact | Step 5 |

---

## Step 1 — Lock the Message (~1 min)

**Slides covered:** Technical Background: Modern Cryptography

**What to click:** Step 1 → read **In simple terms** → **Lock this message**

**What to say:**

> "Step 1 is like putting a message in a locked box. Only someone with the right key can read it. That is what happens when you use online banking or see the padlock in your browser."

*Click the button. Read the **Takeaway** on screen.*

> "Your message is now scrambled. That is today's encryption — it works, and we rely on it everywhere."

**Do not** read the base64 ciphertext unless someone asks (expand Technical details).

**Transition:** **Next: Can a normal computer break it? →**

---

## Step 2 — Can a Normal Computer Break It? (~1 min)

**Slides covered:** Why classical computers can't break RSA today

**What to click:** **See how long it would take**

**What to say:**

> "Could a hacker with the world's fastest normal computers guess the combination? Let's see."

*Let the timer run. Read the **Takeaway**.*

> "That number of years is longer than anything we can imagine. Normal computers are not the threat."

**Transition:** **Next: What about quantum? →**

---

## Step 3 — The Quantum Threat (~1 min)

**Slides covered:** Why Quantum Computing Threatens RSA and ECC

**What to click:** Leave **15** selected → **Crack the toy lock**

**What to say:**

> "A quantum computer is a different kind of machine. We can't crack a real website lock on this screen, but we can crack a tiny toy example — the number 15, which is 3 times 5."

*Let the animation play. Read the **Takeaway**.*

> "It found the answer almost instantly. Real locks on the internet are much bigger and still safe today — but this shows why experts are not waiting around."

**Transition:** **Next: The new lock →**

---

## Step 4 — The New Lock (~45 sec)

**Slides covered:** Post-Quantum Cryptography (PQC)

**What to click:** **Lock with the new method (Kyber)**

**What to say:**

> "Same message — but now we use a lock built for the quantum future. Governments standardized this in 2024."

*Read the **Takeaway**.*

> "This is what companies are testing right now for the padlock in your browser."

**Transition:** **Next: Who is upgrading? →**

---

## Step 5 — The Real World (~45 sec)

**Slides covered:** Case studies, migration, limitations, defenses

**What to say:**

> "This is already happening in the real world."

*Scroll slowly. Name three names — no need to read every bullet:*

> "Google tested this in real website traffic. Cloudflare offers it to customers. The NSA has set deadlines for government systems. Some attackers are even saving encrypted data today hoping to unlock it years from now."

*Read the final recommendation line.*

**Close:**

> "The internet is safe today, but the upgrade has started. That was our five-step story."

**Optional:** **Watch the story again from Step 1 →**

---

## Handoff to Q&A (~15 sec)

> "That was our live demo. The code is open on GitHub, and the app is deployed at quantum.habibullahturkmen.com. Happy to take questions."

**Likely questions — quick answers:**

| Question | Short answer |
|----------|----------------|
| Is the internet broken today? | No. No quantum computer can break RSA-2048 at scale yet. |
| Why demo 15 and not RSA-2048? | Shor on real RSA needs hardware we don't have; 15 is the standard teaching example. |
| What about ECC? | Also broken by Shor's (discrete log). We note it in Steps 1 and 3. |
| Is Kyber deployed? | Yes — hybrid TLS trials at Google, Cloudflare; NIST FIPS 203 (2024). |
| What should enterprises do? | Crypto inventory, hybrid PQC TLS, follow NIST/NSA timelines. |

---

## Presenter tips

- **One presenter drives the demo**; another narrates or handles Q&A notes.
- **Don't rush Step 2's timer** — the growing number is the visual punchline.
- **Don't skip Step 5** — it connects the demo back to your slides and the rubric.
- If the network fails, mention the GitHub repo and run `pnpm dev` locally as backup.
