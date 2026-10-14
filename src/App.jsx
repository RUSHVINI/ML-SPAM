import { useState, useEffect } from 'react'
import { Shield, Brain, BarChart3, Lock, Zap, Mail, Loader2, CheckCircle2, ShieldAlert, ArrowRight, GitBranch, Rocket } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'

const api = async (p, o) => {
  const r = await fetch('/api' + p, o)
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j.detail || 'Request failed. Is the backend running on port 8000?')
  return j
}
const P1 = '#7c3aed', P2 = '#a78bfa', BL = '#60a5fa'
const pct = v => (v * 100).toFixed(1) + '%'

function Illustration() {
  return (<svg viewBox="0 0 400 320" className="float" width="100%" style={{ maxWidth: 460 }}>
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7c3aed" /><stop offset="1" stopColor="#a78bfa" /></linearGradient></defs>
    <circle cx="200" cy="160" r="150" fill="#eef4ff" />
    <rect x="60" y="100" width="280" height="170" rx="22" fill="#fff" stroke="#ddd6fe" strokeWidth="3" />
    <path d="M60 120l140 90 140-90" fill="none" stroke="#c4b5fd" strokeWidth="5" strokeLinejoin="round" />
    <path d="M200 30l75 28v60c0 48-32 78-75 94-43-16-75-46-75-94V58z" fill="url(#g)" />
    <path d="M168 120l24 24 42-48" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="335" cy="95" r="14" fill="#fecaca" /><circle cx="70" cy="75" r="10" fill="#bfdbfe" />
  </svg>)
}

function Nav({ page, go }) {
  const items = [['home', 'Home'], ['analyzer', 'Email Analyzer'], ['dashboard', 'Dashboard'], ['about', 'About']]
  return (<nav>
    <div className="logo" onClick={() => go('home')}><i><Shield size={20} /></i>SpamShield <span className="grad">AI</span></div>
    <div className="links">{items.map(([k, l]) => <button key={k} className={page === k ? 'on' : ''} onClick={() => go(k)}>{l}</button>)}</div>
    <button className="btn" style={{ padding: '10px 20px' }} onClick={() => go('analyzer')}>Check Your Email</button>
  </nav>)
}

function Home({ go }) {
  const F = [[Brain, 'AI Detection', 'TF-IDF language features feed trained models that read the whole message, not just keywords.'],
  [BarChart3, 'Model Comparison', 'See Decision Tree and XGBoost side by side with probabilities and key terms.'],
  [Lock, 'Secure & Reliable', 'Models run on your own server. Your emails are never stored.'],
  [Zap, 'Easy to Use', 'Paste an email, press one button, get a clear answer in seconds.']]
  return (<>
    <div className="wrap hero"><div>
      <h1>Smart Email Protection, <span className="grad">Powered by AI</span></h1>
      <p>SpamShield AI checks any email with two machine learning models and tells you if it is spam, with the evidence behind the decision.</p>
      <div className="row"><button className="btn" onClick={() => go('analyzer')}>Check Your Email <ArrowRight size={18} /></button>
        <button className="btn ghost" onClick={() => go('about')}>How it works</button></div>
    </div><div style={{ display: 'grid', placeItems: 'center' }}><Illustration /></div></div>
    <div className="band"><div className="wrap" style={{ padding: '0 5vw' }}><div className="grid4">
      {F.map(([I, t, d]) => <div className="card" key={t}><div className="ic"><I /></div><h3>{t}</h3><p>{d}</p></div>)}
    </div></div></div></>)
}

