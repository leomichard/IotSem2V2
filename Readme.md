/flow-ai/

│

├── index.html          → Landing page (vision + valeur ajoutée Flow AI)

├── technology.html     → Architecture STM32 ↔ UART ↔ Raspberry Pi

├── features.html       → Capteurs, sensor fusion, IoT sync, AI-ready

├── about.html          → Objectif projet, équipe, démarche ingénierie

├── assets/

│   ├── logo.png        → (ton logo sera placé ici, header + favicon)

│   ├── favicon.png     → (même logo version carrée mini 32x32)

│   └── imgs/           → Diagrammes architecture, photos, etc.

├── script.js           → Mobile menu + animations

└── tailwind.config.js  → (optionnel si tu veux un build plus avancé plus tard)



\## 📘 \*\*README.md – Flow AI : Real-Time IoT People Flow Intelligence\*\*



```markdown

\# 🚀 Flow AI — Real-Time IoT People Flow Intelligence



Flow AI is an academic \*\*IoT + AI system\*\* designed to analyze and optimize \*\*people flow in real-time\*\*.  

It combines \*\*embedded processing (STM32)\*\*, \*\*edge computing (Raspberry Pi)\*\*, and \*\*AI analytics (Mistral AI)\*\*  

to provide precise, fast, and scalable insights.



!\[Flow AI Diagram](assets/imgs/architecture.png)



---



\## 🧩 \*\*System Overview\*\*



\### 🔹 Embedded Layer — \*STM32 MCU\*

\- Collects real-time sensor data:

&nbsp; - Ultrasonic and infrared sensors  

&nbsp; - Handles interrupts for low-latency detection

\- Sends raw data to the Raspberry Pi via \*\*UART\*\*



\### 🔹 Edge Layer — \*Raspberry Pi\*

\- Synchronizes with STM32 using UART

\- Performs \*\*sensor fusion\*\* (ultrasonic + IR)

\- Sends aggregated results to the \*\*Cloud Dashboard\*\*

\- Communicates with \*\*Mistral AI\*\* for intelligent anomaly detection and analysis



\### 🔹 Cloud \& AI Layer

\- Stores all processed flow data

\- Hosts dashboards and analytics visualization

\- Interfaces with \*\*Mistral AI\*\* for intelligent explanations and diagnostics



\### 🔹 User Interaction

\- \*\*LINE Chatbot\*\*: Natural-language interface for engineers and users  

\- \*\*Web Dashboard\*\*: Visualization of occupancy, flow direction, and alerts



---



\## 🧠 \*\*Architecture Summary\*\*



```



STM32 → UART → Raspberry Pi → Cloud Dashboard → Mistral AI → LINE Chatbot → User



````



Each component plays a role in achieving \*\*real-time, intelligent, low-latency IoT analytics\*\*.



---



\## ⚙️ \*\*Core Features\*\*



| Feature | Description |

|:--|:--|

| 🧮 \*\*Sensor Fusion Engine\*\* | Combines multiple sensors to improve accuracy and reliability |

| 🔌 \*\*UART Sync\*\* | Ensures stable and low-latency STM32 ↔ Raspberry Pi communication |

| 🤖 \*\*AI-Ready Pipeline\*\* | Pre-processes data for Mistral AI anomaly detection |

| 💬 \*\*LINE Chatbot Integration\*\* | Query system status and receive technical explanations |

| ☁️ \*\*Cloud Dashboard\*\* | Visualizes flow data and generates alerts in real-time |



---



\## 💬 \*\*AI Assistant Configuration\*\*



Flow AI includes a custom \*\*Mistral AI integration\*\* via `/api/chat.js`.



\*\*System prompt (default):\*\*

> You are \*\*Flow AI\*\*, an IoT expert assistant specialized in real-time people-flow analysis.  

> You explain and optimize the hardware and software architecture of the Flow AI project using STM32 + Raspberry Pi + Sensor Fusion + AI Integration.



See \[`api/chat.js`](api/chat.js) for the complete configuration and prompt rules.



---



\## 🧠 \*\*Flow AI System Diagram\*\*



The architecture is described using \[Graphviz](https://graphviz.org/):



```dot

STM32 -> UART -> Raspberry Pi -> Cloud DB -> Dashboard -> Engineer

Raspberry Pi -> Mistral AI -> LINE Chatbot -> Engineer

````



You can generate the image:



```bash

dot -Tpng flow\_ai\_system.dot -o flow\_ai\_system.png

```



---



\## 🧑‍💻 \*\*Development Setup\*\*



\### 🔧 Requirements



\* Node.js ≥ 18

\* A \[Mistral AI API Key](https://mistral.ai/)

\* A \[Vercel](https://vercel.com/) account for deployment

\* A \[GitHub Pages](https://pages.github.com/) site (for the static frontend)



\### ⚙️ Local Run



```bash

npm install

npm run dev

```



\### 🚀 Deploy on Vercel



1\. Push your repo to GitHub

2\. Connect it on \[vercel.com](https://vercel.com/)

3\. Set your environment variable:



```

MISTRAL\_API\_KEY = sk-live-xxxxxxxxxxxxxxxxxxxx

```



4\. Deploy 🎉



---



\## 💡 \*\*Frontend Chat Example\*\*



```javascript

const res = await fetch("https://iot-sem2-v2-flow-ai-iot.vercel.app/api/chat", {

&nbsp; method: "POST",

&nbsp; headers: { "Content-Type": "application/json" },

&nbsp; body: JSON.stringify({ message: "Explain how UART is used in Flow AI" })

});

const data = await res.json();

console.log(data.choices\[0].message.content);

```



---



\## 🌐 \*\*Live Project\*\*



🔗 \*\*Website:\*\* \[https://iot-sem2-v2-flow-ai-iot.vercel.app](https://iot-sem2-v2-flow-ai-iot.vercel.app)

💬 \*\*LINE Chatbot:\*\* \[@305urthc](https://line.me/R/ti/p/@305urthc?oat\_content=url\&ts=10201911)



---



\## 🧑‍🎓 \*\*Authors\*\*



Project by \*\*Leo Michard\*\* and the IoT Engineering Team — \*ECE Lyon, 2025\*

Guided by academic supervisors and dedicated to advancing real-time IoT AI research.



---



\## 📄 \*\*License\*\*



This project is distributed for academic and educational purposes.

© 2025 Flow AI — All rights reserved

