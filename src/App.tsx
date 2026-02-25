/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type View = 'home' | 'modules' | 'resources' | 'projects' | 'profile' | 'community';

interface Module {
  id: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  bgColor: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'next' | 'locked';
  moduleNumber: string;
}

interface Project {
  id: string;
  title: string;
  author: string;
  rating: number;
  tags: string[];
  type: string;
  imageUrl: string;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  category: string;
  categoryColor: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  imageUrl?: string;
  jobTitle?: string;
  jobDesc?: string;
}

// --- Constants & Data ---

const MODULES: Module[] = [
  {
    id: '1',
    title: 'HTML5 Fundamentos',
    description: 'Estrutura semântica, SEO e as bases fundamentais para construção de páginas modernas.',
    tag: 'Essencial',
    tagColor: 'text-green-600 bg-green-50',
    bgColor: 'bg-orange-100',
    progress: 100,
    status: 'completed',
    moduleNumber: '01',
  },
  {
    id: '2',
    title: 'CSS3 Avançado',
    description: 'Flexbox, Grid, animações e estratégias de Design Responsivo de alta performance.',
    tag: 'Design',
    tagColor: 'text-primary bg-primary/10',
    bgColor: 'bg-blue-100',
    progress: 45,
    status: 'in-progress',
    moduleNumber: '02',
  },
  {
    id: '3',
    title: 'Lógica com JavaScript',
    description: 'Sintaxe moderna ES6+, manipulação de DOM e lógica de programação assíncrona.',
    tag: 'Lógica',
    tagColor: 'text-gray-500 bg-gray-100',
    bgColor: 'bg-yellow-100',
    progress: 0,
    status: 'next',
    moduleNumber: '03',
  },
  {
    id: '4',
    title: 'Frameworks Modernos (React/Vue)',
    description: 'Componentização, estado global e roteamento em Single Page Applications (SPA).',
    tag: 'Bloqueado',
    tagColor: 'text-gray-500 bg-gray-100',
    bgColor: 'bg-teal-100',
    progress: 0,
    status: 'locked',
    moduleNumber: '04',
  },
  {
    id: '5',
    title: 'Backend com Node.js',
    description: 'Criação de APIs RESTful, integração com bancos de dados e autenticação JWT.',
    tag: 'Bloqueado',
    tagColor: 'text-gray-500 bg-gray-100',
    bgColor: 'bg-purple-100',
    progress: 0,
    status: 'locked',
    moduleNumber: '05',
  },
];

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Sistema de Gestão Escolar',
    author: 'Lucas Oliveira',
    rating: 4.9,
    tags: ['React', 'Node.js', 'PostgreSQL'],
    type: 'WEB APP',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEWpZKE8f_hREF7LysqAJ4Bxtvbfp500OSBrTpizkXtGAPz4z4cdhXo6OMSrutQ-fIRgL8tekbOaMb7zsrCzXDfhs7uX70OarU5v7mYdll91GdUs85RMmtS3uMZPXGUJdoxGln_KPMmSNpxH30kAZT2Op8gguGgvMDzrj9bGqLrz2kaMvA9JDb8XMqQWunyRP6tpNvt1BktF6QuvW38vFE7DRF2vn18xaY2vSbwLpuW5uXMkUciNlpyIAxnF4t3aX3p1sOmH0m-GQ-',
  },
  {
    id: '2',
    title: 'Dashboard Logística v2',
    author: 'Ana Clara Souza',
    rating: 4.8,
    tags: ['Python', 'D3.js', 'Firebase'],
    type: 'DATA DASHBOARD',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWu5DklU6xS7CvJEPfkK_-oGEL9VrPTyikZAQvXNEgtrYOA4JU5qVQagwEoiQCju6zgFECM-6blQ7bYOxqun0sKWIOYxFQKW8i9bGVHUAqER5n5DXiejhgCtykGp-Or_m_B5GYVXiWdEcabkiYFpbM1U6ktnBCTS9ot8xg_lwTjpF5iY1mXxIrMeqd7kiDZZ9M9RCo-ZlgiCos1ohOKtrIcar3JItr1QXB3PH__UX5-MevS7e4nAwUo2MbA01R9Kusr4-BXOr0BanS',
  },
  {
    id: '3',
    title: 'App de Nutrição ADS',
    author: 'Gabriel Santos',
    rating: 5.0,
    tags: ['Flutter', 'Supabase'],
    type: 'MOBILE APP',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzwkSchh2Le5jtNHsOq2ipKlG-S3eE9HLafEAMC3P3IJYPFldcQkT9cIIB3YL4VmFTke9uDGVGFIWq-RCC4U9m4WmbAZyTTMkxrZaa5-XcxUyqOcc5ucrbltaur9h2aQDFQrSShLImQ4uW-8gMXuXqwmvmI2o70CFluApsepOyuNZmmhsA1Q81fDOSV6g_RJ_sfZylhjcpNQy0qsgrY2meWmvZ-cTRah1IjMKXSWQwhRCbMwfTUJLwFWxKizBz2CxBYQ6T9vPOIcIa',
  },
];

