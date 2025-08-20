// Schemas principais
export { registerSchema, loginSchema } from './auth.js';

// Schemas de validação
export { 
  cpfSchema, 
  cepSchema, 
  phoneSchema, 
  stateSchema, 
  rgSchema, 
  incomeSchema 
} from './validation.js';

// Schemas de endereço
export { addressSchema } from './address.js';

// Schemas de perfil
export { editProfileSchema } from './profile.js';
