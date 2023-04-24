<template>
  <aside class="fixed h-screen w-72 overflow-y-auto bg-gray-50">
    <div class="bg-gray-200 p-5">
      <p class="font-medium">Hello {{ name }} 👋🏽</p>
      <button
        @click="logout()"
        class="text-xs border border-gray-400 px-2 py-1 rounded mt-2 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition">
        Logout
      </button>
    </div>

    <div class="p-5">
      <small class="text-xs font-medium text-gray-400">USERS</small>
      <ul class="mt-2 space-y-2">
        <li
          @click="
            setUser(u);
            u.newMessage = false;
          "
          class="cursor-pointer rounded-md p-2 text-sm font-medium transition hover:bg-primary-100 hover:text-primary"
          v-for="u in users"
          :key="u.chatId">
          {{ u.name }}
          <span v-if="u.chatId == chatId" class="text-xs text-gray-400">(You)</span>
          <span
            v-if="u.newMessage"
            class="float-right mt-1 inline-block h-2 w-2 rounded-full bg-green-500 py-1"></span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
  const props = defineProps({
    name: {
      type: String,
    },
    chatId: {
      type: String,
    },
    users: {
      type: Array as PropType<IUser[]>,
      required: true,
    },
    setUser: {
      type: Function as PropType<(u: IUser) => void>,
      required: true,
    },
    logout: {
      type: Function as PropType<() => void>,
      required: true,
    },
  });
</script>

<style scoped></style>
