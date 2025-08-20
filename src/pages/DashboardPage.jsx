import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProfile } from '../components/UserProfile';
import { ExchangeRateCard } from '../components/ExchangeRateCard';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { TrendingUp, BarChart3, DollarSign, PieChart, LogOut, Home } from 'lucide-react';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';

export function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' ou 'profile'

  // Verificar se existe um token salvo
  useEffect(() => {
    const savedToken = localStorage.getItem('investpro_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('investpro_token');
    // Redirecionar para home após logout
    navigate('/');
  };

  // Se não estiver logado, redirecionar para auth
  if (!token) {
    navigate('/auth');
    return null;
  }

  // Se estiver visualizando o perfil
  if (currentView === 'profile') {
    return <UserProfile token={token} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>
                <p className="text-sm text-gray-600">Dashboard - Bem-vindo!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home size={20} />
                Início
              </Link>
              <button
                onClick={() => setCurrentView('profile')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Meu Perfil
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                Sair
              </button>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Investimentos
          </h2>
          <p className="text-gray-600">
            Gerencie seus investimentos e acompanhe o mercado financeiro.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Carteira Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ 25.430,00</p>
                <p className="text-sm text-green-600">+5.2% este mês</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rentabilidade</p>
                <p className="text-2xl font-bold text-gray-900">+12.5%</p>
                <p className="text-sm text-green-600">Últimos 12 meses</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Diversificação</p>
                <p className="text-2xl font-bold text-gray-900">8 ativos</p>
                <p className="text-sm text-blue-600">Bem diversificado</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Rate Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Cotações em Tempo Real
          </h3>
          <ExchangeRateCard />
        </div>

        {/* Portfolio Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Minha Carteira
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  PETR4
                </div>
                <div>
                  <p className="font-medium text-gray-900">Petrobras PN</p>
                  <p className="text-sm text-gray-600">100 cotas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">R$ 8.500,00</p>
                <p className="text-sm text-green-600">+2.5%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  VALE3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Vale ON</p>
                  <p className="text-sm text-gray-600">75 cotas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">R$ 6.200,00</p>
                <p className="text-sm text-red-600">-1.2%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  ITUB4
                </div>
                <div>
                  <p className="font-medium text-gray-900">Itaú Unibanco PN</p>
                  <p className="text-sm text-gray-600">200 cotas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">R$ 10.730,00</p>
                <p className="text-sm text-green-600">+4.1%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toaster para notificações */}
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </div>
  );
}
