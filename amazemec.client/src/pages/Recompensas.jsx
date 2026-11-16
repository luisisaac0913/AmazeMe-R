import { useState, useEffect } from 'react';

export default function Recompensas() {
  const [balanceData, setBalanceData] = useState(null);
  const [catalogo, setCatalogo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
  const [canjeandoId, setCanjeandoId] = useState(null);
  const [confirmCanje, setConfirmCanje] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [resBalance, resCatalogo] = await Promise.all([
          fetch('/api/recompensas/balance', { credentials: 'include' }),
          fetch('/api/recompensas/catalogo', { credentials: 'include' })
        ]);

        const dataB = await resBalance.json().catch(() => null);
        if (!resBalance.ok) {
          if (active) setError(dataB?.error || 'No se pudo cargar la información de recompensas.');
          return;
        }

        const dataC = resCatalogo.ok ? await resCatalogo.json().catch(() => []) : [];
        if (active) {
          setBalanceData(dataB);
          if (Array.isArray(dataC)) {
            setCatalogo(dataC);
          }
        }
      } catch {
        if (active) setError('Error al cargar la información de recompensas.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [refreshTrigger]);

  const handleCanjear = async (recompensaId, costoPuntos, titulo) => {
    if (canjeandoId !== null) return;
    if (!balanceData || balanceData.balanceDisponible < costoPuntos) {
      setError(`No cuentas con suficientes Amazings para canjear ${titulo}.`);
      return;
    }

    setCanjeandoId(recompensaId);
    setConfirmCanje(null);
    setError(null);
    setActionMsg(null);
    try {
      const res = await fetch('/api/recompensas/canjear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ recompensaId, costoPuntos })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al canjear.');
      }

      setActionMsg(`¡Canje exitoso para ${titulo}!`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setCanjeandoId(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
        <div className="google-spinner"></div>
      </div>
    );
  }

  const balance = balanceData?.balanceDisponible ?? 0;

  return (
    <div className="container my-5">
      {/* Banner / Balance */}
      <div className="card border rounded-4 p-4 p-lg-5 mb-5 bg-white shadow-sm position-relative overflow-hidden">
        <div className="row align-items-center gy-4">
          <div className="col-lg-7">
            <h1 className="display-5 fw-bold text-dark mb-2">Amazings</h1>
            <p className="lead text-muted mb-0" style={{ lineHeight: 1.6 }}>
              Canjea tus puntos acumulados por beneficios monetarios directos para tus próximas compras.
            </p>
          </div>
          <div className="col-lg-5">
            <div className="card border rounded-4 p-4 bg-light text-center text-lg-end">
              <small className="text-secondary text-uppercase fw-semibold d-block mb-1">Balance Disponible</small>
              <div className="d-flex align-items-center justify-content-center justify-content-lg-end gap-2">
                <span className="display-4 fw-bold text-dark">{balance}</span>
                <span className="badge bg-success text-white px-3 py-2 fw-bold fs-6">Az</span>
              </div>
              <small className="text-muted d-block mt-2">Equivalente a saldo canjeable directo</small>
            </div>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div className="alert alert-success alert-dismissible fade show mb-4 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">stars</span>
          <div>{actionMsg}</div>
          <button type="button" className="btn-close" onClick={() => setActionMsg(null)}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined fs-5">error</span>
          <div>{error}</div>
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Rewards Catalog */}
      <div className="row g-4 mb-5">
        {catalogo.map((item) => {
          const esPopular = item.id === 2;
          const iconName = item.id === 1 ? 'card_giftcard' : item.id === 2 ? 'stars' : 'workspace_premium';
          const partesTitulo = item.titulo.split(' - ');
          const subtitulo = partesTitulo[0] || item.categoria;
          const valorPremio = partesTitulo[1] || item.titulo;

          return (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div
                className={`card h-100 rounded-4 overflow-hidden bg-white d-flex flex-column justify-content-between ${
                  esPopular ? 'border border-success border-2 position-relative shadow-sm' : 'border'
                }`}
              >
                <div>
                  <div className="p-4 bg-light text-center border-bottom">
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                      <span className="material-symbols-outlined text-success" style={{ fontSize: '64px' }}>
                        {iconName}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className={`badge ${esPopular ? 'bg-success text-white' : 'bg-success-subtle text-success'}`}>
                        {item.costo} Amazings{esPopular ? ' • Popular' : ''}
                      </span>
                      <small className="text-muted">{subtitulo}</small>
                    </div>
                    <h3 className="fw-bold text-dark mb-2">{valorPremio}</h3>
                    <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                      {item.descripcion}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <button
                    className={`btn rounded-pill w-100 py-2 fw-medium d-inline-flex align-items-center justify-content-center gap-1 ${
                      esPopular ? 'btn-success text-white shadow-sm' : 'btn-outline-success'
                    }`}
                    type="button"
                    onClick={() => setConfirmCanje(item)}
                    disabled={balance < item.costo || canjeandoId !== null}
                  >
                    <span className="material-symbols-outlined fs-6">redeem</span>
                    <span>
                      {canjeandoId === item.id
                        ? 'Canjeando...'
                        : balance >= item.costo
                          ? 'Canjear Bono'
                          : 'Puntos Insuficientes'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {confirmCanje && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(32, 33, 36, 0.65)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border rounded-4 p-4 bg-white shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">Confirmar canje</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={() => setConfirmCanje(null)}
                ></button>
              </div>
              <div className="modal-body py-3">
                <p className="text-muted mb-0" style={{ lineHeight: 1.6 }}>
                  ¿Deseas canjear <strong>{confirmCanje.titulo}</strong> por{' '}
                  <strong className="text-success">{confirmCanje.costo} Amazings</strong>? Esta operación descontará los puntos de tu balance inmediatamente.
                </p>
              </div>
              <div className="modal-footer border-0 pt-0 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setConfirmCanje(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success rounded-pill px-4 text-white"
                  onClick={() => handleCanjear(confirmCanje.id, confirmCanje.costo, confirmCanje.titulo)}
                >
                  Confirmar canje
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {balanceData?.historial && balanceData.historial.length > 0 && (
        <div className="card border rounded-4 p-4 p-md-5 bg-white shadow-sm">
          <h4 className="fw-bold text-dark mb-3">Historial de Amazings</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Operación</th>
                  <th>Amazings</th>
                </tr>
              </thead>
              <tbody>
                {balanceData.historial.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.fecha).toLocaleDateString()}</td>
                    <td>
                      {item.puntosObtenidos > 0 ? (
                        item.montoCompra > 0 ? (
                          <span className="text-success fw-medium">Compra (${item.montoCompra.toFixed(2)})</span>
                        ) : (
                          <span className="text-success fw-medium">Bono diario de encuesta</span>
                        )
                      ) : (
                        <span className="text-danger fw-medium">Canje de Recompensa</span>
                      )}
                    </td>
                    <td>
                      {item.puntosObtenidos > 0 ? (
                        <span className="badge bg-success-subtle text-success">+{item.puntosObtenidos} Az</span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger">-{item.puntosGastados} Az</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
