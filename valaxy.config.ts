import type { UserConfig } from 'valaxy'
import type { ThemeUserConfig } from 'valaxy-theme-yun'
import { addonWaline } from 'valaxy-addon-waline'

/**
 * User Config
 * do not use export const
 */
const config: UserConfig<ThemeUserConfig> = {
  lang: 'zh-CN',
  title: "Requiem's Blog",
  author: {
    name: 'Requiem',
    avatar: '/images/avatar.png',
  },
  subtitle: '',
  description: "Requiem's Blog",
  url: 'https://reqelp.cn',
  social: [
    // {
    //   name: 'RSS',
    //   link: '/atom.xml',
    //   icon: 'i-ri-rss-line',
    //   color: 'orange',
    // },
    {
      name: 'GitHub',
      link: 'https://github.com/reqelp',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: 'Twitter',
      link: 'https://twitter.com/reqelp',
      icon: 'i-ri-twitter-line',
      color: '#1da1f2',
    },
    {
      name: 'E-Mail',
      link: 'mailto:reqelp@gmail.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
  ],

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: "Requiem",
    },

    pages: [
      {
        name: '我的小伙伴们',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      {
        name: '喜欢的女孩子',
        url: '/girls/',
        icon: 'i-ri-women-line',
        color: 'hotpink',
      },
    ],

    footer: {
      since: 2022,
      icon: {
        name: 'i-ri-cloud-line',
        animated: true,
        color: '#0078E7',
        url: 'https://google.com',
        title: 'Requiem',
      },
      beian: {
        enable: true,
        icp: '苏ICP备17638157号',
      },
    },

    bg_image: {
      enable: true,
      url: '/images/bg.png',
      dark: '/images/bg_dark.jpg',
      opacity: 0.8,
    },

    // colors: {
    //   primary: '',
    // },
  },

  unocss: {
    safelist: [
      'i-ri-home-line',
    ],
  },

  comment: {
    enable: true,
  },

  addons: [
    addonWaline({
      serverURL: 'http://waline.reqelp.cn',
    }),
  ],
}

/**
 * add your icon to safelist
 * if your theme is not yun, so you can add it by yourself
 */
config.themeConfig?.pages?.forEach((item) => {
  config.unocss?.safelist?.push(item?.icon)
})

export default config
