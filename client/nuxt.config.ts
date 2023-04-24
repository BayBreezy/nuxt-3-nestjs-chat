// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: { shim: false },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["vue3-toastify/dist/index.css", "~/assets/css/main.css"],
  modules: ["@nuxtjs/google-fonts"],

  runtimeConfig: {
    public: {
      API: process.env.API,
    },
  },

  // configure fonts
  googleFonts: {
    families: {
      Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },

  app: {
    head: {
      title: "Nuxt Chat",
    },
  },

  // auto import toast
  imports: {
    imports: [{ as: "useToast", from: "vue3-toastify", name: "toast" }],
  },
});
