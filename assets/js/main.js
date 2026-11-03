/**
 * RODRIGUES ADVOCACIA E CONSULTORIA JURÍDICA
 * JavaScript Interativo & Performance
 * Em conformidade com UI/UX Pro Max e Diretrizes OAB
 */

import { BlogStore } from "./blogStore.js";

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Constantes de Configuração
  const CONFIG = {
    whatsappNumber: "5577998544309",
    gaMeasurementId: "G-XXXXXXXXXX", // Substitua pelo ID do Google Analytics 4 do cliente
  };

  /* ==========================================================================
     1. Disparo de Eventos Google Analytics 4 (Conformidade com o Briefing)
     ========================================================================== */
  function trackEvent(eventName, eventParams = {}) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, eventParams);
    }
    // Log para fins de debug e auditoria em desenvolvimento
    // console.log("[Analytics Event]", eventName, eventParams);
  }

  /* ==========================================================================
     2. Navegação Mobile (Drawer & Backdrop)
     ========================================================================== */
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileBackdrop = document.getElementById("mobileBackdrop");
  const mobileClose = document.getElementById("mobileClose");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function openMobileMenu() {
    if (mobileMenu && mobileBackdrop) {
      mobileMenu.classList.add("is-open");
      mobileBackdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
      if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "true");
    }
  }

  function closeMobileMenu() {
    if (mobileMenu && mobileBackdrop) {
      mobileMenu.classList.remove("is-open");
      mobileBackdrop.classList.remove("is-open");
      document.body.style.overflow = "";
      if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "false");
    }
  }

  if (mobileToggle) mobileToggle.addEventListener("click", openMobileMenu);
  if (mobileClose) mobileClose.addEventListener("click", closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeMobileMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  /* ==========================================================================
     3. Tabs de Problemas Comuns ("Você está passando por isso?")
     ========================================================================== */
  const problemTabBtns = document.querySelectorAll(".problem-tab-btn");
  const problemCards = document.querySelectorAll(".problem-card");

  problemTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      problemTabBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const selectedCategory = btn.getAttribute("data-category");

      problemCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (selectedCategory === "all" || cardCategory === selectedCategory) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* ==========================================================================
     4. FAQ Accordion & Filtros por Categoria & Busca em Tempo Real
     ========================================================================== */
  const faqItems = document.querySelectorAll(".faq-item");
  const faqFilterBtns = document.querySelectorAll(".faq-filter-btn");
  const faqSearchInput = document.getElementById("faqSearchInput");
  const loadMoreFaqBtn = document.getElementById("loadMoreFaqBtn");
  const faqAdditionalContainer = document.getElementById("faqAdditionalContainer");

  // Toggle do Accordion
  faqItems.forEach((item) => {
    const header = item.querySelector(".faq-header");
    if (header) {
      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        // Opcional: fechar outros itens para modo sanfona limpo
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove("is-open");
            const otherHeader = other.querySelector(".faq-header");
            if (otherHeader) otherHeader.setAttribute("aria-expanded", "false");
          }
        });

        if (isOpen) {
          item.classList.remove("is-open");
          header.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("is-open");
          header.setAttribute("aria-expanded", "true");
        }
      });
    }
  });

  // Filtros por Categoria do FAQ
  faqFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      faqFilterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filterCat = btn.getAttribute("data-faq-filter");
      filterFaqItems(filterCat, faqSearchInput ? faqSearchInput.value : "");
    });
  });

  // Busca em tempo real no FAQ
  if (faqSearchInput) {
    faqSearchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      const activeBtn = document.querySelector(".faq-filter-btn.is-active");
      const currentCategory = activeBtn ? activeBtn.getAttribute("data-faq-filter") : "all";
      filterFaqItems(currentCategory, term);
    });
  }

  function filterFaqItems(category, searchTerm) {
    const allFaqs = document.querySelectorAll(".faq-item");
    const term = searchTerm.toLowerCase();

    allFaqs.forEach((item) => {
      const itemCat = item.getAttribute("data-faq-category");
      const itemText = item.textContent.toLowerCase();

      const matchesCat = category === "all" || itemCat === category;
      const matchesSearch = term === "" || itemText.includes(term);

      if (matchesCat && matchesSearch) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  // Revelar Banco Completo de Dúvidas
  if (loadMoreFaqBtn && faqAdditionalContainer) {
    loadMoreFaqBtn.addEventListener("click", () => {
      if (faqAdditionalContainer.style.display === "none" || !faqAdditionalContainer.style.display) {
        faqAdditionalContainer.style.display = "block";
        loadMoreFaqBtn.textContent = "Recolher banco adicional de dúvidas";
        loadMoreFaqBtn.setAttribute("aria-expanded", "true");
      } else {
        faqAdditionalContainer.style.display = "none";
        loadMoreFaqBtn.textContent = "Ver mais dúvidas frequentes do nosso banco jurídico";
        loadMoreFaqBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ==========================================================================
     5. Máscara de Telefone WhatsApp
     ========================================================================== */
  const phoneInput = document.getElementById("clientPhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "");
      if (v.length > 11) v = v.substring(0, 11);

      if (v.length > 10) {
        // (99) 99999-9999
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
      } else if (v.length > 6) {
        // (99) 9999-9999
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
      } else if (v.length > 0) {
        v = v.replace(/^(\d{0,2})$/, "($1");
      }
      e.target.value = v;
    });
  }

  /* ==========================================================================
     6. Envio do Formulário de Contato & Conversão para WhatsApp
     ========================================================================== */
  const contactForm = document.getElementById("legalContactForm");
  const formFeedback = document.getElementById("formFeedback");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("clientName").value.trim();
      const phone = document.getElementById("clientPhone").value.trim();
      const subject = document.getElementById("clientSubject").value;
      const message = document.getElementById("clientMessage").value.trim();
      const lgpd = document.getElementById("clientLgpd").checked;

      if (!name || !phone || !subject || !lgpd) {
        if (formFeedback) {
          formFeedback.textContent = "Por favor, preencha todos os campos obrigatórios e marque o aceite da LGPD.";
          formFeedback.className = "form-feedback is-error";
          formFeedback.style.display = "block";
        }
        return;
      }

      // Registro da Conversão no Google Analytics 4
      trackEvent("generate_lead", {
        category: "Contact Form",
        subject: subject,
        method: "WhatsApp Redirect",
      });

      // Feedback visual ao usuário
      if (formFeedback) {
        formFeedback.innerHTML = `<strong>Recebido com sucesso!</strong> Redirecionando para o WhatsApp da Dra. Ezisvane...`;
        formFeedback.className = "form-feedback is-success";
        formFeedback.style.display = "block";
      }

      // Monta texto formatado e elegante para envio
      let whatsappText = `Olá, Dra. Ezisvane!\nMeu nome é *${name}*.\n`;
      whatsappText += `Gostaria de uma orientação jurídica sobre: *${subject}*.\n`;
      whatsappText += `Meu contato: ${phone}\n`;
      if (message) {
        whatsappText += `Breve resumo do meu caso: "${message}"\n`;
      }
      whatsappText += `\n(Enviado através do site oficial Rodrigues Advocacia)`;

      const encodedUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

      // Redireciona com atraso amigável para leitura do feedback
      setTimeout(() => {
        window.open(encodedUrl, "_blank");
        contactForm.reset();
      }, 700);
    });
  }

  /* ==========================================================================
     7. Rastreamento de Cliques em Botões de WhatsApp
     ========================================================================== */
  const whatsappTriggers = document.querySelectorAll(".track-whatsapp");
  whatsappTriggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const location = btn.getAttribute("data-location") || "general";
      trackEvent("click_whatsapp", {
        event_category: "Engagement",
        button_location: location,
      });
    });
  });

  /* ==========================================================================
     8. Banner de Consentimento de Cookies (LGPD)
     ========================================================================== */
  const cookieBanner = document.getElementById("cookieBanner");
  const btnAcceptAllCookies = document.getElementById("acceptAllCookies");
  const btnAcceptEssentialCookies = document.getElementById("acceptEssentialCookies");

  const consentStatus = localStorage.getItem("rodrigues_cookie_consent");

  if (!consentStatus && cookieBanner) {
    setTimeout(() => {
      cookieBanner.classList.add("is-active");
    }, 1200);
  }

  if (btnAcceptAllCookies) {
    btnAcceptAllCookies.addEventListener("click", () => {
      localStorage.setItem("rodrigues_cookie_consent", "all");
      if (cookieBanner) cookieBanner.classList.remove("is-active");
    });
  }

  if (btnAcceptEssentialCookies) {
    btnAcceptEssentialCookies.addEventListener("click", () => {
      localStorage.setItem("rodrigues_cookie_consent", "essential");
      if (cookieBanner) cookieBanner.classList.remove("is-active");
    });
  }

  /* ==========================================================================
     9. Botão "Voltar ao Topo"
     ========================================================================== */
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 450) {
        backToTopBtn.classList.add("is-visible");
      } else {
        backToTopBtn.classList.remove("is-visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* ==========================================================================
     10. Modais de Política de Privacidade e Termos de Uso
     ========================================================================== */
  const privacyModal = document.getElementById("privacyModal");
  const termsModal = document.getElementById("termsModal");

  const openPrivacyBtns = document.querySelectorAll(".open-privacy-modal");
  const openTermsBtns = document.querySelectorAll(".open-terms-modal");
  const modalCloseBtns = document.querySelectorAll(".modal-close-btn");

  function openModal(modal) {
    if (modal) {
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  openPrivacyBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  });

  openTermsBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(termsModal);
    });
  });

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(privacyModal);
      closeModal(termsModal);
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === privacyModal) closeModal(privacyModal);
    if (e.target === termsModal) closeModal(termsModal);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(privacyModal);
      closeModal(termsModal);
      closeMobileMenu();
    }
  });

  // Atualização dinâmica do ano no rodapé
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     11. Renderização dos Artigos Recentes do Blog na Home Page
     ========================================================================== */
  const homeBlogGrid = document.getElementById("homeBlogGrid");
  if (homeBlogGrid) {
    const latestPosts = BlogStore.getPosts({ includeDrafts: false }).slice(0, 3);
    if (latestPosts && latestPosts.length > 0) {
      homeBlogGrid.innerHTML = latestPosts.map(post => `
        <article class="blog-card" data-slug="${post.slug}">
          <div class="blog-card-img-wrap">
            <img src="${post.image}" alt="${post.title}" class="blog-card-img" loading="lazy">
            <span class="blog-card-category-badge">${post.category}</span>
          </div>
          <div class="blog-card-body">
            <div class="blog-card-meta">
              <span>${BlogStore.formatDate(post.publishedAt)}</span>
              <span class="blog-card-meta-dot"></span>
              <span>${post.readTime || '4 min'}</span>
            </div>
            <h3 class="blog-card-title">
              <a href="blog.html?artigo=${post.slug}">
                ${post.title}
              </a>
            </h3>
            <p class="blog-card-excerpt">
              ${post.excerpt}
            </p>
            <div class="blog-card-footer">
              <div class="blog-card-author">
                <img src="assets/images/dra-ezisvane.jpg" alt="Dra. Ezisvane Rodrigues" class="blog-card-author-avatar">
                <div class="blog-card-author-name">
                  ${post.author}
                  <div style="font-size: 0.72rem; color: var(--color-text-muted); font-weight: normal;">${post.authorOab}</div>
                </div>
              </div>
              <a href="blog.html?artigo=${post.slug}" class="blog-card-read-link">
                Ler Artigo &rarr;
              </a>
            </div>
          </div>
        </article>
      `).join("");
    }
  }
});
