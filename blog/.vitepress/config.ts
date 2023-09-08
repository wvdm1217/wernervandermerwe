import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Werner van der Merwe",
  description: "Personal Blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'About', link: '/about' },
      { text: 'Blog', link: '/blog' }
    ],

    sidebar: [
      {
        text: 'Blog',
        items: [
          { text: 'Introduction', link: '/blog' },
          { text: 'The Creation', link: 'posts/creation' }
        ]
      }      
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wvdm1217' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/werner-van-der-merwe/' },
      { icon: 'twitter', link: 'https://twitter.com/WernervanderMe6'}
    ]
  },
  base: "/",
  // lastUpdated: true
})
