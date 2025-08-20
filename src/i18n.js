import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traduções padrão para funcionar offline
const defaultTranslations = {
  pt: {
    title: "InvestPro",
    subtitle: "Plataforma de Investimentos Inteligente",
    language: "Idioma",
    hero: {
      title: "Invista Inteligente, Cresça Mais Rápido",
      subtitle: "Acesse as melhores oportunidades de investimento com dados de mercado em tempo real e análises especializadas",
      cta: "Começar a Investir",
      learn_more: "Saiba Mais"
    },
    exchange: {
      title: "Cotação USD/BRL",
      last_update: "Última atualização",
      high: "Máxima",
      low: "Mínima",
      variation: "Variação"
    },
    features: {
      title: "Por que Escolher a InvestPro?",
      realtime: {
        title: "Dados em Tempo Real",
        description: "Acesse dados de mercado ao vivo e cotações atualizadas a cada minuto"
      },
      analysis: {
        title: "Análise Especializada",
        description: "Obtenha insights de nossa equipe de especialistas financeiros e analistas de mercado"
      },
      security: {
        title: "Máxima Segurança",
        description: "Seus investimentos são protegidos com segurança e criptografia de nível bancário"
      }
    },
    cta: {
      title: "Pronto para Começar a Investir?",
      description: "Junte-se a milhares de investidores que confiam na InvestPro para seu crescimento financeiro",
      button: "Abrir Conta"
    },
    footer: {
      rights: "Todos os direitos reservados",
      terms: "Termos de Serviço",
      privacy: "Política de Privacidade",
      contact: "Contato"
    }
  },
  en: {
    title: "InvestPro",
    subtitle: "Smart Investment Platform",
    language: "Language",
    hero: {
      title: "Invest Smart, Grow Faster",
      subtitle: "Access the best investment opportunities with real-time market data and expert analysis",
      cta: "Start Investing",
      learn_more: "Learn More"
    },
    exchange: {
      title: "USD/BRL Exchange Rate",
      last_update: "Last update",
      high: "High",
      low: "Low",
      variation: "Variation"
    },
    features: {
      title: "Why Choose InvestPro?",
      realtime: {
        title: "Real-time Data",
        description: "Access live market data and exchange rates updated every minute"
      },
      analysis: {
        title: "Expert Analysis",
        description: "Get insights from our team of financial experts and market analysts"
      },
      security: {
        title: "Maximum Security",
        description: "Your investments are protected with bank-level security and encryption"
      }
    },
    cta: {
      title: "Ready to Start Investing?",
      description: "Join thousands of investors who trust InvestPro for their financial growth",
      button: "Open Account"
    },
    footer: {
      rights: "All rights reserved",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      contact: "Contact"
    }
  }
};

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
    
    // Recursos com traduções padrão para funcionar offline
    resources: defaultTranslations
  });

// Função para carregar traduções da API (opcional)
export const loadTranslations = async (lang) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_I18N_API_URL || 'https://invest-pro-khaki.vercel.app/api/i18n';
    const response = await fetch(`${API_BASE_URL}/translations/${lang}`);
    
    if (response.ok) {
      const translations = await response.json();
      
      // Adicionar traduções ao i18next
      i18n.addResourceBundle(lang, 'translation', translations, true, true);
      
      // Mudar para o idioma carregado
      await i18n.changeLanguage(lang);
      
      return translations;
    } else {
      console.log(`API não disponível, usando traduções padrão para ${lang}`);
      return defaultTranslations[lang] || defaultTranslations.pt;
    }
  } catch (error) {
    console.log(`API não disponível, usando traduções padrão para ${lang}:`, error.message);
    return defaultTranslations[lang] || defaultTranslations.pt;
  }
};

// Carregar traduções do idioma padrão (pt) na inicialização
loadTranslations('pt');

export default i18n;
