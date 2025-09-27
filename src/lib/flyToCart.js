export function flyToCart(fromEl, toEl){
  try {
    if (!fromEl || !toEl) return;
    const rect = fromEl.getBoundingClientRect();
    const target = toEl.getBoundingClientRect();
    const clone = fromEl.cloneNode(true);
    const style = clone.style;
    style.position = 'fixed';
    style.left = rect.left+'px';
    style.top = rect.top+'px';
    style.width = rect.width+'px';
    style.height = rect.height+'px';
    style.transition = 'transform .7s cubic-bezier(.22,.61,.36,1), opacity .7s';
    style.zIndex = 9999;
    style.pointerEvents = 'none';
    document.body.appendChild(clone);
    const dx = target.left - rect.left;
    const dy = target.top - rect.top;
    const scale = Math.max(0.15, Math.min(0.25, target.width/rect.width));
    requestAnimationFrame(()=>{
      clone.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      clone.style.opacity = '0.4';
    });
    setTimeout(()=> clone.remove(), 800);
  } catch {}
}

export function findCartTarget(){
  return document.querySelector('[data-cart-target="true"]');
}
