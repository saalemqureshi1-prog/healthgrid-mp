(function () {
'use strict';
const KEY = 'healthgrid_mp_v1', LANG_KEY = 'healthgrid_lang';
const CFG = window.HG_CONFIG || {};
const ONLINE = !!(CFG.url && CFG.key && window.supabase);
const sb = ONLINE ? window.supabase.createClient(CFG.url, CFG.key) : null;
let me = { role: 'admin', facility: null, email: 'demo' };
const canAct = () => me.role === 'admin';

// ---------- Language (Hindi / English) ----------
let LANG = 'hi';
try { const l = localStorage.getItem(LANG_KEY); if (l === 'hi' || l === 'en') LANG = l; } catch (e) {}

const I18N = {
hi: {
  brandSub: 'मध्य प्रदेश जिला स्वास्थ्य रेस्क्यू इंजन',
  tabAdmin: 'एडमिन डैशबोर्ड', tabStaff: 'स्टाफ पोर्टल',
  skipTitle: 'डेमो: डेडलाइन पार होने पर ऑटो-एस्केलेशन देखें',
  logout: 'लॉगआउट', reset: 'डेटा रीसेट',
  banner: '⚠ सिम्युलेटेड डेटा: यह डेमो डेटा है, असली अस्पताल रिकॉर्ड नहीं। अंतिम स्वीकृति हमेशा एडमिनिस्ट्रेटर की होती है।',
  loginTitle: 'HealthGrid MP: लॉगिन', loginSub: 'एडमिन, सरकारी व्यूअर या फैसिलिटी स्टाफ',
  email: 'ईमेल', pass: 'पासवर्ड', loginBtn: 'लॉगिन',
  mapTitle: 'नक्शा: फैसिलिटी जोखिम', legSafe: 'सुरक्षित', legReview: 'समीक्षा', legHigh: 'उच्च जोखिम',
  radarTitle: 'प्रेडिक्टिव क्राइसिस रडार',
  exchTitle: 'स्मार्ट रिसोर्स एक्सचेंज', exchSub: 'सरप्लस वेरिफाई करके ट्रांसफर की सिफारिश',
  distTitle: 'जिला रैंकिंग (जोखिम के अनुसार)',
  thDist: 'जिला', thHigh: 'उच्च', thReview: 'समीक्षा', thScore: 'जोखिम स्कोर',
  simTitle: 'व्हाट-इफ सिमुलेटर', simDelay: 'सप्लाई में देरी', days: 'दिन', simSurge: 'मांग में उछाल',
  surge0: '0%', surge20: '+20% (मानसून)', surge50: '+50% (प्रकोप)',
  simMed: 'दवा', simGo: 'विश्लेषण चलाएँ', medAll: 'सभी दवाइयाँ',
  copTitle: 'हिंदी/अंग्रेज़ी कोपायलट', copSub: 'रिकॉर्ड से जवाब, रूल-आधारित',
  qPh: 'जैसे: कौन से बेड 85% से ज़्यादा भरे हैं?', ask: 'पूछें',
  chip1: 'सबसे जरूरी 5 समस्याएं', chip2: 'दवा की कमी कहाँ है?', chip3: 'बेड 85% से ज़्यादा',
  chip4: 'कहाँ extra stock है?', chip5: 'डॉक्टर अनुपस्थित',
  logTitle: 'एक्शन लॉग', logSub: '(जवाबदेही)', logEmpty: 'अभी कोई एक्शन नहीं।',
  lblDist: 'जिला', lblFac: 'फैसिलिटी',
  billTitle: '💊 बिलिंग / डिस्पेंसिंग', billNote: 'दवा देने पर स्टॉक अपने आप कम होता है, अलग से एंट्री की ज़रूरत नहीं।',
  dGo: 'दवा दें', rGo: 'स्टॉक प्राप्त', bedsDocsTitle: '🛏 बेड और 🩺 डॉक्टर',
  footer: 'प्रोटोटाइप: HealthGrid MP · सिम्युलेटेड डेटा · ब्राउज़र के localStorage में सेव होता है',
  allMP: 'पूरा मध्य प्रदेश (55 जिले)',
  kpiFac: 'फैसिलिटी', kpiHigh: 'उच्च जोखिम वाली फैसिलिटी', kpiReview: 'समीक्षा',
  kpiStock: 'गंभीर स्टॉक (<3 दिन)', kpiBed: 'बेड ओवरलोड (≥85%)', kpiDoc: 'डॉक्टर कवरेज गैप',
  alertCount: '(कुल {n}, शीर्ष 15)', alertNone: 'कोई अलर्ट नहीं।',
  assigned: 'असाइन: CMHO {d} · डेडलाइन: {x}', expired: 'खत्म', hrs: '{n} घंटे',
  escalated: 'एस्केलेट → State Commissioner', auto: ' (ऑटो)', escBtn: 'एस्केलेट',
  sevHigh: 'उच्च', sevReview: 'समीक्षा',
  stockText: '{med}: {d} दिन का स्टॉक बचा ({q} {u})',
  bedText: 'बेड ऑक्यूपेंसी {p}% ({o}/{t})',
  docText: 'कोई डॉक्टर मौजूद नहीं (अटेंडेंस वेरिफाई करें)',
  recNoDonor: '{med} {d} दिन।', noVerified: 'वेरिफाइड सरप्लस नहीं मिला', noVerifiedHint: 'जिला सप्लाई से रीप्लेनिशमेंट का अनुरोध करें।',
  recMove: '{med}: <b>{q} {u}</b> ट्रांसफर', recPartial: ' (पूरी ज़रूरत {n}, बाकी जिला सप्लाई से)',
  recReserve: 'डोनर का {n}-दिन का रिज़र्व बचा रहेगा।',
  approve: 'स्वीकृत करें', reject: 'अस्वीकार करें', adminOnly: 'स्वीकृति केवल एडमिन कर सकता है',
  recNone: 'इस दायरे में कोई लंबित सिफारिश नहीं।',
  mapFail: 'नक्शा लोड नहीं हुआ (इंटरनेट जांचें)।', allGood: 'सब ठीक',
  seedEmpty: 'डेटाबेस खाली है।', seedBtn: 'MP का डेमो डेटा लोड करें (220 फैसिलिटी)', seedWait: 'डेटाबेस अभी खाली है। एडमिन से डेटा लोड करवाएँ।',
  simP: 'अगर सप्लाई <b>{d} दिन</b> लेट हो और मांग <b>+{s}%</b> बढ़े:',
  simL1: '<b>{n}</b> फैसिलिटी-दवा संयोजन सप्लाई आने से पहले खत्म हो सकते हैं।',
  simL2: 'वेरिफाइड सरप्लस से <b>{c}</b> कवर हो सकते हैं; <b>{r}</b> के लिए आपातकालीन जिला सप्लाई चाहिए।',
  simL3: 'सबसे ज़्यादा प्रभावित जिले: {top}', simNone: 'कोई नहीं',
  simNote: 'योजना अनुमान: पारदर्शी नियमों पर आधारित है, ट्रेंड ML मॉडल अभी जुड़ा नहीं है।',
  askUnknown: 'समझ नहीं आया। पूछिए: दवा की कमी, बेड ऑक्यूपेंसी, डॉक्टर, extra stock, या "सबसे जरूरी 5 समस्याएं"। जिले का नाम भी लिख सकते हैं।',
  tBed: 'बेड ऑक्यूपेंसी ≥ 85%', tDoc: 'डॉक्टर कवरेज गैप', tSurplus: 'वेरिफाइड सरप्लस स्टॉक (शीर्ष 8)',
  tUrgent: 'सबसे जरूरी 5 समस्याएं', tShort: 'दवा की कमी का जोखिम', wholeMP: 'पूरे MP',
  surplusRow: '{f}: {m}, {q} {u} सरप्लस', noRec: 'कोई रिकॉर्ड नहीं मिला।',
  ansNote: 'जवाब सीधे सिस्टम रिकॉर्ड से आया है; कोई संख्या गढ़ी नहीं गई।',
  rSafe: 'सुरक्षित', rReview: 'समीक्षा', rHigh: 'उच्च जोखिम',
  thMed: 'दवा', thStock: 'स्टॉक', thUse: 'रोज़ की खपत', thLeft: 'बचे दिन',
  bedsLine: '<b>बेड:</b> {o}/{t} भरे हुए ({p}%)', admit: '+ भर्ती', discharge: '− छुट्टी',
  docAtt: 'डॉक्टर उपस्थिति', mQR: 'QR स्कैन (सिम्युलेटेड)', mGPS: 'GPS जियोफेंस (सिम्युलेटेड)', mSelfie: 'सेल्फी वेरिफाई (सिम्युलेटेड)',
  present: 'उपस्थित', absent: 'अनुपस्थित', checkin: 'चेक-इन', checkout: 'चेक-आउट',
  logDispense: '{f}: {q} {u} {m} दी गई', logReceive: '{f}: {q} {u} {m} स्टॉक प्राप्त हुआ',
  logEsc: 'अलर्ट एस्केलेट हुआ → State Commissioner ({x})',
  logApprove: 'स्वीकृत: {q} {u} {m}, {from} → {to}', logReject: 'अस्वीकृत ट्रांसफर: {k}',
  logSeed: 'एडमिन ने MP डेमो डेटा लोड किया (220 फैसिलिटी)', logSkip: 'डेमो: घड़ी +24 घंटे आगे',
  logBed: '{f}: बेड {a} ({o}/{t})', wAdmit: 'भर्ती', wDisch: 'छुट्टी',
  logDoc: '{f}: {n} {a} ({m})',
  saveFail: 'सेव नहीं हुआ: ', qtyBad: 'सही मात्रा डालें', noStockMsg: 'इतना स्टॉक नहीं है ({n} बचा है)',
  donorLow: 'डोनर का सरप्लस अब कम है, दोबारा वेरिफाई करें', resetConfirm: 'सारा डेमो डेटा रीसेट करें?',
  roleMissing: 'आपका रोल सेट नहीं है। एडमिन से प्रोफ़ाइल बनवाएँ।', loadFail: 'डेटा लोड नहीं हुआ: ', loginFail: 'लॉगिन फेल: ',
  demoMode: 'डेमो मोड (सिर्फ़ इसी ब्राउज़र में)', roleAdmin: 'एडमिन', roleViewer: 'सरकारी व्यूअर (केवल पढ़ने के लिए)', roleStaff: 'फैसिलिटी स्टाफ',
  chatOpen: '🤖 AI से पूछें', chatTitle: 'HealthGrid AI सहायक', chatClear: 'साफ़ करें', chatSend: 'भेजें',
  chatPh: 'अपना सवाल लिखें…',
  chatHello: 'नमस्ते! मैं HealthGrid का AI सहायक हूँ। मैं मौजूदा अलर्ट, स्टॉक, बेड, डॉक्टर कवरेज और ट्रांसफर सिफारिशों के बारे में बता सकता हूँ। अंतिम फैसला हमेशा एडमिन का होता है।',
  chatThinking: 'सोच रहा हूँ…', chatErr: 'AI से जवाब नहीं मिला। थोड़ी देर बाद फिर कोशिश करें।',
  chatOffline: 'AI सर्वर जुड़ा नहीं है, इसलिए रूल-आधारित जवाब:', chatWait: 'कृपया थोड़ा रुकें…',
  chatNote: 'AI गलती कर सकता है। ज़रूरी फैसले से पहले रिकॉर्ड जांच लें।'
},
en: {
  brandSub: 'Madhya Pradesh District Health Rescue Engine',
  tabAdmin: 'Admin Dashboard', tabStaff: 'Staff Portal',
  skipTitle: 'Demo: see auto-escalation after deadlines pass',
  logout: 'Logout', reset: 'Reset data',
  banner: '⚠ Simulated data: this is demo data, not real hospital records. Final approval always rests with the administrator.',
  loginTitle: 'HealthGrid MP: Login', loginSub: 'Admin, Govt viewer or Facility staff',
  email: 'Email', pass: 'Password', loginBtn: 'Login',
  mapTitle: 'Map: facility risk', legSafe: 'Safe', legReview: 'Review', legHigh: 'High risk',
  radarTitle: 'Predictive Crisis Radar',
  exchTitle: 'Smart Resource Exchange', exchSub: 'verified surplus, recommended transfers',
  distTitle: 'District ranking (by risk)',
  thDist: 'District', thHigh: 'High', thReview: 'Review', thScore: 'Risk score',
  simTitle: 'What-If Simulator', simDelay: 'Supply delay', days: 'days', simSurge: 'Demand surge',
  surge0: '0%', surge20: '+20% (monsoon)', surge50: '+50% (outbreak)',
  simMed: 'Medicine', simGo: 'Run analysis', medAll: 'All medicines',
  copTitle: 'Hindi/English Copilot', copSub: 'answers from records, rule-based',
  qPh: 'e.g. Which facilities have beds above 85% full?', ask: 'Ask',
  chip1: 'Top 5 urgent problems', chip2: 'Where is medicine short?', chip3: 'Beds above 85% full',
  chip4: 'Where is extra stock?', chip5: 'Doctors absent',
  logTitle: 'Action log', logSub: '(accountability)', logEmpty: 'No actions yet.',
  lblDist: 'District', lblFac: 'Facility',
  billTitle: '💊 Billing / Dispensing', billNote: 'Stock reduces automatically when medicine is dispensed. No separate entry needed.',
  dGo: 'Dispense', rGo: 'Stock received', bedsDocsTitle: '🛏 Beds & 🩺 Doctors',
  footer: 'Prototype: HealthGrid MP · simulated data · saved in browser localStorage',
  allMP: 'All of Madhya Pradesh (55 districts)',
  kpiFac: 'Facilities', kpiHigh: 'High-risk facilities', kpiReview: 'Review',
  kpiStock: 'Critical stock (<3 days)', kpiBed: 'Bed overload (≥85%)', kpiDoc: 'Doctor coverage gap',
  alertCount: '({n} total, top 15)', alertNone: 'No alerts.',
  assigned: 'Assigned: CMHO {d} · Deadline: {x}', expired: 'expired', hrs: '{n} hrs',
  escalated: 'Escalated → State Commissioner', auto: ' (auto)', escBtn: 'Escalate',
  sevHigh: 'High', sevReview: 'Review',
  stockText: '{med}: {d} days of stock left ({q} {u})',
  bedText: 'Bed occupancy {p}% ({o}/{t})',
  docText: 'No doctor present (please verify attendance)',
  recNoDonor: '{med} {d} days.', noVerified: 'No verified surplus found', noVerifiedHint: 'Request replenishment from district supply.',
  recMove: '{med}: transfer <b>{q} {u}</b>', recPartial: ' (full need {n}, rest from district supply)',
  recReserve: 'Donor keeps a {n}-day reserve.',
  approve: 'Approve', reject: 'Reject', adminOnly: 'Only Admin can approve',
  recNone: 'No pending recommendations in this scope.',
  mapFail: 'Map failed to load (check internet).', allGood: 'All good',
  seedEmpty: 'Database is empty.', seedBtn: 'Load MP demo data (220 facilities)', seedWait: 'Database is empty for now. Ask an admin to load the data.',
  simP: 'If supply is <b>{d} days</b> late and demand rises <b>+{s}%</b>:',
  simL1: '<b>{n}</b> facility-medicine combinations may run out before supply arrives.',
  simL2: 'Verified surplus can cover <b>{c}</b>; <b>{r}</b> need emergency district supply.',
  simL3: 'Most affected districts: {top}', simNone: 'none',
  simNote: 'Planning estimate: based on transparent rules, no trained ML model connected yet.',
  askUnknown: 'Sorry, I did not understand. Try: medicine shortage, bed occupancy, doctors, extra stock, or "top 5 urgent problems". You can also type a district name.',
  tBed: 'Bed occupancy ≥ 85%', tDoc: 'Doctor coverage gap', tSurplus: 'Verified surplus stock (top 8)',
  tUrgent: 'Top 5 urgent problems', tShort: 'Medicine shortage risk', wholeMP: 'all of MP',
  surplusRow: '{f}: {m}, {q} {u} surplus', noRec: 'No records found.',
  ansNote: 'Answer comes straight from system records; no numbers were invented.',
  rSafe: 'Safe', rReview: 'Review', rHigh: 'High risk',
  thMed: 'Medicine', thStock: 'Stock', thUse: 'Daily use', thLeft: 'Days left',
  bedsLine: '<b>Beds:</b> {o}/{t} occupied ({p}%)', admit: '+ Admit', discharge: '− Discharge',
  docAtt: 'Doctor attendance', mQR: 'QR scan (simulated)', mGPS: 'GPS geofence (simulated)', mSelfie: 'Selfie verify (simulated)',
  present: 'Present', absent: 'Absent', checkin: 'Check-in', checkout: 'Check-out',
  logDispense: '{f}: {q} {u} of {m} dispensed', logReceive: '{f}: {q} {u} of {m} stock received',
  logEsc: 'Alert escalated → State Commissioner ({x})',
  logApprove: 'APPROVED: {q} {u} {m}, {from} → {to}', logReject: 'REJECTED transfer: {k}',
  logSeed: 'Admin loaded MP demo data (220 facilities)', logSkip: 'Demo: clock moved +24 hours',
  logBed: '{f}: bed {a} ({o}/{t})', wAdmit: 'admit', wDisch: 'discharge',
  logDoc: '{f}: {n} {a} ({m})',
  saveFail: 'Could not save: ', qtyBad: 'Enter a valid quantity', noStockMsg: 'Not enough stock ({n} left)',
  donorLow: 'Donor surplus is now lower, please verify again', resetConfirm: 'Reset all demo data?',
  roleMissing: 'Your role is not set. Ask an admin to create your profile.', loadFail: 'Could not load data: ', loginFail: 'Login failed: ',
  demoMode: 'Demo mode (this browser only)', roleAdmin: 'Admin', roleViewer: 'Govt Viewer (read-only)', roleStaff: 'Facility Staff',
  chatOpen: '🤖 Ask AI', chatTitle: 'HealthGrid AI Assistant', chatClear: 'Clear', chatSend: 'Send',
  chatPh: 'Type your question…',
  chatHello: 'Hello! I am the HealthGrid AI assistant. I can explain current alerts, stock, beds, doctor coverage and transfer recommendations. Final decisions always rest with the admin.',
  chatThinking: 'Thinking…', chatErr: 'Could not get a reply from the AI. Please try again shortly.',
  chatOffline: 'AI server is not connected, so this is a rule-based answer:', chatWait: 'Please wait a moment…',
  chatNote: 'AI can make mistakes. Check the records before important decisions.'
}
};
const t = (k, p) => {
  let s = (I18N[LANG] && I18N[LANG][k] !== undefined) ? I18N[LANG][k] : (I18N.en[k] !== undefined ? I18N.en[k] : k);
  if (p) for (const x in p) s = s.split('{' + x + '}').join(p[x]);
  return s;
};
const locale = () => LANG === 'hi' ? 'hi-IN' : 'en-IN';

const MEDS = [
  { id: 'para', name: 'Paracetamol 500mg', hi: 'पैरासिटामोल 500mg', unit: 'strips', uhi: 'स्ट्रिप', base: 40 },
  { id: 'ors', name: 'ORS Sachets', hi: 'ORS सैशे', unit: 'sachets', uhi: 'सैशे', base: 30 },
  { id: 'amox', name: 'Amoxicillin 500mg', hi: 'एमोक्सिसिलिन 500mg', unit: 'strips', uhi: 'स्ट्रिप', base: 20 },
  { id: 'met', name: 'Metformin 500mg', hi: 'मेटफॉर्मिन 500mg', unit: 'strips', uhi: 'स्ट्रिप', base: 25 },
  { id: 'iron', name: 'Iron-Folic Acid', hi: 'आयरन-फोलिक एसिड', unit: 'strips', uhi: 'स्ट्रिप', base: 30 },
  { id: 'insu', name: 'Insulin', hi: 'इंसुलिन', unit: 'vials', uhi: 'वायल', base: 4 },
  { id: 'anti', name: 'Anti-Malarial (ACT)', hi: 'मलेरिया-रोधी (ACT)', unit: 'kits', uhi: 'किट', base: 6 },
  { id: 'tt', name: 'Tetanus Toxoid', hi: 'टिटनेस टॉक्सॉइड', unit: 'doses', uhi: 'डोज़', base: 8 }
];
const MED = Object.fromEntries(MEDS.map(m => [m.id, m]));
const mn = m => LANG === 'hi' ? m.hi : m.name;
const mu = m => LANG === 'hi' ? m.uhi : m.unit;

// Madhya Pradesh: 55 districts, approximate centre coordinates
const DISTRICTS = [
['Agar Malwa',23.71,76.01],['Alirajpur',22.31,74.36],['Anuppur',23.10,81.69],['Ashoknagar',24.58,77.73],['Balaghat',21.81,80.19],
['Barwani',22.03,74.90],['Betul',21.91,77.90],['Bhind',26.56,78.79],['Bhopal',23.26,77.41],['Burhanpur',21.31,76.23],
['Chhatarpur',24.92,79.58],['Chhindwara',22.06,78.94],['Damoh',23.84,79.44],['Datia',25.67,78.46],['Dewas',22.96,76.05],
['Dhar',22.60,75.30],['Dindori',22.95,81.08],['Guna',24.65,77.31],['Gwalior',26.22,78.18],['Harda',22.34,77.09],
['Indore',22.72,75.86],['Jabalpur',23.18,79.99],['Jhabua',22.77,74.59],['Katni',23.83,80.40],['Khandwa',21.83,76.35],
['Khargone',21.82,75.61],['Maihar',24.27,80.75],['Mandla',22.60,80.37],['Mandsaur',24.07,75.07],['Mauganj',24.68,81.38],
['Morena',26.50,77.99],['Narmadapuram',22.75,77.73],['Narsinghpur',22.95,79.19],['Neemuch',24.47,74.87],['Niwari',25.37,78.82],
['Pandhurna',21.60,78.52],['Panna',24.72,80.19],['Raisen',23.33,77.79],['Rajgarh',24.01,76.73],['Ratlam',23.33,75.04],
['Rewa',24.53,81.30],['Sagar',23.84,78.74],['Satna',24.60,80.83],['Sehore',23.20,77.08],['Seoni',22.09,79.54],
['Shahdol',23.30,81.36],['Shajapur',23.43,76.27],['Sheopur',25.67,76.70],['Shivpuri',25.42,77.66],['Sidhi',24.41,81.88],
['Singrauli',24.20,82.67],['Tikamgarh',24.74,78.83],['Ujjain',23.18,75.78],['Umaria',23.52,80.84],['Vidisha',23.52,77.81]
];
const DN = ['Sharma','Verma','Patel','Khan','Tiwari','Yadav','Jain','Mishra','Chouhan','Dubey','Rathore','Gupta','Solanki','Pandey','Thakur'];
const RESERVE_DAYS = 10, TARGET_DAYS = 14, HIGH_D = 3, MED_D = 7;

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function generate() {
  const rng = mulberry32(20261018), facs = [];
  DISTRICTS.forEach(([d, lat, lng]) => {
    ['CHC', 'PHC', 'PHC', 'PHC'].forEach((ty, k) => {
      const mult = ty === 'CHC' ? 2.5 : 1, use = {}, stock = {};
      MEDS.forEach(m => {
        use[m.id] = Math.round(m.base * mult * (0.7 + rng() * 0.6) * 10) / 10;
        const r = rng();
        const days = r < 0.015 ? 0.8 + rng() * 2.2 : r < 0.07 ? 3.5 + rng() * 3 : r < 0.35 ? 18 + rng() * 14 : 7 + rng() * 9;
        stock[m.id] = Math.max(1, Math.round(use[m.id] * days));
      });
      const total = ty === 'CHC' ? 30 + Math.floor(rng() * 21) : 6 + Math.floor(rng() * 5);
      const occ = Math.round(total * (0.35 + rng() * 0.5));
      const docs = [];
      for (let j = 0; j < (ty === 'CHC' ? 4 : 1); j++) docs.push({ n: 'Dr. ' + DN[Math.floor(rng() * DN.length)], p: rng() < 0.95 });
      facs.push({ id: d + '-' + k, d, t: ty, name: ty === 'CHC' ? 'CHC ' + d : 'PHC ' + d + '-' + k, lat: lat + (rng() - 0.5) * 0.25, lng: lng + (rng() - 0.5) * 0.25, use, stock, beds: { total, occ }, docs });
    });
  });
  return facs;
}

let S;
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.facs) return s; } catch (e) {}
  return { facs: generate(), log: [], tr: {}, esc: {}, created: {}, shift: 0 };
}
function save() { if (ONLINE) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
S = ONLINE ? { facs: [], log: [], tr: {}, esc: {}, created: {}, shift: 0 } : load();

let scope = 'ALL', tab = 'admin', ready = false;
const $ = id => document.getElementById(id);
const now = () => Date.now() + S.shift * 3600000;
const fmt = n => Math.round(n).toLocaleString('en-IN');
const inScope = f => scope === 'ALL' || f.d === scope;
const days = (f, m, surge) => f.stock[m] / (f.use[m] * (1 + (surge || 0) / 100));
function occPct(f) { return f.beds.occ / f.beds.total * 100; }
function addLog(m) {
  S.log.unshift({ t: now(), m }); S.log = S.log.slice(0, 60);
  if (ONLINE) sb.from('logs').insert({ ts: Date.now(), msg: m, actor: me.email }).then(dbErr);
}
function dbErr(r) { if (r && r.error) alert(t('saveFail') + r.error.message); }
function saveFac(f) { if (!ONLINE) return save(); sb.from('facilities').update({ data: f, updated_by: me.id }).eq('id', f.id).then(dbErr); }
function persistTr(key, status) { S.tr[key] = status; if (!ONLINE) return save(); sb.from('transfers').upsert({ key, status, by_user: me.email, ts: Date.now() }).then(dbErr); }
function persistEsc(id) { S.esc[id] = true; if (!ONLINE) return save(); sb.from('alert_state').upsert({ id, created: S.created[id] || Date.now(), escalated: true }).then(dbErr); }
let pendingCreated = [];
function flushCreated() { if (!ONLINE || !pendingCreated.length) return; const rows = pendingCreated.splice(0).map(id => ({ id, created: S.created[id] })); sb.from('alert_state').upsert(rows, { onConflict: 'id', ignoreDuplicates: true }).then(() => {}); }
function km(a, b) { const R = 6371, r = x => x * Math.PI / 180, dLa = r(b.lat - a.lat), dLo = r(b.lng - a.lng); const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); }

