import { z } from 'zod';
import { 
  cpfSchema, 
  rgSchema, 
  incomeSchema, 
  phoneSchema 
} from './validation.js';
import { addressSchema } from './address.js';

// Schema para edição de perfil
export const editProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')).or(z.null()),
  phone: phoneSchema.optional().or(z.literal('')).or(z.null()),
  cpf: cpfSchema,
  rg: rgSchema,
  income: incomeSchema,
  address: addressSchema
}).refine((data) => {
  return data.email || data.phone;
}, {
  message: 'Email ou telefone é obrigatório',
  path: ['email']
});
