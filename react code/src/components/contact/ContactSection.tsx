import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { SITE } from '../../data/site';

const WEB3FORMS_ACCESS_KEY = SITE.web3FormsAccessKey;

const SOCIAL = [
  {
    label: 'GitHub',
    href: SITE.social.github,
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.69.08-.69 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.96 10.96 0 015.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: SITE.social.linkedin,
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: SITE.social.instagram,
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('access_key', WEB3FORMS_ACCESS_KEY);

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(125,211,252,0.06) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionHeading
          title="Have an idea"
          accent="worth building?"
          subtitle="If you want a production-minded developer who can also build a polished interface, let&apos;s talk."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT: contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 card-forest rounded-2xl p-7 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-sky-300/10 blur-3xl" />
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-4">Contact</div>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-[-0.04em]">
                Let&apos;s build something sharp.
              </h3>
              <p className="text-slate-300/72 text-base leading-relaxed mb-7 max-w-md">
                Reach out with a product idea, a frontend challenge, or a full-stack build. I&apos;ll usually reply quickly and directly.
              </p>

              <div className="space-y-4 mb-7">
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-300/10 group-hover:border-sky-300/30 transition-all">
                    <svg className="w-5 h-5 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-400 text-xs uppercase tracking-wider">Email</div>
                    <div className="text-white text-sm font-medium group-hover:text-sky-200 transition-colors break-all">
                      {SITE.email}
                    </div>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-500/30 border border-leaf/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider">Location</div>
                    <div className="text-white text-sm font-medium">India · Remote-friendly</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="text-slate-400 text-xs uppercase tracking-wider mb-3">Find me on</div>
              <div className="flex gap-3">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:border-sky-300/40 hover:bg-sky-300/10 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:-translate-y-1"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="lg:col-span-7 card-forest rounded-2xl p-7 space-y-4"
          >
            <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-leaf-light/65 text-xs uppercase tracking-wider mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  required
                  className="w-full px-4 py-3 rounded-xl input-forest"
                />
              </div>
              <div>
                <label className="block text-leaf-light/65 text-xs uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl input-forest"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-leaf-light/65 text-xs uppercase tracking-wider mb-2">
                  Phone <span className="opacity-50">(optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 ..."
                  className="w-full px-4 py-3 rounded-xl input-forest"
                />
              </div>
              <div>
                <label className="block text-leaf-light/65 text-xs uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Project inquiry"
                  className="w-full px-4 py-3 rounded-xl input-forest"
                />
              </div>
            </div>

            <div>
              <label className="block text-leaf-light/65 text-xs uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Tell me about your project..."
                rows={5}
                required
                className="w-full px-4 py-3 rounded-xl input-forest resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="px-7 py-3 rounded-xl btn-forest font-semibold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sky-200 text-sm flex items-center gap-2"
                >
                  <span>✓</span> Message sent! I&apos;ll be in touch.
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-300 text-sm"
                >
                  Something went wrong. Try emailing me directly.
                </motion.p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
