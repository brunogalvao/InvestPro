import { z } from 'zod';

// Schema para validação de CPF
const cpfSchema = z
  .string()
  .min(11, 'CPF deve ter pelo menos 11 dígitos')
  .max(14, 'CPF deve ter no máximo 14 dígitos')
  .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF deve estar no formato: 000.000.000-00');

// Schema para validação de CEP
const cepSchema = z
  .string()
  .min(8, 'CEP deve ter pelo menos 8 dígitos')
  .max(9, 'CEP deve ter no máximo 9 dígitos')
  .regex(/^\d{5}-?\d{3}$/, 'CEP deve estar no formato: 00000-000');

// Schema para validação de telefone
const phoneSchema = z
  .string()
  .min(10, 'Telefone deve ter pelo menos 10 dígitos')
  .max(15, 'Telefone deve ter no máximo 15 dígitos')
  .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Telefone deve estar no formato: (11) 99999-9999');

// Schema para validação de estado
const stateSchema = z
  .string()
  .length(2, 'Estado deve ter exatamente 2 caracteres')
  .regex(/^[A-Z]{2}$/, 'Estado deve ser a sigla em maiúsculas (ex: SP, RJ)');

// Schema para validação de RG
const rgSchema = z
  .string()
  .min(5, 'RG deve ter pelo menos 5 caracteres')
  .max(20, 'RG deve ter no máximo 20 caracteres');

// Schema para validação de renda
const incomeSchema = z
  .number()
  .min(0, 'Renda não pode ser negativa')
  .max(999999999.99, 'Renda muito alta');

// Schema para validação de endereço
const addressSchema = z.object({
  street: z.string().min(5, 'Logradouro deve ter pelo menos 5 caracteres'),
  cep: cepSchema,
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: stateSchema
});

// Schema principal para cadastro
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  
  phone: phoneSchema
    .optional()
    .or(z.literal('')),
  
  cpf: cpfSchema,
  rg: rgSchema,
  income: incomeSchema,
  
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),
  
  confirmPassword: z.string(),
  
  address: addressSchema
}).refine((data) => {
  // Pelo menos um dos campos de contato deve ser preenchido
  return data.email || data.phone;
}, {
  message: 'Email ou telefone é obrigatório',
  path: ['email']
}).refine((data) => {
  // Senhas devem coincidir
  return data.password === data.confirmPassword;
}, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: phoneSchema.optional().or(z.literal('')),
  password: z.string().min(1, 'Senha é obrigatória')
}).refine((data) => {
  return data.email || data.phone;
}, {
  message: 'Email ou telefone é obrigatório',
  path: ['email']
});
