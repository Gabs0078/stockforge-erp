import { body } from 'express-validator';

export const warehouseRules = [
  body('name').trim().notEmpty().withMessage('Nome do galpão é obrigatório'),
  body('code').trim().notEmpty().withMessage('Código é obrigatório'),
  body('manager').trim().notEmpty().withMessage('Responsável é obrigatório'),
  body('address').optional({ nullable: true, checkFalsy: true }).trim()
];
