import { body } from 'express-validator';

export const productRules = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('sku').trim().notEmpty().withMessage('SKU é obrigatório'),
  body('supplier_id').isInt({ min: 1 }).withMessage('Fornecedor é obrigatório'),
  body('warehouse_id').isInt({ min: 1 }).withMessage('Galpão é obrigatório'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantidade não pode ser negativa'),
  body('minimum_stock').isInt({ min: 0 }).withMessage('Estoque mínimo não pode ser negativo'),
  body('cost_price').isFloat({ min: 0 }).withMessage('Preço de custo não pode ser negativo'),
  body('category').optional({ nullable: true, checkFalsy: true }).trim()
];