// ---------- Rules engine (transparent, no ML yet) ----------
function facRisk(f) {
  let r = 0;
  MEDS.forEach(m => { const d = days(f, m.id); if (d < HIGH_D) r = 2; else if (d < MED_D) r = Math.max(r, 1); });
  const o = occPct(f); if (o >= 85) r = 2; else if (o >= 70) r = Math.max(r, 1);
  if (!f.docs.some(d => d.p)) r = 2;
  return r;
}
function makeAlerts(list) {
  const out = [];
  list.forEach(f => {
    MEDS.forEach(m => {
      const d = days(f, m.id);
      if (d < MED_D) out.push({ id: 'S|' + f.id + '|' + m.id, sev: d < HIGH_D ? 2 : 1, f, med: m.id, d, kind: 'stock', text: t('stockText', { med: mn(m), d: d.toFixed(1), q: fmt(f.stock[m.id]), u: mu(m) }) });
    });
    const o = occPct(f);
    if (o >= 85) out.push({ id: 'B|' + f.id, sev: 2, f, d: 99 - o / 100, kind: 'bed', text: t('bedText', { p: o.toFixed(0), o: f.beds.occ, t: f.beds.total }) });
    if (!f.docs.some(d => d.p)) out.push({ id: 'D|' + f.id, sev: 2, f, d: 50, kind: 'doc', text: t('docText') });
  });
  out.sort((a, b) => b.sev - a.sev || a.d - b.d);
  out.forEach(a => { if (!S.created[a.id]) { S.created[a.id] = Date.now(); pendingCreated.push(a.id); } });
  return out;
}
function surplusOf(f, m) { return Math.floor(f.stock[m] - RESERVE_DAYS * f.use[m]); }
function makeRecs() {
  const hi = makeAlerts(S.facs.filter(inScope)).filter(a => a.kind === 'stock' && a.sev === 2);
  const recs = [];
  hi.forEach(a => {
    const key = a.f.id + '|' + a.med;
    if (S.tr[key]) return;
    const need = Math.ceil(TARGET_DAYS * a.f.use[a.med] - a.f.stock[a.med]);
    let best = null;
    S.facs.forEach(d => {
      if (d.id === a.f.id) return;
      const sp = surplusOf(d, a.med);
      if (days(d, a.med) < 15 || sp <= 0) return;
      const dist = km(a.f, d), score = dist + (d.d === a.f.d ? 0 : 150);
      if (!best || score < best.score) best = { d, sp, dist, score };
    });
    if (best) {
      const qty = Math.min(need, best.sp);
      recs.push({ key, to: a.f, from: best.d, med: a.med, qty, need, dist: best.dist, d: a.d });
    } else recs.push({ key, to: a.f, from: null, med: a.med, need, d: a.d });
  });
  return recs;
}

