import { useState, useCallback } from 'react';

type Massnahme = 'austausch' | 'neueinbau' | '';

interface FormData {
  massnahme: Massnahme;
  typenschild: string;
  breite: string;
  hoehe: string;
  dachneigung: string;
  anzahl: number;
  zubehoer: string[];
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  plz: string;
  anmerkungen: string;
  dsgvo: boolean;
}

const ZUBEHOER_OPTIONS = [
  'Velux Verdunkelungsrollo',
  'Velux Insektenschutz',
  'Velux Außenrollladen',
  'Velux Elektrische Steuerung (INTEGRA)',
  'Kein Zubehör',
];

const DACHNEIGUNGEN = ['15–25°', '25–38°', '38–55°', '55–75°'];

const TOTAL_STEPS = 5;

function SwapIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16V4m0 0L3 8m4-4l4 4" />
      <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function PlusWindowIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function TypenschildSVG() {
  return (
    <svg width="110" height="76" viewBox="0 0 110 76" className="shrink-0 text-brand" aria-hidden="true">
      <rect x="8" y="4" width="94" height="68" rx="3" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <rect x="14" y="10" width="82" height="56" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <rect x="16" y="12" width="42" height="14" rx="2" fill="rgb(237 230 215)" stroke="currentColor" strokeWidth="1" opacity="0.9" />
      <text x="37" y="22" textAnchor="middle" fontSize="7.5" fill="currentColor" fontFamily="Outfit,sans-serif" fontWeight="500">GGL 3060</text>
      <line x1="75" y1="55" x2="53" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <circle cx="51" cy="22" r="3" fill="currentColor" opacity="0.6" />
      <text x="77" y="58" fontSize="8" fill="currentColor" fontFamily="Outfit,sans-serif" opacity="0.6">Typenschild</text>
    </svg>
  );
}

function RohbauSVG() {
  return (
    <svg width="170" height="115" viewBox="0 0 170 115" className="text-brand" aria-hidden="true">
      <path d="M 15 100 L 85 12 L 155 100 Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <rect x="50" y="42" width="70" height="55" rx="2" fill="rgb(245 239 226)" stroke="currentColor" strokeWidth="2" strokeDasharray="5,3" opacity="0.9" />
      <line x1="50" y1="108" x2="120" y2="108" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <polygon points="50,105 46,108 50,111" fill="currentColor" opacity="0.7" />
      <polygon points="120,105 124,108 120,111" fill="currentColor" opacity="0.7" />
      <text x="85" y="113" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="Outfit,sans-serif" opacity="0.7" fontWeight="500">Breite</text>
      <line x1="132" y1="42" x2="132" y2="97" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <polygon points="129,42 132,38 135,42" fill="currentColor" opacity="0.7" />
      <polygon points="129,97 132,101 135,97" fill="currentColor" opacity="0.7" />
      <text x="140" y="73" fontSize="9" fill="currentColor" fontFamily="Outfit,sans-serif" opacity="0.7" fontWeight="500">Höhe</text>
    </svg>
  );
}

const inputClass = (hasError?: boolean) =>
  `w-full px-[18px] py-[14px] rounded-[8px] border-[1.5px] bg-white text-brand text-[16px] focus:outline-none focus:border-brand transition-all duration-[140ms] ${
    hasError ? 'border-red-400' : 'border-brand/[0.12]'
  }`;

const labelClass = 'text-[11px] font-medium tracking-[0.06em] uppercase text-brand/50 mb-3 block';

const btnPrimary = 'flex-1 py-4 rounded-full bg-brand text-white font-medium hover:bg-brand-deep transition-colors duration-[220ms] disabled:opacity-50 cursor-pointer';
const btnBack = 'flex-1 py-4 rounded-full border-[1.5px] border-brand/20 text-brand font-medium hover:bg-cream-pale transition-colors duration-[220ms] cursor-pointer';

