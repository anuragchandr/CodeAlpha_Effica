const API_URL = {
  development: 'http://localhost:3001',
  production: import.meta.env.VITE_API_URL || 'https://code-alpha-effica.vercel.app'
};

export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === 'production' ? API_URL.production : API_URL.development);
};