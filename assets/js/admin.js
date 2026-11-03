/**
 * RODRIGUES ADVOCACIA E CONSULTORIA JURÍDICA
 * Painel Administrativo da Dra. Ezisvane Rodrigues (admin.js)
 * Gerencia login, métricas, CRUD de postagens, editor assistido e backup.
 */

import { BlogStore } from "./blogStore.js";

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Imagens da biblioteca do escritório disponíveis para seleção rápida
  const PRESET_IMAGES = [
    { label: "Dra. Ezisvane na Poltrona", url: "assets/images/dra-ezisvane-poltrona.webp" },
    { label: "Dra. Ezisvane no Escritório", url: "assets/images/dra-ezisvane-sobre.webp" },
    { label: "Dra. Ezisvane Perfil", url: "assets/images/dra-ezisvane.webp" },
    { label: "Consulta no Escritório", url: "assets/images/consulta-escritorio.webp" },
    { label: "Sala de Atendimento 1", url: "assets/images/escritorio-atendimento-1.webp" },
    { label: "Sala de Atendimento 2", url: "assets/images/escritorio-atendimento-2.webp" },
    { label: "Recepção do Escritório", url: "assets/images/escritorio-recepcao.webp" },
    { label: "Fachada Edifício Prime", url: "assets/images/escritorio-fachada-totem.webp" }
  ];

  // Elementos da Interface
  const loginWrapper = document.getElementById("adminLoginWrapper");
  const dashboardWrapper = document.getElementById("adminDashboardWrapper");
  const loginForm = document.getElementById("adminLoginForm");
  const loginErrorMsg = document.getElementById("loginErrorMsg");
  const btnLogout = document.getElementById("btnAdminLogout");
  const adminToast = document.getElementById("adminToast");
  const adminToastMsg = document.getElementById("adminToastMsg");

  // Elementos do Dashboard
  const adminTabs = document.querySelectorAll(".admin-tab-btn");
  const adminTabPanes = document.querySelectorAll(".admin-tab-pane");

  // Métricas
  const metricTotalPosts = document.getElementById("metricTotalPosts");
  const metricPublished = document.getElementById("metricPublished");
  const metricDrafts = document.getElementById("metricDrafts");
  const metricTotalViews = document.getElementById("metricTotalViews");

  // Tabela
  const postsTableBody = document.getElementById("adminPostsTableBody");
  const tableSearchInput = document.getElementById("tableSearchInput");
  const tableStatusFilter = document.getElementById("tableStatusFilter");

  // Editor Form
  const postForm = document.getElementById("adminPostForm");
  const inputPostId = document.getElementById("postId");
  const inputTitle = document.getElementById("postTitle");
  const inputSlug = document.getElementById("postSlug");
  const selectCategory = document.getElementById("postCategory");
  const inputCustomCategory = document.getElementById("postCustomCategory");
  const inputExcerpt = document.getElementById("postExcerpt");
  const inputContent = document.getElementById("postContent");
  const inputTags = document.getElementById("postTags");
  const selectStatus = document.getElementById("postStatus");
  const inputImageUrl = document.getElementById("postImageUrl");
  const inputImageFile = document.getElementById("postImageFile");
  const imagePreview = document.getElementById("imagePreview");
  const presetThumbsContainer = document.getElementById("presetThumbsContainer");
  const editorFormTitle = document.getElementById("editorFormTitle");
  const btnResetForm = document.getElementById("btnResetPostForm");
  const livePreviewModal = document.getElementById("livePreviewModal");
  const livePreviewContent = document.getElementById("livePreviewContent");

  // Helper de Toast
  function showToast(message) {
    if (!adminToast || !adminToastMsg) return;
    adminToastMsg.textContent = message;
    adminToast.classList.add("show");
    setTimeout(() => {
      adminToast.classList.remove("show");
    }, 3500);
  }

  // ==========================================================================
  // 1. Gerenciamento de Sessão & Autenticação
  // ==========================================================================
  function checkSession() {
    const session = BlogStore.checkAuth();
    if (session) {
      if (loginWrapper) loginWrapper.style.display = "none";
      if (dashboardWrapper) dashboardWrapper.style.display = "flex";
      renderDashboard();
    } else {
      if (loginWrapper) loginWrapper.style.display = "flex";
      if (dashboardWrapper) dashboardWrapper.style.display = "none";
      const emailInput = document.getElementById("loginEmail");
      const passInput = document.getElementById("loginPassword");
      if (emailInput) emailInput.value = "";
      if (passInput) passInput.value = "";
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const pass = document.getElementById("loginPassword").value;

      const res = BlogStore.login(email, pass);
      if (res.success) {
        if (loginErrorMsg) loginErrorMsg.style.display = "none";
        showToast(`Bem-vinda, Dra. Ezisvane!`);
        checkSession();
      } else {
        if (loginErrorMsg) {
          loginErrorMsg.textContent = res.error;
          loginErrorMsg.style.display = "block";
        }
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      BlogStore.logout();
      showToast("Sessão encerrada com sucesso.");
      checkSession();
    });
  }

  // ==========================================================================
  // 2. Abas do Painel
  // ==========================================================================
  adminTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetPaneId = tab.getAttribute("data-target");
      switchTab(targetPaneId);
    });
  });

  function switchTab(targetPaneId) {
    adminTabs.forEach(t => {
      if (t.getAttribute("data-target") === targetPaneId) {
        t.classList.add("is-active");
      } else {
        t.classList.remove("is-active");
      }
    });

    adminTabPanes.forEach(pane => {
      if (pane.id === targetPaneId) {
        pane.style.display = "block";
      } else {
        pane.style.display = "none";
      }
    });

    if (targetPaneId === "paneDashboard" || targetPaneId === "panePosts") {
      renderDashboard();
    }
  }

  // Atalhos de "Novo Artigo"
  const quickNewBtns = document.querySelectorAll(".btn-open-new-post");
  quickNewBtns.forEach(b => {
    b.addEventListener("click", () => {
      resetEditorForm();
      switchTab("paneEditor");
    });
  });

  // ==========================================================================
  // 3. Renderização do Dashboard & Tabela de Postagens
  // ==========================================================================
  function renderDashboard() {
    const allPosts = BlogStore.getPosts({ includeDrafts: true });
    const published = allPosts.filter(p => p.status === "published");
    const drafts = allPosts.filter(p => p.status === "draft");
    const totalViews = allPosts.reduce((acc, p) => acc + (p.views || 0), 0);

    // Atualiza cards de métricas
    if (metricTotalPosts) metricTotalPosts.textContent = allPosts.length;
    if (metricPublished) metricPublished.textContent = published.length;
    if (metricDrafts) metricDrafts.textContent = drafts.length;
    if (metricTotalViews) metricTotalViews.textContent = totalViews.toLocaleString("pt-BR");

    renderTable();
  }

  function renderTable() {
    if (!postsTableBody) return;

    const searchTerm = (tableSearchInput ? tableSearchInput.value : "").toLowerCase().trim();
    const statusFilter = tableStatusFilter ? tableStatusFilter.value : "all";

    let posts = BlogStore.getPosts({ includeDrafts: true });

    if (statusFilter !== "all") {
      posts = posts.filter(p => p.status === statusFilter);
    }

    if (searchTerm) {
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm)
      );
    }

    if (posts.length === 0) {
      postsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--color-text-muted);">
            Nenhuma postagem encontrada com os critérios informados.
          </td>
        </tr>
      `;
      return;
    }

    postsTableBody.innerHTML = posts.map(post => `
      <tr>
        <td style="width: 70px;">
          <img src="${post.image}" alt="${post.title}" style="width: 60px; height: 42px; object-fit: cover; border-radius: 4px; border: 1px solid var(--color-border);">
        </td>
        <td>
          <span class="admin-table-post-title">${post.title}</span>
          <span class="admin-table-post-meta">Slug: /${post.slug} &bull; ${post.readTime || '4 min'}</span>
        </td>
        <td>
          <span class="badge-tag" style="padding: 4px 10px; font-size: 0.75rem; margin: 0;">${post.category}</span>
        </td>
        <td>${BlogStore.formatDate(post.publishedAt)}</td>
        <td>
          <span style="font-weight: 700; color: var(--color-primary-dark); font-size: 0.95rem;">${post.views || 0}</span>
          <span style="font-size: 0.78rem; color: var(--color-text-muted); display: block;">leituras</span>
        </td>
        <td>
          <span class="admin-status-badge ${post.status === 'published' ? 'admin-status-published' : 'admin-status-draft'}">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
            ${post.status === 'published' ? 'Publicado' : 'Rascunho'}
          </span>
        </td>
        <td>
          <div class="admin-actions-cell">
            <button type="button" class="btn-action-sm btn-edit-post" data-id="${post.id}" title="Editar Artigo">
              ✏️ Editar
            </button>
            <a href="blog.html?artigo=${post.slug}" target="_blank" rel="noopener noreferrer" class="btn-action-sm" title="Ver como fica no site">
              👁️ Ver
            </a>
            <button type="button" class="btn-action-sm btn-toggle-status" data-id="${post.id}" title="Alternar status">
              ${post.status === 'published' ? '⏸️ Ocultar' : '▶️ Publicar'}
            </button>
            <button type="button" class="btn-action-sm btn-action-delete btn-delete-post" data-id="${post.id}" data-title="${post.title}" title="Excluir Artigo">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    // Bind de eventos nas ações da tabela
    postsTableBody.querySelectorAll(".btn-edit-post").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-id");
        editPost(id);
      });
    });

    postsTableBody.querySelectorAll(".btn-toggle-status").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-id");
        const res = BlogStore.togglePostStatus(id);
        if (res.success) {
          showToast(`Status atualizado para: ${res.status === 'published' ? 'Publicado' : 'Rascunho'}`);
          renderDashboard();
        }
      });
    });

    postsTableBody.querySelectorAll(".btn-delete-post").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-id");
        const title = b.getAttribute("data-title");
        if (confirm(`Tem certeza que deseja excluir o artigo:\n"${title}"?\nEsta ação não poderá ser desfeita.`)) {
          BlogStore.deletePost(id);
          showToast("Artigo excluído com sucesso.");
          renderDashboard();
        }
      });
    });
  }

  if (tableSearchInput) tableSearchInput.addEventListener("input", renderTable);
  if (tableStatusFilter) tableStatusFilter.addEventListener("change", renderTable);

  // ==========================================================================
  // 4. Editor de Postagens (Novo / Editar)
  // ==========================================================================
  let currentRawImageSrc = PRESET_IMAGES[0].url;
  let currentCropMode = "top"; // 'top' | 'blur' | 'center'

  // Motor de Enquadramento Automático via HTML5 Canvas (16:10 Proporcional)
  function processAndFrameImage(sourceSrc, mode = currentCropMode) {
    if (!sourceSrc) return;
    currentRawImageSrc = sourceSrc;

    const img = new Image();
    if (!sourceSrc.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const targetW = 1200;
      const targetH = 750; // Proporção perfeita 16:10 para os cards do blog
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");

      if (mode === "blur") {
        // MODO 2: Foto Inteira sem cortes com fundo suave desfocado da própria foto
        ctx.save();
        ctx.filter = "blur(32px) brightness(0.65)";
        ctx.drawImage(img, -40, -40, targetW + 80, targetH + 80);
        ctx.restore();

        // Foto inteira centralizada com sombra
        const scale = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight);
        const drawW = img.naturalWidth * scale;
        const drawH = img.naturalHeight * scale;
        const drawX = (targetW - drawW) / 2;
        const drawY = (targetH - drawH) / 2;

        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.shadowBlur = 20;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();

      } else if (mode === "top") {
        // MODO 1: Foco no Rosto (Topo) - Ideal para retratos e fotos verticais
        const targetRatio = targetW / targetH; // 1.6
        const srcRatio = img.naturalWidth / img.naturalHeight;

        if (srcRatio < targetRatio) {
          // Imagem mais alta (vertical): preenche a largura e alinha exatamente no topo (sy = 0)
          const scale = targetW / img.naturalWidth;
          const scaledH = img.naturalHeight * scale;
          ctx.drawImage(img, 0, 0, targetW, scaledH);
        } else {
          // Imagem mais larga que 16:10: preenche a altura e centraliza horizontalmente
          const scale = targetH / img.naturalHeight;
          const scaledW = img.naturalWidth * scale;
          const offsetX = (targetW - scaledW) / 2;
          ctx.drawImage(img, offsetX, 0, scaledW, targetH);
        }

      } else {
        // MODO 3: Centro padrão
        const targetRatio = targetW / targetH;
        const srcRatio = img.naturalWidth / img.naturalHeight;

        if (srcRatio < targetRatio) {
          const scale = targetW / img.naturalWidth;
          const scaledH = img.naturalHeight * scale;
          const offsetY = (targetH - scaledH) / 2;
          ctx.drawImage(img, 0, offsetY, targetW, scaledH);
        } else {
          const scale = targetH / img.naturalHeight;
          const scaledW = img.naturalWidth * scale;
          const offsetX = (targetW - scaledW) / 2;
          ctx.drawImage(img, offsetX, 0, scaledW, targetH);
        }
      }

      try {
        const framedDataUrl = canvas.toDataURL("image/jpeg", 0.90);
        if (inputImageUrl) inputImageUrl.value = framedDataUrl;
        if (imagePreview) imagePreview.src = framedDataUrl;
      } catch (err) {
        // Se houver restrição de segurança no canvas (CORS em URL externa)
        if (inputImageUrl) inputImageUrl.value = sourceSrc;
        if (imagePreview) imagePreview.src = sourceSrc;
      }
    };

    img.onerror = () => {
      if (inputImageUrl) inputImageUrl.value = sourceSrc;
      if (imagePreview) imagePreview.src = sourceSrc;
    };

    img.src = sourceSrc;
  }

  // Controles de Modo de Enquadramento
  const cropBtns = document.querySelectorAll(".btn-crop-mode");
  const cropFeedbackMsg = document.getElementById("cropFeedbackMsg");

  cropBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      cropBtns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      currentCropMode = btn.getAttribute("data-crop") || "top";

      if (cropFeedbackMsg) {
        if (currentCropMode === "top") {
          cropFeedbackMsg.textContent = "Auto-enquadrado com foco no rosto e parte superior da foto.";
        } else if (currentCropMode === "blur") {
          cropFeedbackMsg.textContent = "Foto completa sem cortes com fundo suave atmosférico.";
        } else {
          cropFeedbackMsg.textContent = "Enquadramento centralizado padrão.";
        }
      }

      processAndFrameImage(currentRawImageSrc, currentCropMode);
    });
  });

  // Renderizar a galeria de imagens pré-definidas
  function renderPresetThumbs(selectedUrl = "") {
    if (!presetThumbsContainer) return;
    presetThumbsContainer.innerHTML = PRESET_IMAGES.map(img => `
      <div class="image-thumb-item ${img.url === selectedUrl ? 'is-selected' : ''}" data-url="${img.url}" title="${img.label}">
        <img src="${img.url}" alt="${img.label}">
      </div>
    `).join("");

    presetThumbsContainer.querySelectorAll(".image-thumb-item").forEach(item => {
      item.addEventListener("click", () => {
        const url = item.getAttribute("data-url");
        presetThumbsContainer.querySelectorAll(".image-thumb-item").forEach(i => i.classList.remove("is-selected"));
        item.classList.add("is-selected");
        processAndFrameImage(url, currentCropMode);
      });
    });
  }

  // Inicializa a galeria com a primeira imagem
  renderPresetThumbs(PRESET_IMAGES[0].url);

  // Upload local de imagem com auto-enquadramento instantâneo
  if (inputImageFile) {
    inputImageFile.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("Por favor, selecione uma imagem menor que 5MB.");
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          const rawDataUrl = event.target.result;
          if (presetThumbsContainer) {
            presetThumbsContainer.querySelectorAll(".image-thumb-item").forEach(i => i.classList.remove("is-selected"));
          }
          // Processa e auto-enquadra instantaneamente no formato 16:10
          processAndFrameImage(rawDataUrl, currentCropMode);
          showToast("Imagem carregada e auto-enquadrada com sucesso!");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (inputImageUrl) {
    inputImageUrl.addEventListener("input", (e) => {
      const url = e.target.value.trim();
      if (url) {
        processAndFrameImage(url, currentCropMode);
      }
    });
  }


  // Gerador automático de Slug a partir do Título
  if (inputTitle) {
    inputTitle.addEventListener("input", (e) => {
      if (!inputPostId.value) { // Só atualiza automaticamente se for novo post
        if (inputSlug) {
          inputSlug.value = BlogStore.slugify(e.target.value);
        }
      }
    });
  }

  // Troca de Categoria (Personalizada vs Padrão)
  if (selectCategory) {
    selectCategory.addEventListener("change", (e) => {
      if (e.target.value === "custom") {
        if (inputCustomCategory) {
          inputCustomCategory.style.display = "block";
          inputCustomCategory.focus();
        }
      } else {
        if (inputCustomCategory) {
          inputCustomCategory.style.display = "none";
          inputCustomCategory.value = "";
        }
      }
    });
  }

  // Barra de Ferramentas de Formatação do Conteúdo
  const toolBtns = document.querySelectorAll(".btn-tool");
  toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      insertTemplateIntoContent(action);
    });
  });

  function insertTemplateIntoContent(action) {
    if (!inputContent) return;
    const start = inputContent.selectionStart;
    const end = inputContent.selectionEnd;
    const selectedText = inputContent.value.substring(start, end);
    let snippet = "";

    switch (action) {
      case "h2":
        snippet = `\n<h2>${selectedText || 'Título da Seção Principal'}</h2>\n`;
        break;
      case "h3":
        snippet = `\n<h3>${selectedText || 'Subtítulo Importante'}</h3>\n`;
        break;
      case "p":
        snippet = `\n<p>${selectedText || 'Escreva aqui o seu parágrafo explicativo sobre o caso...'}</p>\n`;
        break;
      case "quote":
        snippet = `\n<div class="legal-quote-box">\n  <div class="legal-quote-icon">⚖️</div>\n  <div>\n    <strong>Decisão Judicial / Jurisprudência:</strong>\n    <p>${selectedText || '“Insira aqui a transcrição de um precedente, súmula do STJ ou trecho de lei relevante...”'}</p>\n  </div>\n</div>\n`;
        break;
      case "highlight":
        snippet = `\n<div class="legal-highlight-box">\n  <h4>💡 Atenção ao Ponto Crítico</h4>\n  <p>${selectedText || 'Explique detalhadamente aqui um direito ou prazo que o leitor não pode perder...'}</p>\n</div>\n`;
        break;
      case "list":
        snippet = `\n<ul class="article-steps-list">\n  <li><strong>Passo 1:</strong> Solicitar o laudo com indicação de urgência.</li>\n  <li><strong>Passo 2:</strong> Notificar a operadora e anotar os protocolos.</li>\n  <li><strong>Passo 3:</strong> Buscar auxílio jurídico especializado.</li>\n</ul>\n`;
        break;
      case "bold":
        snippet = `<strong>${selectedText || 'texto em destaque'}</strong>`;
        break;
    }

    inputContent.setRangeText(snippet, start, end, "end");
    inputContent.focus();
  }

  // Resetar Formulário do Editor
  function resetEditorForm() {
    if (postForm) postForm.reset();
    if (inputPostId) inputPostId.value = "";
    if (editorFormTitle) editorFormTitle.textContent = "Escrever Novo Artigo";
    if (inputCustomCategory) inputCustomCategory.style.display = "none";
    if (inputImageUrl) inputImageUrl.value = PRESET_IMAGES[0].url;
    if (imagePreview) imagePreview.src = PRESET_IMAGES[0].url;
    renderPresetThumbs(PRESET_IMAGES[0].url);
  }

  if (btnResetForm) {
    btnResetForm.addEventListener("click", () => {
      resetEditorForm();
      switchTab("panePosts");
    });
  }

  // Preencher formulário para Edição
  function editPost(id) {
    const post = BlogStore.getPostById(id);
    if (!post) return;

    resetEditorForm();
    if (editorFormTitle) editorFormTitle.textContent = `Editar Artigo: "${post.title}"`;
    if (inputPostId) inputPostId.value = post.id;
    if (inputTitle) inputTitle.value = post.title;
    if (inputSlug) inputSlug.value = post.slug;
    
    // Categoria
    const stdCategories = ["Direito à Saúde", "Direito do Consumidor", "Direito Médico", "Direito Cível"];
    if (stdCategories.includes(post.category)) {
      if (selectCategory) selectCategory.value = post.category;
      if (inputCustomCategory) inputCustomCategory.style.display = "none";
    } else {
      if (selectCategory) selectCategory.value = "custom";
      if (inputCustomCategory) {
        inputCustomCategory.style.display = "block";
        inputCustomCategory.value = post.category;
      }
    }

    // Imagem
    if (inputImageUrl) inputImageUrl.value = post.image;
    if (imagePreview) imagePreview.src = post.image;
    renderPresetThumbs(post.image);

    // Textos
    if (inputExcerpt) inputExcerpt.value = post.excerpt;
    if (inputContent) inputContent.value = post.content;
    if (inputTags) inputTags.value = Array.isArray(post.tags) ? post.tags.join(", ") : (post.tags || "");
    if (selectStatus) selectStatus.value = post.status;

    switchTab("paneEditor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Salvar Postagem (Novo ou Edição)
  if (postForm) {
    postForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let category = selectCategory.value;
      if (category === "custom") {
        category = inputCustomCategory.value.trim() || "Direito Cível";
      }

      const postData = {
        id: inputPostId.value || undefined,
        title: inputTitle.value.trim(),
        slug: inputSlug.value.trim() || BlogStore.slugify(inputTitle.value),
        category,
        image: inputImageUrl.value.trim() || PRESET_IMAGES[0].url,
        excerpt: inputExcerpt.value.trim(),
        content: inputContent.value.trim(),
        tags: inputTags.value,
        status: selectStatus.value
      };

      if (!postData.title || !postData.content) {
        alert("Por favor, preencha o título e o conteúdo do artigo.");
        return;
      }

      const res = BlogStore.savePost(postData);
      if (res.success) {
        showToast(res.isNew ? "Novo artigo publicado com sucesso!" : "Artigo atualizado com sucesso!");
        resetEditorForm();
        renderDashboard();
        switchTab("panePosts");
      } else {
        alert("Erro ao salvar artigo: " + res.error);
      }
    });
  }

  // Botão Pré-visualizar ao Vivo
  const btnLivePreview = document.getElementById("btnLivePreview");
  const btnCloseLivePreview = document.getElementById("btnCloseLivePreview");

  if (btnLivePreview) {
    btnLivePreview.addEventListener("click", () => {
      let category = selectCategory.value;
      if (category === "custom") category = inputCustomCategory.value.trim() || "Direito Geral";

      const title = inputTitle.value || "Título do Artigo";
      const img = inputImageUrl.value || PRESET_IMAGES[0].url;
      const content = inputContent.value || "<p>Nenhum conteúdo digitado ainda...</p>";

      if (livePreviewContent) {
        livePreviewContent.innerHTML = `
          <div class="article-reader-view" style="padding: 0;">
            <div class="badge-tag">${category}</div>
            <h1 class="article-main-title" style="margin-top: 10px;">${title}</h1>
            <div class="article-meta-bar" style="margin-bottom: 24px;">
              <span>Por <strong>Dra. Ezisvane Rodrigues Sousa</strong> (OAB/BA 88.154)</span>
              <span>&bull;</span>
              <span>${BlogStore.formatDate(new Date().toISOString().split("T")[0])}</span>
            </div>
            <div class="article-featured-image-wrapper">
              <img src="${img}" alt="${title}" class="article-featured-image">
            </div>
            <div class="article-body-wrapper">
              ${content}
            </div>
          </div>
        `;
      }

      if (livePreviewModal) livePreviewModal.style.display = "flex";
    });
  }

  if (btnCloseLivePreview) {
    btnCloseLivePreview.addEventListener("click", () => {
      if (livePreviewModal) livePreviewModal.style.display = "none";
    });
  }

  // ==========================================================================
  // 5. Configurações, Backup & Segurança
  // ==========================================================================
  const btnDownloadBackup = document.getElementById("btnDownloadBackup");
  const inputImportBackup = document.getElementById("inputImportBackup");
  const btnResetDefault = document.getElementById("btnResetDefault");
  const formChangePassword = document.getElementById("formChangePassword");

  if (btnDownloadBackup) {
    btnDownloadBackup.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(BlogStore.exportBackup());
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `backup-blog-dra-ezisvane-${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Backup baixado com sucesso!");
    });
  }

  if (inputImportBackup) {
    inputImportBackup.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = BlogStore.importBackup(event.target.result);
          if (res.success) {
            showToast(`${res.count} artigos importados com sucesso!`);
            renderDashboard();
          } else {
            alert("Erro na importação: " + res.error);
          }
        };
        reader.readAsText(file);
      }
    });
  }

  if (btnResetDefault) {
    btnResetDefault.addEventListener("click", () => {
      if (confirm("Deseja recarregar os 4 artigos originais padrão do escritório? As edições recentes serão substituídas.")) {
        BlogStore.resetToDefault();
        showToast("Artigos restaurados para o padrão original.");
        renderDashboard();
      }
    });
  }

  if (formChangePassword) {
    formChangePassword.addEventListener("submit", (e) => {
      e.preventDefault();
      const currentPass = document.getElementById("currentPass").value;
      const newPass = document.getElementById("newPass").value;
      const confirmPass = document.getElementById("confirmPass").value;

      if (!BlogStore.verifyPassword(currentPass)) {
        alert("A senha atual digitada está incorreta.");
        return;
      }
      if (newPass.length < 6) {
        alert("A nova senha deve ter no mínimo 6 caracteres.");
        return;
      }
      if (newPass !== confirmPass) {
        alert("A nova senha e a confirmação não coincidem.");
        return;
      }

      BlogStore.changePassword(newPass);
      showToast("Senha alterada com sucesso!");
      formChangePassword.reset();
    });
  }

  // Checa sessão ao carregar a página
  checkSession();
});
