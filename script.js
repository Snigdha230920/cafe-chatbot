/* JavaScript: menu, cart, chatbot, reservation and payment handling */

/* ---------- Utility ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* Set current year */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Nav hamburger ---------- */
const ham = document.getElementById('hamburger');
const nav = document.getElementById('main-nav');
ham.addEventListener('click', () => {
  nav.style.display = (nav.style.display === 'block') ? 'none' : 'block';
});

/* close nav when resizing up */
window.addEventListener('resize', () => {
  if (window.innerWidth > 880) nav.style.display = 'block';
});

/* ---------- Menu Data (many items) ---------- */
/* Images use royalty-free/AI-style unsplash placeholders — replace with your AI images if you want */
const menuItems = [
  { id: 'espresso', name: 'Espresso', desc: 'Strong & rich single shot', price: 3.5, img: 'https://image.pollinations.ai/prompt/espresso%20coffee%20shot?width=800&height=800&seed=101' },
  { id: 'americano', name: 'Americano', desc: 'Espresso + hot water', price: 3.8, img: 'https://image.pollinations.ai/prompt/americano%20coffee%20cup?width=800&height=800&seed=102' },
  { id: 'cappuccino', name: 'Cappuccino', desc: 'Frothy and balanced', price: 4.25, img: 'https://image.pollinations.ai/prompt/cappuccino%20with%20latte%20art?width=800&height=800&seed=103' },
  { id: 'latte', name: 'Latte', desc: 'Smooth milk coffee', price: 4.5, img: 'https://image.pollinations.ai/prompt/latte%20coffee%20with%20foam?width=800&height=800&seed=104' },
  { id: 'mocha', name: 'Mocha', desc: 'Coffee with chocolate', price: 4.75, img: 'https://image.pollinations.ai/prompt/mocha%20coffee%20with%20chocolate%20drizzle?width=800&height=800&seed=105' },
  { id: 'iced', name: 'Iced Coffee', desc: 'Chilled & refreshing', price: 4.0, img: 'https://image.pollinations.ai/prompt/iced%20coffee%20with%20ice%20cubes?width=800&height=800&seed=106' },
  { id: 'flat-white', name: 'Flat White', desc: 'Smooth ristretto with milk', price: 4.2, img: 'https://image.pollinations.ai/prompt/flat%20white%20coffee%20cup?width=800&height=800&seed=107' },
  { id: 'macchiato', name: 'Macchiato', desc: 'Espresso topped with foam', price: 3.9, img: 'https://image.pollinations.ai/prompt/macchiato%20coffee%20with%20foam%20top?width=800&height=800&seed=108' },
  { id: 'affogato', name: 'Affogato', desc: 'Espresso over ice cream', price: 5.5, img: 'https://image.pollinations.ai/prompt/affogato%20with%20vanilla%20ice%20cream?width=800&height=800&seed=109' },
  { id: 'caramel-macchiato', name: 'Caramel Macchiato', desc: 'Sweet & creamy espresso', price: 5.25, img: 'https://image.pollinations.ai/prompt/caramel%20macchiato%20with%20caramel%20drizzle?width=800&height=800&seed=110' },
  { id: 'irish-coffee', name: 'Irish Coffee', desc: 'Coffee with cream & whiskey', price: 6.0, img: 'https://image.pollinations.ai/prompt/irish%20coffee%20with%20whipped%20cream?width=800&height=800&seed=111' },
  { id: 'cold-brew', name: 'Cold Brew', desc: 'Slow-brewed chilled coffee', price: 4.8, img: 'https://image.pollinations.ai/prompt/cold%20brew%20coffee%20glass?width=800&height=800&seed=112' }
];


/* ---------- Render Menu ---------- */
const menuContainer = document.getElementById('menu-items');

