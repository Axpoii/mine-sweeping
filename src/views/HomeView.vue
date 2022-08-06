<template>
  <div class="hall-container" ref="hallContainer">
    <div class="room-list">
      <div class="room-item" v-for="(item, index) in rooms" :key="index">
        <div class="header">
          <span>ID: {{ item.id }}</span>
        </div>
        <div class="content">
          <div class="join-room">JOIN</div>
        </div>
        <div class="footer">
          <div class="status" :style="{ color: statusMap[item.status].color }">
            <IconFight v-if="item.status === 'PLAYING'" />
            <IconClock v-else />
            <span>{{ statusMap[item.status].label }}</span>
          </div>
          <div class="players">
            <IconUser />
            <span>5</span>
          </div>
        </div>
      </div>
    </div>
    <div class="create-room" @click="handleCreateRoom">
      <IconMine />
    </div>

    <n-modal
      v-model:show="active"
      :to="hallContainer"
      :on-update:show="handleModalShow"
    >
      <n-card
        class="create-modal"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
      >
        <n-form ref="createForm" :model="form" size="medium">
          <n-form-item label="模式">
            <n-radio-group v-model:value="form.mode" name="radiogroup">
              <n-space>
                <n-radio value="1"> 标准 </n-radio>
                <n-radio value="2"> 自定义 </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <template v-if="form.mode === '1'">
            <n-form-item label="难度">
              <n-radio-group
                v-model:value="form.difficult"
                name="radiobuttongroup1"
              >
                <n-radio-button value="easy" label="简单(9 * 9)" />
                <n-radio-button value="medium" label="中等(16 * 16)" />
                <n-radio-button value="hard" label="困难(16 * 30)" />
              </n-radio-group>
            </n-form-item>
          </template>
          <template v-else>
            <n-space vertical>
              <n-card size="small">
                <template #header>
                  <div class="inner-card-title">Player 1</div>
                </template>
                <template #header-extra>
                  <n-button
                    quaternary
                    type="info"
                    size="tiny"
                    @click="active2 = true"
                  >
                    选择Map
                  </n-button>
                  <!-- <n-popselect
                    ref="firstPop"
                    trigger="click"
                    :on-update:show="hanldePopchange"
                  >
                    <n-button quaternary type="info" size="tiny">
                      选择Map
                    </n-button>
                    <template #empty>
                      <MineMapList @select="handleSelectMap"></MineMapList>
                    </template>
                  </n-popselect> -->
                </template>
                <n-form-item label="行数" label-placement="left">
                  <n-input-number v-model:value="value" clearable />
                </n-form-item>
                <n-form-item label="列数" label-placement="left">
                  <n-input-number v-model:value="value" clearable />
                </n-form-item>
                <n-form-item label="雷数" label-placement="left">
                  <n-input-number v-model:value="value" clearable />
                </n-form-item>
              </n-card>
              <n-card size="small">
                <template #header>
                  <div class="inner-card-title">Player 2</div>
                </template>
                <template #header-extra>
                  <n-button quaternary type="info" size="tiny">
                    选择Map
                  </n-button>
                  <!-- <n-popselect trigger="click">
                    <n-button quaternary type="info" size="tiny">
                      选择Map
                    </n-button>
                    <template #empty>
                      <MineMapList></MineMapList>
                    </template>
                  </n-popselect> -->
                </template>
                <n-form-item label="行数" label-placement="left">
                  <n-input-number v-model:value="value" clearable />
                </n-form-item>
                <n-form-item label="列数" label-placement="left">
                  <n-input-number v-model:value="value" clearable />
                </n-form-item>
                <n-form-item label="雷数" label-placement="left">
                  <n-input-number v-model:value="value" clearable />
                </n-form-item>
              </n-card>
            </n-space>
          </template>
        </n-form>

        <template #footer>
          <n-space justify="end">
            <n-button>取消</n-button>
            <n-button type="primary">创建</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>

    <MineMaps v-model:show="active2"></MineMaps>
  </div>
</template>

<script setup>
import IconFight from "@/components/icons/IconFight.vue";
import IconUser from "@/components/icons/IconUser.vue";
import IconClock from "@/components/icons/IconClock.vue";
import IconMine from "@/components/icons/IconMine.vue";
import { reactive, ref } from "vue";
import MineMaps from "@/components/MineMaps.vue";

const statusMap = {
  PENDING: {
    label: "等待中",
    color: "inherit",
  },
  PLAYING: {
    label: "对战中",
    color: "#e9ca91",
  },
};

const rooms = [
  { id: 1, status: "PENDING", players: 10 },
  { id: 2, status: "PLAYING", players: 2 },
  { id: 3, status: "PENDING", players: 4 },
];

const createForm = ref(null);

// const firstPop = ref(null);

const form = reactive({
  mode: "1",
  difficult: "",
});

const hallContainer = ref(null);

const active = ref(false);

const active2 = ref(true);

const canClose = ref(true);

const handleCreateRoom = () => {
  active.value = true;
};

// const hanldePopchange = (val) => {
//   setTimeout(() => {
//     canClose.value = !val;
//   }, 0);
// };

const handleModalShow = (val) => {
  if (canClose.value) {
    active.value = val;
  }
};

// 选择地图
// const handleSelectMap = (map) => {
//   firstPop.value.setShow(false);
//   console.log("select", map);
// };
</script>

<style lang="scss" scoped>
.hall-container {
  background-color: var(--base-black);
  height: 100vh;
  color: var(--base-tx-color);
  .room-list {
    padding: 20px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(5, 1fr);
    .room-item {
      padding: 10px;
      border-radius: 4px;
      box-shadow: 1px 1px 2px var(--shadow-dark),
        -1px -1px 2px var(--shadow-light);

      .header {
      }
      .content {
        padding: 10px 0;
        display: flex;
        justify-content: center;
        .join-room {
          width: 40%;
          height: 50px;
          border-radius: 4px;
          box-shadow: 1px 1px 2px var(--shadow-dark),
            -1px -1px 2px var(--shadow-light);
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          cursor: pointer;

          &:active {
            box-shadow: inset 1px 1px 2px var(--shadow-dark),
              inset -1px -1px 2px var(--shadow-light);
          }
          &:hover {
            background-color: var(--base-black-hover);
          }
        }
      }
      .footer {
        display: flex;
        justify-content: space-between;
        .status,
        .players {
          display: flex;
          align-items: center;

          span {
            line-height: 1;
          }
          .icon {
            width: 24px;
            height: 24px;
            margin-right: 6px;
          }
        }
        .players {
          .icon {
            width: 18px;
            height: 18px;
          }
        }
      }
    }
  }

  .create-room {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    box-shadow: 1px 1px 2px var(--shadow-dark),
      -1px -1px 2px var(--shadow-light);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .icon {
      width: 36px;
      height: 36px;
    }

    &:hover {
      background-color: var(--base-black-hover);
    }
  }

  .custom-drawer {
    width: 500px;
  }

  .create-modal {
    position: fixed;
    left: 50%;
    top: 100px;
    transform: translateX(-50%);
    width: 800px;

    .inner-card-title {
      font-size: 14px;
    }
  }
}
</style>
