import { useState, useEffect } from 'react';

export default function Recompensas() {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadBalance() {
      try {
        const resBalance = await fetch('/api/recompensas/balance', { credentials: 'include' });
        if (resBalance.ok && active) {
          const dataB = await resBalance.json();
          setBalanceData(dataB);
        }
      } catch {
        if (active) setError('Error al cargar la información de recompensas.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBalance();

    return () => {
      active = false;
    };
  }, [refreshTrigger]);

  const handleCanjear = async (recompensaId, costoPuntos, titulo) => {
    if (!balanceData || balanceData.balanceDisponible < costoPuntos) {
      setError(`No cuentas con suficientes Amazings para canjear ${titulo}.`);
      return;
    }

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
        {/* Tier 1 */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 border rounded-4 overflow-hidden bg-white d-flex flex-column justify-content-between">
            <div>
              <div className="p-4 bg-light text-center border-bottom">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                  <span className="material-symbols-outlined text-success" style={{ fontSize: '64px' }}>
                    card_giftcard
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-success-subtle text-success">200 Amazings</span>
                  <small className="text-muted">Bono Nivel 1</small>
                </div>
                <h3 className="fw-bold text-dark mb-2">$100 USD</h3>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                  Recibe un total de $100.00 dólares por cada 200 Amazings acumulados en tu cuenta.
                </p>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button
                className="btn btn-outline-success rounded-pill w-100 py-2 fw-medium d-inline-flex align-items-center justify-content-center gap-1"
                type="button"
                onClick={() => handleCanjear(1, 200, 'Bono Nivel 1 ($100 USD)')}
                disabled={balance < 200}
              >
                <span className="material-symbols-outlined fs-6">redeem</span>
                <span>{balance >= 200 ? 'Canjear Bono' : 'Puntos Insuficientes'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2 */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 border border-success border-2 rounded-4 overflow-hidden bg-white d-flex flex-column justify-content-between position-relative shadow-sm">
            <div>
              <div className="p-4 bg-light text-center border-bottom position-relative">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                  <span className="material-symbols-outlined text-success" style={{ fontSize: '64px' }}>
                    stars
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-success text-white">500 Amazings &bull; Popular</span>
                  <small className="text-muted">Bono Nivel 2</small>
                </div>
                <h3 className="fw-bold text-dark mb-2">$250 USD</h3>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                  Recibe un total de $250.00 dólares por cada 500 Amazings acumulados en tu cuenta.
                </p>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button
                className="btn btn-success rounded-pill w-100 py-2 fw-medium text-white shadow-sm d-inline-flex align-items-center justify-content-center gap-1"
                type="button"
                onClick={() => handleCanjear(2, 500, 'Bono Nivel 2 ($250 USD)')}
                disabled={balance < 500}
              >
                <span className="material-symbols-outlined fs-6">redeem</span>
                <span>{balance >= 500 ? 'Canjear Bono' : 'Puntos Insuficientes'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier 3 */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 border rounded-4 overflow-hidden bg-white d-flex flex-column justify-content-between">
            <div>
              <div className="p-4 bg-light text-center border-bottom">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                  <span className="material-symbols-outlined text-success" style={{ fontSize: '64px' }}>
                    workspace_premium
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-success-subtle text-success">1000 Amazings</span>
                  <small className="text-muted">Bono Elite</small>
                </div>
                <h3 className="fw-bold text-dark mb-2">$500 USD</h3>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.5 }}>
                  Recibe un total de $500.00 dólares por cada 1000 Amazings acumulados en tu cuenta.
                </p>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button
                className="btn btn-outline-success rounded-pill w-100 py-2 fw-medium d-inline-flex align-items-center justify-content-center gap-1"
                type="button"
                onClick={() => handleCanjear(3, 1000, 'Bono Elite ($500 USD)')}
                disabled={balance < 1000}
              >
                <span className="material-symbols-outlined fs-6">redeem</span>
                <span>{balance >= 1000 ? 'Canjear Bono' : 'Puntos Insuficientes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
