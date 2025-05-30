const API_URL = {
  development: 'http://localhost:3001',
  production: 'https://code-alpha-effica.vercel.app'
};

export const getApiUrl = () => {
  return import.meta.env.MODE === 'production' 
    ? API_URL.production 
    : API_URL.development;
};