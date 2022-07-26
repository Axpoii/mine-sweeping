<template>
  <div class="hall-container">
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

    <n-drawer v-model:show="active" :width="502">
      <n-drawer-content title=""> </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import IconFight from "@/components/icons/IconFight.vue";
import IconUser from "@/components/icons/IconUser.vue";
import IconClock from "@/components/icons/IconClock.vue";
import IconMine from "@/components/icons/IconMine.vue";
import { ref } from "vue";
import { NDrawer, NDrawerContent } from "naive-ui";

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

const active = ref(false);

const handleCreateRoom = () => {
  active.value = true;
};
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
            display: inline-block;
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

    &:hover {
      background-color: var(--base-black-hover);
    }
  }
}
</style>