// ---------- Rendering ----------
function renderKpis(alerts) {
  const fl = S.facs.filter(inScope);
  const c = { r: 0, y: 0, g: 0 };
  fl.forEach(f => c[['g', 'y', 'r'][facRisk(f)]]++);
  const stock = alerts.filter(a => a.kind === 'stock' && a.sev === 2).length;
  const bed = alerts.filter(a => a.kind === 'bed').length, doc = alerts.filter(a => a.kind === 'doc').length;
  $('kpis').innerHTML = [
    ['', fl.length, t('kpiFac')], ['r', c.r, t('kpiHigh')], ['y', c.y, t('kpiReview')],
    ['r', stock, t('kpiStock')], ['r', bed, t('kpiBed')], ['r', doc, t('kpiDoc')]
  ].map(k => `<div class="kpi ${k[0]}"><b>${k[1]}</b><span>${k[2]}</span></div>`).join('');
}

function renderAlerts(alerts) {
  $('alertCount').textContent = t('alertCount', { n: alerts.length });
  $('alerts').innerHTML = alerts.slice(0, 15).map(a => {
    const dl = a.sev === 2 ? 24 : 72, due = S.created[a.id] + dl * 3600000, over = now() > due, esc = S.esc[a.id] || over;
    const left = Math.max(0, Math.round((due - now()) / 3600000));
    return `<div class="al ${a.sev === 2 ? 'high' : ''}"><b>${a.f.name}</b> <span class="tag ${a.sev === 2 ? '' : 'y'}">${a.sev === 2 ? t('sevHigh') : t('sevReview')}</span><br>${a.text}<br>
      <small>${t('assigned', { d: a.f.d, x: over ? t('expired') : t('hrs', { n: left }) })}</small>
      ${esc ? `<span class="tag">${t('escalated')}${over && !S.esc[a.id] ? t('auto') : ''}</span>` : (canAct() ? `<button class="sm warn" data-esc="${a.id}">${t('escBtn')}</button>` : '')}</div>`;
  }).join('') || `<p class="muted">${t('alertNone')}</p>`;
}

