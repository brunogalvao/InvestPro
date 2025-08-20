import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_I18N_API_URL || 'http://localhost:3000';

export const useExchangeRate = () => {
  const [exchangeData, setExchangeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExchangeRate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar a API Docker com cache Redis
      const response = await fetch(`${API_BASE_URL}/api/exchange-rate/cached`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      
      const data = await response.json();
      
      setExchangeData({
        rate: data.rate,
        high: data.high,
        low: data.low,
        variation: data.variation,
        varBid: data.varBid,
        timestamp: new Date(data.timestamp),
        name: data.name,
        cached: data.cached,
        cacheAge: data.cacheAge
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
    
    // Atualizar a cada 60 segundos
    const interval = setInterval(fetchExchangeRate, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { exchangeData, loading, error, refetch: fetchExchangeRate };
};

