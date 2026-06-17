# Quantum vs Classical Crypto Lab

An interactive demo that walks you through how everyday internet encryption works, why quantum computers are a threat to it, and what the security industry is doing about it.

No background in quantum computing required — start at Step 1 and follow along.

---

## The big picture (in plain English)

When you visit a website over **HTTPS**, your browser and the server agree on a secret key so nobody in the middle can read your traffic. That protection depends on **math problems that are very hard to solve** with normal computers.

**RSA** is one of the most famous systems used for this. Its security rests on a simple idea: multiplying two large prime numbers is easy, but **figuring out those primes back from the product** is extremely hard.

A **quantum computer** is a different kind of machine. It does not just run programs faster — it can attack certain math problems in fundamentally new ways. In 1994, Peter Shor showed that a large enough quantum computer could break RSA by factoring those large numbers efficiently.

That does **not** mean the internet is broken today. Useful quantum computers large enough to crack RSA-2048 do not exist yet. But the risk is real enough that governments and tech companies are already moving to **post-quantum cryptography (PQC)** — new algorithms designed to stay secure even if quantum computers arrive.

This lab lets you try each piece of that story hands-on.

**Presenting?** See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for a ~5-minute live demo script aligned with the Cyber Experts slides.

---

## What each step does

Click any card at the top of the app to jump to that step, or use the **Next** / **Back** buttons inside each step.

### Step 1 — RSA Encrypt (Classical cryptography today)

**What you do:** Type a message and encrypt it with RSA-2048.

**What is happening:** RSA creates a pair of keys — one public, one private. Anyone can encrypt with the public key, but only the holder of the private key can decrypt. The demo runs real RSA encryption on the server and shows you the scrambled output (ciphertext).

**Why it matters:** RSA (and similar systems) have protected email, VPNs, banking, and the TLS padlock in your browser for decades. This is the baseline — the encryption we rely on today.

**Key idea:** Your message becomes unreadable gibberish unless you have the right private key.

---

### Step 2 — Classical Attack (GNFS)

**What you do:** Run an estimate of how long it would take a normal (classical) computer to break RSA.

**What is happening:** The demo uses the **General Number Field Sieve (GNFS)** — the best known classical method for factoring large numbers — to estimate attack time for RSA-2048. The number you see is not exact science; it is an educational illustration of scale. For RSA-2048, the answer is on the order of **hundreds of billions of years** with today's technology.

**Why it matters:** This is why RSA has felt safe. No nation, company, or supercomputer can realistically brute-force it with classical methods.

**Key idea:** Classical computers are too slow to break modern RSA. You are safe — *from classical attacks*.

---

### Step 3 — Quantum Attack (Shor's algorithm)

**What you do:** Pick a small number (like 15 = 3 × 5) and run a simulated version of **Shor's algorithm**.

**What is happening:** Shor's algorithm is a quantum method for factoring numbers. On a real quantum computer, it could break RSA by finding the prime factors of the key's modulus. This demo only works on **tiny numbers** (15, 21, 35, 77) because simulating quantum behavior on a normal laptop is limited. Breaking real RSA-2048 would need millions of stable qubits — hardware that does not exist at scale yet.

The step animates the high-level stages: quantum register setup, modular exponentiation, the Quantum Fourier Transform, measuring a period, then classical math (gcd) to recover the factors.

**Why it matters:** This is the theoretical threat. If large quantum computers become practical, RSA and similar systems could fail.

**Key idea:** Quantum computers attack the *same math* RSA depends on, but in a completely different way — and much faster *in theory*.

---

### Step 4 — Post-Quantum Cryptography (Kyber / ML-KEM-768)

**What you do:** Encrypt the same message again, this time using **ML-KEM-768** (CRYSTALS-Kyber).

**What is happening:** Kyber is a **post-quantum** key-encapsulation mechanism. Instead of relying on factoring, it uses **lattice math** — problems believed to be hard for both classical and quantum computers. The demo generates Kyber keys, encapsulates a shared secret, then encrypts your message with AES-256-GCM (a standard symmetric cipher).

