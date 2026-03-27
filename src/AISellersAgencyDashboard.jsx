import { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CLIENTS = [
  { id: 1, nom: "Mireille Koumba",    telephone: "+242 06 123 4567", boutique: "Boutique Mireille",    commerce: "Vêtements",    ville: "Pointe-Noire", statut: "actif",    dateExpiration: "2026-04-18", montantMensuel: 9900,  derniereActivite: "Il y a 2h" },
  { id: 2, nom: "Patrick Moussavou",  telephone: "+242 05 987 6543", boutique: "Alimentation Patrick", commerce: "Alimentaire",  ville: "Dolisie",      statut: "actif",    dateExpiration: "2026-04-22", montantMensuel: 9900,  derniereActivite: "Il y a 5h" },
  { id: 3, nom: "Grâce Bitsindou",    telephone: "+242 06 555 7890", boutique: "Coiffure Grâce",       commerce: "Coiffure",     ville: "Brazzaville",  statut: "inactif",  dateExpiration: "2026-03-10", montantMensuel: 9900,  derniereActivite: "Il y a 3j" },
  { id: 4, nom: "Jean-Paul Loubelo",  telephone: "+242 05 321 0987", boutique: "Menuiserie JP",        commerce: "Menuiserie",   ville: "Pointe-Noire", statut: "actif",    dateExpiration: "2026-04-30", montantMensuel: 9900,  derniereActivite: "Il y a 1h" },
  { id: 5, nom: "Sandrine Abena",     telephone: "+242 06 444 5678", boutique: "Pharmacie Abena",      commerce: "Pharmacie",    ville: "Dolisie",      statut: "en_attente", dateExpiration: "2026-03-26", montantMensuel: 9900, derniereActivite: "Il y a 30min" },
  { id: 6, nom: "Rodrigue Fortuné",   telephone: "+242 05 678 9012", boutique: "Garage Fortuné",       commerce: "Automobile",   ville: "Brazzaville",  statut: "actif",    dateExpiration: "2026-04-15", montantMensuel: 9900,  derniereActivite: "Il y a 4h" },
];

const MOCK_PAIEMENTS = [
  { id: 1, client: "Mireille Koumba",   montant: 9900,  type: "Renouvellement", operateur: "MTN Money",   date: "2026-03-18", statut: "validé" },
  { id: 2, client: "Patrick Moussavou", montant: 14900, type: "Installation",   operateur: "Airtel Money",date: "2026-03-15", statut: "validé" },
  { id: 3, client: "Sandrine Abena",    montant: 14900, type: "Installation",   operateur: "MTN Money",   date: "2026-03-24", statut: "en_attente" },
  { id: 4, client: "Jean-Paul Loubelo", montant: 9900,  type: "Renouvellement", operateur: "MTN Money",   date: "2026-03-20", statut: "validé" },
  { id: 5, client: "Grâce Bitsindou",   montant: 9900,  type: "Renouvellement", operateur: "Airtel Money",date: "2026-03-10", statut: "échoué" },
  { id: 6, client: "Rodrigue Fortuné",  montant: 9900,  type: "Renouvellement", operateur: "MTN Money",   date: "2026-03-22", statut: "validé" },
];

const MOCK_CONVERSATIONS = [
  { id: 1, client: "Aminata D.",    telephone: "+242 06 789 1234", dernier: "Je veux en savoir plus sur votre service",        heure: "08:42", nonLus: 2, phase: "qualification" },
  { id: 2, client: "Bruno M.",      telephone: "+242 05 456 7890", dernier: "C'est combien exactement ?",                      heure: "09:15", nonLus: 1, phase: "offre" },
  { id: 3, client: "Cécile N.",     telephone: "+242 06 321 5678", dernier: "Ok je suis intéressée, comment on fait ?",        heure: "09:38", nonLus: 3, phase: "closing" },
  { id: 4, client: "David K.",      telephone: "+242 05 987 3456", dernier: "Merci pour les informations 😊",                   heure: "10:02", nonLus: 0, phase: "termine" },
  { id: 5, client: "Estelle B.",    telephone: "+242 06 654 9870", dernier: "Je vais réfléchir et vous revenir",               heure: "10:25", nonLus: 0, phase: "reflechit" },
];

const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n);

// ─── Status configs ───────────────────────────────────────────────────────────
const STATUT_CLIENT = {
  actif:       { label: "Actif",       color: "#10B981", bg: "#ECFDF5" },
  inactif:     { label: "Inactif",     color: "#EF4444", bg: "#FEF2F2" },
  en_attente:  { label: "En attente",  color: "#F59E0B", bg: "#FFFBEB" },
};