function renderMenu() {
  menuContainer.innerHTML = '';
  menuItems.forEach(item => {
    const card = document.createElement('article');
    card.className = 'menu-item';
    card.innerHTML = `
      <img loading="lazy" src="${item.img}" alt="${item.name}">
      <div class="menu-item-content">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="menu-item-price">
          <div class="price">$${item.price.toFixed(2)}</div>
          <div>
            <button class="add-btn" aria-label="Add ${item.name}" data-id="${item.id}"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      </div>
    `;
    menuContainer.appendChild(card);
  });

  // attach events
  $$('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = menuItems.find(m => m.id === id);
      if (!item) return;
      addToCart(item);
      // visual feedback
      btn.classList.add('added');
      btn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = '<i class="fas fa-plus"></i>';
      }, 900);
    });
  });
}

/* ---------- Cart logic ---------- */
let cart = [];
let cartTotal = 0;

function addToCart(item) {
  // Simple add (no quantity dedupe for demo)
  cart.push(item);
  cartTotal += item.price;
  updateCartView();
  chatAppend(`Added ${item.name} to your cart.`, 'bot');
}

function clearCart() {
  cart = [];
  cartTotal = 0;
  updateCartView();
}

function removeFromCart(index) {
  if (index < 0 || index >= cart.length) return;
  cartTotal -= cart[index].price;
  cart.splice(index, 1);
  updateCartView();
}

function updateCartView() {
  const box = document.getElementById('cart-items');
  box.innerHTML = '';
  if (cart.length === 0) {
    box.innerHTML = '<p class="muted">Cart is empty — add items from the menu.</p>';
  } else {
    cart.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div>
          <strong>${it.name}</strong><div class="small">${it.desc}</div>
        </div>
        <div style="text-align:right">
          <div>$${it.price.toFixed(2)}</div>
          <div style="margin-top:6px">
            <button class="btn ghost" onclick="removeFromCart(${idx})">Remove</button>
          </div>
        </div>
      `;
      box.appendChild(row);
    });
  }
  document.getElementById('cart-total').textContent = `Total: $${cartTotal.toFixed(2)}`;
}

/* ---------- Reservation ---------- */
function submitReservation(e) {
  e.preventDefault();
  const name = $('#res-name').value.trim();
  const contact = $('#res-contact').value.trim();
  const datetime = $('#res-datetime').value;
  const guests = $('#res-guests').value;
  if (!name || !contact || !datetime || !guests) return alert('Please fill reservation details');

  const reservation = { name, contact, datetime, guests, created: new Date().toISOString() };
  // for demo, keep in sessionStorage
  const all = JSON.parse(sessionStorage.getItem('reservations') || '[]');
  all.push(reservation);
  sessionStorage.setItem('reservations', JSON.stringify(all));

  $('#reservation-result').textContent = `Reservation saved: ${name} — ${guests} guests at ${new Date(datetime).toLocaleString()}`;
  document.getElementById('reservation-form').reset();
  chatAppend(`Reservation made for ${guests} guest(s) on ${new Date(datetime).toLocaleString()}`, 'bot');
}

/* ---------- Payments (client-side simulation) ---------- */
function payUPI() {
  const upi = $('#upi-id').value.trim();
  if (!upi) return alert('Enter UPI ID');
  if (cart.length === 0) return alert('Cart is empty');
  // simulate success
  $('#payment-status').textContent = `Payment of $${cartTotal.toFixed(2)} successful via ${upi}!`;
  clearCart();
  chatAppend(`Payment successful via UPI (${upi}). Thank you!`, 'bot');
}

function payCard() {
  const name = $('#card-name').value.trim();
  const number = $('#card-number').value.replace(/\s+/g, '');
  const exp = $('#card-exp').value.trim();
  const cvv = $('#card-cvv').value.trim();
  if (!name || !number || !exp || !cvv) return alert('Please complete card details');
  if (cart.length === 0) return alert('Cart is empty');

  // naive Luhn-like short validation for demo (not real)
  if (number.length < 12) return alert('Invalid card number');
  $('#payment-status').textContent = `Card payment of $${cartTotal.toFixed(2)} successful. Thank you, ${name}!`;
  clearCart();
  chatAppend(`Card payment successful. Thank you, ${name}!`, 'bot');
}

/* ---------- Chatbot logic (ready-made questions + small rule-based responses) ---------- */
const chatArea = document.getElementById('chat-area');

function chatAppend(text, who='bot') {
  const div = document.createElement('div');
  div.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
  if (who === 'user') {
    div.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`;
  } else {
    div.innerHTML = `<div class="avatar"><i class="fas fa-robot"></i></div><div class="bubble">${escapeHtml(text)}</div>`;
  }
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
}

