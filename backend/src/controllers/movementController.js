import { sequelize } from '../config/database.js';
import { Product, StockMovement } from '../models/index.js';

export async function listMovements(req, res, next) {
  try {
    const movements = await StockMovement.findAll({
      include: [{ model: Product, as: 'product' }],
      order: [['id', 'DESC']]
    });

    res.json(movements);
  } catch (error) {
    next(error);
  }
}

export async function createMovement(req, res, next) {
  const { product_id, type, quantity, note } = req.body;
  const qty = Number(quantity);

  try {
    const result = await sequelize.transaction(async (transaction) => {
      const product = await Product.findByPk(product_id, {
        transaction
      });

      if (!product) {
        return {
          error: true,
          status: 404,
          message: 'Produto não encontrado.'
        };
      }

      const currentQuantity = Number(product.quantity);

      if (type === 'saida' && currentQuantity < qty) {
        return {
          error: true,
          status: 409,
          message: `Estoque insuficiente. Estoque atual: ${currentQuantity}. Saída solicitada: ${qty}.`
        };
      }

      const newQuantity =
      type === 'entrada'
      ? currentQuantity + qty
      : currentQuantity - qty;

      await product.update(
        { quantity: newQuantity },
        { transaction }
      );

      const movement = await StockMovement.create(
        {
          product_id,
          type,
          quantity: qty,
          note
        },
        { transaction }
      );

      return movement;
    });

    if (result.error) {
      return res.status(result.status).json({
        message: result.message
      });
    }

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
