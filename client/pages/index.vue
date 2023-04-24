<template>
  <main class="flex items-center justify-center h-screen">
    <div class="w-screen p-5 max-w-md">
      <h1 class="text-2xl font-bold">Chat Along</h1>

      <Transition name="fade-down">
        <span class="inline-block" v-if="name.trim()">Hello {{ name }} 👋🏽</span>
      </Transition>
      <form @submit.prevent="submit" class="mt-5">
        <label class="block mb-1 font-medium text-sm" for="name">Chat name</label>
        <input
          v-model="name"
          class="input"
          type="text"
          name="name"
          id="name"
          placeholder="Enter your name" />
        <button class="btn btn-primary mt-3">Sign in</button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
  import { v4 as uuidv4 } from "uuid";
  const name = ref("");
  const chatId = ref();

  const submit = async () => {
    if (!name.value.trim()) return alert("Please enter your name");
    // set name in localsto9rage
    localStorage.setItem(CHAT_NAME_KEY, name.value);
    await navigateTo("/chat");
  };
  onMounted(() => {
    // get chat id from localstorage.
    let CHAT_ID = localStorage.getItem(CHAT_ID_KEY);
    if (CHAT_ID) {
      chatId.value = CHAT_ID;
    } else {
      // set the ID if none is present
      CHAT_ID = uuidv4();
      localStorage.setItem(CHAT_ID_KEY, CHAT_ID!);
      chatId.value = CHAT_ID;
    }
  });
</script>
