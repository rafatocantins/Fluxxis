// Fluxxis ConsentManager — Disclaimer + Cookie + User Profile Dashboard

import React, { useState, useEffect } from 'react'

const STORAGE_KEY = 'fluxxis_consent'
const COOKIE_NAME = 'fluxxis_consent'

export interface ConsentConfig {
  clientName: string          // Nome do site/app (ex: "FLUXXIS Demo")
  privacyUrl?: string         // Link para politica de privacidade
  onConsentChange?: (given: boolean) => void
}

type ConsentState = 'pending' | 'accepted' | 'rejected' | 'custom'

function getStoredConsent(): ConsentState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'accepted' || stored === 'rejected' || stored === 'custom') {
      return stored
    }
  } catch { /* */ }
  return 'pending'
}

function setStoredConsent(state: ConsentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, state)
  } catch { /* */ }
}

function setConsentCookie(state: ConsentState): void {
  const maxAge = state === 'accepted' ? 365 * 24 * 60 * 60 : 0
  document.cookie = `${COOKIE_NAME}=${state};path=/;max-age=${maxAge};SameSite=Lax`
}

export const ConsentManager: React.FC<ConsentConfig> = ({
  clientName,
  privacyUrl,
  onConsentChange
}) => {
  const [state, setState] = useState<ConsentState>(getStoredConsent)
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    if (state !== 'pending') {
      setConsentCookie(state)
      onConsentChange?.(state === 'accepted')
    }
  }, [state, onConsentChange])

  const accept = () => {
    setStoredConsent('accepted')
    setState('accepted')
  }

  const reject = () => {
    setStoredConsent('rejected')
    setState('rejected')
  }

  const customize = () => {
    setStoredConsent('custom')
    setState('custom')
    setShowDashboard(true)
  }

  // ── Pending: Disclaimer ──
  if (state === 'pending') {
    return (
      <div style={styles.overlay}>
        <div style={styles.banner}>
          <div style={styles.icon}>🔮</div>
          <h3 style={styles.title}>{clientName} Experience</h3>
          <p style={styles.text}>
            Este site adapta a interface ao teu comportamento para te dar a
            melhor experiencia possivel.
          </p>
          <div style={styles.detailList}>
            <span style={styles.detailItem}>✅ Páginas visitadas e tempo de leitura</span>
            <span style={styles.detailItem}>✅ Cliques e interacoes</span>
            <span style={styles.detailItem}>✅ Preferencias de navegacao</span>
            <span style={styles.detailItem}>🔒 NUNCA recolhemos dados pessoais sem conta</span>
          </div>
          <div style={styles.buttons}>
            <button style={styles.secondaryBtn} onClick={customize}>
              ⚙️ Personalizar
            </button>
            <button style={styles.primaryBtn} onClick={accept}>
              ✅ Aceitar Tudo
            </button>
          </div>
          <p style={styles.finePrint}>
            Ao aceitares, podes ver e gerir os teus dados no icone ⚙️ no canto
            inferior direito. Consulta a nossa{' '}
            {privacyUrl ? (
              <a href={privacyUrl} style={styles.link}>politica de privacidade</a>
            ) : (
              'politica de privacidade'
            )}.
          </p>
        </div>
      </div>
    )
  }

  // ── Floating gear icon (always visible after consent) ──
  return (
    <>
      {/* Floating button */}
      <button
        style={styles.floatingBtn}
        onClick={() => setShowDashboard(!showDashboard)}
        aria-label="Gerir preferencias de privacidade"
        title="Gerir dados Fluxxis"
      >
        ⚙️
      </button>

      {/* Dashboard modal */}
      {showDashboard && (
        <div style={styles.overlay} onClick={() => setShowDashboard(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="fluxxis-dashboard-title" style={styles.dashboard} onClick={e => e.stopPropagation()}>
            <div style={styles.dashboardHeader}>
              <h3 id="fluxxis-dashboard-title" style={{ margin: 0 }}>🔮 Fluxxis — Os Teus Dados</h3>
              <button
                style={styles.closeBtn}
                onClick={() => setShowDashboard(false)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>📊 Perfil Inferido</h4>
              <div style={styles.profileBox}>
                <p style={styles.profileText} id="fluxxis-profile-text">
                  A processar... (carrega a pagina e interage para gerar o perfil)
                </p>
                <button
                  style={styles.smallBtn}
                  onClick={() => {
                    // TODO: fetch /api/fluxxis/profile
                    alert('Brevemente: exporta o teu perfil em JSON ou texto.')
                  }}
                >
                  📤 Exportar
                </button>
              </div>
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>🎯 Sinais Recolhidos</h4>
              <div style={styles.signalList} id="fluxxis-signals-count">
                <span style={styles.signalItem}>📄 Page views</span>
                <span style={styles.signalItem}>📜 Scroll depth</span>
                <span style={styles.signalItem}>👆 Cliques</span>
                <span style={styles.signalItem}>⏱️ Tempo de leitura</span>
                <span style={styles.signalItem}>🖱️ Hover (1s+)</span>
                <span style={styles.signalItem}>🚪 Exit intent</span>
              </div>
            </div>

            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>🔐 Controlo</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  style={{ ...styles.smallBtn, background: '#B3261E', color: '#fff' }}
                  onClick={() => {
                    if (confirm('Apagar todos os dados de navegacao? Esta acao e irreversivel.')) {
                      // TODO: DELETE /api/fluxxis/profile
                      setStoredConsent('rejected')
                      setState('rejected')
                      setShowDashboard(false)
                    }
                  }}
                >
                  🗑️ Apagar Todos os Dados
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Styles ──

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
  },
  banner: {
    background: '#14141f',
    border: '1px solid #1FA89E',
    borderRadius: '16px',
    padding: 'clamp(20px, 4vw, 32px)',
    maxWidth: '520px',
    width: '100%',
    color: '#e4e4ed',
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 8px 40px rgba(46,230,214,0.15)',
  },
  icon: { fontSize: '2rem', textAlign: 'center', marginBottom: '8px' },
  title: {
    fontFamily: 'Sora, sans-serif',
    fontSize: '1.2rem',
    margin: '0 0 8px',
    textAlign: 'center',
    color: '#1FA89E',
  },
  text: {
    fontSize: '0.9rem',
    color: '#9d9db5',
    textAlign: 'center',
    marginBottom: '16px',
    lineHeight: 1.6,
  },
  detailList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px',
    padding: '0 8px',
  },
  detailItem: {
    fontSize: '0.82rem',
    color: '#8b8ba0',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    padding: '10px 24px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #5A3FD4, #1FA89E)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'Sora, sans-serif',
  },
  secondaryBtn: {
    padding: '10px 24px',
    borderRadius: '12px',
    border: '1px solid #1FA89E',
    background: 'transparent',
    color: '#1FA89E',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'Sora, sans-serif',
  },
  finePrint: {
    fontSize: '0.7rem',
    color: '#8b8ba0',
    textAlign: 'center',
    marginTop: '16px',
    lineHeight: 1.5,
  },
  link: { color: '#1FA89E', textDecoration: 'underline' },
  floatingBtn: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '1px solid #1FA89E',
    background: '#14141f',
    color: '#1FA89E',
    fontSize: '1.2rem',
    cursor: 'pointer',
    zIndex: 9998,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 12px rgba(46,230,214,0.2)',
  },
  dashboard: {
    background: '#14141f',
    border: '1px solid #1FA89E',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '560px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
    color: '#e4e4ed',
    fontFamily: 'Inter, sans-serif',
  },
  dashboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    fontFamily: 'Sora, sans-serif',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#9d9db5',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  section: { marginBottom: '20px' },
  sectionTitle: {
    fontFamily: 'Sora, sans-serif',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#6D4FE0',
    marginBottom: '8px',
  },
  profileBox: {
    background: '#0a0a0f',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #1e1e2e',
  },
  profileText: {
    fontSize: '0.85rem',
    color: '#9d9db5',
    lineHeight: 1.6,
    margin: '0 0 8px',
  },
  smallBtn: {
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid #1e1e2e',
    background: '#1e1e2e',
    color: '#e4e4ed',
    fontWeight: 600,
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  signalList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  signalItem: {
    fontSize: '0.82rem',
    color: '#8b8ba0',
  },
}
