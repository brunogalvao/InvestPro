import React from 'react';
import { Input } from './input';

// Função para aplicar máscara de CPF
const applyCpfMask = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

// Função para aplicar máscara de RG
const applyRgMask = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}-${numbers.slice(8)}`;
};

// Função para aplicar máscara de telefone
const applyPhoneMask = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
};

// Função para aplicar máscara de CEP
const applyCepMask = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

// Função para aplicar máscara de moeda brasileira
const applyCurrencyMask = (value) => {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  
  // Se não há números, retorna vazio
  if (numbers.length === 0) return '';
  
  // Converte para centavos
  const cents = parseInt(numbers);
  
  // Formata como moeda brasileira
  const formatted = (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatted;
};

export const MaskedInput = React.forwardRef(({ 
  mask = 'text', 
  value, 
  onChange, 
  onBlur,
  placeholder,
  className,
  ...props 
}, ref) => {
  
  const handleChange = (e) => {
    const inputValue = e.target.value;
    let maskedValue = inputValue;
    
    switch (mask) {
      case 'cpf':
        maskedValue = applyCpfMask(inputValue);
        break;
      case 'rg':
        maskedValue = applyRgMask(inputValue);
        break;
      case 'phone':
        maskedValue = applyPhoneMask(inputValue);
        break;
      case 'cep':
        maskedValue = applyCepMask(inputValue);
        break;
      case 'currency':
        maskedValue = applyCurrencyMask(inputValue);
        break;
      default:
        maskedValue = inputValue;
    }
    
    // Chama o onChange com o valor mascarado
    if (onChange) {
      e.target.value = maskedValue;
      onChange(e);
    }
  };

  const handleBlur = (e) => {
    // Remove a máscara ao perder o foco para validação
    if (onBlur) {
      let unmaskedValue = e.target.value;
      
      switch (mask) {
        case 'cpf':
        case 'rg':
        case 'phone':
        case 'cep':
          unmaskedValue = e.target.value.replace(/\D/g, '');
          break;
        case 'currency':
          // Para moeda, mantém o valor formatado mas remove R$ e espaços
          unmaskedValue = e.target.value.replace(/[R$\s]/g, '').replace('.', '').replace(',', '.');
          break;
        default:
          unmaskedValue = e.target.value;
      }
      
      e.target.value = unmaskedValue;
      onBlur(e);
    }
  };

  return (
    <Input
      ref={ref}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
});

MaskedInput.displayName = 'MaskedInput';
