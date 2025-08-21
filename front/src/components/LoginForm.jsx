import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LogIn, Mail, Phone, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginSchema } from '@/schemas';

export const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' ou 'phone'

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: ''
    },
    mode: 'onBlur' // Validação ao perder o foco
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
          email: data.email || null,
          phone: data.phone || null,
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

  // Função para mostrar erros de validação
  const showValidationErrors = () => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      // Mostra o primeiro erro encontrado
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message);
      }
    }
  };

  const switchLoginMethod = () => {
    setLoginMethod(loginMethod === 'email' ? 'phone' : 'email');
    // Limpa os campos ao trocar o método
    form.setValue('email', '');
    form.setValue('phone', '');
    form.clearErrors();
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Entrar</CardTitle>
          <CardDescription className="text-lg">
            Acesse sua conta da InvestPro
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, showValidationErrors)} className="space-y-6">
              {/* Seletor de método de login */}
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
                          <MaskedInput 
                            mask="phone"
                            placeholder="(11) 99999-9999" 
                            className="pl-10"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
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
                          type="password" 
                          placeholder="Digite sua senha" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Botões */}
              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
                
                <div className="text-center">
                  <p className="text-gray-600">
                    Não tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToRegister}
                      className="text-blue-600 hover:text-blue-700 font-semibold underline"
                    >
                      Crie uma conta
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