**Why it matters:** NIST standardized ML-KEM in 2024 (FIPS 203). This is the kind of algorithm organizations are adopting to stay ahead of the quantum threat.

**Key idea:** PQC is not "quantum encryption." It is **classical algorithms designed to resist quantum attacks**.

---

### Step 5 — TLS, PKI & Enterprise Impact

**What you do:** Read structured sections on case studies, migration, risks, and defenses.

**What is happening:** This step loads four subsections aligned with the presentation slides: **Case Studies** (Google, Cloudflare, NSA CNSA 2.0), **Enterprise Migration Challenges**, **Security Challenges & Limitations**, and **Defensive Strategies & Best Practices**.

**Why it matters:** Encryption protects data in transit *now*, but secrets intercepted today could be decrypted in the future. Migration planning has already started.

**Key idea:** This is an industry-wide transition, not a future science project.

When you finish, click **Start over from Step 1** to run through the demo again.

---

## Glossary

| Term | Simple meaning |
|------|----------------|
| **Cryptography** | Scrambling information so only authorized parties can read it |
| **RSA** | A public-key system based on the difficulty of factoring large numbers |
| **Factoring** | Splitting a number into its prime building blocks (e.g. 15 → 3 and 5) |
| **Classical computer** | Normal computers — laptops, servers, phones |
| **Quantum computer** | A machine that uses quantum physics (superposition, interference) to compute |
| **Qubit** | The quantum version of a bit; the basic unit of quantum information |
| **Shor's algorithm** | A quantum algorithm that threatens RSA by factoring efficiently |
| **PQC** | Post-quantum cryptography — algorithms safe against quantum attacks |
| **Kyber / ML-KEM** | A NIST-standardized PQC key-exchange algorithm |
| **TLS** | The protocol behind HTTPS — the padlock in your browser |
| **PKI** | Public Key Infrastructure — the certificate system that backs TLS |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express |
| Classical crypto | Node.js `crypto` (RSA-2048, AES-256-GCM) |
| Post-quantum crypto | [@noble/post-quantum](https://github.com/paulmillr/noble-post-quantum) (ML-KEM-768) |
| Package manager | pnpm (monorepo: `client` + `server`) |

---

## Getting started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/installation) 11+

### Install

```bash
pnpm install
```

### Development

Runs the API on port **3001** and the Vite dev server on port **5173** (with API proxy):

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production (local)

```bash
pnpm build
NODE_ENV=production PORT=3000 pnpm start
```

Open [http://localhost:3000](http://localhost:3000). The server serves the built React app and all `/api/*` routes on one port.

---

## Deployment (Coolify / Docker)

The included `Dockerfile` builds the client and runs a single Node process that serves both the UI and API.

| Setting | Value |
|---------|--------|
| Build | `pnpm build` (handled in Dockerfile) |
| Start | `node server/index.js` |
| Port | `3000` (or whatever Coolify sets via `PORT`) |
| Health check | `GET /api/health` |
| Environment | `NODE_ENV=production` |

Coolify should auto-detect the Dockerfile. If using a build pack instead:

- **Install:** `pnpm install --frozen-lockfile`
- **Build:** `pnpm build`
- **Start:** `node server/index.js`

---

## Project structure

```
quantum-crypto-lab/
├── client/          # React frontend (5 interactive steps)
├── server/          # Express API (RSA, GNFS estimates, Shor demo, Kyber, TLS info)
├── Dockerfile       # Production image for Coolify
├── pnpm-workspace.yaml
└── package.json     # Root scripts (dev, build, start)
```

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/rsa/encrypt` | RSA-2048 encrypt a message |
| `POST` | `/api/classical-attack` | GNFS time estimate for a key size |
| `POST` | `/api/quantum-attack` | Shor's algorithm demo (small N only) |
| `POST` | `/api/pqc/encrypt` | ML-KEM-768 + AES-256-GCM encrypt |
| `GET` | `/api/tls-impact` | Real-world PQC migration context |

---

## Educational disclaimer

This project is for **learning and demonstration**. The classical attack times are rough estimates, the Shor demo only factors small semiprimes, and no real RSA-2048 keys are broken here. For production security decisions, follow current NIST, NSA, and vendor guidance.
