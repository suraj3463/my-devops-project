const QUOTES = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", theme: "motivation" },
  { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", theme: "perseverance" },
  { quote: "Creativity is intelligence having fun.", author: "Albert Einstein", theme: "creativity" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", theme: "dreams" },
  { quote: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", theme: "hope" },
  { quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", theme: "wisdom" },
  { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon", theme: "life" },
  { quote: "The mind is everything. What you think you become.", author: "Buddha", theme: "wisdom" },
  { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", theme: "success" },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", theme: "motivation" },
  { quote: "Love is not about possession. It's about appreciation.", author: "Osho", theme: "love" },
  { quote: "Where there is love there is life.", author: "Mahatma Gandhi", theme: "love" },
];

const THEMES = ["Any", "Motivation", "Love", "Life", "Success", "Wisdom", "Creativity", "Hope"];
let selectedTheme = "Any";
let currentQuote = null;

// Render theme buttons
const themesEl = document.getElementById("themes");
THEMES.forEach(t => {
  const btn = document.createElement("button");
  btn.className = "theme-btn" + (t === "Any" ? " active" : "");
  btn.textContent = t;
  btn.onclick = () => {
    selectedTheme = t;
    document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };
  themesEl.appendChild(btn);
});

function generateQuote() {
  const btn = document.getElementById("generateBtn");
  const btnText = document.getElementById("btnText");
  btn.disabled = true;
  btnText.textContent = "⟳ Crafting your quote...";

  setTimeout(() => {
    const filtered = selectedTheme === "Any"
      ? QUOTES
      : QUOTES.filter(q => q.theme.toLowerCase() === selectedTheme.toLowerCase());
    const pool = filtered.length > 0 ? filtered : QUOTES;
    currentQuote = pool[Math.floor(Math.random() * pool.length)];

    document.getElementById("quoteText").textContent = currentQuote.quote;
    document.getElementById("quoteAuthor").textContent = "— " + currentQuote.author;
    document.getElementById("quoteTheme").textContent = currentQuote.theme;
    document.getElementById("quoteCard").style.display = "block";

    btn.disabled = false;
    btnText.textContent = "✦ Generate Quote";
  }, 1200);
}

function copyQuote() {
  if (!currentQuote) return;
  navigator.clipboard.writeText('"' + currentQuote.quote + '" — ' + currentQuote.author);
  alert("Quote copied!");
}

function shareQuote() {
  if (!currentQuote) return;
  const text = '"' + currentQuote.quote + '" — ' + currentQuote.author;
  if (navigator.share) {
    navigator.share({ text });
  } else {
    copyQuote();
  }
}

function downloadQuote() {
  if (!currentQuote) return;
  const canvas = document.createElement("canvas");
  canvas.width = 1200; canvas.height = 675;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, 1200, 675);

  const grad = ctx.createLinearGradient(100, 0, 1100, 0);
  grad.addColorStop(0, "transparent");
  grad.addColorStop(0.5, "#c9a84c");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(100, 80, 1000, 2);

  ctx.font = "120px Georgia";
  ctx.fillStyle = "rgba(201,168,76,0.2)";
  ctx.fillText("\u201C", 80, 200);

  ctx.font = "italic 36px Georgia";
  ctx.fillStyle = "#e8e0d0";
  const words = currentQuote.quote.split(" ");
  let line = "", y = 250;
  words.forEach(word => {
    const test = line + word + " ";
    if (ctx.measureText(test).width > 900) {
      ctx.fillText(line.trim(), 150, y);
      line = word + " "; y += 50;
    } else { line = test; }
  });
  ctx.fillText(line.trim(), 150, y);

  ctx.font = "24px sans-serif";
  ctx.fillStyle = "#c9a84c";
  ctx.fillText("— " + currentQuote.author, 150, y + 80);

  ctx.fillStyle = grad;
  ctx.fillRect(100, 595, 1000, 2);

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "quote.png"; a.click();
    URL.revokeObjectURL(url);
  });
}
