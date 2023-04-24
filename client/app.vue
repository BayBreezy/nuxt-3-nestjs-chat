<template>
  <div class="text-gray-800 bg-white">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  useHead({
    bodyAttrs: {
      class: "text-gray-800 bg-white",
    },
  });
</script>