const POSTS: Post[] = [
  {
    id: '1',
    author: 'Lucas Oliveira',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBCw3vjjwVmaK2nv0acNMXpcDnVVSyu3_ZJJ9KV8yKYhcI9kWi6b_BtIKGrjEnl2mpYLxWLQ7lwVz1gdbDGPTI4w0aXoSQtZI73HtMmuleH6qeChrs9PBLP6blA7MBLsReyHS6J72-2uG65hWQnY1o61oibIs83e13hmbXNH96Uw3zu3r1Qu3ftxK_rRHinKL8XkuveyA33yK_vrgIXXXISLyGVn3vEPQI-WSqe-cqidYIF1vMfVnwIG9IHz7m5OCp1cjrTPvnmLog',
    time: 'há 15 minutos',
    category: 'Dúvida',
    categoryColor: 'text-orange-500',
    content: 'Alguém para me ajudar com uma dúvida em React? Estou tentando implementar o Context API com TypeScript e os tipos não estão batendo. 😅',
    likes: 12,
    comments: 8,
    tags: ['#ReactJS', '#TypeScript'],
  },
  {
    id: '2',
    author: 'Ana Clara Souza',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcJnpnQtPzYeU06s2P5HlsvCwEmvrvFvFoKbO19uX6Eb3OqvM7P2W-hRKW_Wv_Qt7IjH2SD3XQooM1Uwys4wwbv_SP59P6Q16PstTo1CcHmmKRHmndbb_l0Dr2T3KBHuY60viGDxWiq89QPrWIDe5ZCLh5sc6XJnnL-BlrPaAfFxGeFoRkO9_dxMmSxdbvUM0_lyjcPhFWpRh0Abx0MFbDTQ91NgPM1ZEvlvf-KQO_S3gNoTmIPyN5LNKG4WJ6tT6PzFSt3BVYAaIp',
    time: 'há 2 horas',
    category: 'Projeto',
    categoryColor: 'text-primary',
    content: 'Acabei de finalizar a v2 do meu Dashboard de Logística! O que acharam do novo design? Usei D3.js para os gráficos.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWu5DklU6xS7CvJEPfkK_-oGEL9VrPTyikZAQvXNEgtrYOA4JU5qVQagwEoiQCju6zgFECM-6blQ7bYOxqun0sKWIOYxFQKW8i9bGVHUAqER5n5DXiejhgCtykGp-Or_m_B5GYVXiWdEcabkiYFpbM1U6ktnBCTS9ot8xg_lwTjpF5iY1mXxIrMeqd7kiDZZ9M9RCo-ZlgiCos1ohOKtrIcar3JItr1QXB3PH__UX5-MevS7e4nAwUo2MbA01R9Kusr4-BXOr0BanS',
    likes: 45,
    comments: 14,
    tags: ['#UXDesign', '#DataViz'],
  },
  {
    id: '3',
    author: 'Gabriel Santos',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcCMy_yxQO4VDiaENXnwSJIelEuHsrAF1kTsLquUcVDZnZ_y_ziI5XxZ_Lfaz6d0rJ2tiL2lHu6f4gwFHHZJTHrDal3cqppivPLU-bZiNlIyrHpyRSdXmPgZXiH2QlC6q0_5VN0rXyCgzPuURvXOBM2yKBngQhfpy59NeKb75d_Km9ozgcnfmjSCqlCt82aPgatOCa-OqQo_qzq6CRPVnQ_-YXc_3cczAQUXJz7EpGPZwdgxHYQVqVxU5WmzNjKnn6DgRLCZ4wsUdA',
    time: 'há 4 horas',
    category: 'Vagas',
    categoryColor: 'text-emerald-500',
    content: '',
    jobTitle: 'Estágio Frontend - Remoto',
    jobDesc: 'Empresa de tecnologia buscando alunos de ADS. Conhecimentos em HTML/CSS e JS básico.',
    likes: 28,
    comments: 3,
    tags: [],
  },
];

