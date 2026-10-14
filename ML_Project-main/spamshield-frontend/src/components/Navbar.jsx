// SpamShield AI — Shared Navbar component
import React from 'react';
import { ShieldLogo } from './Icons';

const PAGES = [
  { key: 'home',     label: 'Home' },
  { key: 'analyzer', label: 'Email Analyzer' },
  { key: 'results',  label: 'Results' },
  { key: 'dashboard',label: 'Dashboard' },
  { key: 'about',    label: 'About' },
];

export default function Navbar({ currentPage, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="navbar-brand" onClick={() => onNavigate('home')} style={{background:'none',border:'none',cursor:'pointer'}}>
          <ShieldLogo size={36} />
          <span className="navbar-brand-text">SpamShield AI</span>
        </button>
        <div className="navbar-nav">
          {PAGES.map(p => (
            <button
              key={p.key}
              className={`nav-link${currentPage === p.key ? ' active' : ''}`}
              onClick={() => onNavigate(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
