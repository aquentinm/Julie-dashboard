import { useState, useEffect } from "react";

const SHEETDB_URL = "https://sheetdb.io/api/v1/wesan24zm1o21";

const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n);

const STATUT_CLIENT = {
  actif:       { label: "Actif",       color: "#10B981", bg: "#ECFDF5" },
  inactif:     { label: "Inactif",     color: "#EF4444", bg: "#FEF2F2" },
  "en_attente":{ label: "En attente",  color: "#F59E0B", bg: "#FFFBEB" },
  Prospect:    { label: "Prospect",    color: "#8B5CF6", bg: "#F5F3FF" },
  "À valider": { label: "À valider",   color: "#F59E0B", bg: "#FFFBEB" },
  "Paiement à valider": { label: "Paiement reçu", color: "#3B82F6", bg: "#EFF6FF" },
};

function Badge({ config }) {
  if (!config) return null;
  return (
    <span style={{
      background: config.bg, color: config.color,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
      border: `1px solid ${config.color}30`
    }}>{config.label}</span>
  );
}

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "20px 22px",
      boxShadow: "0 1px 4px rgba(0,0,0,.06)", flex: 1, minWidth: 150,
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color, marginTop: 4, fontWeight: 700 }}>{sub}</div>}
    </div>
  );
}