function renderRecs() {
  const recs = makeRecs();
  $('recs').innerHTML = recs.slice(0, 8).map(r => {
    const m = MED[r.med];
    if (!r.from) return `<div class="rec"><b>${r.to.name}</b>: ${t('recNoDonor', { med: mn(m), d: r.d.toFixed(1) })} <span class="tag y">${t('noVerified')}</span> ${t('noVerifiedHint')}</div>`;
    return `<div class="rec"><b>${r.to.name}</b> (${r.d.toFixed(1)} ${t('days')}) ← <b>${r.from.name}</b> (${days(r.from, r.med).toFixed(0)} ${t('days')}, ${r.dist.toFixed(0)} km)<br>
      ${t('recMove', { med: mn(m), q: fmt(r.qty), u: mu(m) })}${r.qty < r.need ? t('recPartial', { n: fmt(r.need) }) : ''}. ${t('recReserve', { n: RESERVE_DAYS })}<br>
      ${canAct() ? `<button class="sm ok" data-ap="${r.key}|${r.from.id}|${r.qty}">${t('approve')}</button> <button class="sm no" data-rj="${r.key}">${t('reject')}</button>` : `<small class="muted">${t('adminOnly')}</small>`}</div>`;
  }).join('') || `<p class="muted">${t('recNone')}</p>`;
}