function Analyzer({ go, state }) {
  const { text, setText, result, setResult } = state
  const [loading, setLoading] = useState(false), [err, setErr] = useState('')
  const run = async () => {
    setErr(''); setResult(null); setLoading(true)
    try { setResult(await api('/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })) }
    catch (e) { setErr(e.message) } finally { setLoading(false) }
  }
  const spam = result?.final === 'SPAM'
  return (<div className="wrap" style={{ maxWidth: 860 }}>
    <h2>Email Analyzer</h2><p className="sub">Paste the full email below, including subject and body.</p>
    <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your email here…" />
    <div className="row"><button className="btn" disabled={loading || !text.trim()} onClick={run}>
      {loading ? <><Loader2 className="spin" size={18} />Analyzing…</> : <><Mail size={18} />Analyze Email</>}</button></div>
    {err && <div className="err">{err}</div>}
    {result && <div className={'res ' + (spam ? 'spam' : 'ham')}>
      {spam ? <ShieldAlert size={60} color="#ef4444" /> : <CheckCircle2 size={60} color="#10b981" />}
      <div style={{ flex: 1 }}><h3>{result.final}</h3><p style={{ margin: '6px 0 0', color: '#4b5563' }}>
        {spam ? 'This email looks like spam. Do not click links or reply.' : 'This email looks legitimate.'} Confidence {pct(result.confidence)}.</p></div>
      <button className="btn" onClick={() => go('results')}>Analyze Model Results</button></div>}
  </div>)
}

function ModelCard({ m }) {
  const spam = m.label === 'SPAM'
  return (<div className="card"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h3 style={{ margin: 0 }}>{m.name} Results</h3><span className={'badge ' + (spam ? 'spam' : 'ham')}>{m.label}</span></div>
    <p style={{ marginBottom: 0, marginTop: 20, fontWeight: 600 }}>Spam probability · {pct(m.spam_probability)}</p>
    <div className="bar"><b style={{ width: pct(m.spam_probability), background: '#ef4444' }} /></div>
    <p style={{ margin: 0, fontWeight: 600 }}>Not-spam probability · {pct(m.legit_probability)}</p>
    <div className="bar"><b style={{ width: pct(m.legit_probability), background: '#10b981' }} /></div>
    <p style={{ fontWeight: 600 }}>Most influential terms in this email</p>
    {m.top_terms.length ? m.top_terms.map(t => <span className="chip" key={t.term}>{t.term}</span>) : <span className="sub">No influential terms found.</span>}
  </div>)
}

function Results({ go, result }) {
  if (!result) return <Empty go={go} />
  const ms = Object.values(result.models)
  const data = ms.map(m => ({ name: m.name, 'Spam probability': +(m.spam_probability * 100).toFixed(1), 'Not-spam probability': +(m.legit_probability * 100).toFixed(1) }))
  const F = result.features
  return (<div className="wrap"><h2>Model Results</h2><p className="sub">Final verdict: <b>{result.final}</b> (average of both models)</p>
    <div className="two">{ms.map(m => <ModelCard key={m.name} m={m} />)}</div>
    <div className="card" style={{ marginTop: 22 }}><h3>Email features</h3><div className="grid4" style={{ marginTop: 14 }}>
      {[['Word count', F.word_count], ['Links', F.link_count], ['Urgency words', F.urgency_words], ['Capital letters', F.capital_letters]].map(([l, v]) =>
        <div className="stat" key={l}><b className="grad">{v}</b><span>{l}</span></div>)}</div></div>
    <div className="card" style={{ marginTop: 22 }}><h3>Model comparison</h3><div style={{ height: 300 }}><ResponsiveContainer>
      <BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#eef0fb" /><XAxis dataKey="name" /><YAxis unit="%" domain={[0, 100]} /><Tooltip /><Legend />
        <Bar dataKey="Spam probability" fill="#ef4444" radius={[8, 8, 0, 0]} /><Bar dataKey="Not-spam probability" fill="#10b981" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
    <div className="row"><button className="btn" onClick={() => go('dashboard')}>View Dashboard</button><button className="btn ghost" onClick={() => go('analyzer', true)}>Analyze Another Email</button></div></div>)
}

function Empty({ go }) {
  return <div className="wrap" style={{ textAlign: 'center' }}><h2>No email analyzed yet</h2><p className="sub">Analyze an email first to see model results.</p><button className="btn" onClick={() => go('analyzer')}>Check Your Email</button></div>
}

const FEATS = [['word_count', 'Word Count'], ['link_count', 'Link Count'], ['urgency_words', 'Urgency Words'], ['capital_letters', 'Capital Letters']]
const NM = { decision_tree: 'Decision Tree', xgboost: 'XGBoost' }

function Matrix({ cm }) {
  const c = [['True negative', '#d1fae5'], ['False positive', '#fee2e2'], ['False negative', '#fee2e2'], ['True positive', '#d1fae5']]
  return <div className="cm">{cm.flat().map((v, i) => <div key={i} style={{ background: c[i][1] }}>{v}<small>{c[i][0]}</small></div>)}</div>
}

function Dashboard() {
  const [d, setD] = useState(null), [err, setErr] = useState(''), [f, setF] = useState('word_count')
  useEffect(() => { api('/dashboard').then(setD).catch(e => setErr(e.message)) }, [])
  if (err) return <div className="wrap"><div className="err">{err}</div></div>
  if (!d) return <div className="wrap"><Loader2 className="spin" /></div>
  const fd = d.features[f]
  const dist = fd.bins.map((b, i) => ({ bin: b, Spam: fd.spam[i], 'Not spam': fd.legit[i] }))
  const perf = ['accuracy', 'precision', 'recall', 'f1'].map(k => ({ metric: k === 'f1' ? 'F1-score' : k[0].toUpperCase() + k.slice(1), 'Decision Tree': +(d.models.decision_tree.test[k] * 100).toFixed(2), XGBoost: +(d.models.xgboost.test[k] * 100).toFixed(2) }))
  const folds = d.models.xgboost.cv.f1.map((_, i) => ({ fold: 'Fold ' + (i + 1), 'Decision Tree': +(d.models.decision_tree.cv.f1[i] * 100).toFixed(2), XGBoost: +(d.models.xgboost.cv.f1[i] * 100).toFixed(2) }))
  const ch = (h, children) => <div className="card"><h3>{h}</h3><div style={{ height: 290 }}><ResponsiveContainer>{children}</ResponsiveContainer></div></div>
  return (<div className="wrap"><h2>Analytics Dashboard</h2><p className="sub">All numbers come from your trained models and dataset.</p>
    <div className="grid4">{[['Total emails', d.total], ['Spam emails', d.spam], ['Legitimate emails', d.legit]].map(([l, v]) => <div className="card stat" key={l}><b className="grad">{v.toLocaleString()}</b><span>{l}</span></div>)}</div>
    <h3 style={{ margin: '34px 0 14px' }}>Feature explorer</h3>
    <div className="tabs">{FEATS.map(([k, l]) => <button key={k} className={'tab ' + (f === k ? 'on' : '')} onClick={() => setF(k)}>{l}</button>)}</div>
    <div className="two">
      {ch('Distribution by class', <BarChart data={dist}><CartesianGrid strokeDasharray="3 3" stroke="#eef0fb" /><XAxis dataKey="bin" fontSize={11} /><YAxis /><Tooltip /><Legend /><Bar dataKey="Spam" fill="#ef4444" radius={[6, 6, 0, 0]} /><Bar dataKey="Not spam" fill="#10b981" radius={[6, 6, 0, 0]} /></BarChart>)}
      <div className="card"><h3>Average {FEATS.find(x => x[0] === f)[1].toLowerCase()}</h3><div className="grid4" style={{ marginTop: 40 }}>
        <div className="stat"><b style={{ color: '#ef4444' }}>{fd.avg_spam.toFixed(1)}</b><span>Spam emails</span></div>
        <div className="stat"><b style={{ color: '#10b981' }}>{fd.avg_legit.toFixed(1)}</b><span>Legitimate emails</span></div></div></div></div>
    <h3 style={{ margin: '34px 0 14px' }}>Model performance (test set)</h3>
    <div className="two">
      {ch('Accuracy, precision, recall, F1', <BarChart data={perf}><CartesianGrid strokeDasharray="3 3" stroke="#eef0fb" /><XAxis dataKey="metric" /><YAxis unit="%" domain={[0, 100]} /><Tooltip /><Legend /><Bar dataKey="Decision Tree" fill={P2} radius={[6, 6, 0, 0]} /><Bar dataKey="XGBoost" fill={P1} radius={[6, 6, 0, 0]} /></BarChart>)}
      {ch('5-fold cross-validation F1', <LineChart data={folds}><CartesianGrid strokeDasharray="3 3" stroke="#eef0fb" /><XAxis dataKey="fold" /><YAxis unit="%" domain={['auto', 100]} /><Tooltip /><Legend /><Line dataKey="Decision Tree" stroke={P2} strokeWidth={3} /><Line dataKey="XGBoost" stroke={BL} strokeWidth={3} /></LineChart>)}
    </div>
    <div className="two" style={{ marginTop: 22 }}>{Object.keys(NM).map(k => <div className="card" key={k}><h3 style={{ textAlign: 'center' }}>{NM[k]} confusion matrix</h3><Matrix cm={d.models[k].confusion_matrix} />
      <p className="sub" style={{ textAlign: 'center', margin: 0 }}>Rows: actual · Columns: predicted (not spam, spam)</p></div>)}</div>
  </div>)
}

function About() {
  const S = [['Preprocessing', 'Emails are converted to TF-IDF vectors (1–2 word phrases, English stop words removed, top 5,000 terms). The same fitted vectorizer is saved with each model and reused for every prediction.'],
  ['Decision Tree', 'Learns a series of yes/no rules on term weights. Fast and easy to interpret.'],
  ['XGBoost', 'Builds many small trees in sequence, each correcting the last one’s mistakes, for stronger accuracy.'],
  ['Cross-validation', 'Training data is split into 5 stratified folds that keep the spam ratio equal. Each fold is held out once, so scores show how well the model generalizes.'],
  ['Evaluation', 'A stratified 80/20 train/test split gives accuracy, precision, recall, F1 and confusion matrices on emails the models never saw.']]
  return <div className="wrap" style={{ maxWidth: 820 }}><h2>How SpamShield AI works</h2><p className="sub">From raw email text to a verdict you can trust.</p>
    {S.map(([t, d], i) => <div className="step card" key={t} style={{ marginBottom: 16 }}><i>{i === 1 ? <GitBranch size={18} /> : i === 2 ? <Rocket size={18} /> : <Brain size={18} />}</i><div><h3 style={{ margin: '0 0 6px' }}>{t}</h3><p style={{ margin: 0, color: '#6b7280', lineHeight: 1.6 }}>{d}</p></div></div>)}</div>
}

export default function App() {
  const [page, setPage] = useState('home'), [text, setText] = useState(''), [result, setResult] = useState(null)
  const go = (p, reset) => { if (reset) { setText(''); setResult(null) } setPage(p); window.scrollTo(0, 0) }
  return (<><Nav page={page} go={go} />
    {page === 'home' && <Home go={go} />}
    {page === 'analyzer' && <Analyzer go={go} state={{ text, setText, result, setResult }} />}
    {page === 'results' && <Results go={go} result={result} />}
    {page === 'dashboard' && <Dashboard />}
    {page === 'about' && <About />}</>)
}
