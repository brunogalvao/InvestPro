import { z } from 'zod';
import { 
  cpfSchema, 
  rgSchema, 
  incomeSchema, 
  phoneSchema 
} from './validation.js';
import { addressSchema } from './address.js';

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
