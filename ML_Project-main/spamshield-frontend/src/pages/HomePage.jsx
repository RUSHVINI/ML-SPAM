// SpamShield AI — Page 1: Home
import React from 'react';
import {
  HeroIllustration, AIIcon, CompareIcon, SecureIcon, EasyIcon, ShieldLogo, ArrowRight
} from '../components/Icons';

const FEATURES = [
  {
    icon: <AIIcon />,
    title: 'AI Detection',
    desc: 'Dual-model AI using Decision Tree and XGBoost classifiers trained on real email data.',
    color: '#EDE9FE',
  },
  {
    icon: <CompareIcon />,
    title: 'Model Comparison',
    desc: 'Compare predictions side-by-side with probability scores and feature analysis.',
    color: '#E0F2FE',
  },
  {
    icon: <SecureIcon />,
    title: 'Secure & Reliable',
    desc: 'TF-IDF + manual features pipeline with stratified cross-validation for robust accuracy.',
    color: '#D1FAE5',
  },
  {
    icon: <EasyIcon />,
    title: 'Easy to Use',
    desc: 'Paste your email, click Analyze, get instant results. No technical knowledge needed.',
    color: '#FEF3C7',
  },
];

const STATS = [
  { value: '99%+', label: 'Detection Accuracy' },
  { value: '2', label: 'ML Models' },
  { value: '5-Fold', label: 'Cross-Validation' },
  { value: 'Real-time', label: 'Analysis' },
];

export default function HomePage({ onNavigate }) {
  return (
    <div className="page-wrapper">
      {/* ── Hero ── */}
      <section style={{background:'var(--grad-hero)', padding:'80px 0 60px'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}}>
            {/* Left */}
            <div className="fade-in-up">
              <div className="badge badge-primary" style={{marginBottom:24}}>
                <div className="pulse-dot" style={{background:'var(--primary)'}}/>
                Powered by Machine Learning
              </div>
              <h1 style={{fontSize:'clamp(32px,5vw,54px)',fontWeight:800,lineHeight:1.15,marginBottom:24}}>
                Smart Email Protection,{' '}
                <span className="gradient-text">Powered by AI</span>
              </h1>
              <p style={{fontSize:18,color:'var(--text-secondary)',marginBottom:36,lineHeight:1.7}}>
                SpamShield AI uses advanced machine learning models to detect spam emails instantly.
                Protect your inbox with real-time AI analysis and detailed model insights.
              </p>
              <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
                <button className="btn btn-primary btn-lg" onClick={() => onNavigate('analyzer')}>
                  Check Your Email <ArrowRight />
                </button>
                <button className="btn btn-secondary" onClick={() => onNavigate('dashboard')}>
                  View Dashboard
                </button>
              </div>
            </div>
            {/* Right */}
            <div className="fade-in-up delay-2" style={{display:'flex',justifyContent:'center'}}>
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{background:'var(--white)',padding:'48px 0'}}>
        <div className="container">
          <div className="grid-4">
            {STATS.map((s, i) => (
              <div key={i} className="stat-card fade-in-up" style={{animationDelay:`${i*0.1}s`}}>
                <div className="stat-number gradient-text">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section section-pale">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:56}}>
            <div className="badge badge-primary" style={{marginBottom:16}}>Features</div>
            <h2 className="section-title">Why Choose SpamShield AI?</h2>
            <p className="section-subtitle" style={{margin:'0 auto'}}>
              Enterprise-grade spam detection powered by cutting-edge machine learning.
            </p>
          </div>
          <div className="grid-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="card fade-in-up" style={{animationDelay:`${i*0.1}s`,textAlign:'center'}}>
                <div style={{
                  width:72, height:72, borderRadius:20, background:f.color,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 20px', boxShadow:'0 4px 12px rgba(0,0,0,0.06)'
                }}>
                  {f.icon}
                </div>
                <h3 style={{fontSize:18,fontWeight:700,marginBottom:10}}>{f.title}</h3>
                <p style={{fontSize:14,color:'var(--text-secondary)',lineHeight:1.6}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:56}}>
            <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:32,position:'relative'}}>
            {[
              {step:'01', title:'Paste Email', desc:'Copy and paste your suspicious email into the analyzer text box.'},
              {step:'02', title:'AI Analysis',  desc:'Our dual ML models extract features and classify the email in milliseconds.'},
              {step:'03', title:'View Results', desc:'Get clear SPAM / NOT SPAM results with probability scores and insights.'},
            ].map((s, i) => (
              <div key={i} className="card" style={{textAlign:'center',position:'relative'}}>
                <div style={{
                  fontSize:48, fontWeight:800, marginBottom:16,
                  background:'var(--grad-primary)', WebkitBackgroundClip:'text',
                  WebkitTextFillColor:'transparent', backgroundClip:'text',
                }}>
                  {s.step}
                </div>
                <h3 style={{fontSize:20,fontWeight:700,marginBottom:12}}>{s.title}</h3>
                <p style={{color:'var(--text-secondary)',fontSize:15}}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:48}}>
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('analyzer')}>
              Try SpamShield AI Free <ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{background:'var(--grad-primary)',padding:'64px 0'}}>
        <div className="container" style={{textAlign:'center'}}>
          <ShieldLogo size={56} />
          <h2 style={{color:'white',fontSize:'clamp(24px,4vw,38px)',fontWeight:800,margin:'24px 0 16px'}}>
            Ready to Protect Your Inbox?
          </h2>
          <p style={{color:'rgba(255,255,255,0.8)',fontSize:16,marginBottom:32,maxWidth:500,margin:'0 auto 32px'}}>
            Start analyzing emails instantly with our AI-powered spam detection system.
          </p>
          <button className="btn btn-outline btn-lg" onClick={() => onNavigate('analyzer')}>
            Analyze Your Email Now <ArrowRight />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{background:'#1E1B4B',padding:'32px 0',textAlign:'center'}}>
        <p style={{color:'rgba(255,255,255,0.5)',fontSize:14}}>
          © 2024 SpamShield AI · Built with React.js + FastAPI + Scikit-learn + XGBoost
        </p>
      </footer>
    </div>
  );
}