function renderDist() {
  $('distCard').hidden = scope !== 'ALL';
  if (scope !== 'ALL') return;
  const rows = DISTRICTS.map(([d]) => {
    const fl = S.facs.filter(f => f.d === d), al = makeAlerts(fl);
    const hi = al.filter(a => a.sev === 2).length;
    return { d, n: fl.length, hi, me: al.length - hi, score: hi * 3 + (al.length - hi) };
  }).sort((a, b) => b.score - a.score);
  $('dist').innerHTML = `<table><tr><th>${t('thDist')}</th><th>${t('thHigh')}</th><th>${t('thReview')}</th><th>${t('thScore')}</th></tr>` +
    rows.map(r => `<tr class="click" data-d="${r.d}"><td>${r.d}</td><td>${r.hi}</td><td>${r.me}</td><td><div class="bar"><i style="width:${Math.min(100, r.score * 3)}%;background:var(--${r.hi > 3 ? 'r' : r.hi ? 'y' : 'g'})"></i></div></td></tr>`).join('') + '</table>';
}

let map, layer, lastFit = null, lastSig = '';
function renderMap() {
  if (typeof L === 'undefined') { $('map').innerHTML = `<p class="muted" style="padding:20px">${t('mapFail')}</p>`; return; }
  if (!map) { map = L.map('map').setView([23.5, 78.0], 6); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 14 }).addTo(map); layer = L.layerGroup().addTo(map); }
  const sig = LANG + scope + S.facs.filter(inScope).map(f => facRisk(f)).join('');
  if (sig === lastSig) return; lastSig = sig;
  layer.clearLayers();
  const col = ['#2e9e5b', '#e0a21a', '#d33a3a'], pts = [];
  S.facs.filter(inScope).forEach(f => {
    const r = facRisk(f);
    const top = makeAlerts([f]).slice(0, 3).map(a => a.text).join('<br>') || t('allGood');
    L.circleMarker([f.lat, f.lng], { radius: f.t === 'CHC' ? 8 : 5, color: col[r], fillColor: col[r], fillOpacity: .8, weight: 1 }).bindPopup(`<b>${f.name}</b><br>${top}`).addTo(layer);
    pts.push([f.lat, f.lng]);
  });
  setTimeout(() => { map.invalidateSize(); if (lastFit !== scope && pts.length) { lastFit = scope; if (scope === 'ALL') map.setView([23.5, 78.0], 6); else map.fitBounds(pts, { padding: [30, 30] }); } }, 50);
}

