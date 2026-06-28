import { Router } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import { crudController } from '../controllers/crudFactory.js';
import { Supplier, Warehouse, Product } from '../models/index.js';
import { validate } from '../middleware/validate.js';
import { supplierRules } from '../validators/supplierValidators.js';
import { warehouseRules } from '../validators/warehouseValidators.js';
import { productRules } from '../validators/productValidators.js';
import { movementRules } from '../validators/movementValidators.js';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { listMovements, createMovement } from '../controllers/movementController.js';
import { dashboard } from '../controllers/dashboardController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 } });

const suppliers = crudController(Supplier);
const warehouses = crudController(Warehouse);

router.get('/dashboard', dashboard);

router.get('/suppliers', suppliers.list);
router.get('/suppliers/:id', suppliers.get);
router.post('/suppliers', supplierRules, validate, suppliers.create);
router.put('/suppliers/:id', supplierRules, validate, suppliers.update);
router.delete('/suppliers/:id', suppliers.remove);

router.get('/warehouses', warehouses.list);
router.get('/warehouses/:id', warehouses.get);
router.post('/warehouses', warehouseRules, validate, warehouses.create);
router.put('/warehouses/:id', warehouseRules, validate, warehouses.update);
router.delete('/warehouses/:id', warehouses.remove);

router.get('/products', listProducts);
router.get('/products/:id', getProduct);
router.post('/products', productRules, validate, createProduct);
router.put('/products/:id', productRules, validate, updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/movements', listMovements);
router.post('/movements', movementRules, validate, createMovement);

router.post('/products/import-csv', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Arquivo CSV é obrigatório.' });
    const content = req.file.buffer.toString('utf-8');
    const records = parse(content, { columns: true, skip_empty_lines: true, trim: true });
    const created = [];
    const errors = [];

    for (const [index, row] of records.entries()) {
      try {
        const product = await Product.create({
          name: row.nome,
          sku: row.sku,
          category: row.categoria || null,
          quantity: Number(row.quantidade || 0),
          minimum_stock: Number(row.estoque_minimo || 0),
          cost_price: Number(row.preco_custo || 0),
          supplier_id: Number(row.fornecedor_id),
          warehouse_id: Number(row.galpao_id)
        });
        created.push(product.id);
      } catch (error) {
        errors.push({ line: index + 2, message: error.message });
      }
    }

    res.status(201).json({ imported: created.length, errors });
  } catch (error) {
    next(error);
  }
});

export default router;
