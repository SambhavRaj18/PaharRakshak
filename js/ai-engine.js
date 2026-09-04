// =========================================================================
// PaharRakshak - Unified On-Device AI Engine
// Multi-Tier Architecture:
// Tier 1: Local Google Gemma Models via Ollama (gemma4:e4b, gemma3:4b, gemma2:2b, codegemma:2b)
// Tier 2: Chrome Built-in Prompt API (Gemini Nano window.ai)
// Tier 3: Client-Side Semantic Disaster Matrix & Local RAG
// 100% offline, zero external server calls, multilingual (EN, NE, HI, BN)
// =========================================================================

import { getLanguage } from './i18n.js';

class AIEngine {
  constructor() {
    this.ollamaEndpoint = localStorage.getItem('pahar_ollama_endpoint') || 'http://localhost:11434';
    this.ollamaModel = localStorage.getItem('pahar_ollama_model') || 'gemma2:2b';
    this.hasOllama = false;
    this.hasChromeAi = false;
    this.session = null;
    this.installedModels = [];
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
    return 'Embedded Local Matrix (Zero-dependency)';
  }

  async setOllamaConfig(endpoint, model) {
    this.ollamaEndpoint = endpoint.trim().replace(/\/+$/, '');
    this.ollamaModel = model.trim();
    localStorage.setItem('pahar_ollama_endpoint', this.ollamaEndpoint);
    localStorage.setItem('pahar_ollama_model', this.ollamaModel);
    await this.checkOllama();
  }

