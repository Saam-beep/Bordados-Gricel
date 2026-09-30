import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function CustomerPortal() {
  const user = JSON.parse(localStorage.getItem('gricel_user') || '{}'); const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/orders/mine').then(r => setOrders(r.data)).finally(() => setLoading(false)); }, []);
  const active = orders.filter(o => !['DELIVERED','CANCELLED'].includes(o.status)).length;
  return <section className="dashboard-page"><div className="page-title"><div><span className="eyebrow">PORTAL DEL CLIENTE</span><h1>Hola, {user.name?.split(' ')[0]} 👋</h1><p>Aquí puedes consultar el avance y los archivos de tus solicitudes.</p></div><Link className="button" to="/nuevo-pedido">+ Nuevo pedido</Link></div><div className="stats"><div><span>Pedidos activos</span><strong>{active}</strong></div><div><span>Total de pedidos</span><strong>{orders.length}</strong></div><div><span>Entregados</span><strong>{orders.filter(o=>o.status==='DELIVERED').length}</strong></div></div><div className="panel"><div className="panel-title"><h2>Mis pedidos</h2></div>{loading ? <p>Cargando…</p> : orders.length === 0 ? <div className="empty"><h3>Aún no tienes pedidos</h3><p>Crea tu primera solicitud de bordado, sublimado o confección.</p></div> : <div className="order-list">{orders.map(o => <Link to={`/pedido/${o.id}`} className="order-row" key={o.id}><div><strong>{o.orderNumber}</strong><span>{o.product} · {o.quantity} unidades</span></div><div><StatusBadge status={o.status}/><small>{new Date(o.createdAt).toLocaleDateString('es-GT')}</small></div></Link>)}</div>}</div></section>;
}
