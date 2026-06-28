import React, { useEffect, useState } from 'react';
import Alert from '../components/Alert.jsx';
import { api, getErrorMessage } from '../services/api.js';

const empty = { name: '', code: '', address: '', manager: '' };

export default function Warehouses() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  async function load() { const res = await api.get('/warehouses'); setItems(res.data); }
  useEffect(() => { load(); }, []);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function edit(item) { setEditingId(item.id); setForm(item); window.scrollTo(0,0); }
  function cancel() { setEditingId(null); setForm(empty); setError(''); }
  async function submit(e) { e.preventDefault(); setError(''); try { editingId ? await api.put(`/warehouses/${editingId}`, form) : await api.post('/warehouses', form); cancel(); await load(); } catch (err) { setError(getErrorMessage(err)); } }
  async function remove(id) { if (confirm('Excluir galpão?')) { await api.delete(`/warehouses/${id}`); await load(); } }
  return <><h1>Galpões</h1><Alert message={error}/><form className="card card-body shadow-sm mb-4" onSubmit={submit}><div className="row g-3">{[['name','Nome'],['code','Código'],['address','Endereço'],['manager','Responsável']].map(([name,label]) => <div className="col-md" key={name}><label className="form-label">{label}</label><input className="form-control" name={name} value={form[name] || ''} onChange={change} required={name !== 'address'} /></div>)}</div><div className="mt-3"><button className="btn btn-success">{editingId ? 'Salvar edição' : 'Cadastrar'}</button>{editingId && <button type="button" className="btn btn-secondary ms-2" onClick={cancel}>Cancelar</button>}</div></form><table className="table table-striped bg-white shadow-sm"><thead><tr><th>Nome</th><th>Código</th><th>Responsável</th><th>Ações</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td>{item.name}</td><td>{item.code}</td><td>{item.manager}</td><td><button className="btn btn-sm btn-outline-primary me-2" onClick={() => edit(item)}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id)}>Excluir</button></td></tr>)}</tbody></table></>;
}
