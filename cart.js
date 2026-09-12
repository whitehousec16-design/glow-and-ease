// ============================================================
// CART — stored in localStorage as [{id, qty}, ...]
// ============================================================

const CART_KEY = "glowease_cart_v1";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartDrawer();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const line = cart.find(l => l.id === id);
  if (line) {
    line.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart(cart);
  openCart();
}

function updateQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter(l => l.id !== id);
  } else {
    const line = cart.find(l => l.id === id);
    if (line) line.qty = qty;
  }
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(l => l.id !== id);
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, l) => {
    const p = getProductById(l.id);
    return sum + (p ? p.price * l.qty : 0);
  }, 0);
}

// ============ CART DRAWER UI ============
function openCart() {
  document.getElementById("cart-overlay").classList.add("open");
  document.getElementById("cart-drawer").classList.add("open");
}
function closeCart() {
  document.getElementById("cart-overlay").classList.remove("open");
  document.getElementById("cart-drawer").classList.remove("open");
}

function renderCartDrawer() {
  const countEls = document.querySelectorAll(".cart-count");
  countEls.forEach(el => (el.textContent = cartCount()));

  const itemsEl = document.getElementById("cart-items");
  if (!itemsEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
  } else {
    itemsEl.innerHTML = cart
      .map(line => {
        const p = getProductById(line.id);
        if (!p) return "";
        return `
        <div class="cart-line">
          <img src="${p.image}" alt="${p.name}" />
          <div class="info">
            <div class="name">${p.name}</div>
            <div class="line-price">${formatPrice(p.price)} × ${line.qty} = ${formatPrice(p.price * line.qty)}</div>
            <div class="qty-control">
              <button onclick="updateQty('${p.id}', ${line.qty - 1})">−</button>
              <span>${line.qty}</span>
              <button onclick="updateQty('${p.id}', ${line.qty + 1})">+</button>
            </div>
            <button class="remove" onclick="removeFromCart('${p.id}')">Remove</button>
          </div>
        </div>`;
      })
      .join("");
  }

  const subtotalEl = document.getElementById("cart-subtotal-amount");
  if (subtotalEl) subtotalEl.textContent = formatPrice(cartSubtotal());

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

async function goToCheckout() {
  const cart = getCart();
  if (cart.length === 0) return;

  const btn = document.getElementById("checkout-btn");
  const originalText = btn.textContent;
  btn.textContent = "Redirecting to secure checkout...";
  btn.disabled = true;

  try {
    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart })
    });

    if (!res.ok) throw new Error("Checkout session failed");
    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error("No checkout URL returned");
    }
  } catch (err) {
    console.error(err);
    alert(
      "Checkout isn't connected yet. This happens if the site hasn't been deployed to Netlify with a Stripe key set up. See the README for the 2 remaining setup steps."
    );
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

// Wire up drawer open/close on every page load
document.addEventListener("DOMContentLoaded", () => {
  renderCartDrawer();
  const openBtns = document.querySelectorAll(".cart-btn");
  openBtns.forEach(b => b.addEventListener("click", openCart));
  const closeBtn = document.getElementById("cart-close");
  if (closeBtn) closeBtn.addEventListener("click", closeCart);
  const overlay = document.getElementById("cart-overlay");
  if (overlay) overlay.addEventListener("click", closeCart);
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", goToCheckout);
});
