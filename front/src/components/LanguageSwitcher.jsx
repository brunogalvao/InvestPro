import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { loadTranslations } from '../i18n';

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    
    // Carregar traduções do novo idioma
    await loadTranslations(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
    >
      <Globe size={16} />
      <span className="text-sm font-medium">
        {i18n.language === 'pt' ? 'EN' : 'PT'}
      </span>
    </button>
  );
};

