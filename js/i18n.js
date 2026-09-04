// =========================================================================
// PaharRakshak - 4-Language Localization Dictionary (EN, NE, HI, BN)
// Fully offline, zero external dependencies
// =========================================================================

export const translations = {
  en: {
    appName: "PaharRakshak",
    appTagline: "Offline Disaster & Road Mesh for the Hills",
    airplaneModeNotice: "100% Offline PWA · Airplane Mode Ready",
    statusOnline: "Connected (Syncing Enabled)",
    statusOffline: "Offline Mode (IndexedDB Active)",
    
    // Tabs
    tabReporter: "Slope",
    tabMesh: "Roads",
    tabGuide: "Guide",
    tabRelay: "Relay",
    
    // B1: Landslide Reporter
    reporterTitle: "Offline Slope Hazard Reporter",
    reporterSubtitle: "Capture or upload hill slope damage. On-device AI assesses risk and queues reports locally.",
    capturePhoto: "Take Photo with Camera",
    uploadPhoto: "Select from Gallery / File",
    hazardTypeLabel: "Visible Hazard Observation:",
    notesLabel: "Walker / Driver Notes (optional):",
    notesPlaceholder: "e.g., Water gushing near retaining wall, road cracked 2 inches...",
    analyzeButton: "Analyze with On-Device AI",
    analyzingText: "Running On-Device Vision & Risk Model...",
    reportQueueTitle: "Offline Report Queue",
    queuedBadge: "QUEUED (Offline)",
    syncedBadge: "SYNCED (Online)",
    syncNowButton: "Simulate Cloud Sync",
    clearQueueButton: "Clear Stored Reports",
    
    // Hazards
    hazardCrack: "Surface Tension Crack in Soil/Road",
    hazardSeepage: "Water Seepage / Wet Jhora Erosion",
    hazardWallBulge: "Bulging Stone/Concrete Retaining Wall",
    hazardTiltedTrees: "Tilted Trees / Leaning Utility Poles (Soil Creep)",
    hazardDebris: "Fresh Rockfall / Mud Debris Accumulation",
    
    // Severities
    sevLow: "Low Caution",
    sevMedium: "Moderate Hazard",
    sevHigh: "Severe Warning",
    sevCritical: "Critical / Immediate Danger",

    // B6: Road Status Mesh
    meshTitle: "Hill Road Status Mesh",
    meshSubtitle: "Crowd-sourced road blockages propagated peer-to-peer. On-device LLM deduplicates and summarizes corridors.",
    corridorLabel: "Select Mountain Corridor:",
    passableLabel: "Passability Status:",
    passableYes: "Passable (Slow / Light Vehicles)",
    passableNo: "BLOCKED / Closed to All Traffic",
    passableCaution: "High Clearance 4WD Only",
    locationDetailLabel: "Specific Milepost / Landmark:",
    locationDetailPlaceholder: "e.g. Kurseong 14th Mile near Paglajhora...",
    submitRoadReport: "Log Road Report to Mesh",
    dedupSummaryTitle: "AI Route Status Board (Deduplicated & Summarized)",
    liveMeshFeedTitle: "Recent P2P Road Reports",
    noReportsYet: "No road reports logged yet in this session.",
    
    // B7: Disaster-Ready Assistant
    guideTitle: "Disaster-Ready Hills Assistant",
    guideSubtitle: "Grounded emergency response guidance and GPS distance to nearest functional health centers & shelters.",
    askAiPlaceholder: "Ask offline: 'What to do in landslide?', 'How to purify spring water?', 'Signs of hill collapse'...",
    askAiButton: "Consult Offline AI Guide",
    guidanceCategoriesTitle: "Step-by-Step Emergency Field Guides",
    nearestSheltersTitle: "Nearest Emergency Shelters & PHCs",
    calculatingGps: "Acquiring GPS location for distance calculation...",
    gpsDisabledNote: "Using standard Darjeeling Himalayan center coordinates (GPS optional).",
    filterAll: "All Facilities",
    filterHospitals: "Hospitals / Trauma",
    filterShelters: "Community Shelters",
    distanceKm: "km away",
    elevationLabel: "Elevation:",
    bedsLabel: "Capacity:",
    contactLabel: "Emergency Contact:",
    
    // B1 / B6: P2P Relay
    relayTitle: "Zero-Signal P2P Alert Relay",
    relaySubtitle: "Broadcast emergency alerts and road updates to nearby phones without cellular internet or towers.",
    relayBroadcastTitle: "Broadcast an Emergency Alert",
    alertInputPlaceholder: "e.g. HIGH RISK: Mudslide active at Paglajhora. Divert to Pankhabari Road.",
    broadcastBtn: "Generate Offline Relay Beacon (QR / DataChannel)",
    scanQrBtn: "Scan / Ingest Incoming Relay Beacon",
    receivedAlertsTitle: "Received Peer-to-Peer Alerts",
    noAlertsYet: "No relayed alerts received yet.",
    relayMethodNote: "Transmits via local WebRTC DataChannels, Web Bluetooth or optical QR payload when cell towers are dead.",
    
    // High contrast toggle & Audio
    highContrastToggle: "Sunlight High-Contrast",
    soundSiren: "Play Emergency Alert Horn",
    speakAloud: "Read Aloud (TTS)",
    
    // General
    timeAgoJustNow: "Just now",
    timeAgoMins: "min ago",
    km: "km"
  },

  ne: {
    appName: "पहाडरक्षक",
    appTagline: "पहाडी भेगका लागि अफलाइन विपद् तथा सडक मेश प्रणाली",
    airplaneModeNotice: "१००% अफलाइन PWA · हवाइजहाज मोड (Airplane Mode) मा चल्ने",
    statusOnline: "इन्टरनेट जोडिएको (सिंक चालु)",
    statusOffline: "अफलाइन मोड (IndexedDB सक्रिय)",
    
    tabReporter: "पहिरो",
    tabMesh: "सडक",
    tabGuide: "गाइड",
    tabRelay: "रिले",
    
    reporterTitle: "अफलाइन भित्तो/पहिरो जोखिम रिपोर्टर",
    reporterSubtitle: "पहाडी भित्तो, पर्खाल वा सडकको फोटो खिच्नुहोस्। अन-डिभाइस एआईले जोखिम विश्लेषण गरी अफलाइन भण्डारण गर्दछ।",
    capturePhoto: "क्यामेराबाट फोटो खिच्नुहोस्",
    uploadPhoto: "ग्यालरी वा फाइलबाट छान्नुहोस्",
    hazardTypeLabel: "देखिएको जोखिमको प्रकार:",
    notesLabel: "थप विवरण (ऐच्छिक):",
    notesPlaceholder: "जस्तै: पर्खालबाट पानी बगिरहेको छ, सडक २ इन्च फाटेको छ...",
    analyzeButton: "अन-डिभाइस एआईबाट विश्लेषण गर्नुहोस्",
    analyzingText: "अन-डिभाइस मोडल चल्दैछ...",
    reportQueueTitle: "अफलाइन रिपोर्ट लाम (Queue)",
    queuedBadge: "लाममा (अफलाइन)",
    syncedBadge: "सिंक भयो (अनलाइन)",
    syncNowButton: "सिंक परिक्षण गर्नुहोस्",
    clearQueueButton: "रिपोर्टहरू मेटाउनुहोस्",
    
    hazardCrack: "माटो वा सडकमा परेको चिरा/फाटो",
    hazardSeepage: "भित्तोबाट पानी रसाएको / झोड़ा कटान",
    hazardWallBulge: "बाहिर निस्किएको/फुलेको ढुङ्गाको पर्खाल",
    hazardTiltedTrees: "ढल्किएका रूख वा बिजुलीका पोलहरू",
    hazardDebris: "ताजा ढुङ्गा खसेको वा लेदो जम्मा भएको",
    
    sevLow: "सामान्य सतर्कता",
    sevMedium: "मध्यम जोखिम",
    sevHigh: "उच्च खतरा चेतावनी",
    sevCritical: "अत्यन्तै गम्भीर / तुरुन्तै सुरक्षित हुनुहोस्",

    meshTitle: "पहाडी सडक अवस्था मेश",
    meshSubtitle: "सडक अवरोधको खबर फोन-देखि-फोन फैलिन्छ। अन-डिभाइस एलएलएमले सडक अवस्थाको संक्षेप निकाल्छ।",
    corridorLabel: "पहाडी सडक छान्नुहोस्:",
    passableLabel: "सडक सञ्चालन अवस्था:",
    passableYes: "खुल्ला (हल्का गाडी/सावधानीपूर्वक)",
    passableNo: "पूर्ण बन्द / सबै यातायात ठप्प",
    passableCaution: "4WD ठूला गाडी मात्र चल्ने",
    locationDetailLabel: "स्थान वा ल्याण्डमार्क:",
    locationDetailPlaceholder: "जस्तै: पगलाझोड़ा नजिक १४ माइल, खरसाङ...",
    submitRoadReport: "सडक रिपोर्ट दर्ता गर्नुहोस्",
    dedupSummaryTitle: "एआई सडक अवस्था बोर्ड (संक्षिप्त जानकारी)",
    liveMeshFeedTitle: "हालै प्राप्त सडक रिपोर्टहरू",
    noReportsYet: "अहिलेसम्म कुनै सडक रिपोर्ट दर्ता भएको छैन।",
    
    guideTitle: "विपद्-तयारी पहाडी सहायक",
    guideSubtitle: "पहिरो, बाढी, चिसो र अस्पताल विच्छेद हुँदा तत्काल अपनाउने उपाय तथा नजिकको स्वास्थ्य केन्द्र/आश्रय।",
    askAiPlaceholder: "अफलाइन प्रश्न सोध्नुहोस्: 'पहिरो जाँदा के गर्ने?', 'पानी कसरी शुद्ध गर्ने?', 'पर्खाल फुट्न लाग्दा के गर्ने?'...",
    askAiButton: "अफलाइन एआई गाइडसँग सोध्नुहोस्",
    guidanceCategoriesTitle: "चरणबद्ध आपतकालीन प्राथमिक गाइड",
    nearestSheltersTitle: "नजिकैका आपतकालीन स्वास्थ्य केन्द्र र आश्रयहरू",
    calculatingGps: "दूरी गणनाका लागि जीपीएस स्थान लिँदै...",
    gpsDisabledNote: "दार्जिलिङ पहाडी क्षेत्रको केन्द्र विन्दु प्रयोग गरिएको छ।",
    filterAll: "सबै केन्द्रहरू",
    filterHospitals: "अस्पताल / ट्रमा युनिट",
    filterShelters: "सामुदायिक आश्रय स्थल",
    distanceKm: "कि.मि. टाढा",
    elevationLabel: "उचाइ:",
    bedsLabel: "क्षमता:",
    contactLabel: "आपतकालीन सम्पर्क:",
    
    relayTitle: "शून्य-नेटवर्क P2P चेतावनी रिले",
    relaySubtitle: "मोबाइल टावर नहुँदा पनि छेउछाउका फोनहरूमा विपद् चेतावनी र सडक जानकारी पठाउनुहोस्।",
    relayBroadcastTitle: "आपतकालीन चेतावनी प्रसारण गर्नुहोस्",
    alertInputPlaceholder: "जस्तै: खतरा चेतावनी: पगलाझोड़ामा पहिरो खसिरहेको छ। रोहिणी वा पंखाबारी सडक प्रयोग गर्नुहोस्।",
    broadcastBtn: "अफलाइन रिले बीकन (QR / WebRTC) बनाउनुहोस्",
    scanQrBtn: "आएको चेतावनी स्क्यान / ग्रहण गर्नुहोस्",
    receivedAlertsTitle: "प्राप्त भएका मेश चेतावनीहरू",
    noAlertsYet: "अहिलेसम्म कुनै चेतावनी प्राप्त भएको छैन।",
    relayMethodNote: "टावर नहुँदा स्थानीय WebRTC डेटा च्यानल वा QR कोड मार्फत फोन-देखि-फोन सन्देश जान्छ।",
    
    highContrastToggle: "घाममा पढ्न उच्च कन्ट्रास्ट",
    soundSiren: "आपतकालीन साइरन बजाउनुहोस्",
    speakAloud: "आवाजमा सुन्नुहोस् (TTS)",
    
    timeAgoJustNow: "भर्खरै",
    timeAgoMins: "मिनेट अगाडि",
    km: "कि.मि."
  },

  hi: {
    appName: "पहाड़रक्षक",
    appTagline: "पहाड़ी क्षेत्रों के लिए ऑफलाइन आपदा एवं सड़क मेश प्रणाली",
    airplaneModeNotice: "100% ऑफलाइन PWA · एयरप्लेन मोड में पूर्ण सक्षम",
    statusOnline: "इंटरनेट कनेक्टेड (सिंकिंग चालू)",
    statusOffline: "ऑफलाइन मोड (IndexedDB सक्रिय)",
    
    tabReporter: "भूस्खलन",
    tabMesh: "सड़क",
    tabGuide: "गाइड",
    tabRelay: "रिले",
    
    reporterTitle: "ऑफलाइन ढलान व भूस्खलन खतरा रिपोर्टर",
    reporterSubtitle: "पहाड़ी ढलान या दीवार की तस्वीर लें। ऑन-डिवाइस एआई जोखिम का विश्लेषण कर रिपोर्ट ऑफलाइन सहेजता है।",
    capturePhoto: "कैमरे से फोटो लें",
    uploadPhoto: "गैलरी / फाइल से चुनें",
    hazardTypeLabel: "देखे गए खतरे का प्रकार:",
    notesLabel: "अतिरिक्त विवरण (वैकल्पिक):",
    notesPlaceholder: "उदा: दीवार के पास से तेज पानी बह रहा है, सड़क में 2 इंच की दरार है...",
    analyzeButton: "ऑन-डिवाइस एआई द्वारा विश्लेषण करें",
    analyzingText: "ऑन-डिवाइस मॉडल द्वारा विश्लेषण जारी...",
    reportQueueTitle: "ऑफलाइन रिपोर्ट कतार",
    queuedBadge: "कतार में (ऑफलाइन)",
    syncedBadge: "सिंक हो गया (ऑनलाइन)",
    syncNowButton: "सिंक का परीक्षण करें",
    clearQueueButton: "सहेजी गई रिपोर्ट हटाएं",
    
    hazardCrack: "मिट्टी या सड़क में दरार/तनाव रेखा",
    hazardSeepage: "दीवार से पानी का रिसाव / नाले का कटाव",
    hazardWallBulge: "बाहर की ओर उभरी हुई पत्थर/कंक्रीट की दीवार",
    hazardTiltedTrees: "झुके हुए पेड़ या बिजली के खंभे (मिट्टी का खिसकना)",
    hazardDebris: "ताजा गिरे पत्थर या मलबे का ढेर",
    
    sevLow: "सावधानी",
    sevMedium: "मध्यम जोखिम",
    sevHigh: "गंभीर चेतावनी",
    sevCritical: "अत्यंत खतरनाक / तुरंत सुरक्षित स्थान पर जाएं",

    meshTitle: "पहाड़ी सड़क स्थिति मेश",
    meshSubtitle: "सड़क रुकावट की जानकारी फोन-दर-फोन फैलती है। ऑन-डिवाइस एलएलएम सारांश तैयार करता है।",
    corridorLabel: "पहाड़ी मार्ग चुनें:",
    passableLabel: "सड़क की स्थिति:",
    passableYes: "चालू (सावधानीपूर्वक / हल्के वाहन)",
    passableNo: "पूरी तरह बंद / सभी वाहनों के लिए अवरुद्ध",
    passableCaution: "केवल 4WD ऊंचे वाहन",
    locationDetailLabel: "विशिष्ट स्थान या मील का पत्थर:",
    locationDetailPlaceholder: "उदा: पगलाझोड़ा के पास 14वां मील, कुर्सियांग...",
    submitRoadReport: "सड़क रिपोर्ट दर्ज करें",
    dedupSummaryTitle: "एआई सड़क स्थिति बोर्ड (संक्षिप्त एवं सत्यापित)",
    liveMeshFeedTitle: "हालिया सड़क रिपोर्टें",
    noReportsYet: "अभी तक कोई सड़क रिपोर्ट दर्ज नहीं की गई है।",
    
    guideTitle: "आपदा-तैयार पहाड़ सहायक",
    guideSubtitle: "भूस्खलन, बादल फटने या अस्पताल से संपर्क कटने पर त्वरित प्राथमिक उपचार व निकटतम आश्रय केंद्र।",
    askAiPlaceholder: "ऑफलाइन पूछें: 'भूस्खलन के समय क्या करें?', 'पानी कैसे शुद्ध करें?', 'दीवार झुकने पर सुरक्षा'...",
    askAiButton: "ऑफलाइन एआई गाइड से सलाह लें",
    guidanceCategoriesTitle: "चरणबद्ध आपातकालीन प्राथमिक मार्गदर्शिका",
    nearestSheltersTitle: "निकटतम आपातकालीन स्वास्थ्य केंद्र व आश्रय स्थल",
    calculatingGps: "दूरी की गणना के लिए जीपीएस लोकेशन प्राप्त की जा रही है...",
    gpsDisabledNote: "दार्जिलिंग पहाड़ी क्षेत्र का मानक केंद्र बिंदु प्रयुक्त हो रहा है।",
    filterAll: "सभी केंद्र",
    filterHospitals: "अस्पताल / ट्रॉमा यूनिट",
    filterShelters: "सामुदायिक आश्रय केंद्र",
    distanceKm: "किमी दूर",
    elevationLabel: "ऊंचाई:",
    bedsLabel: "क्षमता:",
    contactLabel: "आपातकालीन संपर्क:",
    
    relayTitle: "शून्य-नेटवर्क P2P आपातकालीन रिले",
    relaySubtitle: "बिना मोबाइल नेटवर्क के नजदीकी फोन तक आपातकालीन चेतावनी व सड़क अपडेट पहुंचाएं।",
    relayBroadcastTitle: "आपातकालीन चेतावनी प्रसारित करें",
    alertInputPlaceholder: "उदा: उच्च खतरा: पगलाझोड़ा पर भूस्खलन सक्रिय है। रोहिणी या पंखाबारी मार्ग का उपयोग करें।",
    broadcastBtn: "ऑफलाइन रिले बीकन (QR / WebRTC) बनाएं",
    scanQrBtn: "प्राप्त चेतावनी स्कैन / ग्रहण करें",
    receivedAlertsTitle: "प्राप्त मेश चेतावनियां",
    noAlertsYet: "अभी तक कोई चेतावनी प्राप्त नहीं हुई है।",
    relayMethodNote: "टावर न होने पर स्थानीय WebRTC या QR कोड के माध्यम से सीधे फोन-से-फोन संदेश जाता है।",
    
    highContrastToggle: "धूप में पढ़ने योग्य हाई-कंट्रास्ट",
    soundSiren: "आपातकालीन सायरन बजाएं",
    speakAloud: "बोलकर सुनाएं (TTS)",
    
    timeAgoJustNow: "अभी-अभी",
    timeAgoMins: "मिनट पहले",
    km: "किमी"
  },

  bn: {
    appName: "পাহাড়রক্ষক",
    appTagline: "পাহাড়ি অঞ্চলের জন্য অফলাইন বিপর্যয় ও সড়ক মেশ ব্যবস্থা",
    airplaneModeNotice: "১০০% অফলাইন PWA · এয়ারপ্লেন মোডে সম্পূর্ণ কার্যকর",
    statusOnline: "ইন্টারনেট সংযুক্ত (সিঙ্ক চালু)",
    statusOffline: "অফলাইন মোড (IndexedDB সক্রিয়)",
    
    tabReporter: "ভূমিধস",
    tabMesh: "রাস্তা",
    tabGuide: "গাইড",
    tabRelay: "রিলে",
    
    reporterTitle: "অফলাইন ঢাল ও ভূমিধস ঝুঁকি রিপোর্টার",
    reporterSubtitle: "পাহাড়ি ঢাল বা ক্ষতিগ্রস্ত প্রাচীরের ছবি তুলুন। ডিভাইসের এআই ঝুঁকি মূল্যায়ন করে অফলাইনে সংরক্ষণ করবে।",
    capturePhoto: "ক্যামেরা দিয়ে ছবি তুলুন",
    uploadPhoto: "গ্যালারি বা ফাইল থেকে নির্বাচন করুন",
    hazardTypeLabel: "দৃশ্যমান বিপদের ধরন:",
    notesLabel: "অতিরিক্ত বিবরণ (ঐচ্ছিক):",
    notesPlaceholder: "যেমন: রিটেনিং ওয়ালের পাশ দিয়ে জল চুইয়ে পড়ছে, রাস্তায় ফাটল...",
    analyzeButton: "অন-ডিভাইস এআই দিয়ে বিশ্লেষণ করুন",
    analyzingText: "ডিভাইসের এআই মডেল কাজ করছে...",
    reportQueueTitle: "অফলাইন রিপোর্ট কিউ (Queue)",
    queuedBadge: "কিউতে আছে (অফলাইন)",
    syncedBadge: "সিঙ্ক হয়েছে (অনলাইন)",
    syncNowButton: "সিঙ্ক পরীক্ষা করুন",
    clearQueueButton: "রিপোর্ট মুছে ফেলুন",
    
    hazardCrack: "মাটি বা রাস্তায় ফাটল / টান",
    hazardSeepage: "দেওয়াল থেকে জল চুইয়ে পড়া / ঝোরার ক্ষয়",
    hazardWallBulge: "বাইরে ফুলে ওঠা পাথরের রিটেনিং ওয়াল",
    hazardTiltedTrees: "হেলে পড়া গাছ বা বৈদ্যুতিক খুঁটি",
    hazardDebris: "টাটকা পাথর ধস বা কাদার স্তূপ",
    
    sevLow: "সতর্কতা",
    sevMedium: "মাঝারি ঝুঁকি",
    sevHigh: "গুরুতর সতর্কবার্তা",
    sevCritical: "চরম বিপদ / অবিলম্বে নিরাপদ আশ্রয়ে যান",

    meshTitle: "পাহাড়ি রাস্তার অবস্থা মেশ",
    meshSubtitle: "রাস্তা অবরোধের খবর এক ফোন থেকে অন্য ফোনে ছড়িয়ে পড়ে। ডিভাইসের এআই সারাংশ তৈরি করে।",
    corridorLabel: "পাহাড়ি রাস্তা নির্বাচন করুন:",
    passableLabel: "যানবাহন চলাচলের অবস্থা:",
    passableYes: "খোলা আছে (হালকা গাড়ি / সতর্কতার সাথে)",
    passableNo: "সম্পূর্ণ বন্ধ / সব ধরনের গাড়ি চলাচল বন্ধ",
    passableCaution: "শুধুমাত্র উঁচু 4WD গাড়ি",
    locationDetailLabel: "নির্দিষ্ট মাইলফলক বা ল্যান্ডমার্ক:",
    locationDetailPlaceholder: "যেমন: পাগলাঝোরার কাছে ১৪ মাইল, কার্শিয়াং...",
    submitRoadReport: "রোড রিপোর্ট জমা দিন",
    dedupSummaryTitle: "এআই রুট স্ট্যাটাস বোর্ড (সারাংশ)",
    liveMeshFeedTitle: "সাম্প্রতিক রোড রিপোর্টসমূহ",
    noReportsYet: "এখনও কোনো রোড রিপোর্ট জমা পড়েনি।",
    
    guideTitle: "দুর্যোগ-প্রস্তুত পাহাড় সহায়ক",
    guideSubtitle: "ভূমিধস, মেঘভাঙা বৃষ্টি ও হাসপাতাল বিচ্ছিন্নতায় প্রাথমিক চিকিৎসা এবং নিকটস্থ স্বাস্থ্যকেন্দ্রের দূরত্ব।",
    askAiPlaceholder: "অফলাইনে প্রশ্ন করুন: 'ভূমিধসে কী করণীয়?', 'ঝরনার জল কীভাবে শোধন করবেন?', 'প্রাচীর ঝুঁকলে কী করবেন?'...",
    askAiButton: "অফলাইন এআই গাইডের পরামর্শ নিন",
    guidanceCategoriesTitle: "ধাপে ধাপে জরুরি প্রাথমিক সহায়িকা",
    nearestSheltersTitle: "নিকটবর্তী জরুরি স্বাস্থ্যকেন্দ্র ও আশ্রয়স্থল",
    calculatingGps: "দূরত্ব নির্ণয়ের জন্য জিপিএস লোকেশন নেওয়া হচ্ছে...",
    gpsDisabledNote: "দার্জিলিং পাহাড়ি অঞ্চলের মূল কেন্দ্র ব্যবহৃত হচ্ছে।",
    filterAll: "সব কেন্দ্র",
    filterHospitals: "হাসপাতাল / ট্রমা ইউনিট",
    filterShelters: "কমিউনিটি আশ্রয়স্থল",
    distanceKm: "কিমি দূরে",
    elevationLabel: "উচ্চতা:",
    bedsLabel: "ধারণক্ষমতা:",
    contactLabel: "জরুরি যোগাযোগ:",
    
    relayTitle: "জিরো-নেটওয়ার্ক P2P সতর্কতা রিলে",
    relaySubtitle: "মোবাইল টাওয়ার না থাকলেও কাছাকাছি ফোনে জরুরি সতর্কতা ও রাস্তার তথ্য পাঠান।",
    relayBroadcastTitle: "জরুরি সতর্কতা সম্প্রচার করুন",
    alertInputPlaceholder: "যেমন: জরুরি সতর্কতা: পাগলাঝোরায় ভূমিধস চলছে। রোহিনী বা পঙ্খাবাড়ি রোড ব্যবহার করুন।",
    broadcastBtn: "অফলাইন রিলে বীকন (QR / WebRTC) তৈরি করুন",
    scanQrBtn: "প্রাপ্ত সতর্কতা স্ক্যান / গ্রহণ করুন",
    receivedAlertsTitle: "প্রাপ্ত মেশ সতর্কবার্তা",
    noAlertsYet: "এখনও কোনো সতর্কতা পাওয়া যায়নি।",
    relayMethodNote: "টাওয়ার না থাকলে লোকাল WebRTC বা QR কোডের মাধ্যমে ফোন-টু-ফোন বার্তা পাঠানো হয়।",
    
    highContrastToggle: "রোদে পড়ার জন্য হাই-কনট্রাস্ট",
    soundSiren: "জরুরি সাইরেন বাজান",
    speakAloud: "মুখে শুনুন (TTS)",
    
    timeAgoJustNow: "এইমাত্র",
    timeAgoMins: "মিনিট আগে",
    km: "কিমি"
  }
};

let currentLang = 'en';

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('pahar_lang', lang);
  }
}

export function getLanguage() {
  return localStorage.getItem('pahar_lang') || currentLang;
}

export function t(key) {
  const lang = getLanguage();
  return (translations[lang] && translations[lang][key]) || translations['en'][key] || key;
}
