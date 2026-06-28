import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export default function Dashboard() {
  const [data, setData] = useState({ products: 0, suppliers: 0, warehouses: 0, lowStock: 0 });

  useEffect(() => { api.get('/dashboard').then(res => setData(res.data)); }, []);

  const cards = [
    ['Produtos', data.products],
    ['Fornecedores', data.suppliers],
    ['Galpões', data.warehouses],
    ['Estoque baixo', data.lowStock]
  ];

  return (
    <>
      <h1 className="mb-3">Dashboard</h1>
      <p className="text-muted">MVP para controle de produtos, fornecedores, galpões e movimentações de estoque.</p>
      <div className="row g-3">
        {cards.map(([label, value]) => (
          <div className="col-md-3" key={label}>
            <div className="card card-kpi shadow-sm">
              <div className="card-body">
                <div className="text-muted">{label}</div>
                <div className="display-5 fw-bold">{value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
