import React, { useEffect, useState } from 'react';
import Alert from '../components/Alert.jsx';
import { api, getErrorMessage } from '../services/api.js';

const empty = { name: '', sku: '', category: '', quantity: 0, minimum_stock: 0, cost_price: 0, supplier_id: '', warehouse_id: '' };

export default function Products() {
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('');
  const [search, setSearch] = useState('');

  async function load() {
    const params = {};
    if (filterWarehouse) params.warehouse_id = filterWarehouse;
    if (search) params.search = search;
    const res = await api.get('/products', { params });
    setItems(res.data);
  }
  async function loadSelects() {
    const [s, w] = await Promise.all([api.get('/suppliers'), api.get('/warehouses')]);
    setSuppliers(s.data); setWarehouses(w.data);
  }
  useEffect(() => { loadSelects(); }, []);
  useEffect(() => { load(); }, [filterWarehouse]);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function edit(item) { setEditingId(item.id); setForm({ ...item, supplier_id: item.supplier_id, warehouse_id: item.warehouse_id }); window.scrollTo(0,0); }
  function cancel() { setEditingId(null); setForm(empty); setError(''); }
  async function submit(e) { e.preventDefault(); setError(''); try { editingId ? await api.put(`/products/${editingId}`, form) : await api.post('/products', form); cancel(); await load(); } catch (err) { setError(getErrorMessage(err)); } }
  async function remove(id) { if (confirm('Excluir produto?')) { await api.delete(`/products/${id}`); await load(); } }

  return <><h1>Produtos</h1><Alert message={error}/><form className="card card-body shadow-sm mb-4" onSubmit={submit}><div className="row g-3"><div className="col-md-3"><label className="form-label">Nome</label><input className="form-control" name="name" value={form.name} onChange={change} required /></div><div className="col-md-2"><label className="form-label">SKU</label><input className="form-control" name="sku" value={form.sku} onChange={change} required /></div><div className="col-md-2"><label className="form-label">Categoria</label><input className="form-control" name="category" value={form.category || ''} onChange={change} /></div><div className="col-md-1"><label className="form-label">Qtd</label><input type="number" min="0" className="form-control" name="quantity" value={form.quantity} onChange={change} required /></div><div className="col-md-2"><label className="form-label">Estoque mínimo</label><input type="number" min="0" className="form-control" name="minimum_stock" value={form.minimum_stock} onChange={change} required /></div><div className="col-md-2"><label className="form-label">Preço custo</label><input type="number" min="0" step="0.01" className="form-control" name="cost_price" value={form.cost_price} onChange={change} required /></div><div className="col-md-6"><label className="form-label">Fornecedor</label><select className="form-select" name="supplier_id" value={form.supplier_id} onChange={change} required><option value="">Selecione</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.trade_name}</option>)}</select></div><div className="col-md-6"><label className="form-label">Galpão</label><select className="form-select" name="warehouse_id" value={form.warehouse_id} onChange={change} required><option value="">Selecione</option>{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div></div><div className="mt-3"><button className="btn btn-success">{editingId ? 'Salvar edição' : 'Cadastrar'}</button>{editingId && <button type="button" className="btn btn-secondary ms-2" onClick={cancel}>Cancelar</button>}</div></form><div className="card card-body mb-3 shadow-sm"><div className="row g-2"><div className="col-md-4"><select className="form-select" value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)}><option value="">Todos os galpões</option>{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div><div className="col-md-6"><input className="form-control" placeholder="Buscar por nome ou SKU" value={search} onChange={e => setSearch(e.target.value)} /></div><div className="col-md-2"><button className="btn btn-dark w-100" onClick={load}>Filtrar</button></div></div></div><table className="table table-striped bg-white shadow-sm"><thead><tr><th>Produto</th><th>SKU</th><th>Galpão</th><th>Fornecedor</th><th>Qtd</th><th>Ações</th></tr></thead><tbody>{items.map(item => <tr key={item.id} className={item.quantity <= item.minimum_stock ? 'table-warning' : ''}><td>{item.name}</td><td>{item.sku}</td><td>{item.warehouse?.name}</td><td>{item.supplier?.trade_name}</td><td className={item.quantity <= item.minimum_stock ? 'low-stock' : ''}>{item.quantity}</td><td><button className="btn btn-sm btn-outline-primary me-2" onClick={() => edit(item)}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id)}>Excluir</button></td></tr>)}</tbody></table></>;
}
