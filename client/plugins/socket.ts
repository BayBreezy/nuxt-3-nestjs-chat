import { io } from "socket.io-client";
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const socket = io(config.public.API, {
    autoConnect: false,
  });

  return {
    provide: {
      socket,
    },
  };
});