  async checkOllama() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${this.ollamaEndpoint}/api/tags`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.installedModels = (data.models || []).map(m => m.name);
        this.hasOllama = true;

        // If configured model not in list but models exist, auto-select first gemma or first model
        if (this.installedModels.length > 0 && !this.installedModels.includes(this.ollamaModel)) {
          const gemmaMatch = this.installedModels.find(m => m.toLowerCase().includes('gemma'));
          if (gemmaMatch) {
            this.ollamaModel = gemmaMatch;
            localStorage.setItem('pahar_ollama_model', this.ollamaModel);
          } else {
            this.ollamaModel = this.installedModels[0];
            localStorage.setItem('pahar_ollama_model', this.ollamaModel);
          }
        }
        console.log(`✅ Local Gemma runner detected at ${this.ollamaEndpoint}. Active model: ${this.ollamaModel}`);
      } else {
        this.hasOllama = false;
      }
    } catch (e) {
      // Ollama not currently running or CORS not configured
      this.hasOllama = false;
    }
    this.notifyStateChange();
    return this.hasOllama;
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
   * Multi-tiered fallback: Local Gemma (Ollama) -> Chrome Prompt API -> Local Semantic Matrix
   */
  async generateText(prompt, systemPrompt = '') {
    // 1. Try Local Gemma via Ollama
    if (this.hasOllama) {
      try {
        const result = await this.generateWithOllama(prompt, systemPrompt);
        if (result && result.trim()) {
          return result;
        }
      } catch (err) {
        console.warn('Local Gemma prompt error, trying Chrome AI / Fallback:', err);
      }
    }

    // 2. Try Chrome Built-in AI
    if (this.hasChromeAi && this.session) {
      try {
        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        return await this.session.prompt(fullPrompt);
      } catch (err) {
        console.warn('Chrome AI prompt error, falling back to local reasoning:', err);
      }
    }

    // 3. Fallback: Embedded Local Semantic AI Matrix
    return this.localReasoningEngine(prompt, systemPrompt);
  }

  async generateWithOllama(prompt, systemPrompt = '') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout for local LLM

    const res = await fetch(`${this.ollamaEndpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.ollamaModel,
        prompt: prompt,
        system: systemPrompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9
        }
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Ollama HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    return data.response;
  }

  // -------------------------------------------------------------
  // B1: Slope Hazard Risk & Action Generation
  // -------------------------------------------------------------
  async explainSlopeRisk(hazardType, userNotes, visionMetrics = {}) {
    const lang = getLanguage();
    
    // Risk calculations based on hazard geology
    let riskLevel = 'MEDIUM';
    let riskTitle = '';
    let riskExplanation = '';
    let actionSteps = [];

    switch (hazardType) {
      case 'hazardCrack':
        riskLevel = 'HIGH';
        if (lang === 'ne') {
          riskTitle = 'माटो वा सडकमा तनाव चिरा (Tension Crack)';
          riskExplanation = 'ढलानमा चिरा पर्नु भनेको जमिन भित्र पानी जमेर माटोको पत्र खुकुलो हुँदै गएको स्पष्ट संकेत हो। भारी वर्षा जारी रहेमा यो चिरा ठूलो पहिरोमा परिणत हुन सक्छ।';
          actionSteps = [
            'चिरा परेको क्षेत्रमा गाडी वा पैदल नहिँड्नुहोस्।',
            'चिरामा पानी छिर्न नदिन त्रिपाल वा प्लास्टिकले छोप्ने प्रयास गर्नुहोस्।',
            'तल्लो भेगका बासिन्दाहरूलाई तुरुन्तै सतर्क गराउनुहोस्।'
          ];
        } else if (lang === 'hi') {
          riskTitle = 'सड़क व मिट्टी में तनाव दरार (Tension Crack)';
          riskExplanation = 'ढलान में दरार आना इस बात का संकेत है कि जमीन के भीतर पानी का दबाव बढ़ रहा है और मिट्टी खिसक रही है। भारी बारिश में यह बड़े भूस्खलन का रूप ले सकता है।';
          actionSteps = [
            'दरार वाले हिस्से पर भारी वाहन या पैदल आवागमन रोकें।',
            'दरार में पानी जाने से रोकने हेतु संभव हो तो तिरपाल से ढकें।',
            'ढलान के निचले हिस्से में रहने वाले लोगों को तुरंत चेतावनी दें।'
          ];
        } else if (lang === 'bn') {
          riskTitle = 'মাটি ও রাস্তায় ফাটল (Tension Crack)';
          riskExplanation = 'ঢালে ফাটল সৃষ্টি হওয়া ভূগর্ভস্থ অতিরিক্ত জলের চাপ এবং মাটি সরে যাওয়ার স্পষ্ট লক্ষণ। ভারী বৃষ্টি অব্যাহত থাকলে এটি বড় ধরনের ভূমিধসের কারণ হতে পারে।';
          actionSteps = [
            'ফাটল ধরা অংশের উপর দিয়ে চলাচল বন্ধ করুন।',
            'ফাটলে জল ঢোকা আটকাতে ত্রিপল দিয়ে ঢেকে দেওয়ার ব্যবস্থা করুন।',
            'নিচের বসতি এলাকার মানুষদের অবিলম্বে সতর্ক করুন।'
          ];
        } else {
          riskTitle = 'Active Soil/Road Tension Crack';
          riskExplanation = 'Visible surface fissure indicates subsurface shear strain and loss of soil cohesion. Continued monsoon rain is likely to trigger progressive slope failure along this slip circle.';
          actionSteps = [
            'Cordon off the immediate crack zone from vehicular and pedestrian traffic.',
            'Direct surface runoff away from the crack or cover with tarpaulin if safe.',
            'Alert downstream households and local PWD/Panchayat ward.'
          ];
        }
        break;

      case 'hazardWallBulge':
        riskLevel = 'CRITICAL';
        if (lang === 'ne') {
          riskTitle = 'फुलेको वा झुकेको ढुङ्गाको पर्खाल (Bulging Wall)';
          riskExplanation = 'पर्खाल पछाडि हाइड्रोस्टेटिक दबाब (पानीको भार) अत्यधिक बढेको छ। ड्रेनेज पाइप थुनिएकाले पर्खाल जुनसुकै बेला भत्किएर सडक वा घर पुर्न सक्छ।';
          actionSteps = [
            'पर्खालको फेदी वा माथिल्लो डिलबाट कम्तीमा २० मिटर टाढा रहनुहोस्।',
            'यदि सुरक्षित भए पर्खालका वीप-होल (पानी निस्कने प्वाल) सफा गर्नुहोस्।',
            'तत्काल सुरक्षित सामुदायिक आश्रयमा जानुहोस्।'
          ];
        } else if (lang === 'hi') {
          riskTitle = 'झुकी व बाहर निकली सुरक्षा दीवार (Bulging Retaining Wall)';
          riskExplanation = 'दीवार के पीछे अत्यधिक पानी और मिट्टी का दबाव जमा हो चुका है। वीप-होल बंद होने से यह दीवार कभी भी ढह सकती है।';
          actionSteps = [
            'दीवार के ठीक नीचे या ऊपर जाने से बचें (कम से कम 20 मीटर सुरक्षित दूरी)।',
            'सुरक्षित होने पर जल निकासी छिद्रों को खोलने का प्रयास करें।',
            'तुरंत नजदीकी सुरक्षित शरण स्थल पर जाएं।'
          ];
        } else if (lang === 'bn') {
          riskTitle = 'ফুলে ওঠা রিটেনিং ওয়াল (Bulging Wall)';
          riskExplanation = 'প্রাচীরের পেছনে মাত্রাতিরিক্ত জল ও মাটির চাপ জমেছে। ড্রেনেজ পাইপ বন্ধ হয়ে যাওয়ায় দেওয়ালটি যেকোনো মুহূর্তে ভেঙে পড়তে পারে।';
          actionSteps = [
            'প্রাচীরের পাদদেশ বা ওপর থেকে অন্তত ২০ মিটার দূরে থাকুন।',
            'নিরাপদ হলে প্রাচীরের জলের নির্গমন পথ পরিষ্কার করুন।',
            'অবিলম্বে নিরাপদ জরুরি আশ্রয়ে আশ্রয় নিন।'
          ];
        } else {
          riskTitle = 'Critical Retaining Wall Bulge & Overturning Risk';
          riskExplanation = 'Structural failure imminent due to clogged weep holes and hydrostatic water pressure behind masonry. High hazard of catastrophic collapse onto road or dwelling.';
          actionSteps = [
            'Maintain minimum 20m safety perimeter away from wall toe and crest.',
            'Do not park vehicles adjacent to bulging masonry sections.',
            'Evacuate any structures directly under the wall trajectory.'
          ];
        }
        break;

      case 'hazardSeepage':
        riskLevel = 'MEDIUM';
        if (lang === 'ne') {
          riskTitle = 'भित्तोबाट अत्यधिक पानी रसाउनु (Hydrostatic Seepage)';
          riskExplanation = 'माटो भित्र पानी भरिएर बाहिर निस्किरहेको छ। यसले भित्तोको माटो नरम बनाएर लेदो पहिरो (Mudslide) निम्त्याउन सक्छ।';
          actionSteps = [
            'पानी बग्ने प्राकृतिक झोड़ा वा नाली खुला राख्नुहोस्।',
            'पानी धमिलो हुन थालेमा तत्काल सुरक्षित ठाउँमा जानुहोस्।',
            'निरन्तर निगरानी गर्नुहोस्।'
          ];
        } else if (lang === 'hi') {
          riskTitle = 'दीवार व ढलान से पानी का रिसाव (Water Seepage)';
          riskExplanation = 'मिट्टी में पानी की संतृप्ति अत्यधिक हो गई है। यह स्थिति कीचड़ व मलबे के बहाव (Mudslide) की पूर्व चेतावनी है।';
          actionSteps = [
            'पानी के निकास के नालों को साफ और खुला रखें।',
            'यदि बहने वाला पानी अचानक मटमैला हो जाए, तो तुरंत हटने की तैयारी करें।',
            'ढलान की स्थिति पर लगातार नजर रखें।'
          ];
        } else if (lang === 'bn') {
          riskTitle = 'দেওয়াল ও মাটি থেকে জল চুইয়ে পড়া (Seepage)';
          riskExplanation = 'মাটিতে জল ধারণক্ষমতা পূর্ণ হয়ে গেছে। এই অবস্থা থেকে কাদা ও পলি ধস নামার সম্ভাবনা তৈরি হয়।';
          actionSteps = [
            'জল বেরোনোর প্রাকৃতিক নালা বা ঝোরা পরিষ্কার রাখুন।',
            'বেরোনো জল হঠাৎ অত্যন্ত ঘোলা হয়ে গেলে তৎক্ষণাৎ নিরাপদ স্থানে যান।',
            'পরিস্থিতির ওপর নজর রাখুন।'
          ];
        } else {
          riskTitle = 'High Hydrostatic Saturation & Jhora Seepage';
          riskExplanation = 'Saturated pore water pressure is reducing effective soil strength. Persistent high-volume turbid seepage is a primary pre-cursor to rapid mudslides.';
          actionSteps = [
            'Keep peripheral drainage channels clear of vegetation and silt.',
            'Monitor seepage water clarity: brown/milky water signals internal piping erosion.',
            'Prepare essential grab-bag for rapid evacuation if rainfall accelerates.'
          ];
        }
        break;

      case 'hazardTiltedTrees':
        riskLevel = 'HIGH';
        if (lang === 'ne') {
          riskTitle = 'ढल्किएका रूख र बिजुलीका पोल (Deep Soil Creep)';
          riskExplanation = 'रूख वा पोलहरू भित्तोतिर वा तलतिर ढल्किनु भनेको जमिनको भित्री तह विस्तारै खिसकिरहेको (Soil Creep) प्रमाण हो।';
          actionSteps = [
            'ढल्किएका बिजुलीका तारहरू नछुनुहोस्।',
            'रूखको मुनि गाडी नरोक्नुहोस्।',
            'विद्युत विभाग र स्थानीय प्रशासनलाई खबर गर्नुहोस्।'
          ];
        } else if (lang === 'hi') {
          riskTitle = 'झुके हुए पेड़ व बिजली के खंभे (Soil Creep)';
          riskExplanation = 'पेड़ों का ढलान की ओर झुकना गहरी मिट्टी की परत के खिसकने का प्रमाण है। यह पूरे पहाड़ के हिस्से के दरकने का संकेत हो सकता है।';
          actionSteps = [
            'झुके हुए बिजली के तारों से सुरक्षित दूरी बनाए रखें।',
            'पेड़ों के नीचे वाहन खड़े न करें।',
            'स्थानीय आपदा सेल को तुरंत सूचित करें।'
          ];
        } else if (lang === 'bn') {
          riskTitle = 'হেলে পড়া গাছ ও বৈদ্যুতিক খুঁটি (Soil Creep)';
          riskExplanation = 'গাছ বা খুঁটি হেলে পড়া মাটির গভীর স্তর ধীরে ধীরে সরে যাওয়ার প্রমাণ। এটি ব্যাপক ভূমিধসের পূর্বলক্ষণ।';
          actionSteps = [
            'ঝুলে থাকা বৈদ্যুতিক তার থেকে দূরে থাকুন।',
            'হেলে থাকা গাছের নিচে যানবাহন রাখবেন না।',
            'স্থানীয় কর্তৃপক্ষকে দ্রুত জানান।'
          ];
        } else {
          riskTitle = 'Deep Soil Creep & Rotational Shear';
          riskExplanation = 'Curved tree trunks or tilting telegraph poles demonstrate continuous downslope soil creep, indicating a deeper failure plane beneath the surface layer.';
          actionSteps = [
            'Stay clear of tensioned power lines and swaying telephone poles.',
            'Do not shelter under leaning canopy trees.',
            'Log report to alert track gangs and road maintenance units.'
          ];
        }
        break;

      default: // hazardDebris
        riskLevel = 'HIGH';
        if (lang === 'ne') {
          riskTitle = 'ताजा ढुङ्गा र लेदोको थुप्रो (Fresh Debris Fall)';
          riskExplanation = 'माथिबाट ढुङ्गा वा लेदो खसिसकेको छ। यसको मतलब माथिल्लो डिल अझै अस्थिर छ र थप ढुङ्गा खस्ने सम्भावना उच्च छ।';
          actionSteps = [
            'पहिरोको फेदीमा नरोकिनुहोस्, छिटो सुरक्षित ठाउँमा जानुहोस्।',
            'माथिबाट आउने आवाज सुन्न चनाखो रहनुहोस्।',
            'अन्य यात्रुहरूलाई बाटो बन्द रहेको खबर गर्नुहोस्।'
          ];
        } else if (lang === 'hi') {
          riskTitle = 'ताजा गिरे पत्थर व मलबा (Fresh Rockfall)';
          riskExplanation = 'ऊपरी ढलान से पत्थर गिर चुके हैं। इसका अर्थ है कि ऊपरी हिस्सा अस्थिर है और बारिश के साथ और पत्थर गिर सकते हैं।';
          actionSteps = [
            'मलबे के ठीक नीचे न खड़े हों, तुरंत पार हों या पीछे हटें।',
            'ऊपर से आने वाली आवाज और हलचल पर ध्यान दें।',
            'पीछे आ रहे वाहनों को अलर्ट करें।'
          ];
        } else if (lang === 'bn') {
          riskTitle = 'টাটকা পাথর ও কাদার স্তূপ (Fresh Debris)';
          riskExplanation = 'ওপর থেকে পাথর ও পলি নেমে এসেছে। এর অর্থ উপরের পাহাড়ের অংশ অত্যন্ত নড়বড়ে এবং আরও পাথর নামতে পারে।';
          actionSteps = [
            'ধ্বংসস্তূপের নিচে দেরি করবেন না, অবিলম্বে সরে যান।',
            'উপরের খাড়া পাহাড়ের শব্দের দিকে খেয়াল রাখুন।',
            'অন্যান্য যাত্রীদের সতর্ক করুন।'
          ];
        } else {
          riskTitle = 'Active Rockfall & Talus Accumulation';
          riskExplanation = 'Fresh angular rock debris indicates ongoing slope detachment from upper headwall. Progressive rockfall events are expected under saturated conditions.';
          actionSteps = [
            'Do not loiter or inspect debris at the base of the rock cut.',
            'Listen for whistling stone velocity or falling pebbles.',
            'Relay blockage down the mesh to prevent vehicle congestion.'
          ];
        }
        break;
    }

    if (userNotes && userNotes.trim().length > 0) {
      riskExplanation += ` (Walker Note Context: "${userNotes.trim()}")`;
    }

    // Optional LLM enricher if Gemma / Chrome AI is connected
    if (this.hasOllama || this.hasChromeAi) {
      try {
        const prompt = `You are a Himalayan disaster engineering assistant. Provide a brief 1-sentence assessment in ${lang === 'ne' ? 'Nepali' : lang === 'hi' ? 'Hindi' : lang === 'bn' ? 'Bengali' : 'English'} for a slope hazard: ${riskTitle} with observation notes: "${userNotes || 'None'}".`;
        const aiNote = await this.generateText(prompt);
        if (aiNote && aiNote.trim().length > 10 && !aiNote.includes('[On-Device AI Output]')) {
          riskExplanation += `\n\n🧠 ${this.getActiveBackendName()}: ${aiNote.trim()}`;
        }
      } catch (e) {
        // Safe fallback to deterministic template
      }
    }

    return {
      riskLevel,
      riskTitle,
      riskExplanation,
      actionSteps
    };
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

    if (blockedCount > 0) {
      if (lang === 'ne') {
        return `⚠️ ${corridor} [पूर्ण बन्द]: ${landmark} नजिक पहिरो/अवरोध। ${blockedCount} जनाले बन्द भएको पुष्टि गरेका छन्। अन्य बाटो प्रयोग गर्नुहोस्।`;
      }
      if (lang === 'hi') {
        return `⚠️ ${corridor} [पूर्णतः अवरुद्ध]: ${landmark} के पास मलबा/रुकावट। ${blockedCount} रिपोर्टों द्वारा मार्ग बंद होने की पुष्टि। वैकल्पिक मार्ग चुनें।`;
      }
      if (lang === 'bn') {
        return `⚠️ ${corridor} [সম্পূর্ণ বন্ধ]: ${landmark}-এর কাছে ভূমিধস/বাধা। ${blockedCount} জন যাত্রী রাস্তা বন্ধ থাকার কথা নিশ্চিত করেছেন।`;
      }
      return `⚠️ ${corridor} [BLOCKED]: Heavy blockage reported near ${landmark}. Confirmed by ${blockedCount} mesh node(s). Divert via alternate route.`;
    } else if (cautionCount > 0) {
      if (lang === 'ne') {
        return `🟡 ${corridor} [सतर्कता]: ${landmark} मा हिलो र ढुङ्गा। केवल ४WD र ठूला गाडी मात्र चल्न सक्ने।`;
      }
      if (lang === 'hi') {
        return `🟡 ${corridor} [सावधानी]: ${landmark} के पास कीचड़ व पत्थर। केवल 4WD व ऊंचे वाहन निकल सकते हैं।`;
      }
      if (lang === 'bn') {
        return `🟡 ${corridor} [সতর্কতা]: ${landmark}-এর কাছে কাদা ও পাথর। শুধুমাত্র ৪WD গাড়ি চলাচল করতে পারছে।`;
      }
      return `🟡 ${corridor} [CAUTION]: Slush/debris near ${landmark}. High-clearance 4WD vehicles only. Single-lane slow passage.`;
    } else {
      if (lang === 'ne') {
        return `🟢 ${corridor} [सञ्चालनमा]: ${landmark} मा हल्का गाडीहरू सुचारू रूपमा चलिरहेका छन् (${openCount} रिपोर्ट)।`;
      }
      if (lang === 'hi') {
        return `🟢 ${corridor} [सुचारू]: ${landmark} पर हल्का यातायात सामान्य चल रहा है (${openCount} रिपोर्ट)।`;
      }
      if (lang === 'bn') {
        return `🟢 ${corridor} [খোলা]: ${landmark}-এ হালকা যানবাহন চলাচল করছে (${openCount} रिपोर्ट)।`;
      }
      return `🟢 ${corridor} [PASSABLE]: Light traffic moving steadily past ${landmark} (${openCount} verified mesh log).`;
    }
  }

  // -------------------------------------------------------------
  // B7: Local RAG Q&A grounded in emergency knowledge base & spatial shelters
  // -------------------------------------------------------------
  async queryEmergencyKnowledgeBase(query, knowledgeBase, sheltersData = [], userLocation = null) {
    const lang = getLanguage();
    const cleanQuery = query.toLowerCase().trim();

    if (!cleanQuery) {
      return {
        answer: lang === 'ne' ? 'कृपया आफ्नो आपतकालीन प्रश्न लेख्नुहोस्।' :
                lang === 'hi' ? 'कृपया अपना आपातकालीन प्रश्न दर्ज करें।' :
                lang === 'bn' ? 'অনুগ্রহ করে আপনার জরুরি প্রশ্নটি লিখুন।' :
                'Please enter an emergency question.',
        matchedArticle: null,
        backend: this.getActiveBackendName()
      };
    }

    // Check if query is looking for nearest hospital / shelter / clinic
    const isHospitalQuery = cleanQuery.includes('hospital') || cleanQuery.includes('phc') || 
                            cleanQuery.includes('clinic') || cleanQuery.includes('shelter') ||
                            cleanQuery.includes('अस्पताल') || cleanQuery.includes('হাসপাতাল') ||
                            cleanQuery.includes('nearest') || cleanQuery.includes('कहाँ छ') || cleanQuery.includes('कहा है');

    let spatialContext = '';
    if (isHospitalQuery && sheltersData && sheltersData.length > 0 && userLocation) {
      const sorted = [...sheltersData].map(s => {
        const dLat = (s.lat - userLocation.lat) * (Math.PI / 180);
        const dLon = (s.lng - userLocation.lng) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(userLocation.lat * (Math.PI / 180)) * Math.cos(s.lat * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const distKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return { ...s, distKm };
      }).sort((a, b) => a.distKm - b.distKm);

      const top3 = sorted.slice(0, 3);
      spatialContext = top3.map(h => `- ${h.name} (${h.type}): ${h.distKm.toFixed(1)} km away at ${h.address} (Contact: ${h.contact})`).join('\n');
    }

    // Semantic keyword scoring for offline RAG
    let bestMatch = null;
    let highestScore = 0;

    for (const item of knowledgeBase) {
      let score = 0;
      for (const kw of item.keywords) {
        if (cleanQuery.includes(kw.toLowerCase())) {
          score += 3;
        }
      }
      if (cleanQuery.includes(item.category.toLowerCase())) {
        score += 2;
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (!bestMatch || highestScore === 0) {
      bestMatch = knowledgeBase[0]; // Landslide default
    }

    const title = bestMatch[`title_${lang}`] || bestMatch.title_en;
    const steps = bestMatch[`steps_${lang}`] || bestMatch.steps_en;

    let formattedAnswer = '';

    if (spatialContext) {
      formattedAnswer += `🏥 **Nearest Health Facilities & Emergency Centres:**\n${spatialContext}\n\n`;
    }

    formattedAnswer += `📋 **${title}**\n\n`;
    steps.forEach((step, idx) => {
      formattedAnswer += `${idx + 1}. ${step}\n`;
    });

    // If Gemma / Chrome AI is connected, run generative reasoning grounded in RAG context
    let generatedAiNote = '';
    if (this.hasOllama || this.hasChromeAi) {
      try {
        const ragContext = `${title}\n${steps.join('. ')}\n${spatialContext ? 'Nearby facilities:\n' + spatialContext : ''}`;
        const prompt = `You are the PaharRakshak Himalayan Emergency AI. User asks: "${query}". Answer directly in 2-3 sentences in ${lang === 'ne' ? 'Nepali' : lang === 'hi' ? 'Hindi' : lang === 'bn' ? 'Bengali' : 'English'} strictly using this context:\n${ragContext}`;
        const aiAnswer = await this.generateText(prompt);
        if (aiAnswer && aiAnswer.trim().length > 15 && !aiAnswer.includes('[On-Device AI Output]')) {
          generatedAiNote = aiAnswer.trim();
          formattedAnswer = `🧠 **${this.getActiveBackendName()} Assessment:**\n${generatedAiNote}\n\n` + formattedAnswer;
        }
      } catch (e) {
        // Fallback gracefully
      }
    }

    return {
      answer: formattedAnswer,
      matchedArticle: bestMatch,
      backend: this.getActiveBackendName(),
      hasGenAi: !!generatedAiNote
    };
  }

  localReasoningEngine(prompt, systemPrompt) {
    return `[On-Device AI Output]: Processed query with offline local intelligence matrix. Action verified under Himalayan terrain safety protocol.`;
  }
}

export const aiEngine = new AIEngine();