function renderSeed() {
  const el = $('seedBar'); el.hidden = !(ONLINE && S.facs.length === 0);
  if (!el.hidden) el.innerHTML = canAct() ? `${t('seedEmpty')} <button id="seedBtn">${t('seedBtn')}</button>` : t('seedWait');
}
async function seed() {
  const rows = generate().map(f => ({ id: f.id, district: f.d, data: f }));
  for (let i = 0; i < rows.length; i += 50) { const r = await sb.from('facilities').upsert(rows.slice(i, i + 50)); if (r.error) return alert(r.error.message); }
  addLog(t('logSeed')); await loadAll(); renderAdmin();
}
function renderLog() {
  $('log').innerHTML = S.log.map(l => `<div>${new Date(l.t).toLocaleString(locale())} · ${l.m}</div>`).join('') || `<span class="muted">${t('logEmpty')}</span>`;
}

function renderAdmin() {
  const alerts = makeAlerts(S.facs.filter(inScope));
  renderSeed(); renderKpis(alerts); renderAlerts(alerts); renderRecs(); renderDist(); renderLog(); renderMap(); flushCreated(); save();
}

// ---------- Simulator ----------
function runSim() {
  const delay = +$('simDelay').value, surge = +$('simSurge').value, med = $('simMed').value;
  const meds = med === 'ALL' ? MEDS.map(m => m.id) : [med];
  let atRisk = [], covered = 0;
  const donorPool = {};
  S.facs.forEach(f => meds.forEach(m => { donorPool[m] = (donorPool[m] || 0) + Math.max(0, Math.floor(f.stock[m] - RESERVE_DAYS * f.use[m] * (1 + surge / 100))) * (days(f, m, surge) >= 15 ? 1 : 0); }));
  S.facs.filter(inScope).forEach(f => meds.forEach(m => {
    const d = days(f, m, surge);
    if (d < delay) {
      const need = Math.ceil(f.use[m] * (1 + surge / 100) * (delay + 3) - f.stock[m]);
      const ok = donorPool[m] >= need; if (ok) { covered++; donorPool[m] -= need; }
      atRisk.push({ f, m, d, ok });
    }
  }));
  const byD = {}; atRisk.forEach(r => byD[r.f.d] = (byD[r.f.d] || 0) + 1);
  const top = Object.entries(byD).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => `${e[0]} (${e[1]})`).join(', ') || t('simNone');
  $('simOut').innerHTML = `<p>${t('simP', { d: delay, s: surge })}</p>
    <ul><li>${t('simL1', { n: atRisk.length })}</li>
    <li>${t('simL2', { c: covered, r: atRisk.length - covered })}</li>
    <li>${t('simL3', { top })}</li></ul>
    <small class="muted">${t('simNote')}</small>`;
}

// ---------- Copilot (rule-based, answers only from records) ----------
function ask(q) { $('ans').innerHTML = askHtml(q); }
function askHtml(q) {
  const tx = q.toLowerCase(); let list = S.facs, label = t('wholeMP');
  const dn = DISTRICTS.find(d => tx.includes(d[0].toLowerCase())); if (dn) { list = S.facs.filter(f => f.d === dn[0]); label = dn[0]; } else if (scope !== 'ALL') { list = S.facs.filter(inScope); label = scope; }
  const al = makeAlerts(list); let rows = [], title = '';
  const has = (...w) => w.some(x => tx.includes(x));
  if (has('bed', 'बेड', 'occupancy')) { title = t('tBed'); rows = al.filter(a => a.kind === 'bed').map(a => `${a.f.name}: ${a.text}`); }
  else if (has('doctor', 'डॉक्टर', 'absent', 'अनुपस्थित')) { title = t('tDoc'); rows = al.filter(a => a.kind === 'doc').map(a => a.f.name + ': ' + a.text); }
  else if (has('extra', 'surplus', 'अतिरिक्त', 'zyada stock', 'ज़्यादा stock', 'ज्यादा stock')) {
    title = t('tSurplus');
    const s = []; list.forEach(f => MEDS.forEach(m => { const sp = surplusOf(f, m.id); if (days(f, m.id) >= 15 && sp > 0) s.push({ f, m, sp }); }));
    rows = s.sort((a, b) => b.sp / b.f.use[b.m.id] - a.sp / a.f.use[a.m.id]).slice(0, 8).map(x => t('surplusRow', { f: x.f.name, m: mn(x.m), q: fmt(x.sp), u: mu(x.m) }));
  } else if (has('urgent', 'जरूरी', 'ज़रूरी', 'sabse', 'सबसे', 'top')) { title = t('tUrgent'); rows = al.slice(0, 5).map(a => `${a.f.name}: ${a.text}`); }
  else if (has('shortage', 'short', 'कमी', 'khatam', 'खत्म', 'दवा', 'dawai', 'medicine')) { title = t('tShort'); rows = al.filter(a => a.kind === 'stock').slice(0, 8).map(a => `${a.f.name}: ${a.text}`); }
  else { return `<p>${t('askUnknown')}</p>`; }
  return `<b>${title}: ${label}</b><ul>${rows.map(r => '<li>' + r + '</li>').join('') || `<li>${t('noRec')}</li>`}</ul><small class="muted">${t('ansNote')}</small>`;
}