function Dashboard({ prospects }) {
  const actifs     = prospects.filter(p => p.Statut === "actif").length;
  const enAttente  = prospects.filter(p => p.Statut === "À valider" || p.Statut === "Paiement à valider").length;
  const total      = prospects.length;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={styles.pageTitle}>Vue d'ensemble</h2>
        <p style={styles.pageSubtitle}>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard icon="👥" label="Total prospects"      value={total}      color="#8B5CF6" />
        <StatCard icon="✅" label="Clients actifs"       value={actifs}     color="#10B981" />
        <StatCard icon="⏳" label="Paiements en attente" value={enAttente}  color="#F59E0B" sub="À valider" />
        <StatCard icon="💰" label="Revenus estimés"      value={`${fmt(actifs * 9900)} F`} color="#3B82F6" sub="FCFA/mois" />
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📋 Derniers prospects</h3>
        {prospects.slice(0, 5).map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{p.Nom}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{p.Commerce} • {p.Ville}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{p.Date}</div>
              <Badge config={STATUT_CLIENT[p.Statut] || STATUT_CLIENT["en_attente"]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Prospects({ prospects, onUpdateStatut }) {
  const [search, setSearch] = useState("");
  const filtered = prospects.filter(p =>
    (p.Nom || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.Commerce || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={styles.pageTitle}>Prospects & Clients</h2>
          <p style={styles.pageSubtitle}>{prospects.length} au total</p>
        </div>
        <input
          placeholder="🔍 Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", minWidth: 200 }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((p, i) => (
          <div key={i} style={{
            ...styles.card,
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: 12,
            borderLeft: `4px solid ${STATUT_CLIENT[p.Statut]?.color || "#8B5CF6"}`
          }}>
            <div>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{p.Nom}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{p.Commerce} • {p.Ville}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{p.Numéro} • {p.Date}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <Badge config={STATUT_CLIENT[p.Statut] || { label: p.Statut, color: "#64748b", bg: "#f1f5f9" }} />
              <select
                value={p.Statut}
                onChange={e => onUpdateStatut(p.Numéro, e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, cursor: "pointer" }}
              >
                <option value="Prospect">Prospect</option>
                <option value="À valider">À valider</option>
                <option value="Paiement à valider">Paiement reçu</option>
                <option value="actif">Actif ✅</option>
                <option value="inactif">Inactif ⏸</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Statistiques({ prospects }) {
  const actifs    = prospects.filter(p => p.Statut === "actif").length;
  const total     = prospects.length;
  const revenus   = actifs * 9900;
  const charges   = 7600;
  const benefice  = revenus - charges;

  const villes = [...new Set(prospects.map(p => p.Ville).filter(Boolean))];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={styles.pageTitle}>Statistiques</h2>
        <p style={styles.pageSubtitle}>Performance d'AI SELLERS AGENCY</p>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="💰" label="Revenus mensuels"     value={`${fmt(revenus)} F`}   color="#10B981" sub="FCFA" />
        <StatCard icon="📉" label="Charges mensuelles"   value={`${fmt(charges)} F`}   color="#EF4444" sub="360dialog + Railway" />
        <StatCard icon="📈" label="Bénéfice net"         value={`${fmt(benefice)} F`}  color="#3B82F6" sub="Ce mois" />
        <StatCard icon="🎯" label="Taux conversion"      value={total > 0 ? `${Math.round((actifs/total)*100)}%` : "0%"} color="#8B5CF6" />
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📍 Répartition par ville</h3>
        {villes.map(ville => {
          const count = prospects.filter(p => p.Ville === ville).length;
          const pct   = Math.round((count / total) * 100);
          return (
            <div key={ville} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: "#0f172a", fontWeight: 600 }}>{ville}</span>
                <span style={{ color: "#64748b" }}>{count} ({pct}%)</span>
              </div>
              <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "#25D366", borderRadius: 4 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  pageTitle:    { fontSize: 22, fontWeight: 900, color: "#0f172a", margin: 0 },
  pageSubtitle: { fontSize: 13, color: "#64748b", margin: "4px 0 0 0" },
  card:         { background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" },
  cardTitle:    { fontSize: 15, fontWeight: 700, color: "#0f172a", marginTop: 0, marginBottom: 14 },
};

const NAV = [
  { id: "dashboard",  icon: "📊", label: "Dashboard"   },
  { id: "prospects",  icon: "👥", label: "Prospects"   },
  { id: "stats",      icon: "📈", label: "Statistiques"},
];

export default function AISellersAgencyDashboard() {
  const [page, setPage]         = useState("dashboard");
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [notif, setNotif]       = useState(null);

  useEffect(() => {
    fetch(SHEETDB_URL)
      .then(r => r.json())
      .then(data => { setProspects(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const showNotif = (msg, color = "#10B981") => {
    setNotif({ msg, color });
    setTimeout(() => setNotif(null), 3000);
  };

  const handleUpdateStatut = async (numero, newStatut) => {
    try {
      await fetch(`${SHEETDB_URL}/Numéro/${encodeURIComponent(numero)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { Statut: newStatut } })
      });
      setProspects(prev => prev.map(p => p.Numéro === numero ? { ...p, Statut: newStatut } : p));
      showNotif(`Statut mis à jour ✅`);
    } catch {
      showNotif("Erreur de mise à jour ❌", "#EF4444");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ width: 220, background: "#0f172a", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "24px 18px 18px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 13, lineHeight: 1.2 }}>AI SELLERS</div>
              <div style={{ color: "#25D366", fontWeight: 900, fontSize: 13, lineHeight: 1.2 }}>AGENCY</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#25D366", boxShadow: "0 0 6px #25D366" }} />
            <span style={{ color: "#94a3b8", fontSize: 12 }}>Julie est active 🌿</span>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "8px 10px" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", borderRadius: 10, border: "none", cursor: "pointer",
              marginBottom: 2, fontSize: 13, fontWeight: 600, textAlign: "left",
              background: page === item.id ? "#25D366" : "transparent",
              color: page === item.id ? "#fff" : "#64748b",
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #1e293b" }}>
          <div style={{ color: "#334155", fontSize: 11, textAlign: "center" }}>Quentin Moussoyi · CEO 🇨🇬</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b", fontSize: 16 }}>
            Chargement des données... ⏳
          </div>
        ) : (
          <>
            {page === "dashboard" && <Dashboard    prospects={prospects} />}
            {page === "prospects" && <Prospects    prospects={prospects} onUpdateStatut={handleUpdateStatut} />}
            {page === "stats"     && <Statistiques prospects={prospects} />}
          </>
        )}
      </div>

      {notif && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          background: "#0f172a", color: "#fff",
          padding: "14px 20px", borderRadius: 12,
          fontSize: 14, fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,.3)",
          zIndex: 9999, borderLeft: `4px solid ${notif.color}`
        }}>{notif.msg}</div>
      )}
    </div>
  );
}
