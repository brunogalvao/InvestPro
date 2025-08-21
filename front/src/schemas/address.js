import { z } from 'zod';
import { cepSchema, stateSchema } from './validation.js';

// Schema para validação de endereço
export const addressSchema = z.object({
  street: z.string().min(5, 'Logradouro deve ter pelo menos 5 caracteres'),
  cep: cepSchema,
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: stateSchema
});
