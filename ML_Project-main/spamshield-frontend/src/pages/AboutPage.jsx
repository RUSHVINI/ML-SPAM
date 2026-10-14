// SpamShield AI — Page 5: About
import React from 'react';
import { ShieldLogo, ArrowRight } from '../components/Icons';

const ALGO_CARDS = [
  {
    title: 'TF-IDF Vectorization',
    color: '#EDE9FE',
    border: '#6C3EE8',
    icon: '📊',
    points: [
      'Converts email text into 3,000 numerical features',
      'Uses Term Frequency-Inverse Document Frequency scoring',
      'Captures bigram (1-2 word) patterns for better context',
      'Sublinear TF scaling reduces dominance of very frequent terms',
      'English stop-words removed to focus on meaningful words',
    ],
  },
  {
    title: 'Decision Tree Classifier',
    color: '#E0F2FE',
    border: '#0891B2',
    icon: '🌳',
    points: [
      'Hierarchical binary tree that splits on feature thresholds',
      'Max depth of 20 prevents underfitting on complex emails',
      'Min samples per leaf (2) prevents overfitting to outliers',
      'Fully interpretable — every decision can be traced',
      'Fast inference — no iterative computation needed',
    ],
  },
  {
    title: 'XGBoost Classifier',
    color: '#D1FAE5',
    border: '#059669',
    icon: '⚡',
    points: [
      '200 gradient-boosted decision trees in an ensemble',
      'Learning rate 0.1 balances speed and generalization',
      'Max depth 6 each tree — complex patterns captured',
      'Log-loss as evaluation metric for probability calibration',
      'Industry standard: wins most tabular ML competitions',
    ],
  },
  {
    title: 'Stratified Cross-Validation',
    color: '#FEF3C7',
    border: '#D97706',
    icon: '🔄',
    points: [
      '5-fold cross-validation with stratified splits',
      'Each fold preserves spam/ham class distribution',
      'Reports accuracy, precision, recall, F1 per fold',
      'Prevents optimistic bias from a single train/test split',
      'Random state 42 ensures fully reproducible results',
    ],
  },
];

const PIPELINE_STEPS = [
  { num:'01', title:'Email Input',   desc:'Raw email text received from user interface via REST API call.', icon:'📧'},
  { num:'02', title:'Preprocessing', desc:'Text cleaned, TF-IDF vectorization applied using the fitted training vectorizer.', icon:'⚙️'},
  { num:'03', title:'Feature Extraction', desc:'Word count, link count, urgency words, and capital letters extracted as additional features.', icon:'🔍'},
  { num:'04', title:'Model Prediction', desc:'Combined feature matrix fed to Decision Tree and XGBoost for independent predictions.', icon:'🤖'},
  { num:'05', title:'Result & Probabilities', desc:'Both models return class predictions and probability scores returned to the UI.', icon:'📈'},
];

