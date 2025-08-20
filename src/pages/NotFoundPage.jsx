import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Ícone de erro */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-red-600" />
        </div>

        {/* Título e mensagem */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          Ops! Parece que você se perdeu. A página que você está procurando não existe ou foi movida.
        </p>

        {/* Sugestões */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            O que você pode fazer:
          </h3>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <Search size={16} className="text-blue-500" />
              Verificar se o endereço está correto
            </li>
            <li className="flex items-center gap-2">
              <Home size={16} className="text-blue-500" />
              Voltar para a página inicial
            </li>
            <li className="flex items-center gap-2">
              <ArrowLeft size={16} className="text-blue-500" />
              Usar o botão voltar do navegador
            </li>
          </ul>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Página Inicial
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Se você acredita que isso é um erro, entre em contato conosco.
          </p>
          <p className="mt-1">
            Código de erro: 404 - Not Found
          </p>
        </div>
      </div>
    </div>
  );
}