// ---------- Staff portal ----------
function curFac() { return S.facs.find(f => f.id === $('sFac').value); }
function renderStaff() {
  const f = curFac(); if (!f) return;
  const o = occPct(f);
  $('sInfo').innerHTML = `<b>${f.name}</b> · ${f.t} · ${f.d} <span class="tag ${['g', 'y', ''][facRisk(f)]}">${[t('rSafe'), t('rReview'), t('rHigh')][facRisk(f)]}</span>`;
  $('sStock').innerHTML = `<table><tr><th>${t('thMed')}</th><th>${t('thStock')}</th><th>${t('thUse')}</th><th>${t('thLeft')}</th></tr>` + MEDS.map(m => {
    const d = days(f, m.id); return `<tr><td>${mn(m)}</td><td>${fmt(f.stock[m.id])}</td><td>${f.use[m.id]}</td><td><span class="tag ${d < HIGH_D ? '' : d < MED_D ? 'y' : 'g'}">${d.toFixed(1)}</span></td></tr>`;
  }).join('') + '</table>';
  $('sBeds').innerHTML = `${t('bedsLine', { o: f.beds.occ, t: f.beds.total, p: o.toFixed(0) })}<div class="bar"><i style="width:${o}%;background:var(--${o >= 85 ? 'r' : o >= 70 ? 'y' : 'g'})"></i></div><div class="row" style="margin-top:8px"><button data-bed="1">${t('admit')}</button><button class="ghost" data-bed="-1">${t('discharge')}</button></div>`;
  $('sDocs').innerHTML = `<b>${t('docAtt')}</b><div class="row"><select id="method"><option>${t('mQR')}</option><option>${t('mGPS')}</option><option>${t('mSelfie')}</option></select></div>` +
    f.docs.map((d, i) => `<div class="row">${d.n} <span class="tag ${d.p ? 'g' : ''}">${d.p ? t('present') : t('absent')}</span><button class="sm ${d.p ? 'no' : 'ok'}" data-doc="${i}">${d.p ? t('checkout') : t('checkin')}</button></div>`).join('');
}
function fillStaff() {
  const dsel = $('sDist'); if (!dsel.options.length) dsel.innerHTML = DISTRICTS.map(d => `<option>${d[0]}</option>`).join('');
  if (me.role === 'staff') { const mf = S.facs.find(x => x.id === me.facility); if (mf) dsel.value = mf.d; dsel.disabled = true; }
  else if (scope !== 'ALL') dsel.value = scope;
  const prev = $('sFac').value;
  $('sFac').innerHTML = S.facs.filter(f => f.d === dsel.value && (me.role !== 'staff' || f.id === me.facility)).map(f => `<option value="${f.id}">${f.name}</option>`).join('');
  if (prev && [...$('sFac').options].some(o => o.value === prev)) $('sFac').value = prev;
  renderStaff();
}

// ---------- AI chatbot ----------
// Chatbot ko "train" karne ka tareeka: backend ke system prompt (supabase/functions/ai-chat) mein app ke rules likhe hain,
// aur har sawal ke saath yahan se live dashboard data (context) bheja jata hai.
let chat = [], chatBusy = false, chatLast = 0;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mdLite = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/^[-*] /gm, '• ').replace(/\n/g, '<br>');

function aiContext() {
  const fl = me.role === 'staff' ? S.facs.filter(f => f.id === me.facility) : S.facs.filter(inScope);
  const al = makeAlerts(fl), c = { r: 0, y: 0, g: 0 };
  fl.forEach(f => c[['g', 'y', 'r'][facRisk(f)]]++);
  const ctx = {
    scope: scope === 'ALL' ? 'All Madhya Pradesh' : scope, role: me.role, facilities: fl.length,
    risk: { high: c.r, review: c.y, safe: c.g },
    kpis: { criticalStock: al.filter(a => a.kind === 'stock' && a.sev === 2).length, bedOverload: al.filter(a => a.kind === 'bed').length, doctorGap: al.filter(a => a.kind === 'doc').length },
    topAlerts: al.slice(0, 20).map(a => ({ facility: a.f.name, district: a.f.d, severity: a.sev === 2 ? 'high' : 'review', type: a.kind, text: a.text })),
    recommendations: me.role === 'staff' ? [] : makeRecs().slice(0, 8).map(r => ({ to: r.to.name, medicine: MED[r.med].name, daysLeft: +r.d.toFixed(1), from: r.from ? r.from.name : null, qty: r.qty || null, need: r.need, km: r.dist ? Math.round(r.dist) : null }))
  };
  if (scope === 'ALL' && me.role !== 'staff') {
    ctx.districtRanking = DISTRICTS.map(([d]) => { const a = makeAlerts(S.facs.filter(f => f.d === d)); const hi = a.filter(x => x.sev === 2).length; return { district: d, high: hi, review: a.length - hi }; })
      .sort((a, b) => (b.high * 3 + b.review) - (a.high * 3 + a.review)).slice(0, 10);
  }
  return ctx;
}
async function aiCall(messages) {
  const body = { messages, lang: LANG, context: aiContext() };
  if (CFG.aiUrl) {
    const r = await fetch(CFG.aiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error('AI ' + r.status);
    return (await r.json()).reply;
  }
  if (ONLINE) {
    const r = await sb.functions.invoke('ai-chat', { body });
    if (r.error) throw r.error;
    return r.data.reply;
  }
  return null; // backend nahi hai: rule-based fallback
}
function renderChat() {
  const el = $('chatMsgs'); if (!el) return;
  const list = chat.length ? chat : [{ r: 'a', t: t('chatHello') }];
  el.innerHTML = list.map(m => `<div class="cm ${m.r}">${m.h ? m.t : mdLite(m.t)}</div>`).join('') + (chatBusy ? `<div class="cm a muted">${t('chatThinking')}</div>` : '');
  el.scrollTop = el.scrollHeight;
}
async function sendChat() {
  const inp = $('chatIn'), q = inp.value.trim(); if (!q || chatBusy) return;
  if (Date.now() - chatLast < 1500) return alert(t('chatWait'));
  chatLast = Date.now(); inp.value = ''; chat.push({ r: 'u', t: q }); chatBusy = true; renderChat();
  try {
    const hist = chat.filter(m => !m.h).slice(-10).map(m => ({ role: m.r === 'u' ? 'user' : 'assistant', content: m.t }));
    const rep = await aiCall(hist);
    if (rep === null) chat.push({ r: 'a', h: true, t: `<small class="muted">${t('chatOffline')}</small>${askHtml(q)}` });
    else chat.push({ r: 'a', t: String(rep) });
  } catch (e) { chat.push({ r: 'a', t: t('chatErr') }); }
  chatBusy = false; renderChat();
}
function initChat() {
  $('chatFab').onclick = () => { $('chatBox').hidden = false; $('chatFab').hidden = true; renderChat(); $('chatIn').focus(); };
  $('chatClose').onclick = () => { $('chatBox').hidden = true; $('chatFab').hidden = false; };
  $('chatClear').onclick = () => { chat = []; renderChat(); };
  $('chatSend').onclick = sendChat;
  $('chatIn').onkeydown = e => { if (e.key === 'Enter') sendChat(); };
}

// ---------- Language switching ----------
function buildSelects() {
  const keep = (id, html) => { const el = $(id), v = el.value; el.innerHTML = html; if ([...el.options].some(o => o.value === v)) el.value = v; };
  keep('scope', `<option value="ALL">${t('allMP')}</option>` + DISTRICTS.map(d => `<option>${d[0]}</option>`).join(''));
  const opts = MEDS.map(m => `<option value="${m.id}">${mn(m)}</option>`).join('');
  keep('simMed', `<option value="ALL">${t('medAll')}</option>` + opts); keep('dMed', opts); keep('rMed', opts);
}
function setWho() {
  $('who').textContent = ONLINE ? me.email + ' · ' + ({ admin: t('roleAdmin'), viewer: t('roleViewer'), staff: t('roleStaff') }[me.role]) : t('demoMode');
}
function applyLang() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(e => e.textContent = t(e.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(e => e.placeholder = t(e.dataset.i18nPh));
  document.querySelectorAll('[data-i18n-title]').forEach(e => e.title = t(e.dataset.i18nTitle));
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === LANG));
  if (!ready) return;
  buildSelects(); setWho(); lastSig = ''; renderChat();
  $('simOut').innerHTML = ''; $('ans').innerHTML = '';
  if (tab === 'admin') renderAdmin(); else fillStaff();
}
function bindLang() {
  document.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => {
    LANG = b.dataset.lang;
    try { localStorage.setItem(LANG_KEY, LANG); } catch (e) {}
    applyLang();
  });
}

