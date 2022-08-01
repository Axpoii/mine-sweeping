<template>
  <div class="create-page-container">
    <n-grid x-gap="12" :cols="2" style="height: 100%">
      <n-gi>
        <div class="map-content">
          <div>
            <div
              class="map-row"
              v-for="(item, index) in mapConfig.left.mapData"
              :key="index"
            >
              <div
                class="mine-item"
                v-for="(mine, mIndex) in item"
                :key="mIndex"
                @click="toggleSetMine('left', [index, mIndex])"
              >
                <div class="mine-mask">
                  <span v-if="mine.isMine">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-gi>
      <n-gi> 2</n-gi>
    </n-grid>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRaw } from "vue";

const mineConfig = {
  isMine: false,
};

const settingConfig = reactive({
  mapLen: 27,
  mineCount: 10,
});

const mapConfig = reactive({
  left: {
    mapData: [],
    mineCount: 10,
  },
});

onMounted(() => {
  mapConfig.left = {
    ...toRaw(settingConfig),
    settledMineCount: 0,
    mapData: new Array(settingConfig.mapLen)
      .fill(1)
      .map(() =>
        new Array(settingConfig.mapLen)
          .fill(1)
          .map(() => JSON.parse(JSON.stringify(mineConfig)))
      ),
  };
});

const toggleSetMine = (target, location) => {
  const [x, y] = location;
  const flag = mapConfig[target].mapData[x][y].isMine;
  let settledCount = mapConfig[target].settledMineCount;
  if (flag) {
    mapConfig[target].settledMineCount--;
  } else {
    if (++settledCount > mapConfig[target].mineCount) return;
    mapConfig[target].settledMineCount++;
  }
  mapConfig[target].mapData[x][y].isMine = !flag;
};

const randomSetMine = (target) => {
  const remainCount =
    mapConfig[target].mineCount - mapConfig[target].settledMineCount;
  for (let i = 1; i <= remainCount; i++) {
    while (true) {
      const x = parseInt(Math.random() * settingConfig.mapLen);
      const y = parseInt(Math.random() * settingConfig.mapLen);
      if (!mapConfig[target].mapData[x][y].isMine) {
        toggleSetMine(target, [x, y]);
        break;
      }
    }
  }
};

const resetMine = (target) => {
  mapConfig[target].settledMineCount = 0;
  mapConfig[target].mapData.forEach((item) => {
    item.forEach((mine) => (mine.isMine = false));
  });
};
</script>

<style lang="scss" scoped>
.create-page-container {
  position: relative;
  background-color: var(--base-black);
  height: 100vh;
  color: var(--base-tx-color);
  &::after {
    content: "";
    position: absolute;
    height: 100%;
    width: 1px;
    background-color: var(--base-tx-color);
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .map-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 4px;
    height: 100%;

    .map-row {
      display: flex;

      &:not(:last-child) {
        margin-bottom: 4px;
      }

      .mine-item {
        width: 24px;
        height: 24px;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        box-shadow: -1px -1px 1px 0 var(--shadow-light),
          1px 1px 1px 0 var(--shadow-dark);
        padding: 2px;

        &:not(:last-child) {
          margin-right: 4px;
        }

        .mine-mask {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
