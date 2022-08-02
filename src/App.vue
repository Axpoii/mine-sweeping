<script setup>
import { RouterView } from "vue-router";
import { darkTheme } from "naive-ui";
import { NConfigProvider, NMessageProvider } from "naive-ui";

const darkThemeOverrides = {
  Drawer: {
    color: "var(--card-background)",
  },
};
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="darkThemeOverrides">
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>