// ---------- Events ----------
function setTab(x) {
  tab = x; $('admin').hidden = x !== 'admin'; $('staff').hidden = x !== 'staff';
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === x));
  if (x === 'admin') renderAdmin(); else fillStaff();
}
function init() {
  buildSelects();
  $('reset').hidden = ONLINE;
  $('scope').onchange = e => { scope = e.target.value; tab === 'admin' ? renderAdmin() : fillStaff(); };
  document.querySelectorAll('.tab').forEach(b => b.onclick = () => setTab(b.dataset.tab));
  $('reset').onclick = () => { if (!ONLINE && confirm(t('resetConfirm'))) { localStorage.removeItem(KEY); S = load(); setTab(tab); } };
  $('simGo').onclick = runSim;
  $('skip').onclick = () => { S.shift += 24; addLog(t('logSkip')); renderAdmin(); };
  $('ask').onclick = () => ask($('q').value); $('q').onkeydown = e => { if (e.key === 'Enter') ask($('q').value); };
  document.querySelectorAll('.chip').forEach(c => c.onclick = () => { $('q').value = c.textContent; ask(c.textContent); });
  $('sDist').onchange = fillStaff; $('sFac').onchange = renderStaff;
  $('dGo').onclick = () => {
    const f = curFac(), m = $('dMed').value, q = Math.floor(+$('dQty').value);
    if (!(q > 0)) return alert(t('qtyBad'));
    if (q > f.stock[m]) return alert(t('noStockMsg', { n: f.stock[m] }));
    f.stock[m] -= q; addLog(t('logDispense', { f: f.name, q, u: mu(MED[m]), m: mn(MED[m]) })); saveFac(f); renderStaff();
  };
  $('rGo').onclick = () => {
    const f = curFac(), m = $('rMed').value, q = Math.floor(+$('rQty').value);
    if (!(q > 0)) return alert(t('qtyBad'));
    f.stock[m] += q; addLog(t('logReceive', { f: f.name, q, u: mu(MED[m]), m: mn(MED[m]) })); saveFac(f); renderStaff();
  };
  document.body.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.esc) { persistEsc(b.dataset.esc); const a = b.dataset.esc.split('|'); addLog(t('logEsc', { x: a[1] })); renderAdmin(); }
    if (b.dataset.ap && canAct()) {
      const [fid, med, from, qty] = b.dataset.ap.split('|'), key = fid + '|' + med, f = S.facs.find(x => x.id === fid), d = S.facs.find(x => x.id === from), q = +qty;
      if (surplusOf(d, med) < q) return alert(t('donorLow'));
      d.stock[med] -= q; f.stock[med] += q; saveFac(d); saveFac(f); persistTr(key, 'approved');
      addLog(t('logApprove', { q, u: mu(MED[med]), m: mn(MED[med]), from: d.name, to: f.name })); renderAdmin();
    }
    if (b.dataset.rj && canAct()) { persistTr(b.dataset.rj, 'rejected'); addLog(t('logReject', { k: b.dataset.rj.replace('|', ' / ') })); renderAdmin(); }
    if (b.id === 'seedBtn') seed();
    if (b.dataset.bed && me.role !== 'viewer') { const f = curFac(), v = +b.dataset.bed; f.beds.occ = Math.min(f.beds.total, Math.max(0, f.beds.occ + v)); addLog(t('logBed', { f: f.name, a: v > 0 ? t('wAdmit') : t('wDisch'), o: f.beds.occ, t: f.beds.total })); saveFac(f); renderStaff(); }
    if (b.dataset.doc && me.role !== 'viewer') { const f = curFac(), d = f.docs[+b.dataset.doc]; d.p = !d.p; const mt = $('method') ? $('method').value : ''; addLog(t('logDoc', { f: f.name, n: d.n, a: d.p ? t('checkin') : t('checkout'), m: mt })); saveFac(f); renderStaff(); }
  });
  $('dist').addEventListener('click', e => { const tr = e.target.closest('tr[data-d]'); if (tr) { scope = tr.dataset.d; $('scope').value = scope; renderAdmin(); window.scrollTo(0, 0); } });
  initChat();
  ready = true;
}

// ---------- Auth, load, boot ----------
async function loadAll() {
  const [f, l, a, tr] = await Promise.all([
    sb.from('facilities').select('data').order('id'),
    sb.from('logs').select('*').order('id', { ascending: false }).limit(60),
    sb.from('alert_state').select('*'), sb.from('transfers').select('*')]);
  if (f.error) throw f.error;
  S.facs = f.data.map(r => r.data);
  S.log = (l.data || []).map(r => ({ t: r.ts, m: r.msg + (r.actor ? ' [' + r.actor + ']' : '') }));
  (a.data || []).forEach(r => { S.created[r.id] = Number(r.created); if (r.escalated) S.esc[r.id] = true; });
  S.tr = {}; (tr.data || []).forEach(r => S.tr[r.key] = r.status);
}
function applyRole() {
  document.querySelector('[data-tab=admin]').hidden = me.role === 'staff';
  document.querySelector('[data-tab=staff]').hidden = me.role === 'viewer';
  $('scope').hidden = me.role === 'staff';
  setWho();
  $('logout').hidden = !ONLINE;
  setTab(me.role === 'staff' ? 'staff' : 'admin');
}
let inited = false;
async function afterLogin(user) {
  const r = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (!r.data) { $('loginMsg').textContent = t('roleMissing'); await sb.auth.signOut(); return; }
  me = { id: user.id, email: user.email, role: r.data.role, facility: r.data.facility_id };
  try { await loadAll(); } catch (e) { $('loginMsg').textContent = t('loadFail') + e.message; return; }
  $('login').hidden = true;
  if (!inited) { init(); inited = true; setInterval(poll, 15000); }
  applyLang();
  applyRole();
}
async function poll() {
  try { await loadAll(); if (tab === 'admin') renderAdmin(); else if (document.activeElement.id !== 'method') renderStaff(); } catch (e) {}
}
async function boot() {
  bindLang(); applyLang();
  if (!ONLINE) { init(); applyLang(); applyRole(); return; }
  $('login').hidden = false;
  $('loginBtn').onclick = async () => {
    $('loginMsg').textContent = '';
    const r = await sb.auth.signInWithPassword({ email: $('lEmail').value.trim(), password: $('lPass').value });
    if (r.error) $('loginMsg').textContent = t('loginFail') + r.error.message; else afterLogin(r.data.user);
  };
  $('logout').onclick = async () => { await sb.auth.signOut(); location.reload(); };
  const s0 = await sb.auth.getSession();
  if (s0.data && s0.data.session) afterLogin(s0.data.session.user);
}
boot();
})();