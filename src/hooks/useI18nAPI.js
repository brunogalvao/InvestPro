import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_I18N_API_URL || 'http://localhost:3000';

export const useI18nAPI = (language = 'pt') => {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTranslations = async (lang) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/translations/${lang}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar traduções: ${response.status}`);
      }
      
      const data = await response.json();
      setTranslations(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar traduções:', err);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = async (newLang) => {
    await fetchTranslations(newLang);
  };

  const updateTranslations = async (lang, newTranslations) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/translations/${lang}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTranslations),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar traduções: ${response.status}`);
      }

      // Recarregar traduções atualizadas
      await fetchTranslations(lang);
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar traduções:', err);
      return false;
    }
  };

  const addLanguage = async (lang, translations) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/translations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lang, translations }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao adicionar idioma: ${response.status}`);
      }

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao adicionar idioma:', err);
      return false;
    }
  };

  const getAvailableLanguages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/languages`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar idiomas: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Erro ao buscar idiomas:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchTranslations(language);
  }, [language]);

  return {
    translations,
    loading,
    error,
    changeLanguage,
    updateTranslations,
    addLanguage,
    getAvailableLanguages,
    refetch: () => fetchTranslations(language),
  };
};
