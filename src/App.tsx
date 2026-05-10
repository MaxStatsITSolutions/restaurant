import { useState, useEffect, useRef, type FormEvent } from 'react'

/* ------------------------------------------------------------------ *
 * Helpers                                                             *
 * ------------------------------------------------------------------ */
const EUR_TO_BGN = 1.95583
const fmtPrice = (eur: number) => {
  const e = eur.toFixed(2)
  const b = (eur * EUR_TO_BGN).toFixed(2)
  return { eur: `€${e}`, bgn: `${b} лв.` }
}

function Price({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const { eur, bgn } = fmtPrice(value)
  const sizes = {
    sm:  { eur: 'text-base', bgn: 'text-[11px]' },
    md:  { eur: 'text-lg',   bgn: 'text-xs' },
    lg:  { eur: 'text-2xl',  bgn: 'text-sm' },
  }
  return (
    <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
      <span className={`font-display font-medium gold-text ${sizes[size].eur}`}>{eur}</span>
      <span className={`text-ink-faint ${sizes[size].bgn} font-mono tracking-tight`}>/ {bgn}</span>
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Scroll-reveal wrapper (IntersectionObserver)                        *
 * ------------------------------------------------------------------ */
function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.15,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'fade' | 'left' | 'right' | 'scale'
  threshold?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          obs.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`reveal reveal-${direction}${revealed ? ' revealed' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Reliable Unsplash imagery (matched to descriptions)                 *
 * ------------------------------------------------------------------ */
const IMG = {
  hero:           'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1800&q=80',
  aboutA:         'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1100&q=80',
  pastaTruffle:   'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1100&q=80',
  shrimpGarlic:   'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1100&q=80',
  seafoodRisotto: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1100&q=80',
  bruschetta:     'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=1100&q=80',
  burrata:        'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=1100&q=80',
  tiramisu:       'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1100&q=80',
  galInterior:    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1100&q=80',
  galTerrace:     'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1300&q=80',
  galTable:       'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80',
  galLemonade:    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80',
  galFoodDetail:  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80',
  galCoffee:      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  galDessert:     'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
  galEvening:     'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1300&q=80',
}

/* ------------------------------------------------------------------ *
 * Image with graceful placeholder fallback                            *
 * ------------------------------------------------------------------ */
function Img({ src, alt, className = '', eager = false, label }: {
  src: string; alt: string; className?: string; eager?: boolean; label?: string
}) {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <div className={`placeholder-stripes flex items-center justify-center ${className}`}>
        <span className="font-mono text-[11px] tracking-widest uppercase text-ink-faint">
          {label || 'image'}
        </span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      className={className}
      onError={() => setErr(true)}
    />
  )
}

/* ------------------------------------------------------------------ *
 * Logo mark                                                           *
 * ------------------------------------------------------------------ */
function Logo({ size = 40 }: { size?: number }) {
  return (
    <a href="#top" className="flex items-center gap-3 group">
      <span
        className="relative inline-flex items-center justify-center rounded-full ring-soft"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 40 40" width={size} height={size} className="text-gold">
          <defs>
            <linearGradient id="lg-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0DFAE" />
              <stop offset="100%" stopColor="#A98A45" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="18" fill="none" stroke="url(#lg-grad)" strokeWidth="0.8" opacity="0.7" />
          <path d="M14 22 a8 8 0 1 0 0-8 a6 6 0 1 1 0 8 z" fill="url(#lg-grad)" />
          <circle cx="27" cy="14" r="1" fill="#7A8A5C" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block font-display text-[22px] tracking-wide text-ink">Luna Verde</span>
        <span className="block font-mono text-[9px] uppercase tracking-[0.32em] text-ink-faint mt-1">
          Mediterranean · Plovdiv
        </span>
      </span>
    </a>
  )
}

/* ------------------------------------------------------------------ *
 * Sticky Nav + Mobile drawer                                          *
 * ------------------------------------------------------------------ */
const NAV_LINKS: [string, string][] = [
  ['Начало',     '#top'],
  ['За нас',     '#about'],
  ['Меню',       '#menu'],
  ['Галерия',    '#gallery'],
  ['Резервация', '#reservation'],
  ['Контакти',   '#contact'],
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? 'glass-nav' : 'glass-nav-top'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10 h-[72px] flex items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-8" aria-label="Главна навигация">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="nav-link text-sm font-medium text-ink-muted hover:text-ink transition-colors py-2"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#reservation"
            className="hidden sm:inline-flex btn-primary rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide"
          >
            Резервирай
          </a>
          <button
            aria-label={open ? 'Затвори менюто' : 'Отвори менюто'}
            onClick={() => setOpen(o => !o)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-line text-ink hover:bg-bg-elev transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path
                className="hamburger-line"
                d="M4 8 H20"
                style={open ? { transform: 'rotate(45deg)' } : undefined}
              />
              <path
                className="hamburger-line"
                d="M4 16 H20"
                style={open ? { transform: 'rotate(-45deg)' } : undefined}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer backdrop */}
      <div
        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        className="lg:hidden drawer fixed top-0 right-0 bottom-0 w-[86%] max-w-[360px] bg-bg-soft z-50 shadow-card border-l border-line"
        data-open={open}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-line">
          <span className="font-display text-2xl text-ink">Меню</span>
          <button
            aria-label="Затвори менюто"
            onClick={() => setOpen(false)}
            className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M6 6 L18 18" /><path d="M18 6 L6 18" />
            </svg>
          </button>
        </div>
        <nav className="px-6 py-8 flex flex-col gap-1" aria-label="Мобилна навигация">
          {NAV_LINKS.map(([label, href], i) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="drawer-link flex items-center justify-between py-4 border-b border-line/60 text-ink hover:text-gold"
            >
              <span className="font-display text-2xl">{label}</span>
              <span className="font-mono text-[11px] text-ink-faint">0{i + 1}</span>
            </a>
          ))}
          <a
            href="#reservation"
            onClick={() => setOpen(false)}
            className="drawer-link btn-primary rounded-full px-5 py-3 text-center text-sm font-semibold mt-8"
          >
            Резервирай маса
          </a>
          <div className="drawer-link mt-10 text-xs text-ink-faint leading-relaxed">
            <p>ул. Княз Александър I 24</p>
            <p>Пловдив, България</p>
            <p className="mt-2 text-gold">+359 88 123 4567</p>
          </div>
        </nav>
      </aside>
    </header>
  )
}

/* ------------------------------------------------------------------ *
 * Hero — cinematic entrance                                           *
 * ------------------------------------------------------------------ */
function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <Img
        src={IMG.hero}
        alt="Кинематографичен план на средиземноморско ястие с пресни подправки"
        eager
        className="hero-image absolute inset-0 w-full h-full object-cover"
        label="hero"
      />
      <div className="absolute inset-0 hero-vignette" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/40 sm:from-black/55 sm:via-transparent" />

      <div className="relative z-content max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10 pt-[120px] pb-16 min-h-[100svh] flex flex-col">
        {/* Top badges */}
        <div className="hero-enter flex flex-wrap items-center gap-3 sm:gap-5 text-xs" style={{ animationDelay: '0.2s' }}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-black/30 text-ink-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-olive animate-pulse" />
            Отворено сега · до 23:00
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-black/30 text-ink-muted">
            <span className="star">★</span> 4.9 / 5 · 312 отзива
          </span>
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-black/30 text-ink-muted">
            Пловдив · Капана
          </span>
        </div>

        {/* Headline */}
        <div className="mt-auto pt-16 max-w-3xl">
          <p className="hero-enter font-mono text-[11px] sm:text-xs uppercase tracking-[0.42em] text-gold-100 mb-5" style={{ animationDelay: '0.4s' }}>
            Est. 2019 · Mediterranean kitchen
          </p>
          <h1 className="hero-enter font-display text-[54px] leading-[0.95] sm:text-[72px] md:text-[96px] lg:text-[112px] tracking-tight" style={{ animationDelay: '0.55s' }}>
            <span className="block text-ink">Luna</span>
            <span className="block italic gold-text -mt-2">Verde</span>
          </h1>
          <p className="hero-enter font-display italic text-2xl sm:text-3xl md:text-4xl text-ink-muted mt-6 max-w-[640px] leading-snug" style={{ animationDelay: '0.7s' }}>
            Средиземноморски вкус в&nbsp;сърцето на&nbsp;Пловдив.
          </p>
          <p className="hero-enter text-ink-muted mt-5 max-w-[560px] text-base sm:text-lg leading-relaxed" style={{ animationDelay: '0.85s' }}>
            Свежи сезонни продукти, бавно приготвени ястия и&nbsp;уютна атмосфера —
            създадени за&nbsp;вечери, в&nbsp;които всеки детайл има значение.
          </p>

          <div className="hero-enter mt-9 flex flex-wrap gap-3 sm:gap-4" style={{ animationDelay: '1.0s' }}>
            <a href="#menu" className="btn-primary rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide">
              Разгледай менюто
            </a>
            <a href="#reservation" className="btn-ghost rounded-full px-6 py-3.5 text-sm font-medium tracking-wide">
              Резервирай маса
            </a>
          </div>
        </div>

        {/* Bottom meta strip */}
        <div className="hero-enter mt-14 grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-6 border-t border-line pt-6" style={{ animationDelay: '1.2s' }}>
          {([
            ['Работно време', 'Пон–Пет · 11:00 – 23:00'],
            ['Уикенди',       'Съб–Нед · 12:00 – 00:00'],
            ['Локация',       'ул. Княз Александър I 24'],
            ['Резервации',    '+359 88 123 4567'],
          ] as const).map(([k, v]) => (
            <div key={k}>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">{k}</div>
              <div className="text-sm sm:text-[15px] text-ink mt-1.5">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * About                                                               *
 * ------------------------------------------------------------------ */
function About() {
  return (
    <section id="about" className="relative bg-soft-warm py-24 sm:py-32 overflow-hidden">
      {/* Ambient orbs */}
      <div className="ambient-orb ambient-orb-gold w-[400px] h-[400px] -top-20 -right-32" />
      <div className="ambient-orb ambient-orb-olive w-[300px] h-[300px] -bottom-16 -left-24" />

      <div className="relative z-content max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Images */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Reveal direction="scale">
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3 aspect-[4/5] overflow-hidden rounded-2xl ring-soft">
                  <Img
                    src={IMG.aboutA}
                    alt="Уютен интериор на ресторант с топло осветление и елегантни маси"
                    className="w-full h-full object-cover"
                    label="interior"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-4 pt-10">
                  <div className="aspect-square overflow-hidden rounded-2xl ring-soft">
                    <Img
                      src={IMG.galFoodDetail}
                      alt="Близък план на средиземноморско ястие с пресни подправки"
                      className="w-full h-full object-cover"
                      label="food detail"
                    />
                  </div>
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl ring-soft">
                    <Img
                      src={IMG.galTable}
                      alt="Елегантно подредена маса с домашна лимонада"
                      className="w-full h-full object-cover"
                      label="table"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Text */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-gold mb-5">
                01 — За нас
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-[64px] leading-[1.02] text-ink">
                Кухня, в&nbsp;която сезонът <em className="italic gold-text">диктува</em> менюто.
              </h2>
              <div className="gold-rule-reveal h-px w-32 my-8" />
            </Reveal>
            <Reveal delay={150}>
              <div className="space-y-5 text-ink-muted text-[17px] leading-[1.75] max-w-[58ch]">
                <p>
                  Luna Verde е&nbsp;вдъхновена от&nbsp;спокойствието на&nbsp;средиземноморските
                  крайбрежия и&nbsp;щедростта на&nbsp;българската земя. Работим с&nbsp;местни
                  фермери и&nbsp;подбираме всеки продукт ръчно — от&nbsp;домати, узрели на&nbsp;слънце,
                  до прясна риба, която достига кухнята още същия ден.
                </p>
                <p>
                  Атмосферата е&nbsp;тиха и&nbsp;топла. Подходяща за&nbsp;вечери на&nbsp;двама,
                  семейни събирания, бизнес срещи и&nbsp;поводи, които искате да&nbsp;запомните.
                  Нашите гости получават спокойствие, време и&nbsp;грижа — изкуството да&nbsp;се&nbsp;храниш
                  без бързане.
                </p>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl">
                {([
                  ['Сезонни продукти', 'от местни ферми'],
                  ['Ръчна селекция',   'от шеф готвач'],
                  ['Уютна атмосфера',  'за всеки повод'],
                ] as const).map(([k, v]) => (
                  <div key={k} className="border-t border-line pt-4">
                    <div className="font-display text-2xl text-ink leading-tight">{k}</div>
                    <div className="text-sm text-ink-faint mt-1">{v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Signature dishes                                                    *
 * ------------------------------------------------------------------ */
const SIGNATURE = [
  { name: 'Паста с трюфел и пармезан',          desc: 'Кремообразна паста с тънък трюфелов аромат и зрял пармезан.', price: 17.5, badge: "Chef's choice", img: IMG.pastaTruffle, alt: 'Чиния с прясна паста, гарнирана с трюфел и пармезан' },
  { name: 'Скариди с чесън, лимон и магданоз',  desc: 'Сочни скариди в лек сос от чесън, лимон и пресен магданоз.', price: 16.0, badge: 'Популярно',    img: IMG.shrimpGarlic,  alt: 'Скариди в лек сос с чесън и лимон, поднесени елегантно' },
  { name: 'Ризото с морски дарове',              desc: 'Кремообразно ризото със свежи морски дарове и шафран.',      price: 19.0, badge: 'Сезонно',      img: IMG.seafoodRisotto, alt: 'Кремообразно ризото с морски дарове в дълбока чиния' },
  { name: 'Брускети с домати и босилек',         desc: 'Хрупкав хляб, узрели домати, пресен босилек и зехтин.',      price: 9.5,  badge: 'Класика',      img: IMG.bruschetta,    alt: 'Брускети с домати, босилек и зехтин върху дъска' },
  { name: 'Салата с бурата и чери домати',       desc: 'Кремообразна бурата, чери домати, ароматен босилек, зехтин.', price: 14.5, badge: 'Ново',         img: IMG.burrata,       alt: 'Салата с бурата, чери домати и пресен босилек' },
  { name: 'Тирамису с маскарпоне',              desc: 'Класически италиански десерт с еспресо и крем маскарпоне.',   price: 8.5,  badge: 'Десерт',       img: IMG.tiramisu,      alt: 'Парче тирамису с какао и маскарпоне крем' },
]

function Signature() {
  return (
    <section className="relative py-24 sm:py-32 bg-bg-base overflow-hidden">
      {/* Ambient orb */}
      <div className="ambient-orb ambient-orb-gold w-[350px] h-[350px] top-1/4 -left-28" />

      <div className="relative z-content max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <Reveal>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-gold mb-5">
                02 — Подбрани ястия
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-[64px] leading-[1.02] text-ink max-w-2xl">
                Любими ястия от&nbsp;<em className="italic gold-text">шеф готвача</em>.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-ink-muted max-w-md text-[15px] leading-relaxed">
              Избор от най-обичаните вкусове на&nbsp;Luna Verde — приготвени с&nbsp;продукти,
              подбрани за&nbsp;деня, и&nbsp;сервирани с&nbsp;грижа за&nbsp;всеки детайл.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SIGNATURE.map((d, i) => (
            <Reveal key={d.name} delay={i * 100} className="flex">
              <article
                className="group card-warm card-lift rounded-2xl overflow-hidden flex flex-col shadow-card flex-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Img
                    src={d.img}
                    alt={d.alt}
                    className="img-zoom w-full h-full object-cover"
                    label={d.name}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] bg-bg-base/80 backdrop-blur border border-line text-gold-50">
                      <span className="w-1 h-1 rounded-full bg-gold" />
                      {d.badge}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg-card to-transparent pointer-events-none" />
                </div>

                <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1">
                  <h3 className="font-display text-2xl leading-tight text-ink">{d.name}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed flex-1">{d.desc}</p>
                  <div className="flex items-end justify-between pt-3 border-t border-line">
                    <Price value={d.price} size="md" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">0{i + 1}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Full Menu — animated category transitions                           *
 * ------------------------------------------------------------------ */
const MENU: Record<string, { label: string; sub: string; items: { name: string; desc: string; price: number }[] }> = {
  starters: {
    label: 'Предястия',
    sub: 'Леки начала за вечерта',
    items: [
      { name: 'Брускети с домати и босилек',    desc: 'Хрупкав хляб, свежи домати, босилек и зехтин.',              price: 9.5 },
      { name: 'Салата с бурата и чери домати',   desc: 'Кремообразна бурата, чери домати и ароматен босилек.',        price: 14.5 },
      { name: 'Калмари с лимонов айоли',         desc: 'Нежни калмари с домашен лимонов сос.',                       price: 13.5 },
    ],
  },
  mains: {
    label: 'Основни ястия',
    sub: 'Сърцето на менюто',
    items: [
      { name: 'Паста с трюфел и пармезан',       desc: 'Кремообразна паста с трюфелов аромат и пармезан.',           price: 17.5 },
      { name: 'Ризото с морски дарове',           desc: 'Кремообразно ризото със свежи морски дарове.',               price: 19.0 },
      { name: 'Лаврак на грил със свежа салата',  desc: 'Нежно изпечен лаврак с лимон и сезонна салата.',             price: 22.0 },
      { name: 'Скариди с чесън и лимон',          desc: 'Скариди с чесън, лимон, магданоз и лек сос.',               price: 16.0 },
    ],
  },
  desserts: {
    label: 'Десерти',
    sub: 'Сладък завършек',
    items: [
      { name: 'Тирамису с маскарпоне',            desc: 'Класически италиански десерт с кафе и маскарпоне.',          price: 8.5 },
      { name: 'Шоколадов фондан',                 desc: 'Топъл шоколадов десерт с мек разтопен център.',              price: 9.0 },
      { name: 'Панакота с горски плодове',         desc: 'Нежен крем с пресни горски плодове.',                        price: 7.5 },
    ],
  },
  drinks: {
    label: 'Напитки',
    sub: 'Освежаващи и без алкохол',
    items: [
      { name: 'Домашна лимонада с мента',         desc: 'Свежа лимонада с мента и лимон.',                           price: 5.0 },
      { name: 'Прясно изцеден портокалов сок',     desc: 'Натурален портокалов фреш.',                               price: 5.5 },
      { name: 'Студен чай с праскова',             desc: 'Домашен студен чай с лек плодов вкус.',                     price: 4.5 },
      { name: 'Безалкохолен коктейл с цитрус и мента', desc: 'Освежаваща комбинация от цитрус, мента и сода.',       price: 6.5 },
    ],
  },
}

function FullMenu() {
  const keys = Object.keys(MENU)
  const [active, setActive] = useState('starters')
  const [animKey, setAnimKey] = useState(0)
  const cat = MENU[active]

  const select = (k: string) => {
    if (k === active) return
    setActive(k)
    setAnimKey(x => x + 1)
  }

  return (
    <section id="menu" className="relative py-24 sm:py-32 bg-soft-warm">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10">
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-gold mb-5">
              03 — Меню
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-[64px] leading-[1.02] text-ink">
              Цялото <em className="italic gold-text">меню</em> на&nbsp;Luna&nbsp;Verde
            </h2>
            <p className="ornament inline-block mt-6 font-display italic text-ink-muted text-lg">à la carte</p>
          </div>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={100}>
          <div
            role="tablist"
            aria-label="Категории на менюто"
            className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 p-1.5 rounded-full border border-line bg-bg-card/60 backdrop-blur max-w-3xl mx-auto"
          >
            {keys.map(k => (
              <button
                key={k}
                role="tab"
                aria-selected={k === active}
                data-active={k === active}
                onClick={() => select(k)}
                className="tab relative px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
              >
                <span className="relative z-10">{MENU[k].label}</span>
                <span
                  className="absolute inset-0 rounded-full transition-all duration-500"
                  style={{
                    background: k === active
                      ? 'linear-gradient(180deg, rgba(201,169,97,0.16), rgba(201,169,97,0.06))'
                      : 'transparent',
                    boxShadow: k === active
                      ? 'inset 0 0 0 1px rgba(201,169,97,0.45)'
                      : 'none',
                  }}
                />
              </button>
            ))}
          </div>
        </Reveal>

        {/* Menu panel */}
        <div className="mt-14 max-w-3xl mx-auto">
          <div key={animKey} className="menu-fade-enter menu-fade-enter-active">
            <div className="text-center mb-10">
              <h3 className="font-display text-3xl sm:text-4xl text-ink">{cat.label}</h3>
              <p className="text-ink-faint text-sm mt-2 italic">{cat.sub}</p>
              <div className="gold-rule h-px w-24 mx-auto mt-5" />
            </div>

            <ul className="menu-stagger flex flex-col">
              {cat.items.map((it) => (
                <li
                  key={`${active}-${it.name}`}
                  className="group/item py-5 border-b border-line/70 transition-colors hover:bg-gold/[0.025] -mx-2 px-2 rounded-lg"
                >
                  <div className="flex items-baseline gap-4">
                    <h4 className="font-display text-xl sm:text-2xl text-ink leading-tight shrink-0">
                      {it.name}
                    </h4>
                    <span
                      className="flex-1 mx-1 sm:mx-3 border-b border-dotted border-line/80 translate-y-[-6px] hidden sm:block"
                      aria-hidden="true"
                    />
                    <div className="ml-auto sm:ml-0">
                      <Price value={it.price} size="md" />
                    </div>
                  </div>
                  <p className="text-[15px] text-ink-muted mt-1.5 leading-relaxed max-w-[52ch]">
                    {it.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Gallery / Atmosphere                                                *
 * ------------------------------------------------------------------ */
const GALLERY_TILES = [
  { src: IMG.galInterior,   alt: 'Уютен интериор с топло осветление и дървени детайли',          label: 'Интериор',       area: 'lg:col-span-6 lg:row-span-2' },
  { src: IMG.galTerrace,    alt: 'Външна тераса с елегантни маси и зеленина при залез',          label: 'Тераса',         area: 'lg:col-span-6 lg:row-span-1' },
  { src: IMG.galFoodDetail, alt: 'Близък план на средиземноморско ястие с пресни подправки',     label: 'Кухнята',        area: 'lg:col-span-3 lg:row-span-1' },
  { src: IMG.galLemonade,   alt: 'Чаши с домашна лимонада с мента върху дървена маса',           label: 'Свежи напитки',  area: 'lg:col-span-3 lg:row-span-1' },
  { src: IMG.galDessert,    alt: 'Елегантно сервиран десерт',                                    label: 'Десерти',        area: 'lg:col-span-4 lg:row-span-1' },
  { src: IMG.galCoffee,     alt: 'Чаша еспресо в керамична чаша',                                label: 'Кафе',           area: 'lg:col-span-4 lg:row-span-1' },
  { src: IMG.galEvening,    alt: 'Уютна вечерна атмосфера в ресторанта',                         label: 'Вечер',          area: 'lg:col-span-4 lg:row-span-1' },
]

function Gallery() {
  return (
    <section id="gallery" className="relative py-24 sm:py-32 bg-bg-base overflow-hidden">
      {/* Ambient orb */}
      <div className="ambient-orb ambient-orb-olive w-[400px] h-[400px] top-1/3 -right-24" />

      <div className="relative z-content max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <Reveal>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-gold mb-5">04 — Атмосфера</p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-[64px] leading-[1.02] text-ink max-w-2xl">
                Усещането <em className="italic gold-text">на&nbsp;вечерта</em>.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-ink-muted max-w-md text-[15px] leading-relaxed">
              Топло осветление, тиха музика, тераса с&nbsp;изглед към&nbsp;центъра на&nbsp;Пловдив.
              Място, в&nbsp;което вечерята се&nbsp;превръща в&nbsp;спомен.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-12 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[240px] gap-3 sm:gap-4">
          {GALLERY_TILES.map((t, i) => (
            <Reveal key={t.label} delay={i * 80} direction="scale" className={t.area}>
              <figure
                className="group relative overflow-hidden rounded-2xl ring-soft h-full"
              >
                <Img
                  src={t.src}
                  alt={t.alt}
                  className="img-zoom w-full h-full object-cover"
                  label={t.label}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <figcaption className="absolute left-4 bottom-4 right-4 flex items-center justify-between">
                  <span className="font-display text-xl text-ink">{t.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-100">Luna Verde</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Reservation form                                                    *
 * ------------------------------------------------------------------ */
function Reservation() {
  const [form, setForm] = useState({
    name: '', phone: '', date: '', time: '19:00', guests: 2 as number | string, message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')

  const today = new Date().toISOString().slice(0, 10)
  const times = ['12:00','13:00','14:00','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30']

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setStatus('sent')
    setTimeout(() => setStatus('idle'), 4500)
  }

  return (
    <section id="reservation" className="relative py-24 sm:py-32 bg-soft-warm overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left info */}
          <div className="lg:col-span-5 lg:pt-6">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-gold mb-5">05 — Резервация</p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-[64px] leading-[1.02] text-ink">
                Запазете <em className="italic gold-text">маса</em> за&nbsp;вечерта.
              </h2>
              <div className="gold-rule-reveal h-px w-32 my-8" />
            </Reveal>
            <Reveal delay={100}>
              <p className="text-ink-muted text-[15px] leading-relaxed max-w-md">
                Изберете удобен ден и&nbsp;час, а&nbsp;ние ще&nbsp;се&nbsp;погрижим за&nbsp;всичко
                останало. Препоръчваме резервация в&nbsp;края на&nbsp;седмицата.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <ul className="mt-10 space-y-5">
                {([
                  ['Уютен зал',        'до 80 места'],
                  ['Тераса',           'сезонно, до 32 места'],
                  ['Частни събития',   'по запитване'],
                ] as const).map(([k, v]) => (
                  <li key={k} className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
                    <span className="font-display text-xl text-ink">{k}</span>
                    <span className="text-sm text-ink-faint italic">{v}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={250}>
              <p className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line text-[11px] font-mono uppercase tracking-[0.25em] text-ink-faint">
                <span className="w-1 h-1 rounded-full bg-olive" />
                Демо форма · не изпраща данни
              </p>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal delay={150} direction="scale">
              <form
                onSubmit={submit}
                className="card-warm rounded-3xl p-6 sm:p-9 shadow-card"
                aria-label="Форма за резервация"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="field-label" htmlFor="r-name">Име *</label>
                    <input id="r-name" required className="field" value={form.name} onChange={update('name')} placeholder="Вашето име" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="r-phone">Телефон *</label>
                    <input id="r-phone" required type="tel" className="field" value={form.phone} onChange={update('phone')} placeholder="+359 ..." />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="r-date">Дата *</label>
                    <input id="r-date" required type="date" min={today} className="field" value={form.date} onChange={update('date')} />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="r-time">Час *</label>
                    <select id="r-time" required className="field" value={form.time} onChange={update('time')}>
                      {times.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Брой гости *</label>
                    <div className="flex flex-wrap gap-2">
                      {([1, 2, 3, 4, 5, 6, '7+'] as const).map(n => (
                        <button
                          type="button"
                          key={n}
                          data-active={String(form.guests) === String(n)}
                          onClick={() => setForm(f => ({ ...f, guests: n }))}
                          className="guest-chip rounded-full px-3.5 py-2 text-sm font-medium min-w-[44px]"
                          aria-pressed={String(form.guests) === String(n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="field-label" htmlFor="r-msg">Съобщение</label>
                    <textarea id="r-msg" rows={3} className="field resize-none" value={form.message} onChange={update('message')} placeholder="Алергии, специален повод, предпочитание за маса..." />
                  </div>
                </div>

                <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                  <p className="text-xs text-ink-faint">
                    Полетата с&nbsp;<span className="text-gold">*</span> са&nbsp;задължителни.
                  </p>
                  <button
                    type="submit"
                    className="btn-primary rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide w-full sm:w-auto"
                  >
                    Изпрати резервация
                  </button>
                </div>

                {status === 'sent' && (
                  <div className="mt-5 p-4 rounded-xl border border-olive/40 bg-olive/10 text-sm text-ink fade-up">
                    Благодарим! Вашата резервация е&nbsp;получена (демо). Ще&nbsp;се&nbsp;свържем с&nbsp;Вас за&nbsp;потвърждение.
                  </div>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Reviews                                                             *
 * ------------------------------------------------------------------ */
const REVIEWS = [
  {
    name: 'Мария Г.', rating: 5, occasion: 'Годишнина',
    text: 'Изключителна вечеря в&nbsp;уютна и&nbsp;спокойна обстановка. Пастата с&nbsp;трюфел беше на&nbsp;нивото на&nbsp;най-добрите ресторанти, а&nbsp;обслужването — внимателно, без&nbsp;да&nbsp;е&nbsp;натрапчиво. Идеално място за&nbsp;специален повод.',
  },
  {
    name: 'Стефан Д.', rating: 5, occasion: 'Семейна вечеря',
    text: 'Бяхме на&nbsp;семейна вечеря и&nbsp;всички бяхме впечатлени — от&nbsp;брускетите до&nbsp;тирамисуто. Атмосферата е&nbsp;стилна и&nbsp;топла, а&nbsp;домашната лимонада с&nbsp;мента се&nbsp;превърна в&nbsp;любима на&nbsp;децата.',
  },
  {
    name: 'Десислава П.', rating: 5, occasion: 'Романтична вечеря',
    text: 'Едно от&nbsp;любимите ми места в&nbsp;Пловдив. Свежи продукти, чисти вкусове и&nbsp;елегантно поднасяне. Терасата вечер е&nbsp;истинска приказка. Препоръчвам за&nbsp;спокойна вечеря на&nbsp;двама.',
  },
]

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n} от 5`} className="inline-flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < n ? 'star' : 'text-ink-faint/40'}>★</span>
      ))}
    </span>
  )
}

