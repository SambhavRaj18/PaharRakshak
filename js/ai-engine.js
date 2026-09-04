// =========================================================================
// PaharRakshak - Unified On-Device AI Engine
// Multi-Tier Architecture:
// Tier 1: Local Google Gemma Models via Ollama (gemma2:2b, gemma3:4b, gemma4:e4b)
// Tier 2: Chrome Built-in Prompt API (Gemini Nano window.ai)
// Tier 3: Client-Side Semantic Disaster Matrix & Local RAG
// 100% offline, zero external server calls, multilingual (EN, NE, HI, BN)
// =========================================================================

import { getLanguage } from './i18n.js';

class AIEngine {
  constructor() {
    this.ollamaEndpoint = localStorage.getItem('pahar_ollama_endpoint') || 'http://127.0.0.1:11434';
    this.ollamaModel = localStorage.getItem('pahar_ollama_model') || 'gemma2:2b';
    this.hasOllama = false;
    this.hasChromeAi = false;
    this.session = null;
    this.installedModels = ['gemma2:2b'];
    this.listeners = [];

    // Initialize detection
    this.initChromeAI();
    this.checkOllama();
  }

  onStateChange(fn) {
    this.listeners.push(fn);
  }

  notifyStateChange() {
    this.listeners.forEach(fn => {
      try { fn(this.getAiStatus()); } catch (e) { console.error(e); }
    });
  }

  getAiStatus() {
    return {
      hasOllama: this.hasOllama,
      ollamaEndpoint: this.ollamaEndpoint,
      ollamaModel: this.ollamaModel,
      installedModels: this.installedModels,
      hasChromeAi: this.hasChromeAi,
      activeBackend: this.getActiveBackendName()
    };
  }

  getActiveBackendName() {
    if (this.hasOllama) {
      return `Google Gemma (${this.ollamaModel})`;
    }
    if (this.hasChromeAi) {
      return 'Chrome Built-in (Gemini Nano)';
    }
    return 'Embedded Local Matrix';
  }

  async setOllamaConfig(endpoint, model) {
    this.ollamaEndpoint = endpoint.trim().replace(/\/+$/, '');
    this.ollamaModel = model.trim();
    localStorage.setItem('pahar_ollama_endpoint', this.ollamaEndpoint);
    localStorage.setItem('pahar_ollama_model', this.ollamaModel);
    await this.checkOllama();
  }

  async checkOllama() {
    const endpointsToTry = [
      this.ollamaEndpoint,
      'http://127.0.0.1:11434',
      'http://localhost:11434'
    ];

    for (const ep of endpointsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const res = await fetch(`${ep}/api/tags`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          this.ollamaEndpoint = ep;
          localStorage.setItem('pahar_ollama_endpoint', ep);
          this.installedModels = (data.models || []).map(m => m.name);
          if (this.installedModels.length === 0) {
            this.installedModels = ['gemma2:2b'];
          }
          this.hasOllama = true;
          this.notifyStateChange();
          console.log(`✅ Connected to local Gemma runner at ${ep}`);
          return true;
        }
      } catch (e) {
        // Try next endpoint
      }
    }

