import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginSchema } from '@/lib/schemas';

export const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' ou 'phone'

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const API_BASE_URL = import.meta.env.VITE_I18N_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL.replace('3000', '4000')}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginMethod === 'email' ? data.email : null,
          phone: loginMethod === 'phone' ? data.phone : null,
          password: data.password
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Login realizado com sucesso!');
        onSuccess(result);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Credenciais inválidas');
      }
    } catch (err) {
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Entrar na Conta</CardTitle>
          <CardDescription className="text-lg">
            Acesse sua conta InvestPro
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Método de Login */}
              <div className="space-y-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      loginMethod === 'email'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      loginMethod === 'phone'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Phone size={16} className="inline mr-2" />
                    Telefone
                  </button>
                </div>

                {/* Campo de Email ou Telefone */}
                {loginMethod === 'email' ? (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
                            <Input 
                              type="email" 
                              placeholder="seu@email.com" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone size={20} className="absolute left-3 top-3 text-gray-400" />
                            <Input 
                              placeholder="(11) 99999-9999" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Senha */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
                          <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Digite sua senha" 
                            className="pl-10 pr-12"
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Botões */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={onSwitchToRegister}
                  >
                    Não tem uma conta? Abra sua conta
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
