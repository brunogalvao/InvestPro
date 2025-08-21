import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useExchangeRate } from '../hooks/useExchangeRate';

export const ExchangeRateCard = () => {
  const { t } = useTranslation();
  const { exchangeData, loading, error, refetch } = useExchangeRate();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar cotação</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(value);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{t('exchange.title')}</h3>
        <button
          onClick={refetch}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          title="Atualizar"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {formatCurrency(exchangeData.rate)}
          </span>
        </div>
        
        {/* Variação percentual e absoluta */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
            exchangeData.variation >= 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {exchangeData.variation >= 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>
              {exchangeData.variation >= 0 ? '+' : ''}{exchangeData.variation.toFixed(2)}%
            </span>
          </div>
          
          <div className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
            exchangeData.variation >= 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <span>
              {exchangeData.variation >= 0 ? '+' : ''}R$ {exchangeData.varBid.toFixed(4)}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          {t('exchange.last_update')}: {formatTime(exchangeData.timestamp)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600 mb-1">{t('exchange.high')}</p>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(exchangeData.high)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600 mb-1">{t('exchange.low')}</p>
          <p className="text-lg font-bold text-red-600">
            {formatCurrency(exchangeData.low)}
          </p>
        </div>
      </div>
    </div>
  );
};

