<template>
  <div class="mine-list-box">
    <n-space :wrap-item="false">
      <div style="margin-left: -16px">
        <n-button quaternary size="tiny" style="height: 100%">
          <n-icon> <ArrowBackIosRound /> </n-icon>
        </n-button>
      </div>
      <div style="flex: 1">
        <n-grid :x-gap="12" :cols="6">
          <n-grid-item v-for="item in 4" :key="item">
            <div class="map-item-wrapper">
              <div class="map-item"></div>
            </div>
          </n-grid-item>
        </n-grid>
      </div>
      <div style="margin-right: -16px">
        <n-button quaternary size="tiny" style="height: 100%">
          <n-icon> <ArrowForwardIosRound /> </n-icon>
        </n-button>
      </div>
    </n-space>
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
import {
  ArrowDropDownRound,
  ArrowDropUpRound,
  ArrowBackIosRound,
  ArrowForwardIosRound,
} from "@vicons/material";
</script>

<style lang="scss" scoped>
.mine-list-box {
  min-width: 700px;

  .map-item-wrapper {
    width: 100%;
    padding-top: 100%;
    position: relative;

    .map-item {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background-color: bisque;
    }
  }
}
</style>
