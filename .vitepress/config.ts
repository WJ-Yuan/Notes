import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Tech Notes",
  description: "my tech notes",
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    nav: [
      {
        text: "基础",
        link: "/basic/JS/",
        activeMatch: "/basic/",
      },
      {
        text: "框架",
        link: "/framework/",
        activeMatch: "/framework/",
      },
    ],

    sidebar: {
      "/basic/": {
        base: "/basic/",
        items: [
          {
            text: "JS 原理精讲",
            link: "/",
            base: "/basic/JS/",
            items: [
              {
                text: "数据类型及转换",
                link: "数据类型及转换",
              },
            ],
          },
        ],
      },
      "/framework/": {
        base: "/framework/",
        items: [
          {
            text: "Element Plus 源码解析",
            link: "/",
            base: "/framework/ElementPlus/",
            items: [
              {
                text: "hooks 笔记",
                link: "hooks",
              },
            ],
          },
        ],
      },
    },
  },
});
