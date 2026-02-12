import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertTriangle, Pill, Info, Users, Clock, ShieldAlert, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface DrugDetail {
  name: string;
  genericName: string;
  usages: string[];
  sideEffects: {
    common: string[];
    serious: string[];
  };
  precautions: string[];
  interactions: string[];
  dosageInfo: string;
  howItWorks: string;
}

interface AIDrugInfoProps {
  drugName: string;
}

// Mock AI-generated drug information database
const drugDatabase: Record<string, DrugDetail> = {
  aspirin: {
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    usages: [
      'Relief of mild to moderate pain (headaches, toothaches, muscle aches)',
      'Reduction of fever',
      'Anti-inflammatory for conditions like arthritis',
      'Prevention of heart attacks and strokes (low-dose therapy)',
      'Treatment of inflammatory conditions'
    ],
    sideEffects: {
      common: [
        'Stomach upset or heartburn',
        'Nausea',
        'Easy bruising',
        'Ringing in ears (tinnitus)',
        'Mild dizziness'
      ],
      serious: [
        'Severe allergic reactions (rash, difficulty breathing, swelling)',
        'Black or bloody stools',
        'Severe stomach pain',
        'Unusual bleeding or bruising',
        'Signs of kidney problems',
        'Liver problems (yellowing of skin/eyes)'
      ]
    },
    precautions: [
      'Do not use if allergic to NSAIDs or have bleeding disorders',
      'Avoid alcohol consumption while taking aspirin',
      'Consult doctor if you have asthma, ulcers, or kidney disease',
      'May increase risk of bleeding - inform surgeon before any procedure',
      'Not recommended for children with viral infections (risk of Reye\'s syndrome)',
      'Pregnant women should consult their doctor before use'
    ],
    interactions: [
      'Blood thinners (warfarin) - increased bleeding risk',
      'Other NSAIDs - increased side effects',
      'Corticosteroids - stomach bleeding risk',
      'Diabetes medications - may affect blood sugar',
      'Blood pressure medications - may reduce effectiveness'
    ],
    dosageInfo: 'Adults: 325-650mg every 4-6 hours as needed. Maximum 4000mg per day. Low-dose for heart protection: 75-100mg daily.',
    howItWorks: 'Aspirin works by blocking the production of prostaglandins, which are chemicals that cause pain, fever, and inflammation. It also prevents blood clots by inhibiting platelet aggregation.'
  },
  ibuprofen: {
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    usages: [
      'Relief of pain from headaches, dental pain, menstrual cramps, muscle aches',
      'Reduction of fever',
      'Treatment of minor arthritis pain',
      'Relief from cold and flu symptoms',
      'Post-surgical pain management'
    ],
    sideEffects: {
      common: [
        'Upset stomach, nausea, or heartburn',
        'Dizziness or drowsiness',
        'Gas or bloating',
        'Constipation or diarrhea',
        'Mild headache'
      ],
      serious: [
        'Signs of heart attack (chest pain, shortness of breath)',
        'Signs of stroke (weakness, slurred speech)',
        'Severe stomach/abdominal pain',
        'Black stools or vomit that looks like coffee grounds',
        'Persistent or severe headache',
        'Vision changes',
        'Severe allergic reactions'
      ]
    },
    precautions: [
      'Take with food or milk to reduce stomach upset',
      'Avoid if you have heart disease or have had recent heart surgery',
      'Use caution if you have high blood pressure or kidney disease',
      'May increase sun sensitivity - use sunscreen',
      'Limit alcohol consumption',
      'Not recommended during the last 3 months of pregnancy'
    ],
    interactions: [
      'Aspirin - may decrease aspirin\'s effectiveness',
      'Blood thinners - increased bleeding risk',
      'ACE inhibitors - reduced effectiveness',
      'Lithium - increased lithium levels',
      'Methotrexate - increased toxicity'
    ],
    dosageInfo: 'Adults: 200-400mg every 4-6 hours. Maximum 1200mg per day without medical supervision. Children: dose based on weight.',
    howItWorks: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) that reduces hormones causing inflammation and pain in the body by inhibiting COX enzymes.'
  },
  amoxicillin: {
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    usages: [
      'Treatment of bacterial infections (ear, nose, throat infections)',
      'Urinary tract infections',
      'Skin infections',
      'Pneumonia and bronchitis',
      'H. pylori infection (with other medications)',
      'Dental infections'
    ],
    sideEffects: {
      common: [
        'Nausea or vomiting',
        'Diarrhea',
        'Stomach pain',
        'Vaginal itching or discharge',
        'Headache',
        'Skin rash (mild)'
      ],
      serious: [
        'Severe allergic reactions (hives, difficulty breathing, facial swelling)',
        'Severe skin reaction (blistering, peeling)',
        'Severe diarrhea (may be sign of C. difficile infection)',
        'Unusual bruising or bleeding',
        'Dark urine or yellowing of skin/eyes',
        'Seizures'
      ]
    },
    precautions: [
      'Tell your doctor if you are allergic to penicillin or cephalosporin antibiotics',
      'Complete the full course even if symptoms improve',
      'May reduce effectiveness of birth control pills',
      'Use during pregnancy only if clearly needed',
      'Inform doctor if you have kidney disease or mononucleosis',
      'May cause false positive urine glucose tests'
    ],
    interactions: [
      'Probenecid - increases amoxicillin levels',
      'Methotrexate - increased methotrexate toxicity',
      'Birth control pills - reduced effectiveness',
      'Blood thinners - may increase bleeding risk',
      'Allopurinol - increased risk of rash'
    ],
    dosageInfo: 'Adults: 250-500mg every 8 hours or 500-875mg every 12 hours. Children: dose based on weight. Duration typically 7-10 days.',
    howItWorks: 'Amoxicillin is a penicillin-type antibiotic that works by stopping the growth of bacteria. It interferes with bacterial cell wall synthesis, causing the bacteria to die.'
  },
  lisinopril: {
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    usages: [
      'Treatment of high blood pressure (hypertension)',
      'Treatment of heart failure',
      'Improving survival after heart attack',
      'Prevention of kidney problems in diabetic patients',
      'Reduction of stroke risk'
    ],
    sideEffects: {
      common: [
        'Dry cough',
        'Dizziness or lightheadedness',
        'Headache',
        'Fatigue',
        'Nausea',
        'Weakness'
      ],
      serious: [
        'Fainting',
        'Symptoms of high potassium (muscle weakness, slow heartbeat)',
        'Signs of kidney problems (change in urine amount)',
        'Symptoms of liver problems',
        'Severe allergic reactions (swelling of face, lips, tongue, throat)',
        'Chest pain'
      ]
    },
    precautions: [
      'Stand up slowly from sitting/lying position to avoid dizziness',
      'Do not use during pregnancy - can harm unborn baby',
      'Limit alcohol consumption',
      'Monitor blood pressure and kidney function regularly',
      'Avoid potassium supplements unless directed by doctor',
      'May cause increased sun sensitivity'
    ],
    interactions: [
      'Potassium supplements or salt substitutes - risk of high potassium',
      'NSAIDs - may reduce effectiveness and harm kidneys',
      'Lithium - increased lithium levels',
      'Diuretics - increased blood pressure lowering effect',
      'Diabetes medications - increased risk of low blood sugar'
    ],
    dosageInfo: 'Adults: Initial dose 10mg once daily. May be increased to 20-40mg daily. Take at same time each day. Can be taken with or without food.',
    howItWorks: 'Lisinopril is an ACE inhibitor that relaxes blood vessels, allowing blood to flow more easily and reducing the workload on the heart. It blocks the production of angiotensin II, a substance that narrows blood vessels.'
  },
  metformin: {
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    usages: [
      'Treatment of type 2 diabetes mellitus',
      'Prevention of type 2 diabetes in high-risk individuals',
      'Management of polycystic ovary syndrome (PCOS)',
      'Weight management in diabetic patients',
      'Reduction of cardiovascular risks in diabetic patients'
    ],
    sideEffects: {
      common: [
        'Nausea or vomiting',
        'Diarrhea',
        'Stomach upset or pain',
        'Gas or bloating',
        'Loss of appetite',
        'Metallic taste in mouth',
        'Headache'
      ],
      serious: [
        'Lactic acidosis (rare but serious - muscle pain, weakness, trouble breathing, stomach pain)',
        'Signs of low blood sugar (shakiness, rapid heartbeat, sweating)',
        'Vitamin B12 deficiency (long-term use)',
        'Severe allergic reactions',
        'Liver problems',
        'Unusual tiredness or weakness'
      ]
    },
    precautions: [
      'Take with food to reduce stomach upset',
      'Do not use if you have severe kidney disease',
      'Stop before surgery or imaging procedures with contrast dye',
      'Limit alcohol intake - increases risk of lactic acidosis',
      'Monitor blood sugar levels regularly',
      'Inform doctor if you have liver disease or heart problems',
      'May need B12 supplements with long-term use'
    ],
    interactions: [
      'Contrast dye for X-rays - stop metformin temporarily',
      'Alcohol - increased risk of lactic acidosis',
      'Carbonic anhydrase inhibitors - increased risk of lactic acidosis',
      'Insulin or other diabetes medications - increased risk of low blood sugar',
      'Certain blood pressure medications - may affect blood sugar control'
    ],
    dosageInfo: 'Adults: Start with 500mg twice daily or 850mg once daily with meals. May gradually increase to maximum 2000-2550mg per day in divided doses.',
    howItWorks: 'Metformin decreases glucose production in the liver, decreases intestinal absorption of glucose, and improves insulin sensitivity by increasing peripheral glucose uptake and utilization.'
  }
};

