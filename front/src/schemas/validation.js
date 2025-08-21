import { z } from 'zod';

// Schema para validação de CPF
export const cpfSchema = z
  .string()
  .min(11, 'CPF deve ter pelo menos 11 dígitos')
  .max(14, 'CPF deve ter no máximo 14 dígitos')
  .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF deve estar no formato: 000.000.000-00')
  .refine((cpf) => {
    // Remove caracteres não numéricos
    const cleanCpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cleanCpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(10))) return false;
    
    return true;
  }, 'CPF inválido');

// Schema para validação de CEP
export const cepSchema = z
  .string()
  .min(8, 'CEP deve ter pelo menos 8 dígitos')
  .max(9, 'CEP deve ter no máximo 9 dígitos')
  .regex(/^\d{5}-?\d{3}$/, 'CEP deve estar no formato: 00000-000');

// Schema para validação de telefone
export const phoneSchema = z
  .string()
  .min(10, 'Telefone deve ter pelo menos 10 dígitos')
  .max(15, 'Telefone deve ter no máximo 15 dígitos')
  .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Telefone deve estar no formato: (11) 99999-9999');

// Schema para validação de estado
export const stateSchema = z
  .string()
  .length(2, 'Estado deve ter exatamente 2 caracteres')
  .regex(/^[A-Z]{2}$/, 'Estado deve ser a sigla em maiúsculas (ex: SP, RJ)');

// Schema para validação de RG
export const rgSchema = z
  .string()
  .min(5, 'RG deve ter pelo menos 5 caracteres')
  .max(20, 'RG deve ter no máximo 20 caracteres')
  .refine((rg) => {
    // Remove caracteres não numéricos
    const cleanRg = rg.replace(/\D/g, '');
    
    // RG deve ter pelo menos 7 dígitos (formato mais comum)
    if (cleanRg.length < 7) return false;
    
    // RG deve ter no máximo 12 dígitos
    if (cleanRg.length > 12) return false;
    
    return true;
  }, 'RG deve ter entre 7 e 12 dígitos numéricos');

// Schema para validação de renda
export const incomeSchema = z
  .string()
  .min(1, 'Renda é obrigatória')
  .refine((income) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const cleanIncome = income.replace(/[^\d,.]/g, '');
    
    // Converte vírgula para ponto para validação
    const normalizedIncome = cleanIncome.replace(',', '.');
    
    // Verifica se é um número válido
    const numValue = parseFloat(normalizedIncome);
    if (isNaN(numValue)) return false;
    
    // Verifica se é positivo
    if (numValue < 0) return false;
    
    // Verifica se não é muito alto
    if (numValue > 999999999.99) return false;
    
    return true;
  }, 'Renda deve ser um valor válido')
  .transform((income) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const cleanIncome = income.replace(/[^\d,.]/g, '');
    
    // Converte vírgula para ponto
    const normalizedIncome = cleanIncome.replace(',', '.');
    
    // Retorna o número
    return parseFloat(normalizedIncome);
  });
