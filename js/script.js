/* =========================================================

   KONFIGURASI UNDANGAN

   ========================================================= */


const WEDDING_CONFIG = {
  groom: "Tyo",
  bride: "Pani",

  // Tanggal yang ditampilkan pada cover
  dateLabel: "Minggu, 15 November 2026",

  // Hitung mundur dan simpan kalender menuju RESEPSI
  weddingDate: "2026-11-15T10:00:00+07:00",

  mapsUrl: "https://maps.google.com/?q=Dusun+Beringin+Desa+Tanjung+Putus",
  calendarTitle: "Resepsi Pernikahan Tyo & Pani",
  calendarLocation: "Dusun Beringin, Desa Tanjung Putus",
  calendarDescription: "Resepsi pernikahan Tyo dan Pani"
};




const $ = (selector, root = document) => root.querySelector(selector);

const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];



function applyInvitationData() {

  $$("[data-groom]").forEach(el => { el.textContent = WEDDING_CONFIG.groom; });

  $$("[data-bride]").forEach(el => { el.textContent = WEDDING_CONFIG.bride; });

  $$("[data-date-label]").forEach(el => { el.textContent = WEDDING_CONFIG.dateLabel; });

  document.title = `Undangan Pernikahan ${WEDDING_CONFIG.groom} & ${WEDDING_CONFIG.bride}`;

  $("#mapsLink").href = WEDDING_CONFIG.mapsUrl;



  const params = new URLSearchParams(window.location.search);

  const guest = params.get("to");

  if (guest && guest.trim()) {

    $("#guestName").textContent = guest.trim().replace(/\+/g, " ").slice(0, 100);

  }

}



/* =========================================================

   ANIMASI BUNGA SAKURA

   ========================================================= */

const sakuraChars = ['❀', '✿', '❁', '🌸'];



function createCoverSakura() {

  const topLayer = $("#coverSakuraTop");

  const bottomLayer = $("#coverSakuraBottom");

  if (!topLayer || !bottomLayer) return;



  // 1. Bunga Jatuh dari Atas

  setInterval(() => {

    if (document.hidden || $("#cover").classList.contains("hidden")) return;

    const petal = document.createElement("span");

    petal.className = "sakura-fall";

    petal.textContent = sakuraChars[Math.floor(Math.random() * sakuraChars.length)];

    petal.style.left = `${Math.random() * 100}%`;

    petal.style.animationDuration = `${5 + Math.random() * 4}s`;

    petal.style.fontSize = `${14 + Math.random() * 10}px`;

    topLayer.appendChild(petal);

    petal.addEventListener("animationend", () => petal.remove(), { once: true });

  }, 800);



  // 2. Tangkai bunga tumbuh dari bawah (hanya di halaman cover)
  const growTimer = window.setInterval(() => {
    if (document.hidden || $("#cover").classList.contains("hidden")) {
      window.clearInterval(growTimer);
      return;
    }
    const stem = document.createElement("span");
    stem.className = "cover-flower-stem";
    stem.setAttribute("aria-hidden", "true");
    stem.style.left = `${8 + Math.random() * 84}%`;
    stem.style.animationDuration = `${3.8 + Math.random() * 1.4}s`;
    stem.style.setProperty("--stem-height", `${100 + Math.random() * 90}px`);
    stem.innerHTML = '<span class="stem-leaf leaf-one"></span><span class="stem-leaf leaf-two"></span><span class="stem-bloom">❀</span>';
    bottomLayer.appendChild(stem);
    stem.addEventListener("animationend", () => stem.remove(), { once: true });
  }, 2600);
}



// Panggil animasi sakura cover segera setelah load

window.addEventListener('load', createCoverSakura);





/* =========================================================

   FUNGSI BUKA UNDANGAN & MUSIK

   ========================================================= */

function openInvitation() {

  const cover = $("#cover");

  const invitation = $("#invitation");

  cover.classList.add("cover-leaving");

  cover.style.transition = "opacity .65s ease, transform .65s ease";

  cover.style.opacity = "0";

  cover.style.transform = "scale(1.015)";

  window.setTimeout(() => {

    cover.classList.add("hidden");

    invitation.classList.remove("hidden");

    invitation.setAttribute("aria-hidden", "false");

    document.body.classList.add("invitation-open");

    window.scrollTo({ top: 0, behavior: "auto" });

    observeRevealElements();

    startMusic();

    initScrollSakura(); // Aktifkan bunga saat scroll

  }, 620);

}



const music = $("#weddingMusic");

const musicToggle = $("#musicToggle");

let musicStarted = false;



async function startMusic() {

  if (!music) return;

  try {

    await music.play();

    musicStarted = true;

    updateMusicButton(true);

  } catch (error) {

    updateMusicButton(false);

    $("#musicText").textContent = "Putar";

  }

}



function updateMusicButton(playing) {

  musicToggle.classList.toggle("playing", playing);

  musicToggle.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");

  $("#musicIcon").textContent = playing ? "♫" : "▶";

  $("#musicText").textContent = playing ? "Musik" : "Putar";

}



musicToggle.addEventListener("click", async () => {

  if (music.paused) {

    await startMusic();

  } else {

    music.pause();

    updateMusicButton(false);

  }

});



