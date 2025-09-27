export function gaViewItem(p){
  try {
    if (window.gtag) {
      window.gtag('event','view_item',{items:[{item_id:p.id,item_name:p.name,price:p.priceFrom}]});
    } else if (window.dataLayer) {
      window.dataLayer.push({event:'view_item', items:[{item_id:p.id,item_name:p.name,price:p.priceFrom}]});
    }
  } catch {}
}
export function gaAddToCart(p, qty=1){
  try {
    if (window.gtag) {
      window.gtag('event','add_to_cart',{items:[{item_id:p.id,item_name:p.name,price:p.priceFrom,quantity:qty}]});
    } else if (window.dataLayer) {
      window.dataLayer.push({event:'add_to_cart', items:[{item_id:p.id,item_name:p.name,price:p.priceFrom,quantity:qty}]});
    }
  } catch {}
}
export function gaBeginCheckout(items){
  try {
    const mapped = items.map(x=>({item_id:x.id,item_name:x.name,price:x.price,quantity:x.qty}));
    if (window.gtag) {
      window.gtag('event','begin_checkout',{items:mapped});
    } else if (window.dataLayer) {
      window.dataLayer.push({event:'begin_checkout', items:mapped});
    }
  } catch {}
}
