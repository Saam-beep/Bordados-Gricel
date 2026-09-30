const labels = {
  RECEIVED: 'Solicitud recibida', DESIGN_REVIEW: 'Revisando diseño', QUOTE_SENT: 'Cotización enviada', WAITING_APPROVAL: 'Esperando aprobación', APPROVED: 'Aprobado', WAITING_DEPOSIT: 'Esperando anticipo', IN_PRODUCTION: 'En producción', QUALITY_CONTROL: 'Control de calidad', READY: 'Listo para entrega', DELIVERED: 'Entregado', CANCELLED: 'Cancelado'
};
export { labels };
export default function StatusBadge({ status }) { return <span className={`badge status-${status}`}>{labels[status] || status}</span>; }