const STATUT_PAIEMENT = {
  validé:      { label: "Validé",      color: "#10B981", bg: "#ECFDF5" },
  en_attente:  { label: "En attente",  color: "#F59E0B", bg: "#FFFBEB" },
  échoué:      { label: "Échoué",      color: "#EF4444", bg: "#FEF2F2" },
};

const PHASE_CONV = {
  qualification: { label: "Qualification", color: "#8B5CF6" },
  offre:         { label: "Offre",         color: "#3B82F6" },
  closing:       { label: "Closing 🔥",    color: "#F59E0B" },
  termine:       { label: "Terminé",       color: "#10B981" },
  reflechit:     { label: "Réfléchit",     color: "#6B7280" },
};

// ─── Components ───────────────────────────────────────────────────────────────
function Badge({ config }) {
  return (
    <span style={{
      background: config.bg, color: config.color,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
      border: `1px solid ${config.color}30`
    }}>{config.label}</span>
  );
}

function StatCard({ icon, label, value, sub, color, trend }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "20px 22px",
      boxShadow: "0 1px 4px rgba(0,0,0,.06)", flex: 1, minWidth: 150,
      borderLeft: `4px solid ${color}`, position: "relative"
    }}>
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color, marginTop: 4, fontWeight: 700 }}>{sub}</div>}
      {trend && <div style={{ fontSize: 11, color: "#10B981", marginTop: 2 }}>↑ {trend}</div>}
    </div>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────
