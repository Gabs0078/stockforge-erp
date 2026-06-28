CREATE DATABASE IF NOT EXISTS stockforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE stockforge;

CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trade_name VARCHAR(120) NOT NULL,
  legal_name VARCHAR(160) NOT NULL,
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS warehouses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  code VARCHAR(30) NOT NULL UNIQUE,
  address VARCHAR(255),
  manager VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(140) NOT NULL,
  sku VARCHAR(60) NOT NULL,
  category VARCHAR(80),
  quantity INT NOT NULL DEFAULT 0,
  minimum_stock INT NOT NULL DEFAULT 0,
  cost_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  supplier_id INT NOT NULL,
  warehouse_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_products_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT uq_product_sku_warehouse UNIQUE (sku, warehouse_id),
  CONSTRAINT ck_product_quantity CHECK (quantity >= 0),
  CONSTRAINT ck_product_minimum CHECK (minimum_stock >= 0),
  CONSTRAINT ck_product_price CHECK (cost_price >= 0)
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  type ENUM('entrada','saida') NOT NULL,
  quantity INT NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_movements_product FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT ck_movement_quantity CHECK (quantity > 0)
);

INSERT INTO suppliers (trade_name, legal_name, cnpj, email, phone) VALUES
('Fornecedor Alfa', 'Fornecedor Alfa Materiais LTDA', '12.345.678/0001-95', 'contato@alfa.com', '(41) 99999-0001'),
('Distribuidora Beta', 'Distribuidora Beta Comércio LTDA', '11.222.333/0001-81', 'vendas@beta.com', '(41) 99999-0002')
ON DUPLICATE KEY UPDATE trade_name = VALUES(trade_name);

INSERT INTO warehouses (name, code, address, manager) VALUES
('Galpão Central', 'GALP-CENTRAL', 'Rua Exemplo, 100 - Curitiba/PR', 'Gabriel'),
('Galpão Secundário', 'GALP-SEC', 'Rua Estoque, 200 - Curitiba/PR', 'Operador 2')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (name, sku, category, quantity, minimum_stock, cost_price, supplier_id, warehouse_id) VALUES
('Cimento CP-II 50kg', 'CIM-CP2-50', 'Construção', 35, 10, 32.90, 1, 1),
('Tubo PVC 100mm', 'PVC-100', 'Hidráulica', 8, 12, 48.50, 2, 1),
('Luva PVC 100mm', 'LUVA-PVC-100', 'Hidráulica', 60, 20, 7.90, 2, 2)
ON DUPLICATE KEY UPDATE name = VALUES(name);
