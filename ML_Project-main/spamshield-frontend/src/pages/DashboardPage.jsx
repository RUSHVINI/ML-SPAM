// SpamShield AI — Page 4: Interactive Analytics Dashboard
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler, RadialLinearScale
} from 'chart.js';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import api from '../services/api';
import { ArrowRight } from '../components/Icons';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler, RadialLinearScale
);

// ── Palettes ──────────────────────────────────────────────────────────────────
const PURPLE = '#6C3EE8';
const CYAN   = '#06B6D4';
const ORANGE = '#F59E0B';

const FEATURE_LABELS = {
  word_count:      'Word Count',
  link_count:      'Link Count',
  urgency_words:   'Urgency Words',
  capital_letters: 'Capital Letters',
};

// ── Small metric card ─────────────────────────────────────────────────────────
function MetricBadge({ label, value, color }) {
  return (
    <div style={{
      background:'var(--white)', borderRadius:12, padding:'16px 20px',
      boxShadow:'var(--shadow-sm)', border:`2px solid ${color}20`, textAlign:'center'
    }}>
      <div style={{fontSize:26,fontWeight:800,color}}>{value}%</div>
      <div style={{fontSize:12,color:'var(--text-muted)',fontWeight:500,marginTop:4}}>{label}</div>
    </div>
  );
}

// ── Confusion matrix ──────────────────────────────────────────────────────────
function ConfusionMatrix({ cm, title, color }) {
  if (!cm) return null;
  const [[tn, fp], [fn, tp]] = cm;
  return (
    <div style={{marginBottom:0}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:12,color:'var(--text-secondary)'}}>{title}</div>
      <table className="cm-table">
        <thead>
          <tr>
            <th></th>
            <th>Predicted: Ham</th>
            <th>Predicted: Spam</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Actual: Ham</th>
            <td className="cm-tn">{tn}</td>
            <td className="cm-fp">{fp}</td>
          </tr>
          <tr>
            <th>Actual: Spam</th>
            <td className="cm-fn">{fn}</td>
            <td className="cm-tp">{tp}</td>
          </tr>
        </tbody>
      </table>
      <div style={{display:'flex',gap:12,marginTop:10,fontSize:11,color:'var(--text-muted)',flexWrap:'wrap'}}>
        <span style={{color:'#065F46'}}>■ TN: {tn} (Correct Ham)</span>
        <span style={{color:'#065F46'}}>■ TP: {tp} (Correct Spam)</span>
        <span style={{color:'#991B1B'}}>■ FP: {fp} (Ham→Spam)</span>
        <span style={{color:'#92400E'}}>■ FN: {fn} (Spam→Ham)</span>
      </div>
    </div>
  );
}

const CHART_OPTIONS = {
  responsive:true,
  maintainAspectRatio:true,
  plugins:{ legend:{ position:'top', labels:{ font:{ size:12,family:'Inter' } } } },
  scales:{
    x:{ grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ font:{size:11} } },
    y:{ grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ font:{size:11} }, beginAtZero:true },
  }
};

