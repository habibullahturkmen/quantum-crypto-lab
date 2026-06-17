import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, '../client/dist');
const isProd = process.env.NODE_ENV === 'production';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ── Step 1: RSA Encrypt ──────────────────────────────────────────
app.post('/api/rsa/encrypt', (req, res) => {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicExponent: 0x10001,
    });

    const ciphertext = crypto.publicEncrypt(
        { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
        Buffer.from(message, 'utf8')
    );

    const pubDer = publicKey.export({ type: 'spki', format: 'der' });
    const nBitLength = 2048; // presentation default

    res.json({
        algorithm: 'RSA-2048',
        ciphertext: ciphertext.toString('base64'),
        keyBits: nBitLength,
        messagePreview: message,
        note: 'Used in TLS handshakes, VPN certificates, and PKI today.',
    });
});

// ── Step 2: Classical attack estimate ────────────────────────────
app.post('/api/classical-attack', (req, res) => {
    const keyBits = req.body.keyBits || 2048;

    // Educational estimates (not exact GNFS)
    const estimates = {
        512: { years: 1, label: 'months with cluster' },
        1024: { years: 3000, label: 'years' },
        2048: { years: 300_000_000_000, label: 'years' },
        4096: { years: 1e18, label: 'years (practically impossible)' },
    };

    const est = estimates[keyBits] || estimates[2048];

    res.json({
        keyBits,
        algorithm: 'General Number Field Sieve (GNFS)',
        estimatedYears: est.years,
        unit: est.label,
        verdict: 'Classical computers cannot break RSA-2048 at scale in any realistic timeframe.',
        comparison: 'This is why RSA has protected internet traffic for decades.',
    });
});

// ── Step 3: Quantum attack (Shor's — small numbers only) ─────────
function shorsDemo(n) {
    // Educational simulation for semiprimes ≤ 10000
    if (n % 2 === 0) return { n, factors: [2, n / 2], steps: ['Trivial: even number'] };
    if (n < 4) return { n, factors: [n], steps: ['Prime — no factors'] };

    const steps = [
        `Input: N = ${n}`,
        'Initialize quantum register |x⟩|a⟩',
        'Choose random a, compute a^x mod N via quantum modular exponentiation',
        'Apply Quantum Fourier Transform (QFT)',
        'Measure period r from interference pattern',
        'Classical post-processing: gcd(a^(r/2)±1, N)',
    ];

    for (let a = 2; a < n; a++) {
        if (gcd(a, n) !== 1) continue;
        let r = 1, val = a % n;
        while (val !== 1 && r < n) {
            val = (val * a) % n;
            r++;
        }
        if (r % 2 === 0) {
            const x = modPow(a, r / 2, n);
            const f1 = gcd(x - 1, n);
            const f2 = gcd(x + 1, n);
            if (f1 > 1 && f2 > 1 && f1 * f2 === n) {
                steps.push(`Period r = ${r} found for a = ${a}`);
                steps.push(`Factors: ${f1} × ${f2} = ${n}`);
                return { n, factors: [f1, f2], steps, timeSeconds: 2.4 };
            }
        }
    }
    return { n, factors: [], steps, error: 'Demo limited to small semiprimes' };
}

function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a; }
function modPow(base, exp, mod) {
    let r = 1; base %= mod;
    while (exp > 0) {
        if (exp & 1) r = (r * base) % mod;
        base = (base * base) % mod;
        exp >>= 1;
    }
    return r;
}

app.post('/api/quantum-attack', (req, res) => {
    const n = req.body.modulus || 15; // classic Shor's demo: 15 = 3×5
    const result = shorsDemo(n);
    res.json({
        algorithm: "Shor's Algorithm",
        modulus: n,
        factors: result.factors,
        steps: result.steps,
        timeSeconds: result.timeSeconds || 1.8,
        verdict: n <= 10000
            ? `Quantum computer factors N=${n} in seconds — RSA security collapses at scale.`
            : 'Real RSA-2048 requires millions of stable qubits — not yet feasible, but the threat is real.',
        realWorldNote: 'Google (2024) and Cloudflare have already tested ML-KEM (Kyber) in production TLS.',
    });
});

// ── Step 4: PQC (Kyber / ML-KEM-768) ───────────────────────────
app.post('/api/pqc/encrypt', (req, res) => {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

    const seed = crypto.randomBytes(64);
    const { publicKey, secretKey } = ml_kem768.keygen(seed);
    const { cipherText, sharedSecret: encSecret } = ml_kem768.encapsulate(publicKey);

    // Derive AES key from shared secret, encrypt message
    const aesKey = crypto.createHash('sha256').update(encSecret).digest();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
    const encrypted = Buffer.concat([cipher.update(message, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    res.json({
        algorithm: 'ML-KEM-768 (CRYSTALS-Kyber) + AES-256-GCM',
        ciphertext: encrypted.toString('base64'),
        kemCiphertext: Buffer.from(cipherText).toString('base64'),
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
        quantumResistant: true,
        nistStatus: 'NIST FIPS 203 (standardized 2024)',
        note: 'Lattice-based — believed secure against both classical and quantum attacks.',
    });
});

// ── Step 5: TLS / PKI context ───────────────────────────────────
app.get('/api/tls-impact', (_req, res) => {
    res.json({
        title: 'Why This Matters for TLS, PKI & Enterprise Security',
        items: [
            {
                org: 'Google',
                event: '2024 — First production TLS connection using post-quantum hybrid key exchange (X25519 + ML-KEM-768)',
            },
            {
                org: 'Cloudflare',
                event: 'PQC available for all customers — hybrid TLS 1.3 with Kyber',
            },
            {
                org: 'NSA CNSA 2.0',
                event: 'Mandates PQC migration: NSS by 2025, full transition timelines through 2033',
            },
            {
                org: 'Harvest Now, Decrypt Later',
                event: 'Adversaries store encrypted traffic today to decrypt once quantum computers mature',
            },
        ],
        recommendation: 'Organizations should inventory cryptographic assets and begin PQC migration planning now.',
    });
});

if (isProd) {
    app.use(express.static(clientDist));
    app.get(/^(?!\/api).*/, (_req, res) => {
        res.sendFile(path.join(clientDist, 'index.html'));
    });
}

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${isProd ? ' (production)' : ''}`);
});