import { useState } from 'react';

type Step = 1 | 2 | 3;

interface FormData {
  service: string;
  area: string;
  name: string;
  phone: string;
  email: string;
}

const SERVICES = [
  'Dachsanierung',
  'Dachreparatur',
  'Neueindeckung',
  'Dachrinne',
  'Sonstiges',
];

export default function AngebotForm() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<FormData>({
    service: '',
    area: '',
    name: '',
    phone: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-center shadow-md">
        <p className="text-2xl font-semibold text-green-700">Vielen Dank, {data.name}!</p>
        <p className="mt-2 text-gray-600">Wir melden uns in Kürze bei Ihnen.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-lg"
    >
      <div className="mb-6 flex justify-between text-sm font-medium text-gray-400">
        {([1, 2, 3] as Step[]).map((s) => (
          <span
            key={s}
            className={`rounded-full px-3 py-1 ${step === s ? 'bg-amber-500 text-white' : 'bg-gray-100'}`}
          >
            Schritt {s}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">Welche Leistung benötigen Sie?</h3>
          <div className="space-y-2">
            {SERVICES.map((s) => (
              <label key={s} className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="service"
                  value={s}
                  checked={data.service === s}
                  onChange={(e) => update('service', e.target.value)}
                  className="accent-amber-500"
                />
                {s}
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={!data.service}
            onClick={() => setStep(2)}
            className="mt-6 w-full rounded-xl bg-amber-500 py-3 font-semibold text-white disabled:opacity-40 hover:bg-amber-600"
          >
            Weiter
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">Ungefähre Dachfläche (m²)</h3>
          <input
            type="number"
            min={1}
            placeholder="z. B. 120"
            value={data.area}
            onChange={(e) => update('area', e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-xl border py-3 font-semibold hover:bg-gray-50">
              Zurück
            </button>
            <button
              type="button"
              disabled={!data.area}
              onClick={() => setStep(3)}
              className="flex-1 rounded-xl bg-amber-500 py-3 font-semibold text-white disabled:opacity-40 hover:bg-amber-600"
            >
              Weiter
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">Ihre Kontaktdaten</h3>
          <div className="space-y-3">
            {(
              [
                { field: 'name', label: 'Name', type: 'text', placeholder: 'Max Mustermann' },
                { field: 'phone', label: 'Telefon', type: 'tel', placeholder: '+49 171 …' },
                { field: 'email', label: 'E-Mail', type: 'email', placeholder: 'max@beispiel.de' },
              ] as { field: keyof FormData; label: string; type: string; placeholder: string }[]
            ).map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label className="mb-1 block text-sm font-medium text-gray-600">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={data[field]}
                  onChange={(e) => update(field, e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-xl border py-3 font-semibold hover:bg-gray-50">
              Zurück
            </button>
            <button
              type="submit"
              disabled={!data.name || !data.phone || !data.email}
              className="flex-1 rounded-xl bg-amber-500 py-3 font-semibold text-white disabled:opacity-40 hover:bg-amber-600"
            >
              Angebot anfordern
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
