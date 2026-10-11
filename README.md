# ABI Mohan Medical — 24/7 Medical Center & Pharmacy

Official web application and 24/7 customer service AI assistant for **ABI Mohan Medical**, located at Mathur village, Virudhachalam, Tamil Nadu.

- **Owned and Managed by:** Vanitha Prakashvel (D.Pharm)
- **Timings:** Open 24 Hours / 7 Days a Week
- **Address:** 20, Main Road Street, Mathur, Virudhachalam, Tamil Nadu 606104
- **Google Plus Code:** `J83M+QJ Mathur`
- **Emergency Phone:** [080566 68839](tel:+918056668839)
- **WhatsApp Order:** [+91 80566 68839](https://wa.me/918056668839)

---

## Features

- **Vitacare Editorial Design**: Modern health-tech visual aesthetics with emerald-tinted dark surfaces, frosted glass navigation, and responsive typography across all screen ratios.
- **Micro-Motion Physics**: Hardware-accelerated fluid scroll motions powered by GSAP and ScrollTrigger.
- **24/7 Tamil AI Assistant**: Interactive customer chatbot powered by NVIDIA NIM serverless AI (`meta/llama-3.2-11b-vision-instruct`).
  - Strict Tamil output contract (accepts questions in English, Tamil, or Tanglish and replies strictly in pure Tamil).
  - Sub-20ms instant fast-path routing for store details, owner credentials, address, and timings.
  - Zero-latency dynamic local fallback if cloud networks disconnect.
- **WhatsApp Prescription Refill**: Direct modal integration to send prescription snapshots and medicine lists to the counter.

---

## Tech Stack

- **Frontend**: Vanilla HTML5, Vanilla CSS3, JavaScript (ES6+), GSAP & ScrollTrigger.
- **Backend / API**:
  - Local: Python `ThreadingHTTPServer` (`server.py`).
  - Production (Vercel): Serverless Function (`api/chat.py`).
- **AI Engine**: NVIDIA NIM Cloud API (`meta/llama-3.2-11b-vision-instruct`).

---

## Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/berlin-22/abi-mohan-medical.git
   cd abi-mohan-medical
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variable:**
   Copy `.env.example` to `.env` and add your NVIDIA API key:
   ```bash
   cp .env.example .env
   # Edit .env and set NVIDIA_API_KEY=your_key
   ```

4. **Start the local server:**
   ```bash
   python server.py
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploy to Vercel

1. Import this repository in [Vercel](https://vercel.com).
2. Add the environment variable:
   - `NVIDIA_API_KEY`: *(Your NVIDIA NIM API key)*
3. Click **Deploy**. Vercel will build the static assets and the `/api/chat` serverless function automatically.