document.addEventListener("visibilitychange", () => {

  if (document.hidden && music && !music.paused) music.pause();

  else if (!document.hidden && musicStarted && music && music.paused) {

    updateMusicButton(false);

  }

});



/* =========================================================

   ANIMASI SAKURA SAAT SCROLL

   ========================================================= */

function initScrollSakura() {

  const layer = $("#scrollSakuraLayer");

  if (!layer) return;



  let lastScrollTop = 0;



  window.addEventListener("scroll", () => {

    const st = window.pageYOffset || document.documentElement.scrollTop;



    // Munculkan bunga setiap scroll ke bawah

    if (st > lastScrollTop && Math.random() < 0.22) {

      const petal = document.createElement("span");

      petal.className = "scroll-sakura";

      petal.textContent = sakuraChars[Math.floor(Math.random() * sakuraChars.length)];



      // Posisi acak di layar

      petal.style.left = `${Math.random() * 100}%`;

      petal.style.top = `${Math.random() * 65 + 15}%`; // 10% s/d 90% tinggi layar

      petal.style.fontSize = `${12 + Math.random() * 10}px`;



      layer.appendChild(petal);

      petal.addEventListener("animationend", () => petal.remove(), { once: true });

    }

    lastScrollTop = st <= 0 ? 0 : st;

  }, { passive: true });

}





/* =========================================================

   FITUR PENDUKUNG (Countdown, Form, Reveal)

   ========================================================= */

function observeRevealElements() {

  const elements = $$(".reveal:not([data-observed])");

  if (!("IntersectionObserver" in window)) {

    elements.forEach(el => el.classList.add("is-visible"));

    return;

  }

  const observer = new IntersectionObserver((entries, currentObserver) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("is-visible");

        currentObserver.unobserve(entry.target);

      }

    });

  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });



  elements.forEach(el => {

    el.dataset.observed = "true";

    observer.observe(el);

  });

}



function updateCountdown() {

  const target = new Date(WEDDING_CONFIG.weddingDate).getTime();

  if (Number.isNaN(target)) return;



  const diff = target - Date.now();

  if (diff <= 0) {

    ["days", "hours", "minutes", "seconds"].forEach(id => { $(`#${id}`).textContent = "00"; });

    $("#countdownMessage").textContent = "Hari bahagia kami telah tiba. Terima kasih atas doa Anda.";

    return;

  }

  const days = Math.floor(diff / 86400000);

  const hours = Math.floor((diff % 86400000) / 3600000);

  const minutes = Math.floor((diff % 3600000) / 60000);

  const seconds = Math.floor((diff % 60000) / 1000);

  $("#days").textContent = String(days).padStart(2, "0");

  $("#hours").textContent = String(hours).padStart(2, "0");

  $("#minutes").textContent = String(minutes).padStart(2, "0");

  $("#seconds").textContent = String(seconds).padStart(2, "0");

}



function downloadCalendarEvent() {

  const start = new Date(WEDDING_CONFIG.weddingDate);

  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

  const toICS = date => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const escapeICS = text => String(text).replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r?\n/g, "\\n");

  const ics = [

    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Undangan Digital//ID",

    "BEGIN:VEVENT",

    `DTSTART:${toICS(start)}`,

    `DTEND:${toICS(end)}`,

    `SUMMARY:${escapeICS(WEDDING_CONFIG.calendarTitle)}`,

    `LOCATION:${escapeICS(WEDDING_CONFIG.calendarLocation)}`,

    `DESCRIPTION:${escapeICS(WEDDING_CONFIG.calendarDescription)}`,

    "END:VEVENT", "END:VCALENDAR"

  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "undangan-pernikahan-tyo-pani.ics";

  document.body.appendChild(a);

  a.click();

  a.remove();

  URL.revokeObjectURL(url);

}



$("#openInvitation").addEventListener("click", openInvitation);

$("#calendarButton").addEventListener("click", downloadCalendarEvent);



$("#rsvpForm").addEventListener("submit", event => {

  event.preventDefault();

  const name = $("#senderName").value.trim();

  const attendance = $("#attendance").value;

  const message = $("#message").value.trim();

  if (!name || !attendance || !message) return;



  const item = document.createElement("article");

  item.className = "wish-item";

  const heading = document.createElement("div");

  const strong = document.createElement("strong");

  strong.textContent = name;

  const status = document.createElement("small");

  status.textContent = attendance;

  heading.append(strong, status);

  const paragraph = document.createElement("p");

  paragraph.textContent = message;

  item.append(heading, paragraph);

  $("#wishList").prepend(item);

  $("#formFeedback").textContent = "Terima kasih! Ucapan ditampilkan pada halaman ini.";

  $("#rsvpForm").reset();

});



applyInvitationData();

updateCountdown();

window.setInterval(updateCountdown, 1000);

observeRevealElements();

function salinRekening() {
  const nomor = document
    .getElementById("nomorRekening")
    .textContent.trim();

  navigator.clipboard.writeText(nomor)
    .then(() => {
      alert("Nomor rekening berhasil disalin!");
    })
    .catch(() => {
      alert("Nomor rekening: " + nomor);
    });
}