export default function AngebotForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({
    massnahme: '',
    typenschild: '',
    breite: '',
    hoehe: '',
    dachneigung: '',
    anzahl: 1,
    zubehoer: [],
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    plz: '',
    anmerkungen: '',
    dsgvo: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData | 'dsgvo', string>>>({});

  const update = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const selectMassnahme = (m: 'austausch' | 'neueinbau') => {
    update('massnahme', m);
    setTimeout(() => setStep(2), 300);
  };

  const toggleZubehoer = (item: string) => {
    if (item === 'Kein Zubehör') {
      update('zubehoer', ['Kein Zubehör']);
      return;
    }
    const without = data.zubehoer.filter(z => z !== 'Kein Zubehör');
    update('zubehoer', without.includes(item) ? without.filter(z => z !== item) : [...without, item]);
  };

  const validateStep2 = () => {
    const errors: typeof fieldErrors = {};
    if (!data.breite) errors.breite = 'Bitte Breite angeben';
    if (!data.hoehe) errors.hoehe = 'Bitte Höhe angeben';
    if (data.massnahme === 'neueinbau' && !data.dachneigung) errors.dachneigung = 'Bitte Dachneigung wählen';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep5 = () => {
    const errors: typeof fieldErrors = {};
    if (!data.vorname.trim()) errors.vorname = 'Pflichtfeld';
    if (!data.nachname.trim()) errors.nachname = 'Pflichtfeld';
    if (!data.email.trim() || !data.email.includes('@')) errors.email = 'Gültige E-Mail-Adresse erforderlich';
    if (!data.telefon.trim()) errors.telefon = 'Pflichtfeld';
    if (!data.plz.trim() || data.plz.length < 4) errors.plz = 'Gültige PLZ erforderlich';
    if (!data.dsgvo) errors.dsgvo = 'Bitte Datenschutzerklärung akzeptieren';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep5()) return;
    setLoading(true);
    setServerError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: 'velux_dachfenster',
          metadata: {
            massnahme: data.massnahme,
            ...(data.massnahme === 'austausch' && data.typenschild ? { typenschild: data.typenschild } : {}),
            breite: data.breite,
            hoehe: data.hoehe,
            ...(data.massnahme === 'neueinbau' ? { dachneigung: data.dachneigung } : {}),
            anzahl: data.anzahl,
            zubehoer: data.zubehoer,
          },
          customer: {
            vorname: data.vorname,
            nachname: data.nachname,
            email: data.email,
            telefon: data.telefon,
            plz: data.plz,
            anmerkungen: data.anmerkungen,
          },
        }),
      });
      const result = await res.json();
      if (result.success) setSubmitted(true);
      else setServerError(result.error ?? 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } catch {
      setServerError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-[34px] p-10 text-center shadow-[0_24px_48px_-16px_rgba(24,19,89,0.22)]">
        <div className="w-14 h-14 rounded-full bg-check flex items-center justify-center mx-auto mb-6">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-[24px] font-medium text-brand mb-3">Vielen Dank, {data.vorname}!</h3>
        <p className="text-[16px] text-brand/70 leading-relaxed">
          Wir melden uns innerhalb von 24 Stunden mit Ihrem kostenlosen Velux Angebot.
          Schauen Sie auch in Ihren Spam-Ordner.
        </p>
      </div>
    );
  }

  const ProgressBar = () => (
    <div className="mb-8">
      <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-brand/50 mb-2.5">
        Schritt {step} von {TOTAL_STEPS}
      </p>
      <div className="flex gap-1.5" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-[220ms] ${i < step ? 'bg-brand' : 'bg-cream'}`} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[34px] p-8 lg:p-10 shadow-[0_24px_48px_-16px_rgba(24,19,89,0.22)]">
      <ProgressBar />

      {/* ── Step 1: Massnahme ── */}
      {step === 1 && (
        <div>
          <h3 className="text-[22px] font-medium text-brand mb-6">Was soll gemacht werden?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="group" aria-label="Maßnahme auswählen">
            {([
              { value: 'austausch' as const, label: 'Velux Fenster austauschen', sub: 'Altes Fenster gegen neues Velux-Modell tauschen', Icon: SwapIcon },
              { value: 'neueinbau' as const, label: 'Velux Fenster neu einbauen', sub: 'Neues Dachfenster in bestehende Dachabdeckung', Icon: PlusWindowIcon },
            ]).map(({ value, label, sub, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => selectMassnahme(value)}
                aria-pressed={data.massnahme === value}
                className={`text-left p-6 rounded-[24px] border-2 transition-all duration-[220ms] cursor-pointer ${
                  data.massnahme === value
                    ? 'bg-brand border-brand text-white'
                    : 'bg-cream-pale border-cream hover:border-brand/30 text-brand'
                }`}
              >
                <div className={`mb-3 ${data.massnahme === value ? 'text-white' : 'text-brand'}`}>
                  <Icon />
                </div>
                <div className="text-[15px] font-medium mb-1">{label}</div>
                <div className={`text-[13px] leading-snug ${data.massnahme === value ? 'text-white/70' : 'text-brand/60'}`}>
                  {sub}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2a: Typenschild (Austausch) ── */}
      {step === 2 && data.massnahme === 'austausch' && (
        <div>
          <h3 className="text-[22px] font-medium text-brand mb-2">Typenschild &amp; Maße</h3>
          <p className="text-[14px] text-brand/60 mb-6 leading-snug">
            Das Typenschild befindet sich auf dem inneren Fensterrahmen (z.B. GGL 3060, GGU 4550).
            Kein Typenschild? Maße reichen auch.
          </p>
          <div className="bg-cream-pale rounded-[16px] p-4 flex items-center gap-4">
            <TypenschildSVG />
            <div className="text-[13px] text-brand/70 leading-snug">
              <strong className="text-brand font-medium block mb-0.5">Wo finde ich das Typenschild?</strong>
              Am inneren Fensterrahmen, oben oder seitlich angebracht.
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <div>
              <label className={labelClass}>Velux Typenschild (optional)</label>
              <input type="text" placeholder="z. B. GGL 3060" value={data.typenschild} onChange={e => update('typenschild', e.target.value)} className={inputClass()} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Breite (cm) *</label>
                <input type="number" min={1} placeholder="z. B. 78" value={data.breite} onChange={e => update('breite', e.target.value)} className={inputClass(!!fieldErrors.breite)} />
                {fieldErrors.breite && <p className="mt-1 text-[12px] text-red-500">{fieldErrors.breite}</p>}
              </div>
              <div>
                <label className={labelClass}>Höhe (cm) *</label>
                <input type="number" min={1} placeholder="z. B. 98" value={data.hoehe} onChange={e => update('hoehe', e.target.value)} className={inputClass(!!fieldErrors.hoehe)} />
                {fieldErrors.hoehe && <p className="mt-1 text-[12px] text-red-500">{fieldErrors.hoehe}</p>}
              </div>
            </div>
          </div>
          <div className="mt-7 flex gap-3">
            <button type="button" onClick={() => setStep(1)} className={btnBack}>Zurück</button>
            <button type="button" onClick={() => { if (validateStep2()) setStep(3); }} className={btnPrimary}>Weiter →</button>
          </div>
        </div>
      )}

      {/* ── Step 2b: Rohbauöffnung (Neueinbau) ── */}
      {step === 2 && data.massnahme === 'neueinbau' && (
        <div>
          <h3 className="text-[22px] font-medium text-brand mb-2">Maße der Rohbauöffnung</h3>
          <p className="text-[14px] text-brand/60 mb-6 leading-snug">
            Bitte messen Sie die Rohbauöffnung — also die Aussparung im Dach, nicht das Fenstermaß.
          </p>
          <div className="bg-cream-pale rounded-[16px] p-4 flex justify-center">
            <RohbauSVG />
          </div>
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Breite Rohbau (cm) *</label>
                <input type="number" min={1} placeholder="z. B. 78" value={data.breite} onChange={e => update('breite', e.target.value)} className={inputClass(!!fieldErrors.breite)} />
                {fieldErrors.breite && <p className="mt-1 text-[12px] text-red-500">{fieldErrors.breite}</p>}
              </div>
              <div>
                <label className={labelClass}>Höhe Rohbau (cm) *</label>
                <input type="number" min={1} placeholder="z. B. 118" value={data.hoehe} onChange={e => update('hoehe', e.target.value)} className={inputClass(!!fieldErrors.hoehe)} />
                {fieldErrors.hoehe && <p className="mt-1 text-[12px] text-red-500">{fieldErrors.hoehe}</p>}
              </div>
            </div>
            <div>
              <label className={labelClass}>Dachneigung *</label>
              <select value={data.dachneigung} onChange={e => update('dachneigung', e.target.value)} className={`${inputClass(!!fieldErrors.dachneigung)} appearance-none`}>
                <option value="">Bitte wählen</option>
                {DACHNEIGUNGEN.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {fieldErrors.dachneigung && <p className="mt-1 text-[12px] text-red-500">{fieldErrors.dachneigung}</p>}
            </div>
          </div>
          <div className="mt-7 flex gap-3">
            <button type="button" onClick={() => setStep(1)} className={btnBack}>Zurück</button>
            <button type="button" onClick={() => { if (validateStep2()) setStep(3); }} className={btnPrimary}>Weiter →</button>
          </div>
        </div>
      )}

      {/* ── Step 3: Anzahl ── */}
      {step === 3 && (
        <div>
          <h3 className="text-[22px] font-medium text-brand mb-6">Anzahl der Fenster</h3>
          <p className="text-[14px] text-brand/60 mb-4">Für jedes Fenster erstellen wir ein separates Angebot.</p>
          <div className="flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={() => update('anzahl', Math.max(1, data.anzahl - 1))}
              disabled={data.anzahl <= 1}
              aria-label="Anzahl verringern"
              className="w-14 h-14 rounded-full border-[1.5px] border-brand/20 text-brand text-2xl flex items-center justify-center hover:bg-cream-pale transition-colors disabled:opacity-40 cursor-pointer"
            >−</button>
            <span
              className="text-[64px] font-light text-brand leading-none w-20 text-center tabular-nums"
              aria-live="polite"
              aria-label={`${data.anzahl} Fenster`}
            >{data.anzahl}</span>
            <button
              type="button"
              onClick={() => update('anzahl', Math.min(20, data.anzahl + 1))}
              disabled={data.anzahl >= 20}
              aria-label="Anzahl erhöhen"
              className="w-14 h-14 rounded-full border-[1.5px] border-brand/20 text-brand text-2xl flex items-center justify-center hover:bg-cream-pale transition-colors disabled:opacity-40 cursor-pointer"
            >+</button>
          </div>
          <div className="mt-10 flex gap-3">
            <button type="button" onClick={() => setStep(2)} className={btnBack}>Zurück</button>
            <button type="button" onClick={() => setStep(4)} className={btnPrimary}>Weiter →</button>
          </div>
        </div>
      )}

      {/* ── Step 4: Zubehör ── */}
      {step === 4 && (
        <div>
          <h3 className="text-[22px] font-medium text-brand mb-6">Velux Zubehör gewünscht?</h3>
          <p className="text-[14px] text-brand/60 mb-4">Mehrfachauswahl möglich.</p>
          <div className="space-y-2.5" role="group" aria-label="Zubehör auswählen">
            {ZUBEHOER_OPTIONS.map(item => {
              const sel = data.zubehoer.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleZubehoer(item)}
                  aria-pressed={sel}
                  className={`w-full text-left px-5 py-4 rounded-[16px] border-[1.5px] transition-all duration-[220ms] flex items-center gap-3 cursor-pointer ${
                    sel ? 'bg-brand border-brand text-white' : 'bg-cream-pale border-cream hover:border-brand/30 text-brand'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-[1.5px] shrink-0 flex items-center justify-center transition-colors ${sel ? 'bg-white border-white' : 'border-brand/30'}`}>
                    {sel && (
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <polyline points="1.5 5.5 4.5 8.5 9.5 2.5" stroke="rgb(24,19,89)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[15px] font-medium">{item}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setStep(5)}
            className="mt-4 w-full text-center text-[13px] text-brand/50 hover:text-brand underline underline-offset-4 transition-colors cursor-pointer"
          >
            Weiter ohne Zubehör
          </button>
          <div className="mt-5 flex gap-3">
            <button type="button" onClick={() => setStep(3)} className={btnBack}>Zurück</button>
            <button type="button" onClick={() => setStep(5)} className={btnPrimary}>Weiter →</button>
          </div>
        </div>
      )}

      {/* ── Step 5: Kontaktdaten ── */}
      {step === 5 && (
        <form onSubmit={handleSubmit} noValidate>
          <h3 className="text-[22px] font-medium text-brand mb-6">Ihre Kontaktdaten</h3>
          <p className="text-[14px] text-brand/60 mb-4">Wohin sollen wir Ihr kostenloses Angebot senden?</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Vorname *</label>
                <input type="text" placeholder="Max" value={data.vorname} onChange={e => update('vorname', e.target.value)} className={inputClass(!!fieldErrors.vorname)} />
                {fieldErrors.vorname && <p className="mt-1 text-[12px] text-red-500">{fieldErrors.vorname}</p>}
              </div>
              <div>
                <label className={labelClass}>Nachname *</label>
                <input type="text" placeholder="Mustermann" value={data.nachname} onChange={e => update('nachname', e.target.value)} className={inputClass(!!fieldErrors.nachname)} />
                {fieldErrors.nachname && <p className="mt-1 text-[12px] text-red-500">{fieldErrors.nachname}</p>}
              </div>
            </div>
            <div>
              <label className={labelClass}>E-Mail *</label>
              <input type="email" placeholder="max@beispiel.de" value={data.email} onChange={e => update('email', e.target.value)} className={inputClass(!!fieldErrors.email)} />
              {fieldErrors.email && <p className="mt-1 text-[12px] text-red-500">{fieldErrors.email}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Telefon *</label>
                <input type="tel" placeholder="+49 171 …" value={data.telefon} onChange={e => update('telefon', e.target.value)} className={inputClass(!!fieldErrors.telefon)} />
                {fieldErrors.telefon && <p className="mt-1 text-[12px] text-red-500">{fieldErrors.telefon}</p>}
              </div>
              <div>
                <label className={labelClass}>PLZ *</label>
                <input type="text" placeholder="10115" maxLength={5} value={data.plz} onChange={e => update('plz', e.target.value)} className={inputClass(!!fieldErrors.plz)} />
                {fieldErrors.plz && <p className="mt-1 text-[12px] text-red-500">{fieldErrors.plz}</p>}
              </div>
            </div>
            <div>
              <label className={labelClass}>Anmerkungen (optional)</label>
              <textarea
                placeholder="Besonderheiten, Fragen oder weitere Informationen…"
                rows={3}
                value={data.anmerkungen}
                onChange={e => update('anmerkungen', e.target.value)}
                className={`${inputClass()} resize-none`}
              />
            </div>
            <div className="flex gap-3 items-start pt-1">
              <input
                type="checkbox"
                id="dsgvo-consent"
                checked={data.dsgvo}
                onChange={e => update('dsgvo', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-brand shrink-0 cursor-pointer"
              />
              <label htmlFor="dsgvo-consent" className="text-[13px] text-brand/70 leading-snug cursor-pointer">
                Ich stimme der{' '}
                <a href="/datenschutz" className="underline underline-offset-2 hover:text-brand transition-colors">
                  Datenschutzerklärung
                </a>{' '}
                zu und bin einverstanden, dass meine Daten zur Angebotserstellung verwendet werden. *
              </label>
            </div>
            {fieldErrors.dsgvo && <p className="text-[12px] text-red-500 mt-1">{fieldErrors.dsgvo}</p>}
          </div>
          {serverError && (
            <div className="mt-4 p-4 rounded-[8px] bg-red-50 border border-red-200 text-red-600 text-[14px]">
              {serverError}
            </div>
          )}
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setStep(4)} className={btnBack}>Zurück</button>
            <button type="submit" disabled={loading} className={`${btnPrimary} flex-[2] text-[15px]`}>
              {loading ? 'Wird gesendet…' : 'Kostenloses Angebot anfordern →'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