// --- Components ---

const Header = ({ title, icon, onMenuClick }: { title: string; icon: string; onMenuClick?: () => void }) => (
  <header className="sticky top-0 z-50 glass-effect border-b border-[#f0f2f4] px-4 py-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
        <span className="material-symbols-outlined text-white text-xl filled">{icon}</span>
      </div>
      <h1 className="text-lg font-extrabold tracking-tight text-[#111318]">
        ADS <span className="text-primary">{title}</span>
      </h1>
    </div>
    <button className="p-1" onClick={onMenuClick}>
      <span className="material-symbols-outlined text-[#111318] text-2xl">
        {title === 'CONECTADA' ? 'notifications' : title === 'RECURSOS' ? 'search' : 'menu'}
      </span>
    </button>
  </header>
);

const BottomNav = ({ activeView, onViewChange }: { activeView: View; onViewChange: (view: View) => void }) => {
  const navItems: { view: View; label: string; icon: string }[] = [
    { view: 'home', label: 'Início', icon: 'home' },
    { view: 'modules', label: 'Módulos', icon: 'book_2' },
    { view: 'resources', label: 'Materiais', icon: 'folder' },
    { view: 'projects', label: 'Projetos', icon: 'code' },
    { view: 'community', label: 'Comunidade', icon: 'groups' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-[#f0f2f4] pb-8 pt-3 px-4 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`flex flex-1 flex-col items-center gap-1 transition-colors ${
              activeView === item.view ? 'text-primary' : 'text-[#94a3b8]'
            }`}
          >
            <span className={`material-symbols-outlined text-[26px] ${activeView === item.view ? 'filled' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const HomeView = ({ onNavigate }: { onNavigate: (view: View) => void; key?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="pb-32"
  >
    <section className="px-4 pt-6 pb-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl mb-2">
          <img
            alt="Ambiente de desenvolvimento moderno"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEWpZKE8f_hREF7LysqAJ4Bxtvbfp500OSBrTpizkXtGAPz4z4cdhXo6OMSrutQ-fIRgL8tekbOaMb7zsrCzXDfhs7uX70OarU5v7mYdll91GdUs85RMmtS3uMZPXGUJdoxGln_KPMmSNpxH30kAZT2Op8gguGgvMDzrj9bGqLrz2kaMvA9JDb8XMqQWunyRP6tpNvt1BktF6QuvW38vFE7DRF2vn18xaY2vSbwLpuW5uXMkUciNlpyIAxnF4t3aX3p1sOmH0m-GQ-"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#dbeafe] text-primary text-[11px] font-bold uppercase tracking-wider mb-4">
              Análise e Desenvolvimento de Sistemas
            </span>
            <h2 className="text-[#111318] text-[32px] font-black leading-[1.1] tracking-tight mb-4">
              Masterclass de<br /><span className="text-primary">Desenvolvimento Web</span>
            </h2>
            <p className="text-[#64748b] text-[15px] font-normal leading-relaxed">
              Treinamento prático para alunos de ADS dominarem tecnologias web modernas. Construa, publique e escale suas aplicações.
            </p>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={() => onNavigate('modules')}
              className="flex items-center justify-center gap-2 rounded-xl h-14 w-full bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
            >
              <span>Começar Agora</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
            <button className="flex items-center justify-center rounded-xl h-14 w-full bg-white border border-[#e5e7eb] text-[#111318] text-base font-bold hover:bg-gray-50 transition-colors">
              Ver Ementa
            </button>
          </div>
        </div>
      </div>
    </section>

    <section className="px-4 py-10 bg-white/40">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[22px] font-extrabold tracking-tight">Módulos do Curso</h2>
          <button onClick={() => onNavigate('modules')} className="text-primary text-sm font-bold">Ver Todos</button>
        </div>
        <div className="flex flex-col gap-6">
          {MODULES.slice(0, 3).map((module) => (
            <div key={module.id} className="flex flex-col bg-white rounded-2xl p-6 border border-[#f0f2f4] shadow-sm">
              <div className={`w-14 h-14 ${module.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                <span className={`font-black text-xs ${module.id === '1' ? 'text-[#ff5c35]' : module.id === '2' ? 'text-primary' : 'text-[#eab308]'}`}>
                  {module.id === '1' ? 'HTML' : module.id === '2' ? 'CSS' : 'JS'}
                </span>
              </div>
              <h3 className="text-[#111318] text-xl font-extrabold mb-2">{module.title}</h3>
              <p className="text-[#64748b] text-sm leading-relaxed mb-6">{module.description}</p>
              <div className="flex items-center justify-between text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                <span>Módulo {module.moduleNumber}</span>
                <span className={`px-2.5 py-1 rounded-md ${module.tagColor}`}>{module.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="px-4 py-8 max-w-4xl mx-auto">
      <div className="bg-[#0b101b] rounded-3xl p-8 text-white flex flex-col items-center text-center gap-6">
        <h3 className="text-2xl font-extrabold leading-tight">Pronto para criar seu primeiro projeto?</h3>
        <p className="text-[#94a3b8] text-[14px] leading-relaxed">Junte-se a mais de 200 alunos de ADS que já estão criando aplicações web modernas.</p>
        <button className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 rounded-xl transition-colors w-full sm:w-auto">
          Registrar-se Agora
        </button>
      </div>
    </section>
  </motion.div>
);

const ModulesView = ({ key }: { key?: string }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="pb-32"
  >
    <section className="px-4 pt-6 pb-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-primary text-xs font-bold uppercase tracking-widest">Meu Progresso</span>
          <h2 className="text-[#111318] text-3xl font-black tracking-tight">Módulos de Aprendizado</h2>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#f0f2f4] shadow-sm flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-gray-100" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"></circle>
              <circle className="text-primary" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset="37.6" strokeWidth="4"></circle>
            </svg>
            <span className="absolute text-[10px] font-bold">70%</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[#111318]">Quase lá, Dev!</p>
            <p className="text-xs text-[#64748b]">Você completou 12 de 18 aulas no total.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="px-4 py-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {MODULES.map((module) => (
          <div key={module.id} className={`flex flex-col bg-white rounded-2xl overflow-hidden border border-[#f0f2f4] shadow-sm ${module.status === 'locked' ? 'opacity-90' : ''}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${module.bgColor} rounded-xl flex items-center justify-center`}>
                  <span className={`font-black text-xs ${module.status === 'completed' ? 'text-orange-600' : module.status === 'in-progress' ? 'text-blue-600' : module.status === 'next' ? 'text-yellow-600' : 'text-gray-500'}`}>
                    {module.moduleNumber}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                  module.status === 'completed' ? 'bg-green-50 text-green-600' :
                  module.status === 'in-progress' ? 'bg-primary/10 text-primary' :
                  module.status === 'next' ? 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-400'
                }`}>
                  {module.status === 'completed' ? 'Concluído' :
                   module.status === 'in-progress' ? 'Em curso' :
                   module.status === 'next' ? 'Próximo' : 'Bloqueado'}
                </span>
              </div>
              <h3 className="text-[#111318] text-xl font-extrabold mb-2">{module.title}</h3>
              <p className="text-[#64748b] text-sm leading-relaxed mb-6">{module.description}</p>
              <div className="mb-6">
                <div className="flex justify-between text-[11px] font-bold text-[#94a3b8] uppercase mb-2">
                  <span>Progresso</span>
                  <span className={module.progress > 0 ? 'text-primary' : 'text-[#94a3b8]'}>{module.progress}%</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full transition-all duration-500" style={{ width: `${module.progress}%` }}></div>
                </div>
              </div>
              {module.status === 'completed' ? (
                <button className="flex items-center justify-center gap-2 rounded-xl h-12 w-full bg-[#f1f5f9] text-[#111318] text-sm font-bold transition-colors">
                  <span>Revisar Conteúdo</span>
                  <span className="material-symbols-outlined text-sm">history</span>
                </button>
              ) : module.status === 'in-progress' ? (
                <button className="flex items-center justify-center gap-2 rounded-xl h-12 w-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">
                  <span>Continuar</span>
                  <span className="material-symbols-outlined text-lg">play_arrow</span>
                </button>
              ) : (
                <button className="flex items-center justify-center gap-2 rounded-xl h-12 w-full bg-white border border-[#e5e7eb] text-[#94a3b8] text-sm font-bold cursor-not-allowed">
                  <span>Bloqueado</span>
                  <span className="material-symbols-outlined text-sm">lock</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  </motion.div>
);

const ResourcesView = ({ key }: { key?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="pb-32"
  >
    <section className="px-4 pt-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-[#111318] text-[28px] font-black leading-tight tracking-tight">Recursos e Materiais</h2>
          <p className="text-[#64748b] text-[15px] mt-1">Materiais de apoio para o curso de ADS.</p>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-xl">menu_book</span>
            <h3 className="text-lg font-bold text-[#111318]">Documentação Oficial</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'MDN Web Docs', desc: 'Guia completo de tecnologias web.', icon: 'language', color: 'bg-blue-50', iconColor: 'text-primary' },
              { title: 'W3Schools', desc: 'Tutoriais e referências rápidas.', icon: 'school', color: 'bg-green-50', iconColor: 'text-green-600' }
            ].map((item, i) => (
              <a key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#f0f2f4] shadow-sm active:scale-[0.98] transition-transform" href="#">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${item.iconColor}`}>{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-xs text-[#64748b]">{item.desc}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#94a3b8] text-xl">open_in_new</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-xl">code_blocks</span>
            <h3 className="text-lg font-bold text-[#111318]">Repositórios do GitHub</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'Código-fonte da Aula', desc: 'Exemplos práticos e exercícios.', icon: 'source', arrow: 'fork_right' },
              { title: 'Projetos de Alunos', desc: 'Vitrine de trabalhos da turma.', icon: 'folder_zip', arrow: 'open_in_new' }
            ].map((item, i) => (
              <a key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#f0f2f4] shadow-sm active:scale-[0.98] transition-transform" href="#">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-700">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-xs text-[#64748b]">{item.desc}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#94a3b8] text-xl">{item.arrow}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-xl">download_for_offline</span>
            <h3 className="text-lg font-bold text-[#111318]">E-books e PDFs</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Guia CSS', desc: 'Referência Flexbox/Grid', icon: 'picture_as_pdf', color: 'bg-red-50', iconColor: 'text-red-500' },
              { title: 'Cheat Sheet JS', desc: 'ES6+ Cheat Sheet', icon: 'sticky_note_2', color: 'bg-yellow-50', iconColor: 'text-yellow-600' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-[#f0f2f4] shadow-sm flex flex-col items-center text-center">
                <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mb-3`}>
                  <span className={`material-symbols-outlined ${item.iconColor}`}>{item.icon}</span>
                </div>
                <p className="font-bold text-xs mb-1">{item.title}</p>
                <p className="text-[10px] text-[#64748b] mb-4">{item.desc}</p>
                <button className="w-full py-2 bg-[#f1f5f9] text-primary text-xs font-bold rounded-lg flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-xs">download</span>
                  Baixar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

const ProjectsView = ({ key }: { key?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="pb-40"
  >
    <section className="px-4 pt-6 pb-2">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-[#111318] tracking-tight">Projetos dos Alunos</h2>
        <p className="text-[#64748b] text-sm mt-1 leading-tight">Confira os melhores trabalhos desenvolvidos pela turma de ADS.</p>
      </div>
    </section>

    <section className="px-4 py-4">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button className="whitespace-nowrap bg-primary text-white px-5 py-2 rounded-full text-xs font-bold">Todos</button>
        <button className="whitespace-nowrap bg-white border border-[#e5e7eb] text-[#64748b] px-5 py-2 rounded-full text-xs font-bold">Web</button>
        <button className="whitespace-nowrap bg-white border border-[#e5e7eb] text-[#64748b] px-5 py-2 rounded-full text-xs font-bold">Mobile</button>
        <button className="whitespace-nowrap bg-white border border-[#e5e7eb] text-[#64748b] px-5 py-2 rounded-full text-xs font-bold">Backend</button>
      </div>
    </section>

    <section className="px-4 py-2">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {PROJECTS.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl overflow-hidden border border-[#f0f2f4] shadow-sm">
            <div className="relative aspect-video">
              <img alt={project.title} className="w-full h-full object-cover" src={project.imageUrl} referrerPolicy="no-referrer" />
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-primary uppercase tracking-wide border border-white/20">{project.type}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-extrabold text-[#111318]">{project.title}</h3>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-yellow-500 text-sm filled">star</span>
                  <span className="text-xs font-bold text-[#64748b]">{project.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-[#64748b] text-sm mb-4 leading-none">Desenvolvido por <span className="font-semibold text-[#111318]">{project.author}</span></p>
              <div className="flex gap-2 mb-6">
                {project.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#f1f5f9] text-[#64748b] text-[10px] font-bold rounded">{tag}</span>
                ))}
              </div>
              <button className="w-full bg-primary text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                Ver Projeto
                <span className="material-symbols-outlined text-lg">open_in_new</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="px-4 py-10 max-w-4xl mx-auto">
      <div className="bg-[#0b101b] rounded-3xl p-8 text-white flex flex-col items-center text-center gap-6">
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <img key={i} alt="Aluno" className="w-10 h-10 rounded-full border-2 border-[#0b101b] object-cover" src={`https://lh3.googleusercontent.com/aida-public/AB6AXuDBCw3vjjwVmaK2nv0acNMXpcDnVVSyu3_ZJJ9KV8yKYhcI9kWi6b_BtIKGrjEnl2mpYLxWLQ7lwVz1gdbDGPTI4w0aXoSQtZI73HtMmuleH6qeChrs9PBLP6blA7MBLsReyHS6J72-2uG65hWQnY1o61oibIs83e13hmbXNH96Uw3zu3r1Qu3ftxK_rRHinKL8XkuveyA33yK_vrgIXXXISLyGVn3vEPQI-WSqe-cqidYIF1vMfVnwIG9IHz7m5OCp1cjrTPvnmLog`} referrerPolicy="no-referrer" />
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-[#0b101b] bg-primary flex items-center justify-center text-[10px] font-bold">+15</div>
        </div>
        <h3 className="text-2xl font-extrabold leading-tight">Quer ver seu projeto aqui?</h3>
        <p className="text-[#94a3b8] text-sm leading-relaxed max-w-xs">Junte-se aos alunos que já estão construindo seu portfólio profissional hoje mesmo.</p>
        <button className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 rounded-xl transition-colors w-full">
          Submeter Meu Projeto
        </button>
      </div>
    </section>
  </motion.div>
);

const CommunityView = ({ key }: { key?: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="pb-32"
  >
    <section className="px-4 py-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <button className="whitespace-nowrap bg-primary text-white px-5 py-2 rounded-full text-xs font-bold">Tudo</button>
        <button className="whitespace-nowrap bg-white border border-[#e5e7eb] text-[#64748b] px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-orange-500">help_center</span> Dúvidas
        </button>
        <button className="whitespace-nowrap bg-white border border-[#e5e7eb] text-[#64748b] px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-primary">code</span> Projetos
        </button>
        <button className="whitespace-nowrap bg-white border border-[#e5e7eb] text-[#64748b] px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-purple-500">event</span> Eventos
        </button>
        <button className="whitespace-nowrap bg-white border border-[#e5e7eb] text-[#64748b] px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-emerald-500">work</span> Vagas
        </button>
      </div>
    </section>

    <section className="px-4 mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-bold text-[#111318]">Top Contribuidores</h2>
        <button className="text-primary text-[11px] font-bold">Ver todos</button>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
        {POSTS.map((post, i) => (
          <div key={i} className="flex flex-col items-center gap-1 shrink-0">
            <div className="relative">
              <img alt={post.author} className={`w-14 h-14 rounded-full border-2 ${i === 0 ? 'border-primary' : 'border-transparent'} object-cover`} src={post.avatar} referrerPolicy="no-referrer" />
              {i === 0 && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 border-2 border-white rounded-full w-5 h-5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px] text-white filled">emoji_events</span>
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-[#111318]">{post.author.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </section>

    <div className="flex flex-col gap-4 px-4">
      {POSTS.map((post) => (
        <div key={post.id} className="bg-white rounded-2xl border border-[#f0f2f4] p-4 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-3">
              <img alt="Avatar" className="w-10 h-10 rounded-full object-cover" src={post.avatar} referrerPolicy="no-referrer" />
              <div>
                <h4 className="text-sm font-bold text-[#111318]">{post.author}</h4>
                <span className="text-[10px] text-[#64748b]">{post.time} • <span className={`${post.categoryColor} font-semibold`}>{post.category}</span></span>
              </div>
            </div>
            <button className="text-[#94a3b8]"><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
          
          {post.content && (
            <p className="text-sm text-[#334155] leading-relaxed mb-3">{post.content}</p>
          )}

          {post.jobTitle && (
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 mb-3">
              <h5 className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">local_fire_department</span>
                {post.jobTitle}
              </h5>
              <p className="text-xs text-[#64748b] mt-1">{post.jobDesc}</p>
            </div>
          )}

          {post.imageUrl && (
            <div className="rounded-xl overflow-hidden mb-3 border border-[#f0f2f4]">
              <img alt="Project Preview" className="w-full aspect-video object-cover" src={post.imageUrl} referrerPolicy="no-referrer" />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-blue-50 text-primary text-[10px] font-bold rounded">{tag}</span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#f1f5f9]">
            <div className="flex gap-4">
              <button className="flex items-center gap-1 text-[#64748b] active:scale-95 transition-transform">
                <span className={`material-symbols-outlined text-xl ${post.id === '2' ? 'text-red-500 filled' : ''}`}>favorite</span>
                <span className="text-xs font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-[#64748b] active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-xl">chat_bubble</span>
                <span className="text-xs font-bold">{post.comments}</span>
              </button>
            </div>
            {post.category === 'Vagas' ? (
              <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold">Candidatar-se</button>
            ) : (
              <button className="text-[#64748b] active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-xl">share</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>

    <button className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center z-40 active:scale-90 transition-transform">
      <span className="material-symbols-outlined text-3xl">add</span>
    </button>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [activeView, setActiveView] = useState<View>('home');

  const getHeaderProps = () => {
    switch (activeView) {
      case 'home': return { title: 'WEB', icon: 'terminal' };
      case 'modules': return { title: 'WEB', icon: 'terminal' };
      case 'resources': return { title: 'RECURSOS', icon: 'terminal' };
      case 'projects': return { title: 'PROJETOS', icon: 'rocket_launch' };
      case 'community': return { title: 'CONECTADA', icon: 'forum' };
      default: return { title: 'WEB', icon: 'terminal' };
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <Header {...getHeaderProps()} />
      
      <main className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {activeView === 'home' && <HomeView key="home" onNavigate={(v) => setActiveView(v)} />}
          {activeView === 'modules' && <ModulesView key="modules" />}
          {activeView === 'resources' && <ResourcesView key="resources" />}
          {activeView === 'projects' && <ProjectsView key="projects" />}
          {activeView === 'community' && <CommunityView key="community" />}
        </AnimatePresence>
      </main>

      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}
