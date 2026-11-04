import { html } from 'lit'
import 'fzl-fund-appshell--lit/styles/theme.css'
import '@fzl/design-tokens/tokens.css'
import '@fzl/webcomponents-lit'
import { createAppShell, navigate, pattern } from 'fzl-fund-appshell--lit'
import { supabaseAuthProvider } from './services/supabase-auth-provider.js'

import './views/student-availability-view.js'
import './views/teacher-dashboard-view.js'
import './views/students-list-view.js'
import './views/about-view.js'

createAppShell({
  mount: '#app',
  title: 'Disponibilidade de Alunos',
  ...(supabaseAuthProvider.isConfigured() ? { auth: supabaseAuthProvider } : {}),
  home: () => html`<student-availability-view></student-availability-view>`,
  routes: [
    {
      name: 'minha-disponibilidade',
      match: pattern('minha-disponibilidade'),
      title: 'Minha Disponibilidade',
      crumb: [{ label: 'Minha Disponibilidade' }],
      render: () => html`<student-availability-view></student-availability-view>`,
    },
    {
      name: 'painel',
      match: pattern('painel'),
      title: 'Mapa de Calor & Cruzamento',
      crumb: [{ label: 'Professor' }, { label: 'Mapa de Calor & Cruzamento' }],
      render: () => html`<teacher-dashboard-view></teacher-dashboard-view>`,
    },
    {
      name: 'alunos',
      match: pattern('alunos'),
      title: 'Alunos Respondentes',
      crumb: [
        { label: 'Mapa de Calor', href: '#/painel' },
        { label: 'Alunos Respondentes' },
      ],
      render: () => html`<students-list-view></students-list-view>`,
    },
    {
      name: 'sobre',
      match: pattern('sobre'),
      title: 'Sobre o Aplicativo',
      crumb: [{ label: 'Sobre' }],
      render: () => html`<about-view></about-view>`,
    },
  ],
  drawer: {
    sections: [
      {
        id: 'aluno-section',
        label: 'Área do Aluno',
        expanded: true,
        items: [
          {
            label: 'Minha Disponibilidade',
            icon: 'event_available',
            href: '#/minha-disponibilidade',
          },
        ],
      },
      {
        id: 'professor-section',
        label: 'Visão do Professor / Turmas',
        expanded: true,
        items: [
          {
            label: 'Mapa de Calor (Horários)',
            icon: 'grid_on',
            href: '#/painel',
          },
          {
            label: 'Alunos Respondentes',
            icon: 'groups',
            href: '#/alunos',
          },
        ],
      },
      {
        id: 'sobre-section',
        label: 'Informações',
        items: [
          {
            label: 'Sobre o Aplicativo',
            icon: 'info',
            href: '#/sobre',
          },
        ],
      },
    ],
  },
  headerActions: () => html`
    <fzl-lit-button
      variant="secondary"
      size="sm"
      style="margin-right: 8px;"
      @fzl-click=${() => navigate('painel')}
    >
      📊 Mapa de Calor
    </fzl-lit-button>
  `,
})
