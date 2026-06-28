import { body } from 'express-validator';

export const movementRules = [
  body('product_id').isInt({ min: 1 }).withMessage('Produto é obrigatório'),
  body('type').isIn(['entrada', 'saida']).withMessage('Tipo deve ser entrada ou saida'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que zero'),
  body('note').optional({ nullable: true, checkFalsy: true }).trim()
];
