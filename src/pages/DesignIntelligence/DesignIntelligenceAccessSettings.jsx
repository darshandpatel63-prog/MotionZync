import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

const DEFAULT_POLICY = {
  shareUltraWithPremium: true,
  festivalOffer: { enabled: false, startDate: '', startTime: '', endDate: '', endTime: '', timezone: 'Asia/Kolkata' },
}

function policyFrom(input) {
  return {
    shareUltraWithPremium: input?.shareUltraWithPremium !== false,
    festivalOffer: { ...DEFAULT_POLICY.festivalOffer, ...(input?.festivalOffer || {}) },
  }
}

export default function DesignIntelligenceAccessSettings() {
  const { user } = useAuth()
  const [policy, setPolicy] = useState(DEFAULT_POLICY)
  const [serverState, setServerState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const token = await user.getIdToken()
      const response = await fetch('/api/admin-billing', { headers: { Authorization: 'Bearer ' + token } })
      const json = await response.json().catch(() => null)
      if (!response.ok) throw new Error(json?.error || 'Unable to load Design Intelligence access settings.')
      setPolicy(policyFrom(json?.accessPolicy))
      setServerState(json?.accessPolicyState || null)
    } catch (err) {
      setError(err?.message || 'Unable to load Design Intelligence access settings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [user])

  const updateOffer = (key, value) => {
    setPolicy(current => ({
      ...current,
      festivalOffer: { ...current.festivalOffer, [key]: value },
    }))
  }

  const save = async () => {
    if (!user) return
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const token = await user.getIdToken()
      const response = await fetch('/api/admin-billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ action: 'saveDesignIntelligenceAccessPolicy', accessPolicy: policy }),
      })
      const json = await response.json().catch(() => null)
      if (!response.ok) throw new Error(json?.error || 'Unable to save Design Intelligence access settings.')
      setPolicy(policyFrom(json.accessPolicy))
      setServerState(json.accessPolicyState || null)
      setNotice('Settings saved on the server. Access changes apply to new knowledge requests.')
    } catch (err) {
      setError(err?.message || 'Unable to save Design Intelligence access settings.')
    } finally {
      setSaving(false)
    }
  }

  return <section className="di-surface di-admin-access-settings" aria-labelledby="di-access-settings-title">
    <span className="di-kicker">DESIGN INTELLIGENCE · ACCESS RULES</span>
    <h2 id="di-access-settings-title">Premium / Ultra Premium+ content settings</h2>
    <p>These options control visibility of design-knowledge records only. They never grant Ultra Premium+ subscription status, developer API keys or API-only special effects.</p>

    {loading ? <div className="di-note" role="status">Loading server-authoritative settings…</div> : <>
      <label className="di-access-setting-row">
        <input
          type="checkbox"
          checked={policy.shareUltraWithPremium}
          onChange={event => setPolicy(current => ({ ...current, shareUltraWithPremium: event.target.checked }))}
        />
        <span>
          <strong>Allow logged-in Premium accounts to view Ultra Premium+ designs</strong>
          <small>ON by default, as requested. Signed-in accounts can browse Ultra design records, while their account tier and API permissions remain unchanged.</small>
        </span>
      </label>

      <div className="di-access-offer">
        <label className="di-access-setting-row">
          <input
            type="checkbox"
            checked={policy.festivalOffer.enabled}
            onChange={event => updateOffer('enabled', event.target.checked)}
          />
          <span>
            <strong>Schedule a time-limited festival offer for Ultra designs</strong>
            <small>This temporarily enables access for signed-in accounts during the saved start/end window, even when the main sharing switch is OFF. Guest access stays Free.</small>
          </span>
        </label>

        <div className="di-access-date-grid">
          <div><label className="di-label" htmlFor="di-offer-start-date">Start date (India)</label><input id="di-offer-start-date" className="di-input" type="date" value={policy.festivalOffer.startDate} onChange={event => updateOffer('startDate', event.target.value)} /></div>
          <div><label className="di-label" htmlFor="di-offer-start-time">Start time (IST)</label><input id="di-offer-start-time" className="di-input" type="time" value={policy.festivalOffer.startTime} onChange={event => updateOffer('startTime', event.target.value)} /></div>
          <div><label className="di-label" htmlFor="di-offer-end-date">End date (India)</label><input id="di-offer-end-date" className="di-input" type="date" value={policy.festivalOffer.endDate} onChange={event => updateOffer('endDate', event.target.value)} /></div>
          <div><label className="di-label" htmlFor="di-offer-end-time">End time (IST)</label><input id="di-offer-end-time" className="di-input" type="time" value={policy.festivalOffer.endTime} onChange={event => updateOffer('endTime', event.target.value)} /></div>
        </div>
        <p className="di-muted">Times are interpreted by the server as Asia/Kolkata (IST). The offer ends automatically at the exact end date/time. End time must be later than start time.</p>
        {serverState?.festivalOfferActive
          ? <div className="di-access-state active" role="status">Festival offer is ACTIVE now (server time).</div>
          : policy.festivalOffer.enabled
            ? <div className="di-access-state" role="status">Festival offer is scheduled or expired; current server status will refresh after save/reload.</div>
            : <div className="di-access-state" role="status">Festival offer is OFF.</div>}
      </div>

      {error && <div className="di-warning" role="alert">{error}</div>}
      {notice && <div className="di-note" role="status">{notice}</div>}
      <div className="di-actions">
        <button type="button" className="di-btn di-btn-primary" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save access settings'}</button>
        <button type="button" className="di-btn di-btn-secondary" disabled={saving} onClick={load}>Reload server settings</button>
      </div>
    </>}
  </section>
}
