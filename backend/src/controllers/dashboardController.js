import { Product, Supplier, Warehouse } from '../models/index.js';
import { Op, Sequelize } from 'sequelize';

export async function dashboard(req, res) {
  const [products, suppliers, warehouses, lowStock] = await Promise.all([
    Product.count(),
    Supplier.count(),
    Warehouse.count(),
    Product.count({ where: Sequelize.where(Sequelize.col('quantity'), Op.lte, Sequelize.col('minimum_stock')) })
  ]);
  res.json({ products, suppliers, warehouses, lowStock });
}
