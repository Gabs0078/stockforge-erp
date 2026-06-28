import React, { useEffect, useState } from 'react';
import Alert from '../components/Alert.jsx';
import { api, getErrorMessage } from '../services/api.js';

export default function Movements() {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ product_id: '', type: 'entrada', quantity: 1, note: '' });
  const [error, setError] = useState('');
  async function load() { const [p, m] = await Promise.all([api.get('/products'), api.get('/movements')]); setProducts(p.data); setItems(m.data); }
  useEffect(() => { load(); }, []);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(e) { e.preventDefault(); setError(''); try { await api.post('/movements', form); setForm({ product_id: '', type: 'entrada', quantity: 1, note: '' }); await load(); } catch (err) { setError(getErrorMessage(err)); } }
  return <><h1>Movimentações de Estoque</h1><Alert message={error}/><form className="card card-body shadow-sm mb-4" onSubmit={submit}><div className="row g-3"><div className="col-md-5"><label className="form-label">Produto</label><select className="form-select" name="product_id" value={form.product_id} onChange={change} required><option value="">Selecione</option>{products.map(p => <option key={p.id} value={p.id}>{p.name} - {p.sku} ({p.quantity} un.)</option>)}</select></div><div className="col-md-2"><label className="form-label">Tipo</label><select className="form-select" name="type" value={form.type} onChange={change}><option value="entrada">Entrada</option><option value="saida">Saída</option></select></div><div className="col-md-2"><label className="form-label">Quantidade</label><input type="number" min="1" className="form-control" name="quantity" value={form.quantity} onChange={change} required /></div><div className="col-md-3"><label className="form-label">Observação</label><input className="form-control" name="note" value={form.note} onChange={change} /></div></div><div className="mt-3"><button className="btn btn-success">Registrar movimentação</button></div></form><table className="table table-striped bg-white shadow-sm"><thead><tr><th>ID</th><th>Produto</th><th>Tipo</th><th>Quantidade</th><th>Observação</th><th>Data</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td>{item.id}</td><td>{item.product?.name}</td><td>{item.type}</td><td>{item.quantity}</td><td>{item.note}</td><td>{new Date(item.created_at).toLocaleString('pt-BR')}</td></tr>)}</tbody></table></>;
}
