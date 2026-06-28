export function onlyDigits(value = '') {
  return String(value).replace(/\D/g, '');
}

export function isValidCNPJ(value = '') {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const calc = (base) => {
    const weights = base.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = base.split('').reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const digit1 = calc(cnpj.slice(0, 12));
  const digit2 = calc(cnpj.slice(0, 12) + digit1);
  return cnpj.endsWith(`${digit1}${digit2}`);
}