function Dashboard({ clients, paiements }) {
  const actifs = clients.filter(c => c.statut === "actif").length;
  const revenus = paiements.filter(p => p.statut === "validé").reduce((s, p) => s + p.montant, 0);
  const enAttente = paiements.filter(p => p.statut === "en_attente").length;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={styles.pageTitle}>Vue d'ensemble</h2>
        <p style={styles.pageSubtitle}>Aujourd'hui — 26 mars 2026</p>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard icon="👥" label="Clients actifs"      value={actifs}                   color="#10B981" trend="+2 ce mois" />
        <StatCard icon="💰" label="Revenus du mois"     value={`${fmt(revenus)} F`}       color="#F59E0B" sub="FCFA" />
        <StatCard icon="⏳" label="Paiements en attente" value={enAttente}                color="#F59E0B" sub="À valider" />
        <StatCard icon="💬" label="Conversations actives" value={MOCK_CONVERSATIONS.filter(c => c.nonLus > 0).length} color="#8B5CF6" sub="Prospects chauds" />
      </div>

      {/* Clients expirant bientôt */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>⚠️ Renouvellements à venir</h3>
        {clients.filter(c => c.statut === "actif").slice(0, 3).map(c => (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{c.nom}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{c.boutique}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B" }}>Expire le {c.dateExpiration}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{fmt(c.montantMensuel)} FCFA/mois</div>
            </div>
          </div>
        ))}
      </div>

      {/* Derniers paiements */}
      <div style={{ ...styles.card, marginTop: 16 }}>
        <h3 style={styles.cardTitle}>💳 Derniers paiements</h3>
        {paiements.slice(0, 4).map(p => (
          <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{p.client}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{p.type} • {p.operateur}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{fmt(p.montant)} F</div>
              <Badge config={STATUT_PAIEMENT[p.statut]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Clients({ clients, onToggle }) {
  const [search, setSearch] = useState("");
  const filtered = clients.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.boutique.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={styles.pageTitle}>Clients</h2>
          <p style={styles.pageSubtitle}>{clients.length} clients au total</p>
        </div>
        <input
          placeholder="🔍 Rechercher un client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, outline: "none", minWidth: 200 }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(client => (
          <div key={client.id} style={{
            ...styles.card,
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: 12,
            borderLeft: `4px solid ${STATUT_CLIENT[client.statut]?.color || "#ccc"}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 46, height: 46, borderRadius: "50%",
                background: `${STATUT_CLIENT[client.statut]?.color}20`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0
              }}>
                {client.commerce === "Vêtements" ? "👗" :
                 client.commerce === "Alimentaire" ? "🛒" :
                 client.commerce === "Coiffure" ? "💇" :
                 client.commerce === "Pharmacie" ? "💊" :
                 client.commerce === "Automobile" ? "🚗" : "🏪"}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>{client.nom}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{client.boutique} • {client.ville}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                  {client.telephone} • Actif {client.derniereActivite}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{fmt(client.montantMensuel)} F/mois</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Expire {client.dateExpiration}</div>
              </div>
              <Badge config={STATUT_CLIENT[client.statut]} />
              <button
                onClick={() => onToggle(client.id)}
                style={{
                  background: client.statut === "actif" ? "#FEF2F2" : "#ECFDF5",
                  color: client.statut === "actif" ? "#EF4444" : "#10B981",
                  border: `1px solid ${client.statut === "actif" ? "#EF444430" : "#10B98130"}`,
                  borderRadius: 8, padding: "6px 14px",
                  fontSize: 12, fontWeight: 700, cursor: "pointer"
                }}
              >
                {client.statut === "actif" ? "⏸ Désactiver" : "▶ Activer"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Paiements({ paiements, onValider }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={styles.pageTitle}>Paiements</h2>
        <p style={styles.pageSubtitle}>{paiements.filter(p => p.statut === "en_attente").length} en attente de validation</p>
      </div>

      {paiements.filter(p => p.statut === "en_attente").length > 0 && (
        <div style={{ ...styles.card, marginBottom: 16, borderLeft: "4px solid #F59E0B", background: "#FFFBEB" }}>
          <h3 style={{ ...styles.cardTitle, color: "#92400E" }}>⚠️ Paiements à valider</h3>
          {paiements.filter(p => p.statut === "en_attente").map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #FDE68A", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{p.client}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{p.type} • {p.operateur} • {p.date}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{fmt(p.montant)} F</div>
                <button onClick={() => onValider(p.id, "validé")} style={{
                  background: "#10B981", color: "#fff", border: "none",
                  borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer"
                }}>✅ Valider</button>
                <button onClick={() => onValider(p.id, "échoué")} style={{
                  background: "#EF4444", color: "#fff", border: "none",
                  borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer"
                }}>❌ Rejeter</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Historique des paiements</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {paiements.map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{p.client}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{p.type} • {p.operateur} • {p.date}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{fmt(p.montant)} F</div>
                <Badge config={STATUT_PAIEMENT[p.statut]} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Conversations() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={styles.pageTitle}>Conversations</h2>
        <p style={styles.pageSubtitle}>Prospects en discussion avec Julie</p>
      </div>

      <div style={{ display: "flex", gap: 16, height: 500 }}>
        {/* Liste */}
        <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
          {MOCK_CONVERSATIONS.map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelected(conv)}
              style={{
                background: selected?.id === conv.id ? "#F0FDF4" : "#fff",
                border: `1px solid ${selected?.id === conv.id ? "#10B981" : "#e2e8f0"}`,
                borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                borderLeft: `4px solid ${PHASE_CONV[conv.phase]?.color}`
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>{conv.client}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{conv.heure}</div>
                  {conv.nonLus > 0 && (
                    <div style={{
                      background: "#25D366", color: "#fff",
                      borderRadius: "50%", width: 18, height: 18,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700
                    }}>{conv.nonLus}</div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.dernier}</div>
              <div style={{ marginTop: 6 }}>
                <span style={{
                  background: `${PHASE_CONV[conv.phase]?.color}20`,
                  color: PHASE_CONV[conv.phase]?.color,
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10
                }}>{PHASE_CONV[conv.phase]?.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Détail */}
        <div style={{ flex: 1, background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {selected ? (
            <>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{selected.client}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{selected.telephone}</div>
                </div>
                <Badge config={{ label: PHASE_CONV[selected.phase]?.label, color: PHASE_CONV[selected.phase]?.color, bg: `${PHASE_CONV[selected.phase]?.color}20` }} />
              </div>
              <div style={{ flex: 1, padding: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", color: "#94a3b8" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                  <div style={{ fontSize: 14 }}>Historique de conversation</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Connectez-vous à WhatsApp pour voir les messages</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👆</div>
                <div style={{ fontSize: 14 }}>Sélectionnez une conversation</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Statistiques({ clients, paiements }) {
  const revenus = paiements.filter(p => p.statut === "validé").reduce((s, p) => s + p.montant, 0);
  const actifs = clients.filter(c => c.statut === "actif").length;
  const charges = 7600;
  const benefice = (actifs * 9900) - charges;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={styles.pageTitle}>Statistiques</h2>
        <p style={styles.pageSubtitle}>Performance d'AI SELLERS AGENCY</p>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon="💰" label="Revenus totaux"    value={`${fmt(revenus)} F`}          color="#10B981" sub="FCFA encaissés" />
        <StatCard icon="📉" label="Charges mensuelles" value={`${fmt(charges)} F`}          color="#EF4444" sub="360dialog + Railway" />
        <StatCard icon="📈" label="Bénéfice net"      value={`${fmt(benefice)} F`}          color="#3B82F6" sub="Ce mois" />
        <StatCard icon="🎯" label="Taux de conversion" value="34%"                          color="#8B5CF6" sub="Prospects → Clients" />
      </div>

      {/* Répartition par ville */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ ...styles.card, flex: 1, minWidth: 200 }}>
          <h3 style={styles.cardTitle}>📍 Clients par ville</h3>
          {["Pointe-Noire", "Dolisie", "Brazzaville"].map(ville => {
            const count = clients.filter(c => c.ville === ville).length;
            const pct = Math.round((count / clients.length) * 100);
            return (
              <div key={ville} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: "#0f172a", fontWeight: 600 }}>{ville}</span>
                  <span style={{ color: "#64748b" }}>{count} clients ({pct}%)</span>
                </div>
                <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "#25D366", borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ ...styles.card, flex: 1, minWidth: 200 }}>
          <h3 style={styles.cardTitle}>💳 Paiements ce mois</h3>
          {[
            { label: "Validés",    count: paiements.filter(p => p.statut === "validé").length,     color: "#10B981" },
            { label: "En attente", count: paiements.filter(p => p.statut === "en_attente").length, color: "#F59E0B" },
            { label: "Échoués",    count: paiements.filter(p => p.statut === "échoué").length,     color: "#EF4444" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 14, color: "#0f172a" }}>{item.label}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  pageTitle:    { fontSize: 22, fontWeight: 900, color: "#0f172a", margin: 0 },
  pageSubtitle: { fontSize: 13, color: "#64748b", margin: "4px 0 0 0" },
  card:         { background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,.06)" },
  cardTitle:    { fontSize: 15, fontWeight: 700, color: "#0f172a", marginTop: 0, marginBottom: 14 },
};

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",     icon: "📊", label: "Dashboard"    },
  { id: "clients",       icon: "👥", label: "Clients"      },
  { id: "paiements",     icon: "💳", label: "Paiements"    },
  { id: "conversations", icon: "💬", label: "Conversations" },
  { id: "stats",         icon: "📈", label: "Statistiques" },
];

// ─── App ──────────────────────────────────────────────────────────────────────
export default function AISellersAgencyDashboard() {
  const [page, setPage]           = useState("dashboard");
  const [clients, setClients]     = useState(MOCK_CLIENTS);
  const [paiements, setPaiements] = useState(MOCK_PAIEMENTS);
  const [notif, setNotif]         = useState(null);

  const showNotif = (msg, color = "#10B981") => {
    setNotif({ msg, color });
    setTimeout(() => setNotif(null), 3000);
  };

  const handleToggle = (id) => {
    setClients(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newStatut = c.statut === "actif" ? "inactif" : "actif";
      showNotif(`${c.nom} → ${newStatut === "actif" ? "Activé ✅" : "Désactivé ⏸"}`, newStatut === "actif" ? "#10B981" : "#EF4444");
      return { ...c, statut: newStatut };
    }));
  };

  const handleValiderPaiement = (id, statut) => {
    setPaiements(prev => prev.map(p => p.id === id ? { ...p, statut } : p));
    showNotif(statut === "validé" ? "Paiement validé ✅" : "Paiement rejeté ❌", statut === "validé" ? "#10B981" : "#EF4444");
  };

  const enAttentePaiement = paiements.filter(p => p.statut === "en_attente").length;
  const convsNonLues = MOCK_CONVERSATIONS.reduce((s, c) => s + c.nonLus, 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Sidebar */}
      <div style={{ width: 220, background: "#0f172a", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "24px 18px 18px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 13, lineHeight: 1.2 }}>AI SELLERS</div>
              <div style={{ color: "#25D366", fontWeight: 900, fontSize: 13, lineHeight: 1.2 }}>AGENCY</div>
            </div>
          </div>
        </div>

        {/* Julie status */}
        <div style={{ padding: "12px 18px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#25D366", boxShadow: "0 0 6px #25D366" }} />
            <span style={{ color: "#94a3b8", fontSize: 12 }}>Julie est active 🌿</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 10px" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", borderRadius: 10, border: "none", cursor: "pointer",
              marginBottom: 2, fontSize: 13, fontWeight: 600, textAlign: "left",
              background: page === item.id ? "#25D366" : "transparent",
              color: page === item.id ? "#fff" : "#64748b",
              transition: "all .15s"
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
              {item.id === "paiements" && enAttentePaiement > 0 && (
                <span style={{ marginLeft: "auto", background: "#F59E0B", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{enAttentePaiement}</span>
              )}
              {item.id === "conversations" && convsNonLues > 0 && (
                <span style={{ marginLeft: "auto", background: "#EF4444", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{convsNonLues}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 18px", borderTop: "1px solid #1e293b" }}>
          <div style={{ color: "#334155", fontSize: 11, textAlign: "center" }}>Quentin Moussoyi · CEO 🇨🇬</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
        {page === "dashboard"     && <Dashboard      clients={clients} paiements={paiements} />}
        {page === "clients"       && <Clients        clients={clients} onToggle={handleToggle} />}
        {page === "paiements"     && <Paiements      paiements={paiements} onValider={handleValiderPaiement} />}
        {page === "conversations" && <Conversations />}
        {page === "stats"         && <Statistiques   clients={clients} paiements={paiements} />}
      </div>

      {/* Toast */}
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
