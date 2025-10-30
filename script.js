// script.js - Rafay Subscription Store (premium + animation edition + welcome voice)

// 🎧 Auto-play welcome voice with smooth fade-in (once per session)
document.addEventListener("DOMContentLoaded", () => {
  if (!sessionStorage.getItem("welcomePlayed")) {
    const audio = new Audio("assets/welcome.mp3");
    audio.volume = 0;
    const playAudio = () => {
      audio.play().then(() => {
        sessionStorage.setItem("welcomePlayed", "true");
        let vol = 0;
        const fade = setInterval(() => {
          vol += 0.05;
          if (vol >= 1) {
            vol = 1;
            clearInterval(fade);
          }
          audio.volume = vol;
        }, 100);
      }).catch(() => {});
    };

    // Try autoplay instantly
    audio.play().then(() => {
      sessionStorage.setItem("welcomePlayed", "true");
    }).catch(() => {
      // If blocked, start after first click
      document.body.addEventListener("click", playAudio, { once: true });
    });
  }
});

// ---------- LUXURY VISUALS SECTION ----------
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.id = "fireworks";
  Object.assign(canvas.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: "-2",
    pointerEvents: "none",
    background: "transparent"
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let fireworks = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  class Firework {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = 2;
      this.alpha = 1;
      this.particles = Array.from({ length: 40 }, () => ({
        x: x,
        y: y,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 5 + 1,
        alpha: 1
      }));
    }
    draw() {
      this.particles.forEach(p => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed + 0.5;
        p.alpha -= 0.02;
        ctx.beginPath();
        ctx.arc(p.x, p.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${p.alpha})`;
        ctx.fill();
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach((f, i) => {
      f.draw();
      if (f.particles.every(p => p.alpha <= 0)) fireworks.splice(i, 1);
    });
    requestAnimationFrame(animate);
  }
  animate();

  // ✨ More visible random fireworks (luxury gold)
  setInterval(() => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.6;
    const color = `${255}, ${Math.floor(Math.random() * 180 + 70)}, 50`;
    fireworks.push(new Firework(x, y, color));
  }, 900);
});

// ---------- CART LOGIC ----------
const cart = [];
const cartList = document.getElementById("cart-items");
const totalDisplay = document.getElementById("cart-total");
const orderBtn = document.getElementById("order-btn");

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) existing.quantity++;
  else cart.push({ name, price: Number(price), quantity: 1 });
  updateCart();
  sparkleEffect();
}

document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.closest(".product");
    if (!parent) return;
    const name = parent.dataset.name || parent.querySelector("h3")?.innerText || "Item";
    const price = parseInt(parent.dataset.price || 0, 10) || 0;
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
      <span class="fade-in">${item.name}</span>
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

    const message = [
      "💎✨ 𝗥𝗮𝗳𝗮𝘆 𝗦𝘂𝗯𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻 𝗦𝘁𝗼𝗿𝗲 — 𝗢𝗿𝗱𝗲𝗿 𝗗𝗲𝘁𝗮𝗶𝗹𝘀 🛍️ ✨💎",
      "─────────────────────────────",
      "🧾 Your Selected Items:",
      ...lines,
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
      "🚀 Thank you for choosing Rafay Subscription Store! 💯✨"
    ].join("\n");

    const encoded = encodeURIComponent(message);
    const whatsappNumber = "923313943049";
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encoded}`;
    window.open(waUrl, "_blank");
  });
}

// ✨ Small sparkle animation on add
function sparkleEffect() {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";
  sparkle.innerHTML = "✨";
  Object.assign(sparkle.style, {
    position: "fixed",
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    fontSize: "22px",
    animation: "fadeSparkle 1.3s ease-out forwards",
    pointerEvents: "none",
    color: "gold"
  });
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 1300);
}

window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.updateCart = updateCart;
