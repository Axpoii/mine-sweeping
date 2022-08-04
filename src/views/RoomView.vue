<template>
  <div class="room-container">
    <div class="demo">
      <p class="char">{{ nowChar }}</p>
      <n-button @click="randomChar">Next</n-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const nowChar = ref("");
const str =
  "あアいイうウえエおオかカきキくクけケこコさサしシすスせセそソたタちチつツてテとトなナにニぬヌねネのノはハひヒふフへヘほホまマみミむムめメもモやヤゆユよヨらラりリるルれレろロわワをヲんン";

const randomChar = () => {
  nowChar.value = [...str][Math.floor(Math.random() * str.length)];
};
</script>

<style lang="scss" scoped>
.room-container {
  background-color: var(--base-black);
  height: 100vh;
  color: var(--base-tx-color);

  .char {
    font-size: 20px;
  }
  .demo {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
