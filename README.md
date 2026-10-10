# AURA Verify AI · Industrial Multivariate Anomaly Detection & Quality Decision Support

[![React 19](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Azure IoT Edge](https://img.shields.io/badge/Azure-IoT_Edge-0078D4.svg)](https://azure.microsoft.com/)
[![Power BI Ready](https://img.shields.io/badge/Power_BI-Embedded_Analytics-F2C811.svg)](https://powerbi.microsoft.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C.svg)](https://pytorch.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **A production-grade industrial decision support system designed to detect subtle multivariate assembly defects in real-time, bridging the gap between shop-floor operators, quality engineering, and cloud MLOps.**

---

## 📌 Executive Overview & Industrial Problem Statement

Modern manufacturing verification generates vast streams of high-frequency sensor telemetry (e.g., torque transducers, angular encoders, accelerometers, and acoustic emission sensors). 

### The Critical Flaw of Static Limits (Statistical Process Control / 3-Sigma Bands):
Traditional verification benches evaluate parameters in **isolated univariate silos** (e.g., "Is Peak Torque between 390 Nm and 430 Nm? Pass.").

However, severe assembly defects (such as **cross-threading**, **micro-slip**, or **thread galling**) frequently satisfy individual univariate tolerances while exhibiting **anomalous multidimensional correlation breakdowns**:
- A fastener may achieve nominal peak torque (418 Nm), but if the snug-to-yield angle lag exceeds 25° combined with an anomalous vibration RMS spike, the joint is compromised.
- **Univariate SPC passes the defective component**, allowing safety-critical assemblies to escape to customers, resulting in catastrophic warranty recalls.

**AURA Verify AI** solves this by modeling the multidimensional manifold of **normal system behavior ("Golden Cycles")** using unsupervised neural reconstruction (Autoencoders) and isolation trees, achieving **zero defect escapes** while strictly managing the **cost of false line stoppages (Type I errors)**.

---

## 🚀 Key Architectural Pillars

### 1. Dynamic Process Signature Inspection (Torque vs. Angle Curves)
- Real-time visualization of high-frequency tightening curves sampled at **1,000 Hz**.
- Visualizes the **Nominal Tolerance Envelope** (dynamic process window) alongside the **Observed Curve**.
- Pinpoints micro-mechanical phases: Rundown phase, snug point, elastic deformation, and yield gradient according to **ISO 16047** and **VDI/VDE 2862**.

### 2. Unsupervised Anomaly Engine & Decision Threshold Tuning
- **Deep 1D Autoencoder:** Evaluates reconstruction error ($MSE$) against the learned normal distribution manifold.
- **Isolation Forest Ensemble:** Rapid partitioning of multidimensional outliers without requiring labeled defect data (vital for manufacturing where defects constitute $<0.2\%$ of production).
- **Interactive Decision Threshold ($\tau$):** Calibrates the trade-off between **False Rejection Rate (Type I)** and **Defect Escape Rate (Type II)**.

### 3. Explainable AI (XAI) & Operator Standard Operating Procedures (SOPs)
- **SHAP-style Feature Attribution:** Decomposes the anomaly score into human-interpretable root causes (e.g., `+44% Yield Angle Deviation`, `+32% Vibration Jitter`).
- **Standardized Operator Work Instructions:** Translates mathematical scores into direct physical shop-floor corrective actions (e.g., inspecting tap lubrication, checking thread contamination, or swapping tool sockets).

### 4. Power BI Executive Quality & Yield Analytics
- Interactive cross-filtering canvas by **Station**, **Shift** (Morning, Afternoon, Night), and **Defect Mode**.
- Tracks **First Pass Yield (FPY: 98.7%)**, **Overall Equipment Effectiveness (OEE)**, and **Pareto analysis** of recurring failure modes.
- Quantifies **Cost of Poor Quality (CoQ) Avoidance** in dollars ($).

### 5. Enterprise Azure IoT & Cloud MLOps Pipeline
- **Edge Tier:** Azure IoT Edge + OPC-UA gateway interface with sub-12ms inference using compiled **ONNX Runtime** models.
- **Ingestion:** Azure Event Hubs (Kafka protocol) handling up to 100,000 events/second.
- **Lakehouse:** Azure Data Lake Storage Gen2 (Delta Lake medallion architecture: Bronze raw logs $\rightarrow$ Silver clean curves $\rightarrow$ Gold aggregated KPIs).
- **MLOps:** Azure Machine Learning Model Registry with automated concept drift detection and continuous retraining pipelines.

---

## 📊 Industrial Cost Matrix (Asymmetric Risk Formulation)

In automotive and heavy equipment manufacturing, false alarms and escapes carry vastly different economic consequences:

$$\text{Total Cost of Quality Risk} = (FP \times C_{\text{downtime}} \times t_{\text{investigate}}) + (FN \times C_{\text{warranty}})$$

Where:
- $FP$ = False Positives (Type I: False Line Stoppage).
- $C_{\text{downtime}}$ = Line stoppage cost ($\approx \$1,200/\text{min}$ in heavy manufacturing).
- $t_{\text{investigate}}$ = Mean time to inspect and clear false alarm ($\approx 4\text{ minutes}$).
- $FN$ = False Negatives (Type II: Defective Component Escaped to Field).
- $C_{\text{warranty}}$ = Field warranty recall and liability cost ($\approx \$28,500/\text{defect}$).

AURA Verify AI enables plant managers to tune the threshold $\tau$ to minimize this composite economic loss function.

---

## 🛠 Tech Stack

| Domain | Technology / Library | Role |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 (Vite)** | Modular component architecture & state management |
| **Language** | **TypeScript 5** | Strict type safety across telemetry models |
| **Styling & Theme** | **Tailwind CSS v4** | Clean industrial palette (Azure Blue, Obsidian, Teal, Emerald) |
| **Visualizations** | **Dynamic SVG & Lucide** | Mathematical curve plotting and clean iconography |
| **Machine Learning** | **PyTorch & Scikit-learn** | Autoencoder reconstruction & Isolation Forest modeling |
| **Deployment / Edge** | **ONNX Runtime & Azure IoT** | Deterministic edge execution on industrial IPCs |
| **Business Analytics**| **Power BI DirectQuery** | Multi-dimensional KPI reporting and executive dashboards |

---

## 📁 Repository Structure

```text
├── index.html                  # HTML entry point with metadata
├── package.json                # Project dependencies and build scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite bundler configuration
│
├── src/
│   ├── App.tsx                 # Core AURA Verify interactive application
│   ├── main.tsx                # React DOM mount point
│   ├── index.css               # Global Tailwind CSS imports
│   └── assets/images/          # High-fidelity architectural & sensor imagery
│       ├── industrial_assembly_sensor_*.jpg
│       └── cloud_iot_pipeline_diagram_*.jpg
│
├── pipeline/
│   └── model_training.py       # Python script: PyTorch Autoencoder + Isolation Forest
│
└── README.md                   # Complete architectural documentation
```

---

## ⚡ Quickstart Guide

### 1. Prerequisites
- Node.js (version 18+ or 20+)
- npm or pnpm
- (Optional for ML training) Python 3.10+ with `torch` and `scikit-learn`

### 2. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/aura-verify-ai.git
cd aura-verify-ai
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to interact with the live telemetry and analytics canvas.

### 4. Build for Production
```bash
npm run build
```

### 5. Run the Python ML Offline Pipeline (Optional)
```bash
python pipeline/model_training.py
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
