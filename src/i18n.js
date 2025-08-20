import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Configuração do i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt',
    debug: false,
    
    // Configurações de detecção de idioma
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // Interpolação
    interpolation: {
      escapeValue: false,
    },
    
    // Recursos vazios inicialmente - serão carregados via API
    resources: {
      pt: { translation: {} },
      en: { translation: {} }
    }
  });

// Função para carregar traduções da API Docker
export const loadTranslations = async (lang) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_I18N_API_URL || 'http://localhost:3000';
    const response = await fetch(`${API_BASE_URL}/api/translations/${lang}`);
    
    if (response.ok) {
      const translations = await response.json();
      
      // Adicionar traduções ao i18next
      i18n.addResourceBundle(lang, 'translation', translations, true, true);
      
      // Mudar para o idioma carregado
      await i18n.changeLanguage(lang);
      
      return translations;
    } else {
      console.error(`Erro ao carregar traduções para ${lang}:`, response.status);
      return null;
    }
  } catch (error) {
    console.error(`Erro ao carregar traduções para ${lang}:`, error);
    return null;
  }
};

// Carregar traduções do idioma padrão (pt) na inicialização
loadTranslations('pt');

export default i18n;
