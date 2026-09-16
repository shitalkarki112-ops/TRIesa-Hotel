import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowUpRight, ChevronRight, X, Menu } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const images = [
  ['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Arrival hall'],
  ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200', 'The Atrium Suite'],
  ['https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=1200', 'A study in light'],
  ['https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Lumen dining room'],
  ['https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Rituals at dawn'],
  ['https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1200', 'A night at TRIesa'],
];

function Logo() {
  return <a href="#top" className="brand" data-testid="link-logo" aria-label="TRIesa home">
    <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M4 7h24M16 7v19M9 12l7-5 7 5M8 26h16" /></svg>
    <span>TRIesa</span>
  </a>;
}

function Nav({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const close = () => setOpen(false);
  return <nav className={`nav ${scrolled ? 'scrolled' : ''}`} data-testid="nav-main">
    <Logo />
    <div className={`nav-links ${open ? 'open' : ''}`}>
       <a href="#suites" onClick={close} data-testid="link-suites">Stay</a>
       <a href="#dining" onClick={close} data-testid="link-dining">Dining</a>
       <a href="#wellness" onClick={close} data-testid="link-wellness">Wellness</a>
       <a href="#experiences" onClick={close} data-testid="link-experiences">Experiences</a>
       <a href="#events" onClick={close} data-testid="link-events">Events</a>
       <a href="#gallery" onClick={close} data-testid="link-gallery">Gallery</a>
      <a href="#booking" className="nav-book" onClick={close} data-testid="button-nav-book">Reserve a stay</a>
    </div>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">
      {open ? <X size={22} /> : <Menu size={22} />}
    </button>
  </nav>;
}

function Reveal({ children, className = '' }: { children?: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: .12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? 'visible' : ''} ${className}`}>{children}</div>;
}

function Hero() {
  return <section className="hero" id="top">
    <div className="hero-bg" />
    <div className="sculpture" aria-hidden="true"><div /><div /><div /></div>
    <div className="hero-content">
      <div className="hero-kicker eyebrow"><span /> A private address, internationally minded</div>
      <h1>A quieter<br /><em>kind</em> of grand.</h1>
      <p className="hero-sub">TRIesa is a house for long afternoons, early light, and the rare pleasure of having nowhere else to be.</p>
      <a className="hero-book" href="#booking" data-testid="button-hero-book">Plan your stay <ArrowUpRight size={14} style={{ verticalAlign: 'middle', marginLeft: 8 }} /></a>
    </div>
    <div className="hero-bottom mono">Scroll to enter</div>
  </section>;
}

function Intro() {
  return <section className="section">
    <div className="intro">
      <Reveal className="intro-side"><div className="eyebrow">01 / The house</div><p>Set between a city in motion and a horizon of its own, TRIesa is a considered pause. Three distinct expressions of place, gathered under one roof.</p><a className="text-link" href="#architecture" data-testid="link-discover-house">Discover the house</a></Reveal>
      <Reveal className="intro-copy"><h2>Not a destination.<br /><em>A point of view.</em></h2><p>Every room is a study in balance: shadow and sun, material and air, the familiar made newly strange. We have left space for your own rituals.</p></Reveal>
    </div>
  </section>;
}

function Architecture() {
  const [active, setActive] = useState('SUITES');
  const hotspots = [
    ['SUITES', 'The upper rooms', 'Quiet corners, west light, and a horizon beyond the city.'],
    ['RESTAURANT', 'Vela at ground level', 'An open kitchen, bright plates, and one long shared table.'],
    ['POOL', 'The reflecting pool', 'A blue pause between the house and the old quarter.'],
    ['SPA', 'The restore rooms', 'Heat, water, and a softer pace beneath the courtyard.'],
  ] as const;
  const selected = hotspots.find(([name]) => name === active) ?? hotspots[0];
  return <section className="architecture" id="architecture">
    <div className="architecture-visual">
      <div className="arch-sculpture" aria-hidden="true"><span /><span /><span /></div>
      <div className="arch-stamp"><strong>III</strong> three ways<br />of seeing</div>
      <div className="architecture-hotspots" aria-label="Explore TRIesa spaces">
        {hotspots.map(([name]) => <button key={name} className={active === name ? 'active' : ''} onClick={() => setActive(name)} aria-label={`Explore ${name}`} data-testid={`button-hotspot-${name.toLowerCase()}`}>{name}</button>)}
      </div>
      <div className="hotspot-card" role="status"><div className="eyebrow">{selected[0]}</div><strong>{selected[1]}</strong><p>{selected[2]}</p></div>
    </div>
    <Reveal className="architecture-copy"><div className="eyebrow">02 / Architecture</div><h2>Form follows<br /><em>feeling.</em></h2><p>Architect Amina Vale shaped TRIesa as a sequence of thresholds. Limestone gives way to linen, shadow opens into sky, and every corridor ends in a reason to linger.</p><div className="arch-facts"><div><strong>1968</strong><span>originally built</span></div><div><strong>42</strong><span>rooms & suites</span></div></div></Reveal>
  </section>;
}

function Suites() {
  const suiteCards = [
    ['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200', 'The Horizon Room', 'A west-facing room for golden hour.'],
    ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200', 'The Atelier', 'A generous studio with a private terrace.'],
    ['https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=1200', 'The Courtyard', 'Morning light, softened by olive trees.'],
  ];
  return <section className="section section-dark" id="suites">
    <div className="section-head"><div><div className="eyebrow">03 / Stay awhile</div><h2>Rooms with<br /><em>room to breathe.</em></h2></div><p>Three ways to inhabit TRIesa, each with a view, a considered minibar, and the feeling that someone anticipated the hour you would wake.</p></div>
    <div className="suites-grid">{suiteCards.map(([src, title, desc], i) => <Reveal className="suite-card" key={title}><img src={src} alt={title} /><div className="suite-card-content"><div className="eyebrow">0{i + 1} / suite</div><h3>{title}</h3><p>{desc}</p><span className="card-arrow">↗</span></div></Reveal>)}</div>
  </section>;
}

function Signature() {
  return <section className="signature" id="signature">
    <Reveal className="signature-copy"><div className="eyebrow">04 / The signature stay</div><h2>The<br /><em>TRIesa</em><br />Suite</h2><p>Our largest address: a private salon, a limestone bath, and a terrace that turns the last light into a daily ceremony.</p><a className="text-link" href="#booking" data-testid="link-suite-book">Request the suite</a></Reveal>
    <div className="signature-visual" aria-label="Warmly lit hotel suite" role="img" />
  </section>;
}

function Dining() {
  return <section className="section" id="dining">
    <div className="dining">
      <Reveal className="dining-visual" />
      <Reveal className="dining-copy"><div className="eyebrow">05 / At the table</div><h2>Gather<br /><em>slowly.</em></h2><p>At Vela, the menu follows the coast and the market. Small plates, bright herbs, an open fire, and a room designed to make one more glass feel inevitable.</p><div className="dining-menu"><div><strong>Vela</strong><span>All day dining</span></div><div><strong>Orra</strong><span>Rooftop bar</span></div><div><strong>07:00</strong><span>First coffee</span></div></div></Reveal>
    </div>
  </section>;
}

function Wellness() {
  const cards = [['01', 'The thermal circuit', 'Heat, cool, rest, repeat.'], ['02', 'Movement studio', 'Private practice with city views.'], ['03', 'The treatment room', 'Restorative work, unhurried.']];
  return <section className="section section-ink" id="wellness">
    <div className="wellness-head"><div><div className="eyebrow">06 / Restore</div><h2>Leave the day<br /><em>lighter.</em></h2></div><p>Wellness at TRIesa is not a program to complete. It is a collection of gentle invitations: a warm pool, a quiet room, a therapist who remembers your name.</p></div>
    <div className="wellness-grid">{cards.map(([num, title, desc]) => <Reveal className="wellness-card" key={num}><div className="eyebrow">{num}</div><h3>{title}</h3><p>{desc}</p></Reveal>)}</div>
  </section>;
}

function Experiences() {
  const items = [['01', 'The blue hour walk', 'Old harbour / 90 min', 'Dawn'], ['02', 'A table in the orchard', 'The valley / half day', 'Seasonal'], ['03', 'The private gallery', 'North quarter / 2 hours', 'Curated'], ['04', 'By water, beyond the bay', 'Marina / full day', 'On request']];
  return <section className="section experiences" id="experiences">
    <div className="section-head"><div><div className="eyebrow">07 / Further afield</div><h2>Made for<br /><em>curiosity.</em></h2></div><p>Ask our house team for the version of the city that does not appear on a map.</p></div>
    <div className="experience-list">{items.map(([num, title, detail, timing]) => <Reveal className="experience-row" key={num}><div className="experience-number">{num}</div><h3>{title}</h3><p>{detail}</p><div className="experience-location">{timing}</div><div className="experience-arrow"><ChevronRight size={19} /></div></Reveal>)}</div>
  </section>;
}

function Gallery({ onOpen }: { onOpen: (image: string, label: string) => void }) {
  return <section className="section gallery" id="gallery">
    <div className="section-head"><div><div className="eyebrow">08 / Field notes</div><h2>Fragments of<br /><em>TRIesa.</em></h2></div><p>Light moves differently here. A visual diary from the house, the coast, and the spaces between.</p></div>
    <div className="gallery-grid">{images.map(([src, label], i) => <button className="gallery-item" key={src} onClick={() => onOpen(src, label)} aria-label={`Open ${label}`} data-testid={`button-gallery-${i}`}><img src={src} alt={label} /><span>↗</span></button>)}</div>
  </section>;
}

function Events() {
  return <section className="section" id="events"><div className="events"><Reveal className="events-visual" /><Reveal className="events-copy"><div className="eyebrow">09 / In good company</div><h2>Gather<br /><em>beautifully.</em></h2><p>For celebrations that deserve more than a room, TRIesa offers the Lantern Hall: a warm, adaptable space with its own entrance, kitchen, and late-night view.</p><div className="event-detail"><div><strong>120</strong><span>standing guests</span></div><div><strong>02</strong><span>private rooms</span></div></div><a className="text-link" href="#booking" data-testid="link-event-enquiry">Make an enquiry</a></Reveal></div></section>;
}

function Location() {
  return <section className="location" id="location"><div className="location-map" /><div className="location-pin"><span>III</span></div><div className="location-card"><div className="eyebrow">10 / Find us</div><h2>Close to<br /><em>elsewhere.</em></h2><p>At the edge of the old quarter, where the city softens into the sea. TRIesa is 28 minutes from the international terminal and a world away from hurry.</p><div className="location-meta"><div><strong>28 min</strong><span>from terminal</span></div><div><strong>07 min</strong><span>to old harbour</span></div></div></div></section>;
}

function Booking() {
  const [status, setStatus] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('Your stay request is with our house team. We will be in touch shortly.');
  };
  return <section className="section booking" id="booking"><div className="booking-copy"><div className="eyebrow">11 / Begin here</div><h2>Make a little<br /><em>room.</em></h2><p>Tell us how you imagine your time at TRIesa. We will take care of the rest.</p></div><form className="booking-form" onSubmit={submit}><div className="field"><label htmlFor="arrival">Check-in</label><input id="arrival" type="date" required data-testid="input-arrival" /></div><div className="field"><label htmlFor="departure">Check-out</label><input id="departure" type="date" required data-testid="input-departure" /></div><div className="field"><label htmlFor="guests">Guests</label><select id="guests" defaultValue="2" data-testid="select-guests"><option value="1">01 guest</option><option value="2">02 guests</option><option value="3">03 guests</option><option value="4">04 guests</option></select></div><div className="field"><label htmlFor="rooms">Rooms</label><select id="rooms" defaultValue="1" data-testid="select-rooms"><option value="1">01 room</option><option value="2">02 rooms</option><option value="3">03 rooms</option></select></div><button className="booking-submit" type="submit" data-testid="button-check-availability">Check availability <ArrowUpRight size={14} style={{ verticalAlign: 'middle', marginLeft: 8 }} /></button>{status && <div className="form-message" role="status" data-testid="status-booking">{status}</div>}</form></section>;
}

function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (email) setMessage('You are on the list. Welcome to TRIesa.'); };
   return <footer className="footer"><div className="footer-top"><div><Logo /><div className="footer-title" style={{ marginTop: 55 }}>There is always<br /><em>another way in.</em></div></div><div className="footer-contact"><div className="eyebrow">The house / demo residence</div><p>Somewhere by the sea<br />A location to be announced</p><a href="tel:+00123456789">+00 123 456 789</a><a href="mailto:stay@triesa.house">stay@triesa.house</a></div><div className="newsletter"><div className="eyebrow">The house journal</div><p>Occasional notes on places worth going, tables worth sharing, and the art of staying put.</p><form className="newsletter-form" onSubmit={submit}><input type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required aria-label="Email address" data-testid="input-newsletter" /><button type="submit" aria-label="Join newsletter" data-testid="button-newsletter">↗</button></form>{message && <div className="newsletter-message" role="status" data-testid="status-newsletter">{message}</div>}</div></div><div className="footer-bottom"><span>© 2026 TRIesa. All rights reserved.</span><div className="footer-links"><a href="#top" data-testid="link-instagram">Instagram</a><a href="#top" data-testid="link-facebook">Facebook</a><a href="#top" data-testid="link-linkedin">LinkedIn</a><a href="mailto:stay@triesa.house" data-testid="link-email">Contact</a></div><span>Made for the unhurried</span></div></footer>;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ image: string; label: string } | null>(null);
  return <div className="triesa-app"><Nav open={menuOpen} setOpen={setMenuOpen} /><main><Hero /><Intro /><Architecture /><Suites /><Signature /><Dining /><Wellness /><Experiences /><Gallery onOpen={(image, label) => setLightbox({ image, label })} /><Events /><Location /><Booking /></main><Footer />{lightbox && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close gallery" data-testid="button-close-lightbox"><X size={27} /></button><img src={lightbox.image} alt={lightbox.label} /><div className="lightbox-label">{lightbox.label}</div></div>}</div>;
}

function Router() {
  return <ErrorBoundary><Switch><Route path="/" component={Home} /><Route component={() => <Home />} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;