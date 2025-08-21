import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('investpro_token');
  
  // Se não houver token, redirecionar para a página de autenticação
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  
  // Se houver token, renderizar o componente filho
  return children;
}

export function PublicRoute({ children }) {
  const token = localStorage.getItem('investpro_token');
  
  // Se já estiver logado, redirecionar para o dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Se não estiver logado, renderizar o componente filho
  return children;
}