function Reviews() {
  return (
    <section className="relative py-24 sm:py-32 bg-bg-base overflow-hidden">
      {/* Ambient orb */}
      <div className="ambient-orb ambient-orb-olive w-[400px] h-[400px] -top-20 -right-24" />

      <div className="relative z-content max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10">
        <Reveal>
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-gold mb-5">06 — Отзиви</p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-[64px] leading-[1.02] text-ink">
              Думи на&nbsp;<em className="italic gold-text">нашите гости</em>.
            </h2>
            <div className="mt-6 inline-flex items-center gap-3 text-ink-muted text-sm">
              <Stars n={5} /> <span>4.9 / 5 средна оценка · 312 отзива</span>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 120} className="flex">
              <article className="card-warm card-lift rounded-2xl p-7 shadow-card flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <Stars n={r.rating} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">{r.occasion}</span>
                </div>
                <p
                  className="font-display italic text-xl leading-[1.5] text-ink mt-5 flex-1"
                  dangerouslySetInnerHTML={{ __html: `&ldquo;${r.text}&rdquo;` }}
                />
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-line">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-100 to-gold-700 flex items-center justify-center text-bg-base font-display text-lg">
                    {r.name[0]}
                  </span>
                  <span className="text-sm text-ink">{r.name}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Contact + Map                                                       *
 * ------------------------------------------------------------------ */
function Contact() {
  const mapSrc =
    'https://maps.google.com/maps?q=' +
    encodeURIComponent('ул. Княз Александър I 24, Пловдив, България') +
    '&z=16&output=embed'

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-soft-warm overflow-hidden">
      {/* Ambient orb */}
      <div className="ambient-orb ambient-orb-gold w-[350px] h-[350px] bottom-0 -left-20" />

      <div className="relative z-content max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Info */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-gold mb-5">07 — Контакти</p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-[64px] leading-[1.02] text-ink">
                Намерете <em className="italic gold-text">ни</em>.
              </h2>
              <div className="gold-rule-reveal h-px w-32 my-8" />
            </Reveal>

            <Reveal delay={100}>
              <dl className="space-y-7">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint mb-2">Адрес</dt>
                  <dd className="font-display text-2xl text-ink leading-snug">ул. Княз Александър I 24<br />Пловдив, България</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint mb-2">Телефон</dt>
                  <dd className="text-lg text-ink"><a href="tel:+359881234567" className="hover:text-gold transition">+359 88 123 4567</a></dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint mb-2">Имейл</dt>
                  <dd className="text-lg text-ink"><a href="mailto:reservations@lunaverde.bg" className="hover:text-gold transition">reservations@lunaverde.bg</a></dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint mb-2">Работно време</dt>
                  <dd className="space-y-1 text-ink">
                    <div className="flex justify-between max-w-xs"><span>Понеделник – Петък</span><span className="text-ink-muted">11:00 – 23:00</span></div>
                    <div className="flex justify-between max-w-xs"><span>Събота – Неделя</span><span className="text-ink-muted">12:00 – 00:00</span></div>
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={200}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('ул. Княз Александър I 24, Пловдив')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium mt-10"
              >
                Отвори в Google Maps
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M7 17 L17 7" /><path d="M9 7 H17 V15" />
                </svg>
              </a>
            </Reveal>
          </div>

          {/* Map */}
          <div className="lg:col-span-7">
            <Reveal delay={150} direction="scale">
              <div className="card-warm card-lift rounded-3xl overflow-hidden shadow-card">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] bg-bg-elev">
                  <iframe
                    title="Карта · Luna Verde, ул. Княз Александър I 24, Пловдив"
                    src={mapSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0, filter: 'saturate(0.7) brightness(0.85)' }}
                    allowFullScreen
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-line rounded-3xl" />
                </div>
                <div className="px-6 py-5 flex items-center justify-between border-t border-line">
                  <div>
                    <div className="font-display text-xl text-ink">Luna Verde · Пловдив</div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint mt-1">
                      42.1463° N · 24.7475° E
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-2 text-xs text-ink-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-olive animate-pulse" /> отворено сега
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Footer                                                              *
 * ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="relative bg-bg-base border-t border-line">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-7 lg:px-10 py-16">
        <Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <Logo />
              <p className="text-ink-muted text-[15px] mt-6 max-w-sm leading-relaxed">
                Средиземноморска кухня в&nbsp;сърцето на&nbsp;Пловдив. Свежи продукти,
                елегантна атмосфера и&nbsp;грижа за&nbsp;всеки детайл.
              </p>
            </div>

            <div className="lg:col-span-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint mb-5">Навигация</div>
              <ul className="space-y-3 text-ink">
                {NAV_LINKS.map(([l, h]) => (
                  <li key={h}><a href={h} className="hover:text-gold transition">{l}</a></li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint mb-5">Социални</div>
              <ul className="space-y-3 text-ink">
                <li><a href="#" className="hover:text-gold transition">Facebook</a></li>
                <li><a href="#" className="hover:text-gold transition">Instagram</a></li>
                <li><a href="#" className="hover:text-gold transition">TikTok</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint mb-5">Контакт</div>
              <ul className="space-y-3 text-ink-muted text-sm">
                <li className="text-ink">+359 88 123 4567</li>
                <li>reservations@<br />lunaverde.bg</li>
                <li>ул. Княз Александър I 24, Пловдив</li>
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-14 pt-8 border-t border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-ink-faint">
            <p>© 2026 Luna Verde. Всички права запазени.</p>
            <p className="font-mono tracking-[0.18em]">
              Демо уебсайт, създаден от&nbsp;<span className="text-ink-muted">MaxStats IT Solutions</span>.
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ *
 * App                                                                 *
 * ------------------------------------------------------------------ */
export default function App() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <About />
      <Signature />
      <FullMenu />
      <Gallery />
      <Reservation />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  )
}