export function AIDrugInfo({ drugName }: AIDrugInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const drugKey = drugName.toLowerCase();
  const drugInfo = drugDatabase[drugKey];

  if (!drugInfo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900">AI-Powered Drug Information</h3>
            <p className="text-sm text-gray-600">Detailed medical information not available for this medication</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          We're continuously expanding our AI knowledge base. Please consult your healthcare provider or pharmacist for detailed information about this medication.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      {/* AI Header - Clickable Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 p-4 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ${isExpanded ? 'rounded-t-[20px] rounded-b-[0px]' : 'rounded-[20px]'
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="bg-white/20 p-2 rounded-lg"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div className="text-left">
              <h3 className="text-white">AI-Powered Drug Information</h3>
              <p className="text-indigo-100 text-sm">Click to {isExpanded ? 'hide' : 'view'} detailed medical information</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </motion.div>
        </div>
      </button>

      {/* Drug Info Content - Collapsible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white shadow-lg border border-gray-200 border-t-0 overflow-hidden rounded-t-[0px] rounded-b-[30px]">
              {/* Drug Name & Generic */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
                <h2 className="text-gray-900 mb-1">{drugInfo.name}</h2>
                <p className="text-gray-600">Generic Name: {drugInfo.genericName}</p>
              </div>

              {/* How It Works */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="p-6 border-b border-gray-200 bg-blue-50"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">How It Works</h3>
                    <p className="text-gray-600 leading-relaxed">{drugInfo.howItWorks}</p>
                  </div>
                </div>
              </motion.div>

              {/* Usages */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-6 border-b border-gray-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-green-600 p-2 rounded-lg flex-shrink-0">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-3">Common Uses</h3>
                    <ul className="space-y-2">
                      {drugInfo.usages.map((usage, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{usage}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Dosage Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-6 border-b border-gray-200 bg-purple-50"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600 p-2 rounded-lg flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Dosage Information</h3>
                    <p className="text-gray-600 leading-relaxed">{drugInfo.dosageInfo}</p>
                  </div>
                </div>
              </motion.div>

              {/* Side Effects */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-6 border-b border-gray-200"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-yellow-600 p-2 rounded-lg flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-4">Side Effects</h3>

                    {/* Common Side Effects */}
                    <div className="mb-4">
                      <h4 className="text-gray-700 mb-2">Common (Usually Mild)</h4>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <ul className="space-y-1">
                          {drugInfo.sideEffects.common.map((effect, index) => (
                            <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                              <span className="text-yellow-600 mt-0.5">•</span>
                              <span>{effect}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Serious Side Effects */}
                    <div>
                      <h4 className="text-gray-700 mb-2">Serious (Seek Medical Attention)</h4>
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <ul className="space-y-1">
                          {drugInfo.sideEffects.serious.map((effect, index) => (
                            <li key={index} className="text-red-700 text-sm flex items-start gap-2">
                              <span className="text-red-600 mt-0.5">⚠</span>
                              <span>{effect}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Precautions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-6 border-b border-gray-200 bg-orange-50"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-orange-600 p-2 rounded-lg flex-shrink-0">
                    <ShieldAlert className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-3">Precautions & Warnings</h3>
                    <ul className="space-y-2">
                      {drugInfo.precautions.map((precaution, index) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5">⚠</span>
                          <span>{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Drug Interactions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-red-600 p-2 rounded-lg flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-3">Drug Interactions</h3>
                    <ul className="space-y-2">
                      {drugInfo.interactions.map((interaction, index) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start gap-2">
                          <span className="text-red-600 mt-0.5">•</span>
                          <span>{interaction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Disclaimer */}
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  ⚕️ This information is AI-generated for educational purposes only. Always consult your doctor, pharmacist, or healthcare provider before starting, stopping, or changing any medication. This is not a substitute for professional medical advice.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}