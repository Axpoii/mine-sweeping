<template>
  <div class="mine-list-box">
    <n-divider>
      <span style="font-size: 14px; color: #63e2b7">Online</span>
      <n-icon size="28" color="#63e2b7">
        <ArrowDropUpRound />
      </n-icon>
      <n-icon size="28" color="#70c0e8">
        <ArrowDropDownRound />
      </n-icon>
      <span style="font-size: 14px; color: #70c0e8">Local</span>
    </n-divider>
  </div>
</template>

<script setup>
import { ArrowDropDownRound, ArrowDropUpRound } from "@vicons/material";
</script>

<style lang="scss" scoped>
.mine-list-box {
  min-width: 700px;
}
</style>
