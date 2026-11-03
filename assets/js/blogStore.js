/**
 * RODRIGUES ADVOCACIA E CONSULTORIA JURÍDICA
 * Módulo de Armazenamento e Gerenciamento do Blog (blogStore.js)
 * Gerencia persistência local (localStorage), autenticação da advogada e artigos padrão.
 */

const STORAGE_KEY_POSTS = "rodrigues_advocacia_blog_posts_v3";
const STORAGE_KEY_AUTH = "rodrigues_advocacia_admin_session_v1";
const STORAGE_KEY_CREDS = "rodrigues_advocacia_admin_creds_v2";

// Credenciais padrão da Dra. Ezisvane Rodrigues
// Função de Hash Criptográfico SHA-256 (Padrão FIPS 180-4)
// Protege a senha para NUNCA ficar exposta em texto puro no código ou no navegador
function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j;
  var result = '';
  var words = [];
  var asciiBitLength = ascii[lengthProperty] * 8;
  var hash = [];
  var k = [];
  var primeCounter = 0;
  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  hash = hash.slice(0, 8);
  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength | 0;
  for (j = 0; j < words[lengthProperty]; ) {
    var w = words.slice(j, (j += 16));
    var oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      var i2 = i + j;
      var w15 = w[i - 15], w2 = w[i - 2];
      var a = hash[0], e = hash[4];
      var temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      var temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      var byte = (hash[i] >> (j * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

const PASSWORD_SALT = "_salt_ezis_rodrigues_2026";
function hashPassword(pass) {
  return sha256((pass || "") + PASSWORD_SALT);
}

// Credenciais protegidas com Hash Criptográfico irreversível (nenhuma senha é salva em texto puro)
const DEFAULT_CREDS = {
  email: "contato@ezisrodrigues.com.br",
  passwordHash: "fef98ae443fcf991e864bf1482d1f0a03318318311a11428f066a1ae3d808327",
  name: "Dra. Ezisvane Rodrigues Sousa",
  oab: "OAB/BA 88.154"
};

// Artigos jurídicos iniciais de alto nível (Compliance com Provimento 205/2021 CFOAB)
const DEFAULT_POSTS = [
  {
    id: "post_1",
    slug: "negativa-plano-de-saude-cirurgia-medicamento-como-agir",
    title: "Negativa de Cirurgia, Exame ou Remédio pelo Plano de Saúde: Como Agir Passo a Passo",
    category: "Direito à Saúde",
    image: "assets/images/dra-ezisvane-poltrona.webp",
    excerpt: "Descubra o que fazer quando a operadora de saúde nega seu procedimento alegando ausência no rol da ANS ou falta de cobertura contratual.",
    content: `
      <p class="article-lead">Receber a notícia de que o plano de saúde recusou a autorização de uma cirurgia, exame de alta complexidade ou fornecimento de medicamento essencial é um momento de extrema angústia e urgência para qualquer paciente ou família.</p>
      
      <h2>A Recusa com Base no Rol da ANS Ainda é Válida?</h2>
      <p>Historicamente, as operadoras de planos de saúde utilizavam a justificativa de que determinado procedimento ou medicamento não consta expressamente no <strong>Rol de Procedimentos e Eventos em Saúde da ANS</strong> (Agência Nacional de Saúde Suplementar).</p>
      
      <p>Entretanto, com a promulgação da <strong>Lei Federal nº 14.454/2022</strong>, restou consolidado no ordenamento jurídico brasileiro que o rol da ANS possui <em>natureza exemplificativa</em>. Isso significa que, havendo prescrição do médico assistente e preenchidos critérios técnicos científicos, o plano tem o dever legal de cobrir o tratamento prescrito.</p>

      <div class="legal-quote-box">
        <div class="legal-quote-icon">⚖️</div>
        <div>
          <strong>Jurisprudência Consolidada do STJ:</strong>
          <p>“Quem define a melhor terapêutica para o paciente é o médico que o acompanha, e não a operadora do plano de saúde. Havendo expressa indicação médica, é abusiva a negativa de cobertura sob alegação de não constar no rol da ANS.”</p>
        </div>
      </div>

      <h2>Passo a Passo Fundamental Diante da Negativa</h2>
      <p>Caso você ou um familiar enfrente essa situação, siga estes passos imediatos para proteger seus direitos:</p>
      
      <ul class="article-steps-list">
        <li><strong>1. Exija a Negativa por Escrito:</strong> Solicite à operadora a formalização da recusa por escrito ou por e-mail com a fundamentação legal ou contratual. É direito do consumidor garantido pela Resolução Normativa nº 395 da ANS.</li>
        <li><strong>2. Guarde o Relatório Médico Detalhado:</strong> Peça ao médico assistente um laudo minucioso constando: o diagnóstico (CID), a urgência do caso, os riscos do atraso e por que alternativas convencionais não são adequadas.</li>
        <li><strong>3. Anote os Protocolos de Atendimento:</strong> Registre todos os protocolos telefônicos e mensagens trocadas com o plano.</li>
        <li><strong>4. Reclamação na ANS e Notificação:</strong> Em casos de recusa flagrante, a reclamação administrativa na ANS pode ser realizada, embora em situações urgentes a via judicial com pedido de liminar seja o caminho mais célere.</li>
      </ul>

      <div class="legal-highlight-box">
        <h4>💡 O que é o Pedido de Liminar?</h4>
        <p>A tutela de urgência (popularmente chamada de <strong>liminar</strong>) é um mecanismo processual em que o juiz pode determinar, no início do processo — frequentemente em 24 a 48 horas —, que o plano de saúde autorize e custeie o procedimento sob pena de multa diária, evitando prejuízos irreversíveis à saúde do paciente.</p>
      </div>

      <h2>Orientação e Acompanhamento Especializado</h2>
      <p>Cada caso exige a verificação atenta do contrato, do laudo médico e da urgência clínica. Buscar auxílio de um profissional do Direito especializado em Saúde assegura que todas as provas necessárias sejam reunidas tempestivamente.</p>
    `,
    author: "Dra. Ezisvane Rodrigues Sousa",
    authorOab: "OAB/BA 88.154",
    publishedAt: "2026-10-12",
    readTime: "4 min de leitura",
    status: "published",
    tags: ["Direito à Saúde", "Plano de Saúde", "Rol da ANS", "Liminar", "Cirurgia Negada"],
    views: 0
  },
  {
    id: "post_2",
    slug: "terapias-autismo-tea-plano-de-saude-limitacao-sessoes-ilegal",
    title: "Terapias para Crianças com Autismo (TEA): Limitação de Sessões pelo Plano de Saúde é Ilegal",
    category: "Direito à Saúde",
    image: "assets/images/dra-ezisvane-sobre.webp",
    excerpt: "Entenda por que planos de saúde não podem estipular teto de sessões de ABA, fonoaudiologia e terapia ocupacional para pacientes no espectro autista.",
    content: `
      <p class="article-lead">Famílias de crianças diagnosticadas com Transtorno do Espectro Autista (TEA) com frequência se deparam com um obstáculo injusto: o plano de saúde autoriza apenas uma quantidade limitada de sessões por ano ou recusa métodos como a Análise do Comportamento Aplicada (ABA).</p>

      <h2>O Fim da Limitação de Sessões pela Resolução ANS nº 539/2022</h2>
      <p>Desde julho de 2022, a Agência Nacional de Saúde Suplementar (ANS) editou a <strong>Resolução Normativa nº 539</strong>, tornando obrigatória para todos os planos de saúde a cobertura ilimitada de sessões de psicoterapia, fonoaudiologia, terapia ocupacional e fisioterapia para pacientes diagnosticados com transtornos globais do desenvolvimento, incluindo o TEA.</p>

      <p>Portanto, <strong>qualquer cláusula contratual que estabeleça limite anual de consultas ou sessões é considerada nula de pleno direito</strong> pela legislação brasileira e pelos tribunais de justiça estaduais.</p>

      <div class="legal-quote-box">
        <div class="legal-quote-icon">🧩</div>
        <div>
          <strong>Direito ao Método Prescrito pelo Neuropediatra:</strong>
          <p>O método terapêutico específico (como ABA, Denver, Integração Sensorial de Ayres, PECS) deve ser o indicado pelo médico especialista. A operadora não pode substituir unilateralmente o método por outro de menor eficácia comprovada.</p>
        </div>
      </div>

      <h2>E se a Operadora Não Tiver Profissionais Credenciados Especializados?</h2>
      <p>Caso o plano de saúde não disponha de profissionais habilitados na técnica indicada na sua rede credenciada do município ou região limítrofe, a operadora é <strong>obrigada a custear o tratamento integral na rede particular</strong> por meio de reembolso integral ou pagamento direto à clínica.</p>

      <div class="legal-highlight-box">
        <h4>📋 Documentos Essenciais para Defesa do Direito:</h4>
        <ul style="margin-left: 20px; margin-top: 8px;">
          <li>Laudo médico com diagnóstico de TEA e indicação detalhada da carga horária e método;</li>
          <li>Plano terapêutico individual elaborado pelos terapeutas;</li>
          <li>Negativa de cobertura ou resposta de insuficiência de rede emitida pelo plano;</li>
          <li>Contrato de prestação de serviços do plano de saúde.</li>
        </ul>
      </div>

      <h2>Conclusão</h2>
      <p>A intervenção precoce e intensiva é determinante para o pleno desenvolvimento da criança com TEA. Havendo qualquer recusa ou corte de sessões, a atuação jurídica ágil assegura a manutenção do plano de cuidados sem interrupções prejudiciais.</p>
    `,
    author: "Dra. Ezisvane Rodrigues Sousa",
    authorOab: "OAB/BA 88.154",
    publishedAt: "2026-10-08",
    readTime: "5 min de leitura",
    status: "published",
    tags: ["Autismo", "TEA", "Método ABA", "Terapia Ocupacional", "Direito à Saúde"],
    views: 0
  },
  {
    id: "post_3",
    slug: "desconto-indevido-emprestimo-inss-aposentadoria-cancelar-restituicao",
    title: "Desconto Indevido de Empréstimo no Benefício do INSS: Como Cancelar e Receber em Dobro",
    category: "Direito do Consumidor",
    image: "assets/images/escritorio-atendimento-1.webp",
    excerpt: "Aposentados e pensionistas que sofrem descontos de empréstimos consignados ou mensalidades associativas não autorizadas têm direito à devolução em dobro e indenização.",
    content: `
      <p class="article-lead">Milhares de aposentados e pensionistas do INSS no Brasil são surpreendidos todos os meses ao conferir o extrato do seu benefício previdenciário (Extrato de Pagamento / Histórico de Créditos) e notar descontos de parcelas de empréstimos consignados que nunca contrataram.</p>

      <h2>A Devolução em Dobro (Artigo 42 do Código de Defesa do Consumidor)</h2>
      <p>O Código de Defesa do Consumidor estabelece expressamente em seu art. 42, parágrafo único, que o consumidor cobrado em quantia indevida tem direito à repetição do indébito por valor igual ao <strong>dobro do que pagou em excesso</strong>, acrescido de correção monetária e juros legais.</p>

      <p>Recentemente, o Superior Tribunal de Justiça (STJ), no julgamento do <strong>Tema 929</strong>, fixou a tese de que a restituição em dobro independe da comprovação de má-fé da instituição financeira: basta que a conduta contrarie a boa-fé objetiva, cabendo apenas o engano justificável comprovado pelo banco.</p>

      <div class="legal-quote-box">
        <div class="legal-quote-icon">🏛️</div>
        <div>
          <strong>Súmula 479 do STJ:</strong>
          <p>“As instituições financeiras respondem objetivamente pelos danos gerados por fortuito interno relativo a fraudes e delitos praticados por terceiros no âmbito de operações bancárias.”</p>
        </div>
      </div>

      <h2>Descontos de Associações e Sindicatos (RBM, APDD, CONAFER, etc.)</h2>
      <p>Outra prática recorrente são os descontos de contribuições associativas ou securitárias mensais (valores de R$ 30, R$ 45 a R$ 80). Sem a expressa autorização assinada pelo beneficiário com validação biométrica inequívoca, tais cobranças são ilícitas.</p>

      <div class="legal-highlight-box">
        <h4>O que Fazer ao Identificar o Desconto?</h4>
        <ol style="margin-left: 20px; margin-top: 8px;">
          <li>Acesse o portal ou aplicativo <strong>Meu INSS</strong> e emita o Extrato de Pagamento do Benefício (HisCre);</li>
          <li>Identifique o nome da financeira ou da associação e o código do desconto;</li>
          <li>Solicite o bloqueio para empréstimos no próprio aplicativo do Meu INSS;</li>
          <li>Conteste formalmente a contratação junto à instituição e procure apoio jurídico para requerer judicialmente o cancelamento, devolução em dobro e indenização por danos morais.</li>
        </ol>
      </div>

      <h2>Proteção à Dignidade do Aposentado</h2>
      <p>Os proventos de aposentadoria possuem natureza estritamente alimentar. A retenção ilícita de valores atinge a subsistência básica do beneficiário, ensejando a devida reparação moral e material na Justiça.</p>
    `,
    author: "Dra. Ezisvane Rodrigues Sousa",
    authorOab: "OAB/BA 88.154",
    publishedAt: "2026-10-02",
    readTime: "4 min de leitura",
    status: "published",
    tags: ["Direito do Consumidor", "INSS", "Empréstimo Indevido", "Restituição em Dobro", "Dano Moral"],
    views: 0
  },
  {
    id: "post_4",
    slug: "golpe-do-pix-cartao-clonado-responsabilidade-banco-restituicao",
    title: "Golpe do Pix ou Cartão Clonado: Quando o Banco é Obrigado a Devolver o Dinheiro?",
    category: "Direito do Consumidor",
    image: "assets/images/consulta-escritorio.webp",
    excerpt: "Saiba como o Mecanismo Especial de Devolução (MED) e as teses de falha na segurança do sistema bancário respaldam a vítima de fraudes digitais.",
    content: `
      <p class="article-lead">Com o avanço das transações instantâneas e a digitalização bancária, golpes como a falsa central de segurança, transferências via Pix sob coação e clonagem de cartões tornaram-se alarmantes.</p>

      <h2>O Dever de Segurança dos Bancos</h2>
      <p>As instituições financeiras lucram com a disponibilização de canais digitais ágeis e, por consequência direta do <em>Risco da Atividade (Teoria do Risco-Proveito)</em>, têm a obrigação de manter sistemas antifraude eficientes que detectem e bloqueiem transações atípicas fora do perfil habitual do cliente.</p>

      <p>Quando um cliente que habitualmente movimenta quantias modestas realiza de repente transferências vultosas em horários incomuns para contas recém-abertas de terceiros, <strong>a ausência de bloqueio preventivo pelo algoritmo de segurança do banco configura falha na prestação do serviço</strong>.</p>

      <div class="legal-quote-box">
        <div class="legal-quote-icon">📱</div>
        <div>
          <strong>Mecanismo Especial de Devolução (MED) do Banco Central:</strong>
          <p>O MED é uma ferramenta criada pelo Banco Central que possibilita o bloqueio e estorno de valores transferidos via Pix quando houver fundada suspeita de fraude ou golpe, desde que acionado com rapidez pelo consumidor.</p>
        </div>
      </div>

      <h2>Ações Imediatas que a Vítima Deve Tomar:</h2>
      <ul class="article-steps-list">
        <li><strong>1. Acione o Banco Imediatamente:</strong> Ligue para o SAC/Central do seu banco e peça o registro do pedido de bloqueio via MED em até 80 dias (quanto mais rápido, maior a chance de saldo na conta receptora).</li>
        <li><strong>2. Registre Boletim de Ocorrência (B.O.):</strong> Faça o boletim na delegacia presencial ou pela Delegacia Virtual, informando todos os dados da transação, chave Pix e dados do destinatário.</li>
        <li><strong>3. Notifique o Banco Receptor:</strong> Se possível, informe também a instituição financeira que recebeu o valor sobre a fraude na conta de destino.</li>
        <li><strong>4. Guarde Todos os Comprovantes:</strong> Prints das conversas com os golpistas, histórico de chamadas, protocolos e comprovantes bancários.</li>
      </ul>

      <h2>A Via Judicial em Caso de Negativa do Banco</h2>
      <p>Caso o banco se recuse a ressarcir a vítima alegando culpa exclusiva do consumidor, é possível levar o caso ao Poder Judiciário. Os tribunais têm condenado instituições bancárias que permitiram a abertura de 'contas-laranjas' sem rigorosa conferência de identidade, viabilizando o golpe.</p>
    `,
    author: "Dra. Ezisvane Rodrigues Sousa",
    authorOab: "OAB/BA 88.154",
    publishedAt: "2026-09-25",
    readTime: "4 min de leitura",
    status: "published",
    tags: ["Golpe do Pix", "Direito Bancário", "Consumidor", "Mecanismo Especial de Devolução", "Segurança Bancária"],
    views: 0
  }
];


export const BlogStore = {
  // Inicialização e recuperação dos posts
  getPosts(options = {}) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_POSTS);
      let posts = stored ? JSON.parse(stored) : null;

      if (!posts || !Array.isArray(posts) || posts.length === 0) {
        posts = [...DEFAULT_POSTS];
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      }

      // Filtro por rascunho / publicado
      if (!options.includeDrafts) {
        posts = posts.filter(p => p.status === "published");
      }

      // Filtro por categoria
      if (options.category && options.category !== "all" && options.category !== "Todas") {
        posts = posts.filter(p => p.category.toLowerCase() === options.category.toLowerCase());
      }

      // Filtro por busca
      if (options.search && options.search.trim()) {
        const query = options.search.toLowerCase().trim();
        posts = posts.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
        );
      }

      // Ordenação decrescente por data
      posts.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

      return posts;
    } catch (err) {
      console.error("[BlogStore] Erro ao recuperar posts:", err);
      return DEFAULT_POSTS;
    }
  },

  getPostBySlug(slug) {
    if (!slug) return null;
    const posts = this.getPosts({ includeDrafts: true });
    return posts.find(p => p.slug === slug) || null;
  },

  getPostById(id) {
    if (!id) return null;
    const posts = this.getPosts({ includeDrafts: true });
    return posts.find(p => p.id === id) || null;
  },

  savePost(postData) {
    try {
      const posts = this.getPosts({ includeDrafts: true });
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];

      // Gerar ou formatar slug
      let slug = postData.slug || this.slugify(postData.title);

      // Cálculo de tempo de leitura aproximado (200 palavras por minuto)
      const wordCount = (postData.content || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
      const readMinutes = Math.max(2, Math.ceil(wordCount / 180));
      const readTime = `${readMinutes} min de leitura`;

      if (postData.id) {
        // Atualização de post existente
        const index = posts.findIndex(p => p.id === postData.id);
        if (index !== -1) {
          posts[index] = {
            ...posts[index],
            ...postData,
            slug,
            readTime: postData.readTime || readTime,
            updatedAt: dateStr
          };
          localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
          return { success: true, post: posts[index], isNew: false };
        }
      }

      // Criação de novo post
      const newId = `post_${Date.now()}`;
      // Garantir slug único
      if (posts.some(p => p.slug === slug)) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }

      const newPost = {
        id: newId,
        slug,
        title: postData.title,
        category: postData.category || "Direito Cível",
        image: postData.image || "assets/images/dra-ezisvane-sobre.webp",
        excerpt: postData.excerpt || (postData.content || "").replace(/<[^>]*>/g, "").slice(0, 160) + "...",
        content: postData.content || "",
        author: postData.author || DEFAULT_CREDS.name,
        authorOab: postData.authorOab || DEFAULT_CREDS.oab,
        publishedAt: postData.publishedAt || dateStr,
        readTime,
        status: postData.status || "published",
        tags: Array.isArray(postData.tags) ? postData.tags : (postData.tags || "").split(",").map(t => t.trim()).filter(Boolean),
        views: 0
      };

      posts.unshift(newPost);
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      return { success: true, post: newPost, isNew: true };
    } catch (err) {
      console.error("[BlogStore] Erro ao salvar post:", err);
      return { success: false, error: err.message };
    }
  },

  deletePost(id) {
    try {
      let posts = this.getPosts({ includeDrafts: true });
      posts = posts.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      return { success: true };
    } catch (err) {
      console.error("[BlogStore] Erro ao deletar post:", err);
      return { success: false, error: err.message };
    }
  },

  togglePostStatus(id) {
    try {
      const posts = this.getPosts({ includeDrafts: true });
      const post = posts.find(p => p.id === id);
      if (post) {
        post.status = post.status === "published" ? "draft" : "published";
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
        return { success: true, status: post.status };
      }
      return { success: false, error: "Post não encontrado" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  incrementView(slug) {
    try {
      if (!slug) return;
      // Não contabiliza visualização se a própria advogada estiver conectada
      if (this.checkAuth()) return;

      // Evita inflar acessos com múltiplos F5: conta 1 visualização real por leitor/sessão
      const sessionKey = `viewed_article_${slug}`;
      if (sessionStorage.getItem(sessionKey)) {
        return;
      }
      sessionStorage.setItem(sessionKey, "true");

      const posts = this.getPosts({ includeDrafts: true });
      const post = posts.find(p => p.slug === slug);
      if (post) {
        post.views = (post.views || 0) + 1;
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      }
    } catch (e) { }
  },

  resetToDefault() {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(DEFAULT_POSTS));
    return DEFAULT_POSTS;
  },

  exportBackup() {
    const posts = this.getPosts({ includeDrafts: true });
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      advogada: DEFAULT_CREDS.name,
      posts
    }, null, 2);
  },

  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const posts = parsed.posts || (Array.isArray(parsed) ? parsed : null);
      if (!posts || !Array.isArray(posts)) {
        throw new Error("Formato do arquivo de backup inválido.");
      }
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      return { success: true, count: posts.length };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  slugify(text) {
    return (text || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^a-z0-9 -]/g, "") // Remove caracteres inválidos
      .trim()
      .replace(/\s+/g, "-") // Substitui espaços por traços
      .replace(/-+/g, "-");
  },

  formatDate(dateStr) {
    if (!dateStr) return "";
    try {
      const [year, month, day] = dateStr.split("-");
      if (!year || !month || !day) return dateStr;
      const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];
      return `${parseInt(day, 10)} de ${months[parseInt(month, 10) - 1]} de ${year}`;
    } catch (e) {
      return dateStr;
    }
  },

  /* ==========================================================================
     Autenticação e Sessão da Advogada (Criptografia SHA-256)
     ========================================================================== */
  getCredentials() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CREDS);
      if (!stored) return DEFAULT_CREDS;
      const parsed = JSON.parse(stored);
      // Migração automática se não tiver hash
      if (!parsed.passwordHash || parsed.password) {
        delete parsed.password;
        parsed.passwordHash = DEFAULT_CREDS.passwordHash;
        parsed.email = DEFAULT_CREDS.email;
        localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify(parsed));
      }
      return { ...DEFAULT_CREDS, ...parsed };
    } catch (e) {
      return DEFAULT_CREDS;
    }
  },

  setCredentials(newCreds) {
    try {
      const current = this.getCredentials();
      const updated = { ...current, ...newCreds };
      localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify(updated));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  verifyPassword(inputPassword) {
    const creds = this.getCredentials();
    const inputHash = hashPassword(inputPassword);
    return inputHash === creds.passwordHash;
  },

  changePassword(newPassword) {
    const newHash = hashPassword(newPassword);
    return this.setCredentials({ passwordHash: newHash });
  },

  login(email, password) {
    const creds = this.getCredentials();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    // Verificação estrita com Hash Criptográfico irreversível
    const isEmailValid = cleanEmail === creds.email.toLowerCase();
    const isPasswordValid = this.verifyPassword(cleanPass);

    if (isEmailValid && isPasswordValid) {
      const session = {
        token: `session_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        email: creds.email,
        name: creds.name,
        oab: creds.oab,
        loggedInAt: new Date().toISOString()
      };
      sessionStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session));
      localStorage.removeItem(STORAGE_KEY_AUTH);
      return { success: true, session };
    }

    return { success: false, error: "E-mail ou senha incorretos. Verifique suas credenciais." };
  },

  checkAuth() {
    try {
      // Sessão em sessionStorage (expira ao fechar navegador para proteção)
      const session = sessionStorage.getItem(STORAGE_KEY_AUTH);
      if (!session) return null;
      return JSON.parse(session);
    } catch (e) {
      return null;
    }
  },

  logout() {
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    return true;
  }
};
