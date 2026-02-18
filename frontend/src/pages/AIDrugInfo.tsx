import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertTriangle, Pill, Info, Users, Clock, ShieldAlert, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

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



export function AIDrugInfo({ drugName }: AIDrugInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [drugInfo, setDrugInfo] = useState<DrugDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to fill empty fields with 'Not available'
  function fillDefaults(info: DrugDetail): DrugDetail {
    return {
      name: info.name || 'Not available',
      genericName: info.genericName || 'Not available',
      usages: info.usages && info.usages.length > 0 ? info.usages : ['Not available'],
      sideEffects: {
        common: info.sideEffects?.common && info.sideEffects.common.length > 0 ? info.sideEffects.common : ['Not available'],
        serious: info.sideEffects?.serious && info.sideEffects.serious.length > 0 ? info.sideEffects.serious : ['Not available'],
      },
      precautions: info.precautions && info.precautions.length > 0 ? info.precautions : ['Not available'],
      interactions: info.interactions && info.interactions.length > 0 ? info.interactions : ['Not available'],
      dosageInfo: info.dosageInfo || 'Not available',
      howItWorks: info.howItWorks || 'Not available',
    };
  }

  useEffect(() => {
    if (!drugName) return;
    setLoading(true);
    setError(null);
    setDrugInfo(null);
    apiFetch(`/api/drug-info?name=${encodeURIComponent(drugName)}`)
      .then((data) => {
        setDrugInfo(fillDefaults(data));
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.error || 'No information found.');
        setLoading(false);
      });
  }, [drugName]);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white animate-spin" />
          </div>
          <div>
            <h3 className="text-gray-900">AI-Powered Drug Information</h3>
            <p className="text-sm text-gray-600">Loading information for <b>{drugName}</b>...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !drugInfo) {
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
            <p className="text-sm text-gray-600">{error || 'Detailed medical information not available for this medication'}</p>
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