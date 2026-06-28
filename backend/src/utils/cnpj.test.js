import { isValidCNPJ } from './cnpj.js';

test('valida CNPJ correto', () => {
  expect(isValidCNPJ('12.345.678/0001-95')).toBe(true);
});

test('bloqueia CNPJ inválido', () => {
  expect(isValidCNPJ('11.111.111/1111-11')).toBe(false);
});
