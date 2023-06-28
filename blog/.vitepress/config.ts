import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Werner van der Merwe",
  description: "Personal Blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Blog', link: '/blog' }
    ],

    sidebar: [
      {
        text: 'Blog',
        items: [
          // { text: 'Markdown Examples', link: '/blog' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
      
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wvdm1217' }
    ]
  },
  base: "/"
})
