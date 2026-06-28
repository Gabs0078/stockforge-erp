import { Op } from 'sequelize';
import { Product, Supplier, Warehouse } from '../models/index.js';

const include = [
  { model: Supplier, as: 'supplier' },
  { model: Warehouse, as: 'warehouse' }
];

export async function listProducts(req, res) {
  const where = {};
  if (req.query.warehouse_id) where.warehouse_id = req.query.warehouse_id;
  if (req.query.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${req.query.search}%` } },
      { sku: { [Op.like]: `%${req.query.search}%` } }
    ];
  }
  const products = await Product.findAll({ where, include, order: [['id', 'DESC']] });
  res.json(products);
}

export async function getProduct(req, res) {
  const product = await Product.findByPk(req.params.id, { include });
  if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
  res.json(product);
}

export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(await Product.findByPk(product.id, { include }));
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Já existe produto com este SKU neste galpão.' });
    }
    throw error;
  }
}

export async function updateProduct(req, res) {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
  try {
    await product.update(req.body);
    res.json(await Product.findByPk(product.id, { include }));
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Já existe produto com este SKU neste galpão.' });
    }
    throw error;
  }
}

export async function deleteProduct(req, res) {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
  await product.destroy();
  res.status(204).send();
}
