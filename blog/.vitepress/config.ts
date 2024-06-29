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
          { text: 'The Creation', link: '/posts/2023-09-08-creation' },
          { text:"Dev Container", link: '/posts/2023-10-14-devcontainer'},
          { text: 'Property Scrapper', link: '/posts/2024-03-18-property-scrapper' },
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
  cleanUrls: true
  // lastUpdated: true
})
