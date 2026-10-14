// SpamShield AI — Page 3: Analysis Results
import React from 'react';
import { SpamIcon, SafeIcon, ArrowRight, ShieldLogo } from '../components/Icons';

function ProbabilityBar({ label, value, color }) {
  return (
    <div style={{marginBottom:12}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
        <span style={{fontSize:13,fontWeight:500,color:'var(--text-secondary)'}}>{label}</span>
        <span style={{fontSize:13,fontWeight:700,color}}>{value.toFixed(1)}%</span>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{
          width:`${value}%`,
          background: color === '#EF4444'
            ? 'linear-gradient(90deg,#F87171,#EF4444)'
            : color === '#10B981'
              ? 'linear-gradient(90deg,#34D399,#10B981)'
              : 'var(--grad-primary)',
        }}/>
      </div>
    </div>
  );
}

function ModelCard({ title, result, accentColor, bgGrad }) {
  if (!result) return null;
  const isSpam = result.is_spam;

  return (
    <div className="card fade-in-up" style={{border:`2px solid ${accentColor}20`}}>
      {/* Header */}
      <div style={{
        background: bgGrad, borderRadius:12, padding:'20px 24px',
        marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between'
      }}>
        <div>
          <div style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,0.7)',marginBottom:4}}>Model</div>
          <div style={{fontSize:22,fontWeight:800,color:'white'}}>{title}</div>
        </div>
        <div style={{
          background:'rgba(255,255,255,0.2)', borderRadius:12, padding:'8px 20px',
          fontSize:16, fontWeight:800, color:'white'
        }}>
          {result.prediction}
        </div>
      </div>

      {/* Verdict icon */}
      <div style={{textAlign:'center',marginBottom:20}}>
        {isSpam ? <SpamIcon/> : <SafeIcon/>}
        <div style={{
          fontSize:28,fontWeight:800,marginTop:12,
          color: isSpam ? '#DC2626' : '#059669'
        }}>{result.prediction}</div>
      </div>

      {/* Probability bars */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:600,color:'var(--text-muted)',marginBottom:12,textTransform:'uppercase',letterSpacing:'0.05em'}}>
          Confidence Scores
        </div>
        <ProbabilityBar label="Spam Probability"      value={result.spam_probability} color="#EF4444"/>
        <ProbabilityBar label="Legitimate Probability" value={result.ham_probability}  color="#10B981"/>
      </div>

      {/* Confidence meter */}
      <div style={{
        background: isSpam ? '#FEF2F2' : '#F0FDF4',
        borderRadius:10, padding:'12px 16px',
        border: `1px solid ${isSpam ? '#FCA5A5' : '#6EE7B7'}`
      }}>
        <span style={{fontSize:13,fontWeight:600,color: isSpam ? '#DC2626' : '#059669'}}>
          {isSpam ? 'High Spam Confidence' : 'High Legitimacy Confidence'}
          {' '}— {Math.max(result.spam_probability, result.ham_probability).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function FeatureCard({ features }) {
  if (!features) return null;
  const items = [
    { label: 'Word Count',       value: features.word_count,      icon: '📝', desc: 'Total words in email' },
    { label: 'Link Count',       value: features.link_count,      icon: '🔗', desc: 'HTTP/www links found' },
    { label: 'Urgency Words',    value: features.urgency_words,   icon: '⚡', desc: 'Spam trigger words' },
    { label: 'Capital Letters',  value: features.capital_letters, icon: '🔠', desc: 'UPPERCASE characters' },
  ];

  return (
    <div className="card fade-in-up delay-2" style={{marginBottom:0}}>
      <h3 style={{fontWeight:700,marginBottom:20,fontSize:18}}>Email Feature Analysis</h3>
      <div className="grid-2" style={{gap:16}}>
        {items.map((item, i) => (
          <div key={i} style={{
            background:'var(--bg-pale)', borderRadius:12, padding:'16px',
            display:'flex', alignItems:'center', gap:12
          }}>
            <div style={{fontSize:24}}>{item.icon}</div>
            <div>
              <div style={{fontSize:22,fontWeight:800,color:'var(--primary)'}}>{item.value}</div>
              <div style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)'}}>{item.label}</div>
              <div style={{fontSize:11,color:'var(--text-muted)'}}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsPage({ prediction, emailText, onNavigate }) {
  if (!prediction) {
    return (
      <div style={{minHeight:'100vh',background:'var(--bg-pale)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div className="card" style={{textAlign:'center',padding:48,maxWidth:480}}>
          <ShieldLogo size={56}/>
          <h2 style={{marginTop:24,marginBottom:12}}>No Analysis Yet</h2>
          <p style={{color:'var(--text-secondary)',marginBottom:24}}>
            Please analyze an email first to see the model results.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('analyzer')}>
            Go to Email Analyzer <ArrowRight/>
          </button>
        </div>
      </div>
    );
  }

  const { decision_tree, xgboost, features, overall_verdict, overall_is_spam, consensus } = prediction;

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-pale)',paddingBottom:60}}>
      {/* Header */}
      <div style={{
        background: overall_is_spam
          ? 'linear-gradient(135deg,#DC2626,#EF4444)'
          : 'linear-gradient(135deg,#059669,#10B981)',
        padding:'48px 0 80px'
      }}>
        <div className="container" style={{textAlign:'center'}}>
          <div className="badge" style={{background:'rgba(255,255,255,0.2)',color:'white',marginBottom:20}}>
            Analysis Complete
          </div>
          <div style={{marginBottom:16}}>
            {overall_is_spam ? <SpamIcon/> : <SafeIcon/>}
          </div>
          <h1 style={{color:'white',fontSize:'clamp(32px,5vw,52px)',fontWeight:800,marginBottom:12}}>
            {overall_verdict}
          </h1>
          <p style={{color:'rgba(255,255,255,0.85)',fontSize:16}}>
            {consensus
              ? 'Both Decision Tree and XGBoost models agree on this result.'
              : 'Models have differing opinions — see individual results below.'}
          </p>
        </div>
      </div>

      <div className="container" style={{marginTop:'-52px'}}>
        {/* Model Cards */}
        <div className="grid-2" style={{marginBottom:32}}>
          <ModelCard
            title="Decision Tree"
            result={decision_tree}
            accentColor="#6C3EE8"
            bgGrad="linear-gradient(135deg,#6C3EE8,#8B5CF6)"
          />
          <ModelCard
            title="XGBoost"
            result={xgboost}
            accentColor="#06B6D4"
            bgGrad="linear-gradient(135deg,#0891B2,#06B6D4)"
          />
        </div>

        {/* Feature Analysis & Comparison */}
        <div className="grid-2" style={{marginBottom:32}}>
          <FeatureCard features={features}/>

          {/* Comparison Summary */}
          <div className="card fade-in-up delay-3">
            <h3 style={{fontWeight:700,marginBottom:20,fontSize:18}}>Model Comparison</h3>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              {/* Spam probability comparison */}
              <div>
                <div style={{fontSize:13,fontWeight:600,color:'var(--text-muted)',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.05em'}}>
                  Spam Confidence
                </div>
                <ProbabilityBar label="Decision Tree" value={decision_tree.spam_probability} color="var(--primary)"/>
                <ProbabilityBar label="XGBoost"       value={xgboost.spam_probability}       color="var(--accent)"/>
              </div>
              {/* Ham probability comparison */}
              <div>
                <div style={{fontSize:13,fontWeight:600,color:'var(--text-muted)',marginBottom:10,textTransform:'uppercase',letterSpacing:'0.05em'}}>
                  Legitimate Confidence
                </div>
                <ProbabilityBar label="Decision Tree" value={decision_tree.ham_probability} color="var(--primary)"/>
                <ProbabilityBar label="XGBoost"       value={xgboost.ham_probability}       color="var(--accent)"/>
              </div>

              {/* Consensus badge */}
              <div style={{
                background: consensus ? 'var(--success-light)' : '#FEF3C7',
                border: `1px solid ${consensus ? '#6EE7B7' : '#FCD34D'}`,
                borderRadius:10, padding:'12px 16px', textAlign:'center'
              }}>
                <span style={{fontWeight:600,color: consensus ? '#065F46' : '#92400E',fontSize:14}}>
                  {consensus ? '✓ Models Agree' : '⚡ Models Disagree — check dashboard for details'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Analyzed email snippet */}
        {emailText && (
          <div className="card fade-in-up delay-4" style={{marginBottom:32}}>
            <h3 style={{fontWeight:700,marginBottom:12,fontSize:16}}>Analyzed Email Preview</h3>
            <div style={{
              background:'var(--bg-pale)', borderRadius:10, padding:'16px',
              fontFamily:'monospace', fontSize:13, color:'var(--text-secondary)',
              maxHeight:120, overflow:'hidden', position:'relative',
              lineHeight:1.6, borderLeft:'4px solid var(--primary)'
            }}>
              {emailText.slice(0, 300)}{emailText.length > 300 ? '...' : ''}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
          <button className="btn btn-primary btn-lg" onClick={() => onNavigate('dashboard')}>
            View Analytics Dashboard <ArrowRight/>
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('analyzer')}>
            Analyze Another Email
          </button>
        </div>
      </div>
    </div>
  );
}
