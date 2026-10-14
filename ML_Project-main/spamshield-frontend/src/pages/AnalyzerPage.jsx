// SpamShield AI — Page 2: Email Analyzer
import React, { useState } from 'react';
import { ShieldLogo, SpamIcon, SafeIcon, ArrowRight } from '../components/Icons';
import api from '../services/api';

const SAMPLE_SPAM = `Congratulations! You have been selected as our LUCKY WINNER for this month's grand prize of $10,000. 
This is an URGENT and EXCLUSIVE offer just for you! Click here immediately: http://claim-prize.fake.com
This offer EXPIRES in 24 hours. Act now to claim your free cash reward!
To unsubscribe or verify your account, visit our secure link. GUARANTEED income awaits!`;

const SAMPLE_HAM = `Hi Sarah,

I wanted to follow up on our meeting from last Tuesday. I've attached the quarterly report you requested for your review.

Could we schedule a quick call this week to discuss the findings? I'm available Thursday afternoon or Friday morning.

Looking forward to hearing from you.

Best regards,
Michael`;

export default function AnalyzerPage({ onResult, onNavigate }) {
  const [emailText, setEmailText]   = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [quickResult, setQuickResult] = useState(null);
  const [charCount, setCharCount]   = useState(0);

  const handleTextChange = (e) => {
    setEmailText(e.target.value);
    setCharCount(e.target.value.length);
    setQuickResult(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!emailText.trim()) { setError('Please paste or type an email before analyzing.'); return; }
    setLoading(true); setError(''); setQuickResult(null);
    try {
      const result = await api.predict(emailText);
      setQuickResult(result);
      onResult(result, emailText);
    } catch (e) {
      setError(e.message || 'Failed to connect to backend. Make sure the FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => { onNavigate('results'); };
  const loadSample = (type) => {
    const text = type === 'spam' ? SAMPLE_SPAM : SAMPLE_HAM;
    setEmailText(text); setCharCount(text.length); setQuickResult(null); setError('');
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-pale)',paddingBottom:60}}>
      {/* Header */}
      <div style={{background:'var(--grad-primary)',padding:'48px 0 80px'}}>
        <div className="container" style={{textAlign:'center'}}>
          <div className="badge" style={{background:'rgba(255,255,255,0.2)',color:'white',marginBottom:20}}>
            <ShieldLogo size={16} /> AI Email Analyzer
          </div>
          <h1 style={{color:'white',fontSize:'clamp(28px,4vw,44px)',fontWeight:800,marginBottom:12}}>
            Analyze Your Email
          </h1>
          <p style={{color:'rgba(255,255,255,0.8)',fontSize:16,maxWidth:520,margin:'0 auto'}}>
            Paste your email below and our dual AI models will classify it instantly.
          </p>
        </div>
      </div>

      {/* Card — pulled up */}
      <div className="container" style={{marginTop:'-52px'}}>
        <div className="card" style={{boxShadow:'var(--shadow-xl)',borderRadius:24,padding:40}}>
          {/* Steps */}
          <div className="steps" style={{marginBottom:32}}>
            {['Paste Email','Analyze','View Results'].map((s,i) => (
              <React.Fragment key={i}>
                <div className="step-item">
                  <div className={`step-num${i===0?' done':''}`}>{i+1}</div>
                  <span className="step-label">{s}</span>
                </div>
                {i < 2 && <div className="step-divider"/>}
              </React.Fragment>
            ))}
          </div>

          {/* Sample buttons */}
          <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}>
            <span style={{fontSize:13,color:'var(--text-muted)',alignSelf:'center'}}>Try a sample:</span>
            <button className="btn btn-sm btn-secondary" onClick={() => loadSample('spam')}
              style={{borderColor:'#EF4444',color:'#EF4444'}}>
              Load Spam Sample
            </button>
            <button className="btn btn-sm btn-secondary" onClick={() => loadSample('ham')}
              style={{borderColor:'#10B981',color:'#10B981'}}>
              Load Legitimate Sample
            </button>
          </div>

          {/* Textarea */}
          <div style={{position:'relative',marginBottom:8}}>
            <textarea
              className="textarea-field"
              style={{minHeight:260}}
              value={emailText}
              onChange={handleTextChange}
              placeholder="Paste your email content here...&#10;&#10;Include the subject, body, and any links or attachments text for best accuracy."
            />
            <div style={{
              position:'absolute',bottom:12,right:16,fontSize:12,
              color:'var(--text-muted)',fontWeight:500
            }}>
              {charCount} characters
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background:'var(--danger-light)',border:'1px solid #FCA5A5',
              borderRadius:10,padding:'12px 16px',marginBottom:16,
              color:'#991B1B',fontSize:14,display:'flex',alignItems:'center',gap:8
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Analyze button */}
          <button
            className="btn btn-primary btn-lg"
            onClick={handleAnalyze}
            disabled={loading}
            style={{width:'100%',fontSize:16,padding:'18px'}}
          >
            {loading
              ? <><div className="spinner spinner-sm"/>&nbsp;Analyzing with AI Models...</>
              : <><ShieldLogo size={20}/>&nbsp;Analyze Email</>
            }
          </button>

          {/* Quick result preview */}
          {quickResult && (
            <div className={`fade-in-up ${quickResult.overall_is_spam ? 'result-spam' : 'result-ham'}`}
              style={{marginTop:32,padding:32,textAlign:'center'}}>
              <div style={{marginBottom:16}}>
                {quickResult.overall_is_spam ? <SpamIcon/> : <SafeIcon/>}
              </div>
              <h2 style={{
                fontSize:36, fontWeight:800, marginBottom:8,
                color: quickResult.overall_is_spam ? '#DC2626' : '#059669'
              }}>
                {quickResult.overall_verdict}
              </h2>
              <p style={{color:'var(--text-secondary)',marginBottom:8,fontSize:15}}>
                {quickResult.consensus
                  ? 'Both AI models agree on this classification.'
                  : 'Models have different predictions — check detailed results.'}
              </p>
              <div style={{display:'flex',gap:24,justifyContent:'center',margin:'20px 0',flexWrap:'wrap'}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:13,color:'var(--text-muted)',marginBottom:4}}>Decision Tree</div>
                  <div style={{
                    padding:'6px 16px',borderRadius:50,fontWeight:700,fontSize:14,
                    background: quickResult.decision_tree.is_spam ? '#FEE2E2' : '#D1FAE5',
                    color: quickResult.decision_tree.is_spam ? '#DC2626' : '#059669'
                  }}>
                    {quickResult.decision_tree.prediction}
                  </div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:13,color:'var(--text-muted)',marginBottom:4}}>XGBoost</div>
                  <div style={{
                    padding:'6px 16px',borderRadius:50,fontWeight:700,fontSize:14,
                    background: quickResult.xgboost.is_spam ? '#FEE2E2' : '#D1FAE5',
                    color: quickResult.xgboost.is_spam ? '#DC2626' : '#059669'
                  }}>
                    {quickResult.xgboost.prediction}
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleViewDetails} style={{marginTop:8}}>
                View Detailed Analysis <ArrowRight/>
              </button>
            </div>
          )}
        </div>

        {/* Info cards below */}
        <div className="grid-3" style={{marginTop:32}}>
          {[
            {title:'TF-IDF Features',  desc:'Text vectorized into 3,000 n-gram features capturing word importance.'},
            {title:'Email Features',   desc:'Word count, link count, urgency words, and capital letter ratio extracted.'},
            {title:'Dual Prediction',  desc:'Decision Tree and XGBoost both classify independently for higher confidence.'},
          ].map((c,i) => (
            <div key={i} className="card" style={{textAlign:'center',padding:24}}>
              <h4 style={{fontWeight:700,marginBottom:8,color:'var(--primary)'}}>{c.title}</h4>
              <p style={{fontSize:13,color:'var(--text-secondary)'}}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