/* escape minimal */
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function sendChatInput(){
  const inp = $('#chat-input');
  const text = inp.value.trim();
  if (!text) return;
  chatAppend(text, 'user');
  inp.value = '';
  setTimeout(()=> respondToUser(text), 500);
}

function chatAsk(pre) {
  // simulate user clicking suggested action
  chatAppend(pre, 'user');
  setTimeout(()=> respondToUser(pre), 350);
}

/* respondToUser: rule-based responses tailored to this cafe */
function respondToUser(txt) {
  const msg = txt.toLowerCase();

  // menu related
  if (msg.includes('menu') || msg.includes('show') && msg.includes('menu')) {
    // summarize top items
    const names = menuItems.slice(0,8).map(m => `${m.name} ($${m.price.toFixed(2)})`).join(', ');
    chatAppend(`Here are some popular items: ${names}. Click the + next to an item to add to cart, or say "add latte" to add by voice.`, 'bot');
    return;
  }

  // add item by text e.g., "add latte" or "i want latte"
  const addMatch = msg.match(/\b(add|order|i want|i\'d like)\s+([a-z\s\-]+)\b/);
  if (addMatch) {
    const want = addMatch[2].trim();
    // fuzzy find
    const found = menuItems.find(m => m.name.toLowerCase().includes(want) || m.id.toLowerCase().includes(want));
    if (found) {
      addToCart(found);
      chatAppend(`Added ${found.name} to your cart. Cart total is $${cartTotal.toFixed(2)}.`, 'bot');
    } else {
      chatAppend(`I couldn't find "${want}" on the menu. Try "show menu" or another item name.`, 'bot');
    }
    return;
  }

  // view cart
  if (msg.includes('cart') || msg.includes('order') || msg.includes('what is in my cart') ){
    if (cart.length === 0) chatAppend('Your cart is empty. Use "show menu" to browse items.', 'bot');
    else {
      const summary = cart.map((c,i)=> `${i+1}. ${c.name} - $${c.price.toFixed(2)}`).join('\n');
      chatAppend(`Your cart:\n${summary}\nTotal: $${cartTotal.toFixed(2)}. Say "checkout" to proceed.`, 'bot');
    }
    return;
  }

  // checkout
  if (msg.includes('checkout') || msg.includes('payment') || msg.includes('pay')) {
    if (cart.length === 0) {
      chatAppend('Your cart is empty. Add items first.', 'bot');
    } else {
      chatAppend('Proceeding to payment section. Choose UPI or Card and follow the form.', 'bot');
      // scroll to section
      scrollToSection('payment');
    }
    return;
  }

  // reservation
  if (msg.includes('reservation') || msg.includes('reserve') || msg.includes('book table')) {
    chatAppend('To make a reservation, tell me name, date/time and guest count — or use the reservation form. Example: "Reserve for 2 at 19:00 tomorrow".', 'bot');
    return;
  }

  // location / contact
  if (msg.includes('location') || msg.includes('address') || msg.includes('where')) {
    chatAppend('We are at 123 Coffee Street, Brewville. See the Contact section for the map and phone number.', 'bot');
    scrollToSection('contact');
    return;
  }

  // greetings
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    chatAppend('Hello! How can I help today? Try "show menu", "order latte", or "make reservation".', 'bot');
    return;
  }

  // fallback
  chatAppend("Sorry, I didn't understand that. Try clicking one of the suggested actions: Show menu, Order latte, Make reservation, or View cart.", 'bot');
}

/* ---------- Helpers for UX ---------- */
function scrollToSection(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.scrollIntoView({behavior:'smooth', block:'start'});
}

/* ---------- Small helpers ---------- */
function init() {
  renderMenu();
  updateCartView();
  // prefill some chat suggestions to show functionality
  setTimeout(()=> {
    chatAppend('Tip: Click suggested actions or type commands like "add latte" or "checkout".', 'bot');
  }, 600);
}

init();