export default function AboutPage({ onNavigate }) {
  return (
    <div style={{minHeight:'100vh',background:'var(--white)',paddingBottom:60}}>
      {/* Hero */}
      <div style={{background:'var(--grad-hero)',padding:'60px 0'}}>
        <div className="container" style={{textAlign:'center'}}>
          <ShieldLogo size={60}/>
          <h1 style={{fontSize:'clamp(28px,5vw,48px)',fontWeight:800,marginTop:24,marginBottom:16}}>
            How <span className="gradient-text">SpamShield AI</span> Works
          </h1>
          <p style={{fontSize:17,color:'var(--text-secondary)',maxWidth:620,margin:'0 auto',lineHeight:1.7}}>
            A dual-model machine learning pipeline combining natural language processing and
            handcrafted features to deliver high-accuracy email spam detection.
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:48}}>
            <h2 className="section-title">Technology Stack</h2>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:16,justifyContent:'center'}}>
            {[
              {name:'React.js',    color:'#61DAFB',bg:'#E0F7FE',desc:'Frontend UI'},
              {name:'FastAPI',     color:'#009688',bg:'#E0F2F1',desc:'REST Backend'},
              {name:'scikit-learn',color:'#F08000',bg:'#FFF3E0',desc:'ML Framework'},
              {name:'XGBoost',     color:'#E7412A',bg:'#FFEBEE',desc:'Gradient Boost'},
              {name:'TF-IDF',      color:'#6C3EE8',bg:'#EDE9FE',desc:'Text Features'},
              {name:'Pandas',      color:'#150458',bg:'#EDE9FE',desc:'Data Handling'},
              {name:'Joblib',      color:'#4CAF50',bg:'#E8F5E9',desc:'Model Saving'},
              {name:'Chart.js',    color:'#FF6384',bg:'#FCE4EC',desc:'Visualizations'},
            ].map((t,i) => (
              <div key={i} style={{
                background:t.bg, borderRadius:12, padding:'16px 24px',
                border:`2px solid ${t.color}40`, textAlign:'center', minWidth:120
              }}>
                <div style={{fontSize:16,fontWeight:700,color:t.color}}>{t.name}</div>
                <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ML Pipeline */}
      <section className="section section-pale">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:48}}>
            <h2 className="section-title">ML <span className="gradient-text">Pipeline</span></h2>
            <p className="section-subtitle" style={{margin:'0 auto'}}>
              From raw email text to a spam/ham prediction in milliseconds.
            </p>
          </div>
          <div style={{position:'relative'}}>
            {PIPELINE_STEPS.map((s, i) => (
              <div key={i} style={{
                display:'flex', gap:24, alignItems:'flex-start', marginBottom:24,
                padding:'24px 28px', background:'white', borderRadius:16,
                boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)',
                transition:'transform 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform='translateX(8px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateX(0)'}
              >
                <div style={{
                  width:56, height:56, borderRadius:16, background:'var(--bg-section)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:24, flexShrink:0,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
                    <span style={{
                      fontSize:12,fontWeight:700,color:'var(--primary)',
                      background:'var(--bg-section)',borderRadius:50,padding:'2px 10px'
                    }}>{s.num}</span>
                    <h3 style={{fontWeight:700,fontSize:17}}>{s.title}</h3>
                  </div>
                  <p style={{color:'var(--text-secondary)',fontSize:14,lineHeight:1.6}}>{s.desc}</p>
                </div>
                {i < PIPELINE_STEPS.length-1 && (
                  <div style={{
                    position:'absolute',left:52,marginTop:80,
                    width:2,height:24,background:'var(--border)'
                  }}/>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Algorithm cards */}
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:48}}>
            <h2 className="section-title">Algorithms & Techniques</h2>
            <p className="section-subtitle" style={{margin:'0 auto'}}>
              How each component of the AI pipeline works under the hood.
            </p>
          </div>
          <div className="grid-2" style={{gap:28}}>
            {ALGO_CARDS.map((a, i) => (
              <div key={i} className="card fade-in-up" style={{
                animationDelay:`${i*0.1}s`,
                borderTop:`4px solid ${a.border}`,
                background:`linear-gradient(135deg,white,${a.color}40)`,
              }}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                  <span style={{fontSize:32}}>{a.icon}</span>
                  <h3 style={{fontWeight:700,fontSize:18,color:a.border}}>{a.title}</h3>
                </div>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10}}>
                  {a.points.map((p, j) => (
                    <li key={j} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                      <span style={{color:a.border,marginTop:2,flexShrink:0,fontWeight:700}}>→</span>
                      <span style={{fontSize:14,color:'var(--text-secondary)',lineHeight:1.5}}>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features used */}
      <section className="section section-pale">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:48}}>
            <h2 className="section-title">Email Features Extracted</h2>
          </div>
          <div className="grid-4">
            {[
              {feat:'Word Count',       icon:'📝',desc:'Total words in the email. Spam emails tend to be shorter or very long.'},
              {feat:'Link Count',       icon:'🔗',desc:'Number of HTTP/HTTPS and www links. Spam often contains multiple URLs.'},
              {feat:'Urgency Words',    icon:'⚡',desc:'Count of spam trigger words like "free", "urgent", "winner", "click here".'},
              {feat:'Capital Letters',  icon:'🔠',desc:'Number of uppercase characters. SHOUTING is a classic spam indicator.'},
            ].map((f,i) => (
              <div key={i} className="card" style={{textAlign:'center'}}>
                <div style={{fontSize:40,marginBottom:16}}>{f.icon}</div>
                <h4 style={{fontWeight:700,fontSize:16,marginBottom:10,color:'var(--primary)'}}>{f.feat}</h4>
                <p style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.5}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{background:'var(--grad-primary)',padding:'56px 0'}}>
        <div className="container" style={{textAlign:'center'}}>
          <h2 style={{color:'white',fontSize:'clamp(24px,4vw,36px)',fontWeight:800,marginBottom:16}}>
            Ready to Detect Spam?
          </h2>
          <p style={{color:'rgba(255,255,255,0.8)',fontSize:16,marginBottom:32}}>
            Try the email analyzer or explore the model performance dashboard.
          </p>
          <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
            <button className="btn btn-outline btn-lg" onClick={() => onNavigate('analyzer')}>
              Analyze Email <ArrowRight/>
            </button>
            <button className="btn btn-outline" onClick={() => onNavigate('dashboard')}
              style={{background:'rgba(255,255,255,0.15)'}}>
              View Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
