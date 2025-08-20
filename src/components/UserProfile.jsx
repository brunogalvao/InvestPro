import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Mail, Phone, CreditCard, FileText, DollarSign, LogOut, Edit, Shield } from 'lucide-react';
import { EditProfileForm } from './EditProfileForm';

export const UserProfile = ({ token, onLogout }) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_I18N_API_URL || 'http://localhost:3000';
      
      // Decodificar o token para pegar o user ID
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.sub;

      const response = await fetch(`${API_BASE_URL.replace('3000', '4000')}/accounts/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        setError('Erro ao carregar dados do usuário');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = (updatedData) => {
    // Atualizar os dados locais com as informações editadas
    setUserData(prevData => ({
      ...prevData,
      ...updatedData,
      // Converter income de volta para número se necessário
      income: typeof updatedData.income === 'string' ? parseFloat(updatedData.income) : updatedData.income
    }));
    setIsEditing(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Se estiver editando, mostrar o formulário de edição
  if (isEditing) {
    return (
      <EditProfileForm
        userData={userData}
        token={token}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <Shield size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar dados</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchUserData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Minha Conta
            </h2>
            <p className="text-gray-600">
              Bem-vindo de volta, {userData.name}!
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Edit size={16} />
              Editar
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dados Pessoais */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <User size={20} className="text-blue-600" />
                Dados Pessoais
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                  <p className="text-gray-900 font-medium">{userData.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">CPF</label>
                  <p className="text-gray-900 font-mono">{userData.cpf}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">RG</label>
                  <p className="text-gray-900">{userData.rg}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Renda Mensal</label>
                  <p className="text-green-600 font-bold text-lg">
                    {formatCurrency(userData.income)}
                  </p>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Mail size={20} className="text-green-600" />
                Contato
              </h3>
              
              <div className="space-y-3">
                {userData.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{userData.email}</p>
                  </div>
                )}
                
                {userData.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefone</label>
                    <p className="text-gray-900">{userData.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Endereço e Informações da Conta */}
          <div className="space-y-6">
            {/* Endereço */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-purple-600" />
                Endereço
              </h3>
              
              {userData.address ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Logradouro</label>
                    <p className="text-gray-900">{userData.address.street}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">CEP</label>
                      <p className="text-gray-900 font-mono">{userData.address.cep}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Cidade</label>
                      <p className="text-gray-900">{userData.address.city}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estado</label>
                      <p className="text-gray-900 font-bold">{userData.address.state}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Endereço não cadastrado</p>
              )}
            </div>

            {/* Informações da Conta */}
            <div className="bg-orange-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Shield size={20} className="text-orange-600" />
                Informações da Conta
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">ID da Conta</label>
                  <p className="text-gray-900 font-mono text-sm">{userData.id}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Data de Criação</label>
                  <p className="text-gray-900">{formatDate(userData.created_at)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ativa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo da Conta</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(userData.income)}</div>
              <div className="text-sm text-gray-600">Renda Mensal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">Conta Ativa</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Perfil Completo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
