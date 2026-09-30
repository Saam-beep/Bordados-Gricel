import { useEffect, useState } from 'react';
import { api } from '../services/api';
import StatusBadge, { labels } from '../components/StatusBadge';

const statuses = Object.keys(labels);
const fileBase = import.meta.env.VITE_FILES_URL || 'http://localhost:4000';

function isImage(file) {
  return file.mimeType?.startsWith('image/');
}

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('orders');
  const [selected, setSelected] = useState(null);

  async function load() {
    const [o, c, s] = await Promise.all([
      api.get('/orders/admin/all'),
      api.get('/customers'),
      api.get('/orders/admin/stats')
    ]);

    setOrders(o.data);
    setCustomers(c.data);
    setStats(s.data);

    if (selected) {
      const fresh = o.data.find(x => x.id === selected.id);
      if (fresh) setSelected(fresh);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    await api.patch(`/orders/${selected.id}/status`, raw);
    await load();
    setSelected(null);
  }

  return (
    <section className="crm-shell">
      <aside className="crm-sidebar">
        <div className="crm-brand">
          <img src="/logo-bordados-gricel.png" alt="Bordados Gricel" />
          <div>
            <strong>Bordados Gricel</strong>
            <small>CRM administrativo</small>
          </div>
        </div>

        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
          Pedidos
        </button>
        <button className={tab === 'customers' ? 'active' : ''} onClick={() => setTab('customers')}>
          Clientes
        </button>
      </aside>

      <div className="crm-main">
        <div className="page-title">
          <div>
            <span className="eyebrow">ADMINISTRACIÓN</span>
            <h1>Panel de control</h1>
            <p>Gestiona solicitudes, producción y clientes desde un solo lugar.</p>
          </div>
        </div>

        {stats && (
          <div className="stats">
            <div><span>Pedidos</span><strong>{stats.orders}</strong></div>
            <div><span>Clientes</span><strong>{stats.clients}</strong></div>
            <div><span>Ventas registradas</span><strong>Q {stats.totalSales.toFixed(2)}</strong></div>
          </div>
        )}

        {tab === 'orders' ? (
          <div className="panel">
            <div className="panel-title"><h2>Pedidos recientes</h2></div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><strong>{o.orderNumber}</strong></td>
                      <td>{o.customer.name}<small>{o.customer.company || o.customer.email}</small></td>
                      <td>{o.product}</td>
                      <td>{o.quantity}</td>
                      <td><StatusBadge status={o.status} /></td>
                      <td><button className="link-btn" onClick={() => setSelected(o)}>Gestionar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="panel">
            <div className="panel-title"><h2>Clientes</h2></div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Cliente</th><th>Empresa</th><th>Teléfono</th><th>Correo</th><th>Pedidos</th></tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.company || '—'}</td>
                      <td>{c.phone || c.whatsapp || '—'}</td>
                      <td>{c.email}</td>
                      <td>{c._count.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selected && (
          <div className="modal-backdrop" onClick={() => setSelected(null)}>
            <form className="modal admin-order-modal" onSubmit={save} onClick={e => e.stopPropagation()}>
              <button type="button" className="close" onClick={() => setSelected(null)}>×</button>
              <span className="eyebrow">{selected.orderNumber}</span>
              <h2>Gestionar pedido</h2>

              <div className="order-summary-card">
                <div><span>Cliente</span><strong>{selected.customer.name}</strong></div>
                <div><span>Producto</span><strong>{selected.product}</strong></div>
                <div><span>Cantidad</span><strong>{selected.quantity}</strong></div>
                <div><span>Teléfono</span><strong>{selected.customer.phone || '—'}</strong></div>
              </div>

              <label>
                Estado
                <select name="status" defaultValue={selected.status}>
                  {statuses.map(s => <option value={s} key={s}>{labels[s]}</option>)}
                </select>
              </label>

              <div className="form-grid">
                <label>
                  Fecha confirmada
                  <input name="confirmedDate" type="date" defaultValue={selected.confirmedDate?.slice(0, 10) || ''} />
                </label>
                <label>
                  Total Q
                  <input name="total" type="number" step="0.01" defaultValue={selected.total || ''} />
                </label>
                <label>
                  Anticipo Q
                  <input name="deposit" type="number" step="0.01" defaultValue={selected.deposit || ''} />
                </label>
              </div>

              <label>
                Nota
                <textarea name="note" rows="3" placeholder="Ej. Diseño aprobado por cliente" />
              </label>

              <section className="admin-files">
                <div className="admin-files-title">
                  <div>
                    <span className="eyebrow">ARCHIVOS</span>
                    <h3>Diseños enviados por el cliente</h3>
                  </div>
                  <span className="file-count">{selected.files?.length || 0}</span>
                </div>

                {!selected.files?.length ? (
                  <p className="empty-files">Este pedido no tiene archivos adjuntos.</p>
                ) : (
                  <div className="admin-file-grid">
                    {selected.files.map(file => (
                      <a
                        key={file.id}
                        className="admin-file-card"
                        href={`${fileBase}${file.filePath}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Abrir archivo en una pestaña nueva"
                      >
                        {isImage(file) ? (
                          <img src={`${fileBase}${file.filePath}`} alt={file.fileName} />
                        ) : (
                          <div className="file-placeholder">ARCHIVO</div>
                        )}
                        <div>
                          <strong>{file.fileName}</strong>
                          <small>Abrir archivo ↗</small>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </section>

              <div className="modal-actions">
                <button type="button" className="button secondary" onClick={() => setSelected(null)}>Cancelar</button>
                <button className="button">Guardar cambios</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
