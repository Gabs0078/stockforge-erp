import { body } from 'express-validator';
import { isValidCNPJ } from '../utils/cnpj.js';

export const supplierRules = [
  body('trade_name').trim().notEmpty().withMessage('Nome fantasia é obrigatório'),
  body('legal_name').trim().notEmpty().withMessage('Razão social é obrigatória'),
  body('cnpj').custom((value) => isValidCNPJ(value)).withMessage('CNPJ inválido'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('phone').optional({ nullable: true, checkFalsy: true }).trim().isLength({ max: 30 })
];
