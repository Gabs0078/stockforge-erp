import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Suppliers from './pages/Suppliers.jsx';
import Warehouses from './pages/Warehouses.jsx';
import Products from './pages/Products.jsx';
import Movements from './pages/Movements.jsx';

export default function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-success">
        <div className="container-fluid">
          <NavLink className="navbar-brand fw-bold" to="/">StockForge ERP</NavLink>
          <div className="navbar-nav gap-2">
            <NavLink className="nav-link" to="/">Dashboard</NavLink>
            <NavLink className="nav-link" to="/products">Produtos</NavLink>
            <NavLink className="nav-link" to="/suppliers">Fornecedores</NavLink>
            <NavLink className="nav-link" to="/warehouses">Galpões</NavLink>
            <NavLink className="nav-link" to="/movements">Movimentações</NavLink>
          </div>
        </div>
      </nav>
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/movements" element={<Movements />} />
        </Routes>
      </main>
    </div>
  );
}
