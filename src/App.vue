<script setup>
import { RouterView } from "vue-router";
import { darkTheme } from "naive-ui";
import { NConfigProvider } from "naive-ui";

const darkThemeOverrides = {
  Drawer: {
    color: "var(--card-background)",
  },
};
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="darkThemeOverrides">
    <RouterView />
  </n-config-provider>
</template>

<style scoped></style>
