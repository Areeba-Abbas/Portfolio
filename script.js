// Change navbar background on scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".custom-navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
// <!-- Typewriter Script -->
document.addEventListener("DOMContentLoaded", () => {
  const words = [
    "Areeba Abbas",
    "a Web Developer",
    "a Designer",
    "a Programmer",
  ];
  let i = 0;
  let j = 0;
  let currentWord = "";
  let isDeleting = false;
  const speed = 150; // typing speed
  const delay = 2000; // wait before deleting
  const typedText = document.getElementById("typed-text");

  function typeEffect() {
    currentWord = words[i];
    typedText.textContent = currentWord.substring(0, j);

    if (!isDeleting && j < currentWord.length) {
      j++;
      setTimeout(typeEffect, speed);
    } else if (isDeleting && j > 0) {
      j--;
      setTimeout(typeEffect, speed / 1.8);
    } else {
      if (!isDeleting) {
        isDeleting = true;
        setTimeout(typeEffect, delay);
      } else {
        isDeleting = false;
        i = (i + 1) % words.length;
        setTimeout(typeEffect, 400);
      }
    }
  }

  typeEffect();
});
// ABOUT: reveal animation + count-up + in-view checks
// ABOUT SECTION — robust reveal + count-up + card reveal
document.addEventListener("DOMContentLoaded", () => {
  // --- Helpers --------------------------------------------------------------
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // Smooth count-up with easing
  function animateCount(el, to, duration = 1400, suffix = "") {
    const start = performance.now();
    const from = 0;
    function frame(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const current = Math.round(from + (to - from) * eased);
      el.textContent = current + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = to + suffix; // ensure exact final
    }
    requestAnimationFrame(frame);
  }

  // --- About box reveal ----------------------------------------------------
  const aboutBox = document.querySelector(".about-box");
  if (aboutBox) {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aboutBox.classList.add("in-view"); // CSS handles translate/opacity
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    obs.observe(aboutBox);
  }

  // --- Stats cards reveal + count-up ---------------------------------------
  const statCards = document.querySelectorAll(
    ".stat-box, .stat-card, .stat-box, .stat-card"
  );
  // The markup in your page may be .stat-box or .stat-card depending on which version you used.
  // We'll select any matching ones and handle them uniformly.
  const stats = Array.from(statCards).filter(Boolean);

  if (stats.length) {
    const statObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("in-view"); // CSS reveals with translateY/opacity
          // find number element inside (data-target attribute)
          const numEl = el.querySelector(
            ".stat-number, .count, .stat-number, h3.count"
          );
          if (numEl && !numEl.dataset.animated) {
            const raw =
              numEl.getAttribute("data-target") ||
              numEl.getAttribute("data-target") ||
              numEl.textContent.trim();
            // Parse numeric target
            let target = parseInt(raw.toString().replace(/[^0-9]/g, ""), 10);
            if (isNaN(target)) target = 0;
            // Decide suffix (you had people using + or %)
            let suffix = "";
            // if original target was 100 treat as plus; if 99 treat as % (your earlier example)
            const rawAttr = numEl.getAttribute("data-target") || "";
            if (rawAttr.indexOf("%") !== -1 || rawAttr === "99") suffix = "%";
            else if (target >= 100) suffix = "+";
            animateCount(numEl, target, 1400, suffix);
            numEl.dataset.animated = "1";
          }
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );

    stats.forEach((s) => statObserver.observe(s));
  }

  // --- Optional: small entrance stagger for cards (CSS + class used)
  // If you want the cards to animate with a stagger, add delays via style when they come into view.
  const revealStagger = () => {
    const visibleCards = document.querySelectorAll(
      ".stat-box.in-view, .stat-card.in-view"
    );
    visibleCards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 120}ms`;
    });
  };

  // observe changes to add stagger when any stat becomes in-view
  const mo = new MutationObserver(() => revealStagger());
  mo.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ["class"],
  });
});
// Slide-in effect when About section scrolls into view
const aboutObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        aboutBox.classList.add("in-view");
      }
    });
  },
  { threshold: 0.3 }
);

// aboutObserver.observe(aboutBox);
////// skills section ////////////
function createSkillCircle(container, percent, skill) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("skill-circle");

  const wave = document.createElement("div");
  wave.classList.add("skill-wave");
  wrapper.appendChild(wave);

  const text = document.createElement("div");
  text.classList.add("skill-text");
  text.textContent = "0%";
  wrapper.appendChild(text);

  const label = document.createElement("div");
  label.classList.add("skill-label");
  label.textContent = skill;

  container.appendChild(wrapper);
  container.appendChild(label);

  container.skillElements = { wave, text, percent };
  container.filled = false;
}

function fillSkill(container) {
  if (container.filled) return;
  container.filled = true;

  const { wave, text, percent } = container.skillElements;
  let current = 0;
  const fill = setInterval(() => {
    if (current < percent) {
      current++;
      text.textContent = current + "%";
      wave.style.top = 100 - current + "%";
    } else {
      clearInterval(fill);
    }
  }, 35);
}

document.addEventListener("DOMContentLoaded", () => {
  const skillDivs = document.querySelectorAll("#skills .col-md-3");

  skillDivs.forEach((div) => {
    const percent = parseInt(div.dataset.percent);
    const skill = div.dataset.skill;
    createSkillCircle(div, percent, skill);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) fillSkill(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  skillDivs.forEach((div) => observer.observe(div));
});
//////////////// project section//////////////
/* ===== Projects swipe + modal logic ===== */
document.addEventListener("DOMContentLoaded", function () {
  // Init Swiper
  const projSwiper = new Swiper(".proj-swiper", {
    slidesPerView: 3,
    spaceBetween: 28,
    loop: true,
    pagination: {
      el: ".proj-pagination",
      clickable: true,
      bulletClass: "swiper-pagination-bullet",
      bulletActiveClass: "swiper-pagination-bullet-active",
    },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 14 },
      576: { slidesPerView: 1.25, spaceBetween: 16 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      992: { slidesPerView: 3, spaceBetween: 28 },
    },
  });

  // Projects data (replace `img:` values with your actual file paths)
  const PROJECTS = [
    {
      img: "popup-project-1.jpg",
      title: "Website Design for Marketing Agency Startup",
      desc: "I build fully responsive, interactive websites using custom HTML, CSS, Bootstrap, and JavaScript. Each layout is coded from scratch with attention to speed, animation, and design flow. My goal is to create digital experiences that look modern and perform flawlessly. You can also hire me to craft a unique and professional website for your brand.",
      type: "Website",
      lang: "PHP, HTML, CSS, JS",
      platform: "Web",
      country: "Pakistan",
      url: "#",
    },
    {
      img: "popup-project-2.jpg",
      title: "Business & Corporate Websites",
      desc: "I created this digital marketing site to highlight SEO, Ads, and campaign services with a clean, high-converting design. Every section is structured to attract clients and build trust. Optimized coding ensures speed, clarity, and performance. You can get your own powerful agency website built just like this.",
      type: "App",
      lang: "Figma",
      platform: "Mobile",
      country: "USA",
      url: "#",
    },
    {
      img: "popup-project-3.jpg",
      title: "Portfolio & Personal Branding Sites",
      desc: "I design and customize WordPress websites with precision — combining design freedom and technical reliability. My builds are responsive, SEO-ready, and easy to manage. From themes to plugins, everything is optimized for smooth performance. You can work with me to get a professional, fully customized WordPress site.",
      type: "Dashboard",
      lang: "HTML,CSS",
      platform: "Web",
      country: "UK",
      url: "#",
    },
    {
      img: "popup-project-4.jpg",
      title: "E-Commerce Website Design",
      desc: "This project shows my skill in developing modern, conversion-focused online stores. I create seamless product pages, animations, and secure checkout systems. Each e-commerce layout is coded for mobile performance and user comfort. You can hire me to design an online store that truly sells.",
      type: "E-commerce",
      lang: "HTML,JS",
      platform: "Shopify",
      country: "USA",
      url: "#",
    },
    {
      img: "popup-project-5.jpg",
      title: "WordPress Website Development",
      desc: "I love creating portfolio websites that reflect individuality and professionalism. Clean design, smooth motion, and strong visual balance define my approach. Each site is fast, responsive, and thoughtfully coded. Let me help you build a personal brand that stands out online.",
      type: "Landing",
      lang: "HTML,CSS",
      platform: "Web",
      country: "Canada",
      url: "#",
    },
    {
      img: "popup-project-6.jpg",
      title: "Web Development Projects",
      desc: "For corporate clients, I build professional, minimal, and performance-driven websites. My coding ensures structure, clarity, and authority in every section. Each project reflects trust and modern design standards. You can collaborate with me to build a strong online identity for your business.",
      type: "App Site",
      lang: "HTML,JS",
      platform: "React",
      country: "India",
      url: "#",
    },
  ];

  // Modal elements
  const modal = document.querySelector(".proj-modal");
  const modalPanel = document.querySelector(".proj-modal-panel");
  const closeBtn = document.querySelector(".proj-modal-close");
  const modalImg = document.getElementById("projModalImg");
  const modalTitle = document.getElementById("projModalTitle");
  const modalDesc = document.getElementById("projModalDesc");
  const modalType = document.getElementById("projModalType");
  const modalLang = document.getElementById("projModalLang");
  const modalPlat = document.getElementById("projModalPlat");
  const modalCountry = document.getElementById("projModalCountry");
  const modalURL = document.getElementById("projModalURL");

  // Wire up open buttons — match data-index attribute
  document.querySelectorAll(".proj-open-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const idx = Number(btn.getAttribute("data-index") || 0);
      const data = PROJECTS[idx] || PROJECTS[0];

      // Set content (use absolute or relative paths depending on where your images live)
      modalImg.src = data.img;
      modalImg.alt = data.title;
      modalTitle.textContent = data.title;
      modalDesc.textContent = data.desc;
      modalType.textContent = data.type;
      modalLang.textContent = data.lang;
      modalPlat.textContent = data.platform;
      modalCountry.textContent = data.country;
      modalURL.href = data.url;
      modalURL.textContent = data.url;

      // open modal
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden"; // optional: prevent body scroll
    });
  });
      
  // Close handlers
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    // small timeout to allow panel transition (optional)
    setTimeout(() => {
      modalImg.src = "";
    }, 300);
  }
});
///////////Contact section js ////////////
// <!-- AOS Animation -->
AOS.init({
  duration: 1000,
  once: true,
});
// Footer section js//////////
