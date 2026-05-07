import { useState } from 'react';

const FAQS = [
  {
    q: 'Wie lange dauert ein Velux Dachfenster-Austausch?',
    a: 'Ein Austausch dauert in der Regel etwa 2 Stunden. Unsere zertifizierten Monteure arbeiten sauber und effizient — Sie können Ihr Zuhause während des Einbaus normal nutzen.',
  },
  {
    q: 'Verbaut ihr nur original Velux Fenster?',
    a: 'Ja, ausschließlich Velux Originalprodukte. Keine Billigalternativen, keine Nachbauten. Damit ist auch die volle Velux Herstellergarantie gesichert.',
  },
  {
    q: 'Wie erhalte ich mein Angebot?',
    a: 'Innerhalb von 24 Stunden nach Ihrer Anfrage senden wir Ihnen ein verbindliches Festpreisangebot per E-Mail zu. Kein Vor-Ort-Termin erforderlich.',
  },
  {
    q: 'Wo finde ich das Velux Typenschild?',
    a: 'Das Typenschild befindet sich auf dem inneren Fensterrahmen, meist oben oder seitlich. Es beginnt mit einer Buchstabenkombination wie GGL, GGU, GPU oder VKU, gefolgt von der Größenbezeichnung (z. B. GGL 3060).',
  },
  {
    q: 'Führt ihr die Montage selbst durch?',
    a: 'Wir arbeiten mit einem Netzwerk zertifizierter Velux Partner-Handwerker zusammen. Je nach Region übernehmen eigene Monteure oder geprüfte Fachbetriebe den Einbau — immer nach Velux Montagestandard.',
  },
  {
    q: 'Welche Velux Fenstertypen verbaut ihr?',
    a: 'Wir verbauen alle gängigen Velux Typen: Schwingfenster (GGL/GGU), Klappschwingfenster (VKU/VFA), Dachausstiege (GXU) sowie Solar- und elektrisch betriebene Varianten der INTEGRA Linie.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="bg-cream-pale rounded-[24px] overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full text-left px-7 py-6 flex items-center justify-between gap-6 text-brand hover:bg-cream transition-colors duration-[140ms]"
            >
              <span className="text-[17px] font-medium leading-snug">{faq.q}</span>
              <span
                className={`w-8 h-8 rounded-full border-[1.5px] border-brand/20 flex items-center justify-center shrink-0 transition-transform duration-[220ms] ${isOpen ? 'rotate-45' : ''}`}
                aria-hidden="true"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="7" y1="2" x2="7" y2="12" />
                  <line x1="2" y1="7" x2="12" y2="7" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="px-7 pb-6">
                <p className="text-[16px] text-brand/70 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
