// SpamShield AI — Root App Component
import React, { useState } from 'react';
import './styles/global.css';

import Navbar        from './components/Navbar';
import HomePage      from './pages/HomePage';
import AnalyzerPage  from './pages/AnalyzerPage';
import ResultsPage   from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage     from './pages/AboutPage';

export default function App() {
  const [page, setPage]             = useState('home');
  const [prediction, setPrediction] = useState(null);
  const [emailText, setEmailText]   = useState('');

  const navigate = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleResult = (result, text) => {
    setPrediction(result);
    setEmailText(text);
  };

  return (
    <>
      <Navbar currentPage={page} onNavigate={navigate} />

      {page === 'home'      && <HomePage     onNavigate={navigate}/>}
      {page === 'analyzer'  && <AnalyzerPage onResult={handleResult} onNavigate={navigate}/>}
      {page === 'results'   && <ResultsPage  prediction={prediction} emailText={emailText} onNavigate={navigate}/>}
      {page === 'dashboard' && <DashboardPage onNavigate={navigate}/>}
      {page === 'about'     && <AboutPage    onNavigate={navigate}/>}
    </>
  );
}
