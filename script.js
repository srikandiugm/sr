document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") document.body.classList.add("dark");
    updateThemeIcon();
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
      updateThemeIcon();
    });
  }

  const savedResult = localStorage.getItem("ecoResult");
  const saved = document.getElementById("savedResult");
  if (saved && savedResult) saved.textContent = savedResult + " kg CO₂ / hari";
});

function updateThemeIcon() {
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = document.body.classList.contains("dark") ? "☀" : "☾";
}

function toggleMenu() {
  const nav = document.querySelector(".topbar nav");
  if (!nav) return;
  const visible = getComputedStyle(nav).display !== "none";
  nav.style.display = visible ? "none" : "flex";
  nav.style.position = "absolute";
  nav.style.top = "58px";
  nav.style.left = "0";
  nav.style.right = "0";
  nav.style.background = "inherit";
  nav.style.padding = "18px 7%";
  nav.style.flexDirection = "column";
}

function showMessage(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function calculateCarbon() {
  const distance = Number(document.getElementById("distance")?.value || 0);
  const plastic = Number(document.getElementById("plastic")?.value || 0);
  const electricity = Number(document.getElementById("electricity")?.value || 0);

  if (distance === 0 && plastic === 0 && electricity === 0) {
    showMessage("Masukkan minimal satu data terlebih dahulu.");
    return;
  }

  // Estimasi sederhana untuk kebutuhan proyek edukasi, bukan alat ukur resmi.
  const emission = (distance * 0.21) + (plastic * 0.03) + (electricity * 0.45);
  const rounded = emission.toFixed(2);

  const result = document.getElementById("result");
  const bar = document.getElementById("progressBar");
  const score = document.getElementById("scoreText");
  const recommendation = document.getElementById("recommendation");

  if (result) result.textContent = rounded;
  if (bar) bar.style.width = Math.min(emission * 4, 100) + "%";

  let tips = [];
  if (distance > 10) tips.push("• Pertimbangkan berjalan kaki, sepeda, atau transportasi umum untuk sebagian perjalanan.");
  if (plastic > 3) tips.push("• Kurangi barang sekali pakai dan gunakan barang yang dapat dipakai ulang.");
  if (electricity > 5) tips.push("• Matikan perangkat yang tidak digunakan dan pertimbangkan perangkat hemat energi.");
  if (!tips.length) tips.push("• Kebiasaanmu terlihat cukup rendah dari input sederhana ini. Pertahankan dan terus belajar!");

  if (score) score.textContent = emission < 5 ? "Impact relatif rendah dari input ini." : emission < 10 ? "Impact sedang. Masih ada ruang untuk perbaikan." : "Impact cukup tinggi. Coba beberapa rekomendasi di bawah.";
  if (recommendation) recommendation.innerHTML = "<b>EcoTrack Recommendation</b><br><br>" + tips.join("<br>");

  localStorage.setItem("ecoResult", rounded);
  const saved = document.getElementById("savedResult");
  if (saved) saved.textContent = rounded + " kg CO₂ / hari";
}

function clearData() {
  ["distance", "plastic", "electricity"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const result = document.getElementById("result");
  const bar = document.getElementById("progressBar");
  const recommendation = document.getElementById("recommendation");
  if (result) result.textContent = "0.00";
  if (bar) bar.style.width = "0%";
  if (recommendation) recommendation.textContent = "";
  localStorage.removeItem("ecoResult");
  const saved = document.getElementById("savedResult");
  if (saved) saved.textContent = "Belum ada data";
}
