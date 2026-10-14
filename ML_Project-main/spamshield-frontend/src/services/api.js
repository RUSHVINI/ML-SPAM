// SpamShield AI — API service layer
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function apiCall(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  health:                () => apiCall('/health'),
  predict:          (text) => apiCall('/predict', { method: 'POST', body: JSON.stringify({ email_text: text }) }),
  getMetrics:            () => apiCall('/metrics'),
  getFeatureDistributions: () => apiCall('/feature-distributions'),
  getModelInfo:          () => apiCall('/model-info'),
};

export default api;