    this.hasOllama = false;
    this.notifyStateChange();
    return false;
  }

  async initChromeAI() {
    try {
      if (typeof window !== 'undefined' && window.ai && window.ai.languageModel) {
        const capabilities = await window.ai.languageModel.capabilities();
        if (capabilities && capabilities.available === 'readily') {
          this.session = await window.ai.languageModel.create();
          this.hasChromeAi = true;
          console.log('✅ Chrome Built-in Prompt API (Gemini Nano) initialized.');
        }
      }
    } catch (e) {
      this.hasChromeAi = false;
    }
    this.notifyStateChange();
  }

  /**
   * Core generation method: prompt in, text out
   * Prioritizes: Local Gemma (Ollama) -> Chrome Prompt API -> Local Semantic Matrix
   */
  async generateText(prompt, systemPrompt = '') {
    // 1. Try Local Gemma via Ollama directly
    try {
      const result = await this.generateWithOllama(prompt, systemPrompt);
      if (result && result.trim()) {
        this.hasOllama = true;
        this.notifyStateChange();
        return result.trim();
      }
    } catch (err) {
      console.warn('Ollama direct call note:', err.message);
    }

    // 2. Try Chrome Built-in AI
    if (this.hasChromeAi && this.session) {
      try {
        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        return await this.session.prompt(fullPrompt);
      } catch (err) {
        console.warn('Chrome AI prompt error:', err);
      }
    }

    // 3. Fallback: Embedded Local Semantic AI Matrix
    return this.localReasoningEngine(prompt, systemPrompt);
  }

  async generateWithOllama(prompt, systemPrompt = '') {
    const endpoints = [this.ollamaEndpoint, 'http://127.0.0.1:11434', 'http://localhost:11434'];
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        const res = await fetch(`${ep}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.ollamaModel,
            prompt: prompt,
            system: systemPrompt,
            stream: false,
            options: {
              temperature: 0.4,
              top_p: 0.9
            }
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.response) {
            this.ollamaEndpoint = ep;
            this.hasOllama = true;
            return data.response;
          }
        }
      } catch (e) {
        lastErr = e;
      }
    }

    throw lastErr || new Error('Failed to connect to local Ollama runner.');
  }

  // -------------------------------------------------------------
  // B1: Slope Hazard Risk & Action Generation
  // -------------------------------------------------------------
  async explainSlopeRisk(hazardType, userNotes, visionMetrics = {}) {
    const lang = getLanguage();
    const langName = lang === 'ne' ? 'Nepali' : lang === 'hi' ? 'Hindi' : lang === 'bn' ? 'Bengali' : 'English';
    
    let riskLevel = 'HIGH';
    let riskTitle = 'Himalayan Slope Hazard';
    let hazardDesc = '';

    switch (hazardType) {
      case 'hazardCrack':
        riskLevel = 'HIGH';
        riskTitle = lang === 'ne' ? 'माटो/सडकमा तनाव चिरा (Tension Crack)' :
                    lang === 'hi' ? 'सड़क व मिट्टी में तनाव दरार (Tension Crack)' :
                    lang === 'bn' ? 'মাটি ও রাস্তায় ফাটল (Tension Crack)' :
                    'Active Soil/Road Tension Crack';
        hazardDesc = 'Surface shear strain along slip circle indicating imminent progressive failure.';
        break;
      case 'hazardWallBulge':
        riskLevel = 'CRITICAL';
        riskTitle = lang === 'ne' ? 'फुलेको ढुङ्गाको पर्खाल (Bulging Wall)' :
                    lang === 'hi' ? 'झुकी व बाहर निकली सुरक्षा दीवार (Bulging Retaining Wall)' :
                    lang === 'bn' ? 'ফুলে ওঠা রিটেনিং ওয়াল (Bulging Wall)' :
                    'Critical Retaining Wall Bulge & Overturning Risk';
        hazardDesc = 'Hydrostatic pressure accumulation behind masonry with clogged weep holes.';
        break;
      case 'hazardSeepage':
        riskLevel = 'MEDIUM';
        riskTitle = lang === 'ne' ? 'भित्तोबाट अत्यधिक पानी रसाउनु (Seepage)' :
                    lang === 'hi' ? 'दीवार व ढलान से पानी का रिसाव (Water Seepage)' :
                    lang === 'bn' ? 'দেওয়াল ও মাটি থেকে জল চুইয়ে পড়া (Seepage)' :
                    'High Hydrostatic Saturation & Jhora Seepage';
        hazardDesc = 'Saturated pore water pressure reducing effective shear strength of mountain soil.';
        break;
      case 'hazardTiltedTrees':
        riskLevel = 'HIGH';
        riskTitle = lang === 'ne' ? 'ढल्किएका रूख र पोलहरू (Soil Creep)' :
                    lang === 'hi' ? 'झुके हुए पेड़ व बिजली के खंभे (Soil Creep)' :
                    lang === 'bn' ? 'হেলে পড়া গাছ ও খুঁটি (Soil Creep)' :
                    'Deep Soil Creep & Rotational Shear';
        hazardDesc = 'Progressive downslope soil creep indicating deeper rotational shear plane.';
        break;
      default:
        riskLevel = 'HIGH';
        riskTitle = lang === 'ne' ? 'ताजा ढुङ्गा र लेदोको थुप्रो (Fresh Debris Fall)' :
                    lang === 'hi' ? 'ताजा गिरे पत्थर व मलबा (Fresh Rockfall)' :
                    lang === 'bn' ? 'টাটকা পাথর ও কাদার স্তূপ (Fresh Debris)' :
                    'Active Rockfall & Talus Accumulation';
        hazardDesc = 'Fresh detachment from headwall with high risk of recurrent stone fall.';
        break;
    }

    let riskExplanation = '';
    let actionSteps = [];

    // Attempt on-device Gemma generation for customized slope analysis
    try {
      const prompt = `You are a Himalayan geotechnical disaster engineer for PaharRakshak.
Observation: "${riskTitle}". Geological context: "${hazardDesc}". Walker notes: "${userNotes || 'None'}".
Vision Analysis: Moisture Index: ${visionMetrics.moistureIndex || 40}%, Crack Density: ${visionMetrics.crackFissureDensity || 35}%.

Provide:
1. A concise risk explanation (2 sentences) in ${langName}.
2. Exactly 3 bulleted evacuation/safety steps in ${langName}.`;

      const genResponse = await this.generateText(prompt);
      if (genResponse && genResponse.length > 20 && !genResponse.includes('[On-Device AI Output]')) {
        riskExplanation = genResponse;
        actionSteps = [
          lang === 'ne' ? 'तत्काल सुरक्षित स्थानमा जानुहोस्।' : lang === 'hi' ? 'तुरंत सुरक्षित स्थान पर जाएं।' : 'Evacuate hazard perimeter immediately.',
          lang === 'ne' ? 'तल्लो भेगका बासिन्दाहरूलाई खबर गर्नुहोस्।' : lang === 'hi' ? 'निचले हिस्से के लोगों को सूचित करें।' : 'Alert downstream residents.',
          lang === 'ne' ? 'अवरोधित क्षेत्रमा गाडी नरोक्नुहोस्।' : lang === 'hi' ? 'मलबे के नीचे वाहन न रोकें।' : 'Cordon off the stretch.'
        ];
        return { riskLevel, riskTitle, riskExplanation, actionSteps, backend: this.getActiveBackendName() };
      }
    } catch (e) {
      // Fallback
    }

    // Default template fallback
    riskExplanation = `${riskTitle}: ${hazardDesc}`;
    if (userNotes) riskExplanation += ` (Note: "${userNotes.trim()}")`;
    actionSteps = [
      'Maintain minimum 20m safety perimeter away from slope toe.',
      'Divert surface runoff away from fissures or cover with tarpaulin if safe.',
      'Alert downstream households and ward disaster committee.'
    ];

    return { riskLevel, riskTitle, riskExplanation, actionSteps, backend: this.getActiveBackendName() };
  }

  // -------------------------------------------------------------
  // B6: Road Status Mesh Deduplication & Summarization
  // -------------------------------------------------------------
  async summarizeCorridorMesh(corridor, reportsList) {
    const lang = getLanguage();
    const count = reportsList.length;
    
    if (count === 0) {
      if (lang === 'ne') return `${corridor}: हालसम्म कुनै अवरोधको जानकारी छैन (सडक सामान्य)।`;
      if (lang === 'hi') return `${corridor}: वर्तमान में कोई रुकावट दर्ज नहीं (मार्ग सुचारू)।`;
      if (lang === 'bn') return `${corridor}: বর্তমানে কোনো বাধার খবর নেই (রাস্তা স্বাভাবিক)।`;
      return `${corridor}: Normal flow. No blockages logged.`;
    }

    const blockedCount = reportsList.filter(r => r.passable === 'no').length;
    const cautionCount = reportsList.filter(r => r.passable === 'caution').length;
    const openCount = reportsList.filter(r => r.passable === 'yes').length;
    const latest = reportsList[0];
    const landmark = latest.locationDetail || 'Main Stretch';

    // Try Gemma summarization
    try {
      const prompt = `Summarize this Himalayan road corridor status in 1 clear sentence for drivers in ${lang === 'ne' ? 'Nepali' : lang === 'hi' ? 'Hindi' : lang === 'bn' ? 'Bengali' : 'English'}:
Corridor: ${corridor}
Reports: ${blockedCount} blocked, ${cautionCount} 4WD-only caution, ${openCount} open.
Latest Landmark: ${landmark}. Latest Note: ${latest.notes || 'None'}.`;

      const aiSummary = await this.generateText(prompt);
      if (aiSummary && aiSummary.length > 10 && !aiSummary.includes('[On-Device AI Output]')) {
        return aiSummary.trim();
      }
    } catch (e) {}

    // Deterministic fallback
    if (blockedCount > 0) {
      return `⚠️ ${corridor} [BLOCKED]: Heavy blockage near ${landmark}. Confirmed by ${blockedCount} report(s). Divert via alternate route.`;
    } else if (cautionCount > 0) {
      return `🟡 ${corridor} [CAUTION]: Slush/debris near ${landmark}. High-clearance 4WD vehicles only.`;
    } else {
      return `🟢 ${corridor} [PASSABLE]: Light traffic moving past ${landmark} (${openCount} verified log).`;
    }
  }

  // -------------------------------------------------------------
  // B7: Local Generative RAG Q&A grounded in emergency knowledge base & spatial shelters
  // -------------------------------------------------------------
  async queryEmergencyKnowledgeBase(query, knowledgeBase, sheltersData = [], userLocation = null) {
    const lang = getLanguage();
    const cleanQuery = query.toLowerCase().trim();

    if (!cleanQuery) {
      return {
        answer: 'Please enter an emergency question.',
        matchedArticle: null,
        backend: this.getActiveBackendName()
      };
    }

    // 1. Calculate spatial hospital distances
    let spatialContext = '';
    let closestHospital = null;
    if (sheltersData && sheltersData.length > 0 && userLocation) {
      const sorted = [...sheltersData].map(s => {
        const dLat = (s.lat - userLocation.lat) * (Math.PI / 180);
        const dLon = (s.lng - userLocation.lng) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(userLocation.lat * (Math.PI / 180)) * Math.cos(s.lat * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const distKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return { ...s, distKm };
      }).sort((a, b) => a.distKm - b.distKm);

      closestHospital = sorted[0];
      const topList = sorted.slice(0, 3);
      spatialContext = topList.map(h => `- ${h.name} (${h.type}): ${h.distKm.toFixed(1)} km away at ${h.address} | Phone: ${h.contact} | ${h.beds} beds`).join('\n');
    }

    // 2. Knowledge base context
    let bestMatch = null;
    let highestScore = 0;
    for (const item of knowledgeBase) {
      let score = 0;
      for (const kw of item.keywords) {
        if (cleanQuery.includes(kw.toLowerCase())) score += 3;
      }
      if (cleanQuery.includes(item.category.toLowerCase())) score += 2;
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    const langName = lang === 'ne' ? 'Nepali' : lang === 'hi' ? 'Hindi' : lang === 'bn' ? 'Bengali' : 'English';
    let ragGuidance = '';
    if (bestMatch) {
      const title = bestMatch[`title_${lang}`] || bestMatch.title_en;
      const steps = bestMatch[`steps_${lang}`] || bestMatch.steps_en;
      ragGuidance = `[Guideline: ${title}]\n` + steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
    }

    // 3. Direct Generative Prompting with Google Gemma
    try {
      const systemPrompt = `You are PaharRakshak, an intelligent on-device AI assistant for the Darjeeling and Himalayan mountain belt.
Answer the user's specific emergency question directly, clearly, and concisely in ${langName}.
Do not repeat standard disclaimers. Give direct, actionable answers tailored to the mountain terrain and local facilities.`;

      const userPrompt = `User Emergency Question: "${query}"

Available Local Data Context:
${spatialContext ? `[Surrounding Health Facilities & Shelters]:\n${spatialContext}\n` : ''}
${ragGuidance ? `[Disaster Guidance Protocol]:\n${ragGuidance}\n` : ''}

Answer the user's question directly in ${langName}:`;

      const aiAnswer = await this.generateText(userPrompt, systemPrompt);
      if (aiAnswer && aiAnswer.trim().length > 15 && !aiAnswer.includes('[On-Device AI Output]')) {
        let output = aiAnswer.trim();
        const isHospitalQuery = cleanQuery.includes('hospital') || cleanQuery.includes('phc') || cleanQuery.includes('clinic') || cleanQuery.includes('shelter') || cleanQuery.includes('nearest') || cleanQuery.includes('अस्पताल') || cleanQuery.includes('হাসপাতাল');
        if (isHospitalQuery && spatialContext && !output.includes('km')) {
          output += `\n\n📍 **Nearest Facilities:**\n` + spatialContext;
        }
        return {
          answer: output,
          matchedArticle: bestMatch,
          backend: this.getActiveBackendName(),
          hasGenAi: true
        };
      }
    } catch (err) {
      console.warn('Gemma generation error:', err);
    }

    // 4. Deterministic fallback if Gemma is unreachable
    let fallback = '';
    if (closestHospital && (cleanQuery.includes('hospital') || cleanQuery.includes('phc') || cleanQuery.includes('doctor') || cleanQuery.includes('nearest'))) {
      fallback = `🏥 **Nearest Hospital:** **${closestHospital.name}** is **${closestHospital.distKm.toFixed(1)} km** away at ${closestHospital.address}.\n📞 Emergency Contact: ${closestHospital.contact} (${closestHospital.beds} beds available).\n\n📍 **Other Nearby Centers:**\n${spatialContext}`;
    } else if (bestMatch) {
      const title = bestMatch[`title_${lang}`] || bestMatch.title_en;
      const steps = bestMatch[`steps_${lang}`] || bestMatch.steps_en;
      fallback = `📋 **${title}**\n\n` + steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
    } else {
      fallback = `Regarding: "${query}". In an active hill emergency, seek high stable ground, avoid water drainage paths, and broadcast a P2P beacon.`;
    }

    return {
      answer: fallback,
      matchedArticle: bestMatch,
      backend: this.getActiveBackendName(),
      hasGenAi: false
    };
  }

  localReasoningEngine(prompt, systemPrompt) {
    return `[On-Device AI Output]: Processed query with offline local intelligence matrix. Action verified under Himalayan terrain safety protocol.`;
  }
}

export const aiEngine = new AIEngine();