export default function DashboardPage({ onNavigate }) {
  const [metrics, setMetrics]   = useState(null);
  const [featDist, setFeatDist] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [selFeature, setSelFeature] = useState('word_count');

  useEffect(() => {
    (async () => {
      try {
        const [m, f] = await Promise.all([api.getMetrics(), api.getFeatureDistributions()]);
        setMetrics(m); setFeatDist(f);
      } catch (e) {
        setError(e.message);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-pale)'}}>
      <div style={{textAlign:'center'}}>
        <div className="spinner" style={{margin:'0 auto 16px'}}/>
        <p style={{color:'var(--text-secondary)'}}>Loading dashboard data…</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg-pale)'}}>
      <div className="card" style={{maxWidth:480,textAlign:'center',padding:40}}>
        <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
        <h2 style={{marginBottom:12}}>Failed to Load Data</h2>
        <p style={{color:'var(--text-secondary)',marginBottom:24}}>{error}</p>
        <p style={{fontSize:13,color:'var(--text-muted)'}}>Make sure the FastAPI server is running on port 8000.</p>
      </div>
    </div>
  );

  const dt  = metrics.decision_tree;
  const xgb = metrics.xgboost;

  // ── Chart data builders ────────────────────────────────────────────────────

  // 1. Model performance comparison (bar)
  const performanceData = {
    labels: ['Accuracy', 'Precision', 'Recall', 'F1-Score'],
    datasets: [
      {
        label: 'Decision Tree',
        data: [dt.accuracy, dt.precision, dt.recall, dt.f1],
        backgroundColor: `${PURPLE}CC`, borderColor: PURPLE, borderWidth:2, borderRadius:8,
      },
      {
        label: 'XGBoost',
        data: [xgb.accuracy, xgb.precision, xgb.recall, xgb.f1],
        backgroundColor: `${CYAN}CC`, borderColor: CYAN, borderWidth:2, borderRadius:8,
      },
    ],
  };

  // 2. CV accuracy line chart (5 folds)
  const foldLabels = ['Fold 1','Fold 2','Fold 3','Fold 4','Fold 5'];
  const cvData = {
    labels: foldLabels,
    datasets: [
      {
        label:'Decision Tree CV Accuracy',
        data: dt.cv_accuracy,
        borderColor: PURPLE, backgroundColor:`${PURPLE}22`,
        borderWidth:2, pointRadius:5, fill:true, tension:0.3,
      },
      {
        label:'XGBoost CV Accuracy',
        data: xgb.cv_accuracy,
        borderColor: CYAN, backgroundColor:`${CYAN}22`,
        borderWidth:2, pointRadius:5, fill:true, tension:0.3,
      },
    ],
  };

  // 3. Radar chart
  const radarData = {
    labels:['Accuracy','Precision','Recall','F1-Score'],
    datasets:[
      {
        label:'Decision Tree',
        data:[dt.accuracy,dt.precision,dt.recall,dt.f1],
        backgroundColor:`${PURPLE}30`,borderColor:PURPLE,borderWidth:2,pointBackgroundColor:PURPLE,
      },
      {
        label:'XGBoost',
        data:[xgb.accuracy,xgb.precision,xgb.recall,xgb.f1],
        backgroundColor:`${CYAN}30`,borderColor:CYAN,borderWidth:2,pointBackgroundColor:CYAN,
      },
    ],
  };

  // 4. Doughnut (dataset split)
  const doughnutData = {
    labels:['Spam Emails','Legitimate Emails'],
    datasets:[{
      data:[metrics.spam_emails, metrics.legitimate_emails],
      backgroundColor:[`${PURPLE}CC`, `${CYAN}CC`],
      borderColor:['white','white'], borderWidth:3,
    }],
  };

  // 5. Feature distribution
  const fd = featDist && featDist[selFeature];
  const featHistData = fd ? {
    labels: fd.bins,
    datasets:[
      {
        label:'Spam',
        data: fd.spam_hist,
        backgroundColor:`${PURPLE}CC`, borderColor:PURPLE, borderWidth:1, borderRadius:4,
      },
      {
        label:'Legitimate',
        data: fd.ham_hist,
        backgroundColor:`${CYAN}CC`, borderColor:CYAN, borderWidth:1, borderRadius:4,
      },
    ],
  } : null;

  // 6. CV F1 scores
  const cvF1Data = {
    labels: foldLabels,
    datasets:[
      {
        label:'Decision Tree F1',
        data: dt.cv_f1,
        borderColor:PURPLE, backgroundColor:`${PURPLE}22`, borderWidth:2,
        pointRadius:5, fill:true, tension:0.3,
      },
      {
        label:'XGBoost F1',
        data: xgb.cv_f1,
        borderColor:ORANGE, backgroundColor:`${ORANGE}22`, borderWidth:2,
        pointRadius:5, fill:true, tension:0.3,
      },
    ],
  };

  const radarOptions = {
    responsive:true, maintainAspectRatio:true,
    scales:{ r:{ beginAtZero:false, min:80, max:100,
      ticks:{font:{size:10}}, pointLabels:{font:{size:12}} } },
    plugins:{ legend:{ position:'bottom', labels:{font:{size:12}} } },
  };
  const doughnutOptions = {
    responsive:true, maintainAspectRatio:true, cutout:'65%',
    plugins:{ legend:{ position:'bottom' }, tooltip:{
      callbacks:{ label: ctx => ` ${ctx.label}: ${ctx.parsed.toLocaleString()}` }
    }},
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-pale)',paddingBottom:60}}>
      {/* Header */}
      <div style={{background:'var(--grad-primary)',padding:'40px 0 72px'}}>
        <div className="container">
          <div className="badge" style={{background:'rgba(255,255,255,0.2)',color:'white',marginBottom:16}}>
            Analytics Dashboard
          </div>
          <h1 style={{color:'white',fontSize:'clamp(26px,4vw,40px)',fontWeight:800,marginBottom:8}}>
            Model Performance Dashboard
          </h1>
          <p style={{color:'rgba(255,255,255,0.8)',fontSize:15}}>
            Real metrics from trained models • Stratified 5-fold cross-validation
          </p>
        </div>
      </div>

      <div className="container" style={{marginTop:'-48px'}}>

        {/* ── Top stat cards ── */}
        <div className="grid-4" style={{marginBottom:28}}>
          {[
            {label:'Total Emails', value:metrics.total_emails.toLocaleString(), color:PURPLE, icon:'📧'},
            {label:'Spam Emails',  value:metrics.spam_emails.toLocaleString(),  color:'#EF4444',icon:'🚫'},
            {label:'Legit Emails', value:metrics.legitimate_emails.toLocaleString(), color:'#10B981',icon:'✅'},
            {label:'Best F1 Score',value:`${Math.max(dt.f1,xgb.f1)}%`, color:CYAN, icon:'🏆'},
          ].map((s,i) => (
            <div key={i} className="card fade-in-up" style={{animationDelay:`${i*0.08}s`,padding:'20px 24px'}}>
              <div style={{fontSize:32,marginBottom:8}}>{s.icon}</div>
              <div style={{fontSize:28,fontWeight:800,color:s.color,marginBottom:4}}>{s.value}</div>
              <div style={{fontSize:13,color:'var(--text-muted)',fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Model performance bar ── */}
        <div className="grid-2" style={{marginBottom:28}}>
          <div className="card fade-in-up">
            <h3 style={{fontWeight:700,marginBottom:4,fontSize:16}}>Model Performance Comparison</h3>
            <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:20}}>Test set metrics (%)</p>
            <Bar data={performanceData} options={{
              ...CHART_OPTIONS,
              scales:{...CHART_OPTIONS.scales, y:{...CHART_OPTIONS.scales.y,min:0,max:100}}
            }}/>
          </div>
          <div className="card fade-in-up delay-1">
            <h3 style={{fontWeight:700,marginBottom:4,fontSize:16}}>Model Radar — All Metrics</h3>
            <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:20}}>Performance overview</p>
            <Radar data={radarData} options={radarOptions}/>
          </div>
        </div>

        {/* ── Metric badges ── */}
        <div className="grid-2" style={{marginBottom:28,gap:28}}>
          {/* DT metrics */}
          <div className="card fade-in-up">
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
              <div style={{width:14,height:14,borderRadius:4,background:PURPLE}}/>
              <h3 style={{fontWeight:700,fontSize:16}}>Decision Tree Metrics</h3>
            </div>
            <div className="grid-2" style={{gap:12}}>
              <MetricBadge label="Accuracy"  value={dt.accuracy}  color={PURPLE}/>
              <MetricBadge label="Precision" value={dt.precision} color={PURPLE}/>
              <MetricBadge label="Recall"    value={dt.recall}    color={PURPLE}/>
              <MetricBadge label="F1-Score"  value={dt.f1}        color={PURPLE}/>
            </div>
          </div>
          {/* XGB metrics */}
          <div className="card fade-in-up delay-1">
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
              <div style={{width:14,height:14,borderRadius:4,background:CYAN}}/>
              <h3 style={{fontWeight:700,fontSize:16}}>XGBoost Metrics</h3>
            </div>
            <div className="grid-2" style={{gap:12}}>
              <MetricBadge label="Accuracy"  value={xgb.accuracy}  color={CYAN}/>
              <MetricBadge label="Precision" value={xgb.precision} color={CYAN}/>
              <MetricBadge label="Recall"    value={xgb.recall}    color={CYAN}/>
              <MetricBadge label="F1-Score"  value={xgb.f1}        color={CYAN}/>
            </div>
          </div>
        </div>

        {/* ── CV Charts ── */}
        <div className="grid-2" style={{marginBottom:28}}>
          <div className="card fade-in-up">
            <h3 style={{fontWeight:700,marginBottom:4,fontSize:16}}>5-Fold CV Accuracy</h3>
            <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:20}}>Accuracy per cross-validation fold</p>
            <Line data={cvData} options={{
              ...CHART_OPTIONS,
              scales:{...CHART_OPTIONS.scales, y:{...CHART_OPTIONS.scales.y,min:0,max:100}}
            }}/>
          </div>
          <div className="card fade-in-up delay-1">
            <h3 style={{fontWeight:700,marginBottom:4,fontSize:16}}>5-Fold CV F1-Score</h3>
            <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:20}}>F1-score per cross-validation fold</p>
            <Line data={cvF1Data} options={{
              ...CHART_OPTIONS,
              scales:{...CHART_OPTIONS.scales, y:{...CHART_OPTIONS.scales.y,min:0,max:100}}
            }}/>
          </div>
        </div>

        {/* ── Confusion matrices ── */}
        <div className="grid-2" style={{marginBottom:28}}>
          <div className="card fade-in-up">
            <h3 style={{fontWeight:700,marginBottom:20,fontSize:16}}>Decision Tree — Confusion Matrix</h3>
            <ConfusionMatrix cm={dt.confusion_matrix} color={PURPLE}/>
          </div>
          <div className="card fade-in-up delay-1">
            <h3 style={{fontWeight:700,marginBottom:20,fontSize:16}}>XGBoost — Confusion Matrix</h3>
            <ConfusionMatrix cm={xgb.confusion_matrix} color={CYAN}/>
          </div>
        </div>

        {/* ── Feature distribution ── */}
        {featDist && (
          <div className="card fade-in-up" style={{marginBottom:28}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:16,marginBottom:24}}>
              <div>
                <h3 style={{fontWeight:700,fontSize:16,marginBottom:4}}>Feature Distribution</h3>
                <p style={{fontSize:12,color:'var(--text-muted)'}}>
                  Distribution of selected feature for spam vs. legitimate emails
                </p>
              </div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                {Object.keys(FEATURE_LABELS).map(k => (
                  <button
                    key={k}
                    className={`feature-chip${selFeature===k?' selected':''}`}
                    onClick={() => setSelFeature(k)}
                  >
                    {FEATURE_LABELS[k]}
                  </button>
                ))}
              </div>
            </div>

            {featDist[selFeature] && (
              <div className="grid-2" style={{alignItems:'start'}}>
                <div>
                  <Bar
                    data={featHistData}
                    options={{
                      ...CHART_OPTIONS,
                      plugins:{...CHART_OPTIONS.plugins,
                        title:{display:true,text:`${FEATURE_LABELS[selFeature]} Distribution`,font:{size:13}}
                      }
                    }}
                  />
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:16}}>
                  <div style={{background:'var(--bg-pale)',borderRadius:12,padding:'20px'}}>
                    <div style={{fontSize:13,fontWeight:600,color:'var(--text-muted)',marginBottom:12}}>Mean Values</div>
                    <div style={{display:'flex',gap:12}}>
                      <div style={{flex:1,background:'white',borderRadius:10,padding:'14px',textAlign:'center',border:`2px solid ${PURPLE}20`}}>
                        <div style={{fontSize:22,fontWeight:800,color:PURPLE}}>
                          {featDist[selFeature].spam_mean}
                        </div>
                        <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>Spam Mean</div>
                      </div>
                      <div style={{flex:1,background:'white',borderRadius:10,padding:'14px',textAlign:'center',border:`2px solid ${CYAN}20`}}>
                        <div style={{fontSize:22,fontWeight:800,color:CYAN}}>
                          {featDist[selFeature].ham_mean}
                        </div>
                        <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>Legit Mean</div>
                      </div>
                    </div>
                  </div>
                  <div style={{background:'var(--bg-pale)',borderRadius:12,padding:'20px'}}>
                    <div style={{fontSize:13,fontWeight:600,color:'var(--text-muted)',marginBottom:12}}>Dataset Split</div>
                    <Doughnut data={doughnutData} options={doughnutOptions}/>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Action buttons ── */}
        <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
          <button className="btn btn-primary btn-lg" onClick={() => onNavigate('analyzer')}>
            Analyze Another Email <ArrowRight/>
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('about')}>
            Learn How It Works
          </button>
        </div>
      </div>
    </div>
  );
}
