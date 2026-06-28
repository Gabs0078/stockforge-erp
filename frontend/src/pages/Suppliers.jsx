import React, { useEffect, useState } from 'react';
import Alert from '../components/Alert.jsx';
import { api, getErrorMessage } from '../services/api.js';

const empty = { trade_name: '', legal_name: '', cnpj: '', email: '', phone: '' };

export default function Suppliers() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  async function load() { const res = await api.get('/suppliers'); setItems(res.data); }
  useEffect(() => { load(); }, []);

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function edit(item) { setEditingId(item.id); setForm(item); window.scrollTo(0,0); }
  function cancel() { setEditingId(null); setForm(empty); setError(''); }

  async function submit(e) {
    e.preventDefault(); setError('');
    try {
      if (editingId) await api.put(`/suppliers/${editingId}`, form); else await api.post('/suppliers', form);
      cancel(); await load();
    } catch (err) { setError(getErrorMessage(err)); }
  }
  async function remove(id) { if (confirm('Excluir fornecedor?')) { await api.delete(`/suppliers/${id}`); await load(); } }

  return (
    <>
      <h1>Fornecedores</h1><Alert message={error} />
      <form className="card card-body shadow-sm mb-4" onSubmit={submit}>
        <div className="row g-3">
          {[
            ['trade_name','Nome fantasia'], ['legal_name','Razão social'], ['cnpj','CNPJ'], ['email','E-mail'], ['phone','Telefone']
          ].map(([name,label]) => <div className="col-md" key={name}><label className="form-label">{label}</label><input className="form-control" name={name} value={form[name] || ''} onChange={change} required={name !== 'phone'} /></div>)}
        </div>
        <div className="mt-3"><button className="btn btn-success">{editingId ? 'Salvar edição' : 'Cadastrar'}</button> {editingId && <button type="button" className="btn btn-secondary ms-2" onClick={cancel}>Cancelar</button>}</div>
      </form>
      <table className="table table-striped bg-white shadow-sm"><thead><tr><th>Nome</th><th>CNPJ</th><th>E-mail</th><th>Ações</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td>{item.trade_name}</td><td>{item.cnpj}</td><td>{item.email}</td><td><button className="btn btn-sm btn-outline-primary me-2" onClick={() => edit(item)}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id)}>Excluir</button></td></tr>)}</tbody></table>
    </>
  );
}
