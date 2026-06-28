import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Supplier = sequelize.define('Supplier', {
  trade_name: { type: DataTypes.STRING(120), allowNull: false },
  legal_name: { type: DataTypes.STRING(160), allowNull: false },
  cnpj: { type: DataTypes.STRING(18), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(160), allowNull: false },
  phone: { type: DataTypes.STRING(30) }
}, { tableName: 'suppliers' });

export const Warehouse = sequelize.define('Warehouse', {
  name: { type: DataTypes.STRING(120), allowNull: false },
  code: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  address: { type: DataTypes.STRING(255) },
  manager: { type: DataTypes.STRING(120), allowNull: false }
}, { tableName: 'warehouses' });

export const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING(140), allowNull: false },
  sku: { type: DataTypes.STRING(60), allowNull: false },
  category: { type: DataTypes.STRING(80) },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  minimum_stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  cost_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  supplier_id: { type: DataTypes.INTEGER, allowNull: false },
  warehouse_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'products',
  indexes: [{ unique: true, fields: ['sku', 'warehouse_id'] }]
});

export const StockMovement = sequelize.define('StockMovement', {
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('entrada', 'saida'), allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  note: { type: DataTypes.STRING(255) }
}, {
  tableName: 'stock_movements',
  updatedAt: false
});

Supplier.hasMany(Product, { foreignKey: 'supplier_id', as: 'products' });
Product.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

Warehouse.hasMany(Product, { foreignKey: 'warehouse_id', as: 'products' });
Product.belongsTo(Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });

Product.hasMany(StockMovement, { foreignKey: 'product_id', as: 'movements' });
StockMovement.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

export async function initModels() {
  await sequelize.authenticate();
}
