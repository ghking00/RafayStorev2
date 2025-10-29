// script.js - Rafay Subscription Store (premium message)
// - Add-to-cart (supports .add-btn or inline addToCart(name, price))
// - Quantity controls & cart total
// - Sends premium WhatsApp order message (2nd / "more premium" version)

const cart = [];
const cartList = document.getElementById("cart-items");
const totalDisplay = document.getElementById("cart-total");
const orderBtn = document.getElementById("order-btn");

// Add item (callable from HTML inline or JS)
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price: Number(price), quantity: 1 });
  }
  updateCart();
}

// Attach to all .add-btn buttons (if using data-name/data-price structure)
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.closest(".product");
    if (!parent) return;
    const name = parent.dataset.name || parent.getAttribute("data-name") || parent.querySelector("h3")?.innerText || "Item";
    const price = parseInt(parent.dataset.price || parent.getAttribute("data-price") || 0, 10) || 0;
    addToCart(name, price);
  });
});

function updateCart() {
  if (!cartList) return;
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name}</span>
      <div class="quantity-controls">
        <button onclick="changeQuantity(${index}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${index}, 1)">+</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  if (totalDisplay) totalDisplay.textContent = total;
}

function changeQuantity(index, change) {
  if (!cart[index]) return;
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  updateCart();
}

// Build premium message and send via WhatsApp
if (orderBtn) {
  orderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Please add at least one item to your cart.");
      return;
    }

    let total = 0;
    let lines = [];

    cart.forEach((item, i) => {
      lines.push(`${i + 1}️⃣ ${item.name} — ${item.price} Rs × ${item.quantity}`);
      total += item.price * item.quantity;
    });

    // Premium message (the "more premium" version you approved)
    const message = [
      "💎✨ 𝗥𝗮𝗳𝗮𝘆 𝗦𝘂𝗯𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻 𝗦𝘁𝗼𝗿𝗲 — 𝗢𝗿𝗱𝗲𝗿 𝗗𝗲𝘁𝗮𝗶𝗹𝘀 🛍️ ✨💎",
      "─────────────────────────────",
      "🧾 Your Selected Items:",
      ...lines.map(l => l),
      "─────────────────────────────",
      `💰 Total Amount: ₨ ${total}`,
      "─────────────────────────────",
      "",
      "🌟 💳 Secure Payment Options 💳",
      "👤 Account Title: Abdul Rafeh",
      "",
      "💠 Easypaisa: 0314 8396100 — Abdul Rafeh",
      "💠 SadaPay: 0314 8396100 — Abdul Rafeh",
      "💠 U Paisa: 0301 3555251 — Abdul Rafeh",
      "💠 NayaPay: 0339 0116375 — Abdul Rafeh",
      "💠 JazzCash: 0339 0116375 — Abdul Rafeh",
      "💠 Zindagi: 0314 8396100 — Abdul Rafeh",
      "",
      "⚠️ Please send your payment screenshot after deposit for instant order activation.",
      "─────────────────────────────",
      "💻✨ For Premium Website Development:",
      "📞 Contact: 0314-1495075",
      "👩‍💻 Amna Rajpoot — Professional Developer & Ethical Hacker",
      "─────────────────────────────",
      "🚀 Thank you for choosing Rafay Subscription Store! We deliver trusted, fast, and secure services — always 💯✨"
    ].join("\n");

    const encoded = encodeURIComponent(message);
    const whatsappNumber = "923313943049"; // confirmed WhatsApp order number
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encoded}`;

    window.open(waUrl, "_blank");
  });
}

// expose for inline/on-page use
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.updateCart = updateCart;
