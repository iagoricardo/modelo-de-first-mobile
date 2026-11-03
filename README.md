# Dra. Ezisvane Rodrigues — Advocacia & Assessoria Jurídica

Landing page institucional de alta conversão, responsiva e moderna, com blog integrado e painel administrativo para publicação de conteúdos jurídicos (Direito Previdenciário e Trabalhista).

## 🚀 Tecnologias Utilizadas

- **HTML5 & Semântica Avançada** (Schema.org JSON-LD para SEO jurídico)
- **CSS3 Moderno** (Variáveis CSS, Flexbox, CSS Grid, Design Responsivo Mobile-First)
- **JavaScript Moderno** (ES6+, Vite)
- **Painel Administrativo com Segurança**:
  - Autenticação com hash SHA-256 e salt seguro
  - Proteção de sessão via `sessionStorage` (encerra ao fechar a aba)
  - Formulários limpos sem preenchimento automático de senhas
- **Integração com Redes e Contato**:
  - Instagram oficial: [@adv.ezisrodrigues](https://www.instagram.com/adv.ezisrodrigues)
  - Botões de atendimento direto via WhatsApp
- **Deploy Automático**: Vercel

## 📁 Estrutura do Projeto

```
├── admin.html          # Painel de acesso e gerenciamento de artigos do blog
├── blog.html           # Página pública de artigos e notícias
├── index.html          # Landing page institucional principal
├── assets/
│   ├── css/            # Folhas de estilo (style.css, blog.css)
│   ├── js/             # Scripts (main.js, blog.js, blogStore.js, admin.js)
│   └── images/         # Fotos da advogada, logos e ícones
├── public/             # Arquivos públicos e estáticos
├── sitemap.xml         # Mapa do site para indexação em mecanismos de busca
├── robots.txt          # Instruções para rastreadores web
└── vercel.json         # Configuração de rotas e headers para Vercel
```

## 🛠️ Execução Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```
