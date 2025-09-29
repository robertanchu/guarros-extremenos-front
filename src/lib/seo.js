// src/lib/seo.js
export function injectJsonLd(data) {
  const id = 'ldjson-dynamic';
  document.querySelectorAll(`script#${id}`).forEach(n => n.remove());
  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) return;
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = id;
  s.text = JSON.stringify(data);
  document.head.appendChild(s);
}

export function setOgImage(url) {
  if (!url) return;
  let m = document.querySelector('meta[property="og:image"]');
  if (!m) {
    m = document.createElement('meta');
    m.setAttribute('property','og:image');
    document.head.appendChild(m);
  }
  m.setAttribute('content', url);

  let t = document.querySelector('meta[name="twitter:image"]');
  if (!t) {
    t = document.createElement('meta');
    t.setAttribute('name','twitter:image');
    document.head.appendChild(t);
  }
  t.setAttribute('content', url);
}
