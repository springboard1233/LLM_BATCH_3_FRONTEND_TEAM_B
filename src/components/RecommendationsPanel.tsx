import { useState } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  related_transaction_ids: string[];
  acknowledged: boolean;
  acknowledged_at?: string;
}

const STATIC_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    title: 'Unusual activity detected on multiple accounts',
    description: 'Several accounts have shown transaction patterns 300% above normal. Recommend immediate review and potential account freeze.',
    severity: 'high',
    confidence: 0.92,
    related_transaction_ids: ['TXN00000123', 'TXN00000456'],
    acknowledged: false,
  },
  {
    id: '2',
    title: 'Enable 2FA for high-risk user segments',
    description: 'Users with transaction patterns similar to flagged fraud cases should be required to enable two-factor authentication.',
    severity: 'medium',
    confidence: 0.85,
    related_transaction_ids: [],
    acknowledged: false,
  },
  {
    id: '3',
    title: 'Geographic anomaly in ATM transactions',
    description: 'Multiple accounts show transactions from geographically distant ATMs within short time windows. Recommend implementing velocity checks.',
    severity: 'high',
    confidence: 0.88,
    related_transaction_ids: ['TXN00001234', 'TXN00001567'],
    acknowledged: false,
  },
];

export const RecommendationsPanel = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(STATIC_RECOMMENDATIONS);

  const handleAcknowledge = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === id
          ? { ...rec, acknowledged: true, acknowledged_at: new Date().toISOString() }
          : rec
      )
    );
  };

  const getSeverityStyles = (severity: string) => {
    const styles = {
      high: {
        bg: 'bg-red-900/50',
        border: 'border-red-700',
        text: 'text-red-200',
        icon: <AlertCircle className="w-5 h-5" />,
      },
      medium: {
        bg: 'bg-yellow-900/50',
        border: 'border-yellow-700',
        text: 'text-yellow-200',
        icon: <AlertCircle className="w-5 h-5" />,
      },
      low: {
        bg: 'bg-blue-900/50',
        border: 'border-blue-700',
        text: 'text-blue-200',
        icon: <Info className="w-5 h-5" />,
      },
    };

    return styles[severity as keyof typeof styles] || styles.low;
  };

  const activeRecommendations = recommendations.filter(r => !r.acknowledged);
  const acknowledgedRecommendations = recommendations.filter(r => r.acknowledged);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Recommendations</h2>
        <p className="text-slate-400 text-sm">
          AI-driven insights and suggested actions
        </p>
      </div>

      {activeRecommendations.length === 0 && acknowledgedRecommendations.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-slate-400">No recommendations at this time</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeRecommendations.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                Active ({activeRecommendations.length})
              </h3>
              <div className="space-y-3">
                {activeRecommendations.map(recommendation => {
                  const styles = getSeverityStyles(recommendation.severity);
                  return (
                    <div
                      key={recommendation.id}
                      className={`${styles.bg} border ${styles.border} rounded-lg p-4 transition-all hover:shadow-lg`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={styles.text}>
                          {styles.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h4 className="text-white font-semibold">{recommendation.title}</h4>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-xs font-medium ${styles.text} uppercase px-2 py-1 rounded bg-black bg-opacity-20`}>
                                {recommendation.severity}
                              </span>
                              <span className="text-xs text-slate-400">
                                {Math.round(recommendation.confidence * 100)}% confidence
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 mb-3">
                            {recommendation.description}
                          </p>
                          {recommendation.related_transaction_ids.length > 0 && (
                            <div className="mb-3">
                              <span className="text-xs text-slate-400">
                                Related transactions: {recommendation.related_transaction_ids.length}
                              </span>
                            </div>
                          )}
                          <button
                            onClick={() => handleAcknowledge(recommendation.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white bg-opacity-10 hover:bg-opacity-20 text-white text-sm font-medium rounded transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Acknowledge
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {acknowledgedRecommendations.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                Acknowledged ({acknowledgedRecommendations.length})
              </h3>
              <div className="space-y-2">
                {acknowledgedRecommendations.map(recommendation => (
                  <div
                    key={recommendation.id}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 opacity-60"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{recommendation.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Acknowledged {new Date(recommendation.acknowledged_at!).toLocaleString()}
                        </p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
