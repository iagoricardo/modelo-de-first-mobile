/**
 * RODRIGUES ADVOCACIA E CONSULTORIA JURÍDICA
 * Script da Página de Blog e Leitor de Artigos (blog.js)
 */

import { BlogStore } from "./blogStore.js";

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Elementos da Interface
  const blogListSection = document.getElementById("blogListSection");
  const blogHeroSection = document.getElementById("blogHeroSection");
  const blogControlsWrapper = document.getElementById("blogControlsWrapper");
  const blogReaderSection = document.getElementById("blogReaderSection");
  const blogGrid = document.getElementById("blogGrid");
  const searchInput = document.getElementById("blogSearchInput");
  const categoryPills = document.querySelectorAll(".category-pill");
  const blogToast = document.getElementById("blogToast");
  const blogToastMsg = document.getElementById("blogToastMsg");

  let currentCategory = "all";
  let searchQuery = "";

  // Helper para Exibir Notificação Toast
  function showToast(message) {
    if (!blogToast || !blogToastMsg) return;
    blogToastMsg.textContent = message;
    blogToast.classList.add("show");
    setTimeout(() => {
      blogToast.classList.remove("show");
    }, 3500);
  }

  // Renderizar os Cards da Listagem
  function renderBlogList() {
    if (!blogGrid) return;

    const posts = BlogStore.getPosts({
      includeDrafts: false,
      category: currentCategory,
      search: searchQuery
    });

    if (posts.length === 0) {
      blogGrid.innerHTML = `
        <div class="blog-empty-state" style="grid-column: 1 / -1;">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <h3>Nenhum artigo encontrado</h3>
          <p>Tente ajustar o termo de pesquisa ou selecione outra categoria jurídica.</p>
          <button type="button" class="btn btn-outline-gold" id="btnResetSearch">Ver todos os artigos</button>
        </div>
      `;
      const btnReset = document.getElementById("btnResetSearch");
      if (btnReset) {
        btnReset.addEventListener("click", () => {
          if (searchInput) searchInput.value = "";
          searchQuery = "";
          currentCategory = "all";
          categoryPills.forEach(p => p.classList.remove("is-active"));
          const firstPill = document.querySelector('.category-pill[data-category="all"]');
          if (firstPill) firstPill.classList.add("is-active");
          renderBlogList();
        });
      }
      return;
    }

    blogGrid.innerHTML = posts.map(post => `
      <article class="blog-card" data-slug="${post.slug}">
        <div class="blog-card-img-wrap">
          <img src="${post.image}" alt="${post.title}" class="blog-card-img" loading="lazy">
          <span class="blog-card-category-badge">${post.category}</span>
        </div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span>${BlogStore.formatDate(post.publishedAt)}</span>
            <span class="blog-card-meta-dot"></span>
            <span>${post.readTime || '4 min de leitura'}</span>
          </div>
          <h2 class="blog-card-title">
            <a href="blog.html?artigo=${post.slug}" class="article-link" data-slug="${post.slug}">
              ${post.title}
            </a>
          </h2>
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
            <a href="blog.html?artigo=${post.slug}" class="blog-card-read-link article-link" data-slug="${post.slug}">
              Ler Artigo
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </article>
    `).join("");

    // Adiciona evento de clique para abrir o leitor via SPA
    const articleLinks = blogGrid.querySelectorAll(".article-link");
    articleLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        // Se o usuário segurar Ctrl/Cmd, deixa abrir em nova aba
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        const slug = link.getAttribute("data-slug");
        if (slug) {
          openArticle(slug, true);
        }
      });
    });
  }

  // Abrir o Artigo Completo (Modo Leitor)
  function openArticle(slug, pushState = true) {
    const post = BlogStore.getPostBySlug(slug);
    if (!post) {
      showToast("Artigo não encontrado.");
      closeArticle(false);
      return;
    }

    // Incrementar visualização
    BlogStore.incrementView(slug);

    if (pushState) {
      history.pushState({ slug }, "", `blog.html?artigo=${slug}`);
    }

    // Atualizar título da página para SEO
    document.title = `${post.title} | Blog Dra. Ezisvane Rodrigues`;

    // Esconder listagem e hero
    if (blogHeroSection) blogHeroSection.style.display = "none";
    if (blogControlsWrapper) blogControlsWrapper.style.display = "none";
    if (blogListSection) blogListSection.style.display = "none";

    // Buscar artigos relacionados da mesma categoria
    const relatedPosts = BlogStore.getPosts({ includeDrafts: false })
      .filter(p => p.slug !== post.slug)
      .slice(0, 3);

    const shareUrl = encodeURIComponent(window.location.origin + window.location.pathname + `?artigo=${post.slug}`);
    const shareTitle = encodeURIComponent(post.title);
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`;
    const directContactUrl = `https://wa.me/5577998544309?text=${encodeURIComponent(`Olá, Dra. Ezisvane! Li o seu artigo sobre "${post.title}" e gostaria de uma orientação jurídica.`)}`;

    // Renderizar Conteúdo Completo no Reader
    if (blogReaderSection) {
      blogReaderSection.innerHTML = `
        <div class="container article-reader-view">
          
          <div class="article-back-nav">
            <button type="button" class="btn-back-blog" id="btnBackToBlog">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              Voltar a Todos os Artigos
            </button>
          </div>

          <div class="blog-breadcrumb">
            <a href="index.html">Início</a>
            <span class="blog-breadcrumb-separator">/</span>
            <a href="blog.html" id="breadcrumbBlogLink">Blog Jurídico</a>
            <span class="blog-breadcrumb-separator">/</span>
            <span>${post.category}</span>
          </div>

          <header class="article-header">
            <div class="badge-tag">${post.category}</div>
            <h1 class="article-main-title">${post.title}</h1>
            
            <div class="article-meta-bar">
              <div class="article-meta-item">
                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                <span>Por <strong>${post.author}</strong> (${post.authorOab})</span>
              </div>
              <div class="article-meta-item">
                <svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
                <span>${BlogStore.formatDate(post.publishedAt)}</span>
              </div>
              <div class="article-meta-item">
                <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                <span>${post.readTime || '4 min de leitura'}</span>
              </div>
            </div>
          </header>

          <div class="article-featured-image-wrapper">
            <img src="${post.image}" alt="${post.title}" class="article-featured-image">
          </div>

          <div class="article-body-wrapper">
            ${post.content}
          </div>

          <!-- Seção de Compartilhamento -->
          <div class="article-share-section">
            <div class="article-share-title">Gostou deste artigo? Compartilhe conhecimento:</div>
            <div class="article-share-buttons">
              <a href="${whatsappShareUrl}" target="_blank" rel="noopener noreferrer" class="btn-share btn-share-whatsapp">
                <svg viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2Z"/></svg>
                Compartilhar no WhatsApp
              </a>
              <button type="button" class="btn-share btn-share-copy" id="btnCopyArticleLink">
                <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                Copiar Link do Artigo
              </button>
            </div>
          </div>

          <!-- Banner de Conversão Ética com a Advogada -->
          <div class="article-cta-box">
            <h3>Está enfrentando uma situação semelhante?</h3>
            <p>Cada caso possui peculiaridades contratuais e documentais. Converse diretamente com a Dra. Ezisvane Rodrigues para entender o caminho legal mais adequado.</p>
            <a href="${directContactUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="margin: 0 auto; display: inline-flex;">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2Z"/></svg>
              Falar com a Dra. Ezisvane no WhatsApp
            </a>
          </div>

          <!-- Card da Autora -->
          <div class="article-author-card">
            <img src="assets/images/dra-ezisvane.jpg" alt="Dra. Ezisvane Rodrigues" class="article-author-card-avatar">
            <div class="article-author-card-info">
              <h3>Dra. Ezisvane Rodrigues Sousa</h3>
              <div class="article-author-card-badge">Advogada Inscrita na OAB/BA sob o nº 88.154</div>
              <p class="article-author-card-bio">
                Especialista em Direito Médico e da Saúde, Direito do Consumidor e Direito Cível. Atuação técnica, humanizada e combativa em Vitória da Conquista - Bahia e online em todo o território nacional.
              </p>
              <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 14px;">
                <a href="${directContactUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 0.88rem; padding: 10px 20px;">
                  Agendar Consulta com a Advogada
                </a>
                <a href="https://www.instagram.com/adv.ezisrodrigues?mdxt=cDl2Y2NpNnhjcmpk&utm_source=qr" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 0.88rem; padding: 10px 18px; border: 1px solid var(--color-gold); color: var(--color-primary-dark); display: inline-flex; align-items: center; gap: 8px; background: rgba(197, 160, 89, 0.08); font-weight: 600;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--color-gold)"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.441-1.44z"/></svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <!-- Artigos Relacionados -->
          ${relatedPosts.length > 0 ? `
            <div class="related-articles-section">
              <div class="related-articles-header">
                <div class="badge-tag">Continue Lendo</div>
                <h3 style="font-size: 1.8rem; color: var(--color-primary-dark);">Outros Artigos que Podem Interessar Você</h3>
              </div>
              <div class="blog-grid" style="margin-top: 24px;">
                ${relatedPosts.map(rel => `
                  <article class="blog-card" data-slug="${rel.slug}">
                    <div class="blog-card-img-wrap">
                      <img src="${rel.image}" alt="${rel.title}" class="blog-card-img" loading="lazy">
                      <span class="blog-card-category-badge">${rel.category}</span>
                    </div>
                    <div class="blog-card-body">
                      <div class="blog-card-meta">
                        <span>${BlogStore.formatDate(rel.publishedAt)}</span>
                        <span class="blog-card-meta-dot"></span>
                        <span>${rel.readTime || '4 min'}</span>
                      </div>
                      <h4 class="blog-card-title" style="font-size: 1.18rem;">
                        <a href="blog.html?artigo=${rel.slug}" class="article-link" data-slug="${rel.slug}">
                          ${rel.title}
                        </a>
                      </h4>
                      <p class="blog-card-excerpt" style="font-size: 0.92rem;">${rel.excerpt}</p>
                      <div class="blog-card-footer">
                        <a href="blog.html?artigo=${rel.slug}" class="blog-card-read-link article-link" data-slug="${rel.slug}">
                          Ler Artigo &rarr;
                        </a>
                      </div>
                    </div>
                  </article>
                `).join("")}
              </div>
            </div>
          ` : ''}

        </div>
      `;

      blogReaderSection.style.display = "block";

      // Botão Voltar
      const btnBack = document.getElementById("btnBackToBlog");
      const breadcrumbLink = document.getElementById("breadcrumbBlogLink");
      if (btnBack) btnBack.addEventListener("click", () => closeArticle(true));
      if (breadcrumbLink) {
        breadcrumbLink.addEventListener("click", (e) => {
          e.preventDefault();
          closeArticle(true);
        });
      }

      // Botão Copiar Link
      const btnCopy = document.getElementById("btnCopyArticleLink");
      if (btnCopy) {
        btnCopy.addEventListener("click", () => {
          const currentUrl = window.location.href;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(currentUrl).then(() => {
              showToast("Link do artigo copiado com sucesso!");
            });
          } else {
            showToast("Link pronto para compartilhar!");
          }
        });
      }

      // Adiciona clique nos cards relacionados
      const relatedLinks = blogReaderSection.querySelectorAll(".article-link");
      relatedLinks.forEach(l => {
        l.addEventListener("click", (e) => {
          if (e.metaKey || e.ctrlKey) return;
          e.preventDefault();
          const rSlug = l.getAttribute("data-slug");
          if (rSlug) openArticle(rSlug, true);
        });
      });

      // Scroll suave até o topo
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Fechar Leitor e Voltar para Lista
  function closeArticle(pushState = true) {
    if (pushState) {
      history.pushState(null, "", "blog.html");
    }
    document.title = "Blog & Artigos Jurídicos | Dra. Ezisvane Rodrigues - OAB/BA 88.154";

    if (blogReaderSection) {
      blogReaderSection.style.display = "none";
      blogReaderSection.innerHTML = "";
    }
    if (blogHeroSection) blogHeroSection.style.display = "block";
    if (blogControlsWrapper) blogControlsWrapper.style.display = "block";
    if (blogListSection) blogListSection.style.display = "block";

    renderBlogList();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Monitorar Botões Voltar e Avançar do Navegador
  window.addEventListener("popstate", (e) => {
    const params = new URLSearchParams(window.location.search);
    const artigoSlug = params.get("artigo");
    if (artigoSlug) {
      openArticle(artigoSlug, false);
    } else {
      closeArticle(false);
    }
  });

  // Filtros de Categoria
  categoryPills.forEach(pill => {
    pill.addEventListener("click", () => {
      categoryPills.forEach(p => p.classList.remove("is-active"));
      pill.classList.add("is-active");
      currentCategory = pill.getAttribute("data-category") || "all";
      renderBlogList();
    });
  });

  // Busca em Tempo Real
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value;
        renderBlogList();
      }, 250);
    });
  }

  // Inicialização Baseada na URL
  const initialParams = new URLSearchParams(window.location.search);
  const initialSlug = initialParams.get("artigo");
  if (initialSlug) {
    openArticle(initialSlug, false);
  } else {
    renderBlogList();
  }
});
