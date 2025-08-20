import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AccountForm } from '../components/AccountForm';
import { LoginForm } from '../components/LoginForm';
import { UserProfile } from '../components/UserProfile';
import { CheckCircle, UserPlus, LogIn, ArrowLeft } from 'lucide-react';

export const AuthPage = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'profile'
  const [token, setToken] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Verificar se já existe um token salvo
  useEffect(() => {
    const savedToken = localStorage.getItem('investpro_token');
    if (savedToken) {
      // Se já estiver logado, redirecionar para o dashboard
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLoginSuccess = (result) => {
    setToken(result.token);
    localStorage.setItem('investpro_token', result.token);
    // Redirecionar para o dashboard após login bem-sucedido
    navigate('/dashboard');
  };

  const handleRegisterSuccess = (result) => {
    setSuccessMessage('Conta criada com sucesso! Agora faça login para acessar.');
    setCurrentView('login');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('investpro_token');
    setCurrentView('login');
  };

  const switchToLogin = () => {
    setCurrentView('login');
    setSuccessMessage('');
  };

  const switchToRegister = () => {
    setCurrentView('register');
    setSuccessMessage('');
  };

  // Se já está logado, redirecionar para dashboard
  if (token) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      {/* Botão voltar */}
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Voltar ao Dashboard
        </Link>
      </div>
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-full">
            {currentView === 'register' ? (
              <UserPlus size={32} className="text-white" />
            ) : (
              <LogIn size={32} className="text-white" />
            )}
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          InvestPro
        </h1>
        <p className="text-xl text-gray-600">
          {currentView === 'register' 
            ? 'Crie sua conta e comece a investir' 
            : 'Acesse sua conta e gerencie seus investimentos'
          }
        </p>
      </div>

      {/* Mensagem de sucesso */}
      {successMessage && (
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle size={20} />
            {successMessage}
          </div>
        </div>
      )}

      {/* Formulários */}
      {currentView === 'register' && (
        <AccountForm 
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={switchToLogin}
        />
      )}

      {currentView === 'login' && (
        <LoginForm 
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={switchToRegister}
        />
      )}

      {/* Footer */}
      <div className="text-center mt-12 text-gray-500">
        <p className="text-sm">
          © 2025 InvestPro. Todos os direitos reservados.
        </p>
        <p className="text-xs mt-2">
          Sua plataforma de investimentos segura e confiável
        </p>
      </div>
    </div>
  );
};
