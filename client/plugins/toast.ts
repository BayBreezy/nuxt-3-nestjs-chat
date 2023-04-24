import Toast, { ToastOptions } from "vue3-toastify";

export default defineNuxtPlugin((nApp) => {
  nApp.vueApp.use(Toast, {
    autoClose: 7000,
    position: "top-right",
  } satisfies ToastOptions);
});
