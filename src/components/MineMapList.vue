<template>
  <div class="mine-list-box">
    <!-- 网络MAP -->
    <n-space :wrap-item="false">
      <div style="margin-left: -16px">
        <n-button
          :disabled="pageConfig.page === 1"
          quaternary
          size="tiny"
          style="height: 100%"
          @click="lastPage"
        >
          <n-icon> <ArrowBackIosRound /> </n-icon>
        </n-button>
      </div>
      <div style="flex: 1; overflow: hidden">
        <Transition :name="pageConfig.fadeType" v-if="!loading">
          <div v-if="!isAnimate">
            <template v-if="pageConfig.list.length !== 0">
              <n-grid :x-gap="12" :cols="6">
                <n-grid-item
                  v-for="item in pageConfig.list[pageConfig.page - 1]"
                  :key="item"
                >
                  <div class="map-item-wrapper">
                    <div class="map-item"></div>
                  </div>
                </n-grid-item>
              </n-grid>
            </template>
            <template v-else>
              <n-empty description="暂无数据"></n-empty>
            </template>
          </div>
        </Transition>
        <div v-else>
          <n-spin :show="loading">
            <n-grid :x-gap="12" :cols="6">
              <n-grid-item>
                <div class="map-item-wrapper">
                  <div class="map-item" style="opacity: 0"></div>
                </div>
              </n-grid-item>
            </n-grid>
          </n-spin>
        </div>
      </div>
      <div style="margin-right: -16px">
        <n-button
          quaternary
          size="tiny"
          style="height: 100%"
          @click="nextPage"
          :disabled="pageConfig.isLoadDone"
        >
          <n-icon> <ArrowForwardIosRound /> </n-icon>
        </n-button>
      </div>
    </n-space>
    <!-- 分割线 -->
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
    <!-- 本地MAP -->
    <n-space :wrap-item="false">
      <div style="margin-left: -16px">
        <n-button
          quaternary
          size="tiny"
          style="height: 100%"
          @click="lastLocalPage"
        >
          <n-icon> <ArrowBackIosRound /> </n-icon>
        </n-button>
      </div>
      <div style="flex: 1; overflow: hidden">
        <Transition :name="localConfig.fadeType" v-if="!localLoading">
          <div v-if="!isLocalAnimate">
            <n-grid :x-gap="12" :cols="6">
              <n-grid-item
                v-for="(item, index) in localConfig.list[localConfig.page - 1]"
                :key="index"
              >
                <div class="map-item-wrapper">
                  <div
                    class="map-item"
                    v-if="!item.isCreate"
                    @click="handleSelectMap(item)"
                  >
                    <img :src="item.headImg" alt="" />
                  </div>
                  <div class="map-item create" v-else @click="handleCreate">
                    <n-icon>
                      <PlusRound />
                    </n-icon>
                  </div>
                </div>
              </n-grid-item>
            </n-grid>
          </div>
        </Transition>
        <div v-else>
          <n-spin :show="localLoading">
            <n-grid :x-gap="12" :cols="6">
              <n-grid-item>
                <div class="map-item-wrapper">
                  <div class="map-item" style="opacity: 0"></div>
                </div>
              </n-grid-item>
            </n-grid>
          </n-spin>
        </div>
      </div>
      <div style="margin-right: -16px">
        <n-button
          quaternary
          size="tiny"
          style="height: 100%"
          @click="nextLocalPage"
        >
          <n-icon> <ArrowForwardIosRound /> </n-icon>
        </n-button>
      </div>
    </n-space>
  </div>
</template>

<script setup>
import {
  ArrowDropDownRound,
  ArrowDropUpRound,
  ArrowBackIosRound,
  ArrowForwardIosRound,
  PlusRound,
} from "@vicons/material";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import MineDB from "@/utils/DB.js";

const emit = defineEmits(["select"]);

const mineDB = new MineDB();

const router = useRouter();

const pageConfig = reactive({
  page: 1,
  list: [],
  fadeType: "fade-left",
  isLoadDone: true,
});

const localConfig = reactive({
  page: 1,
  list: [[{ isCreate: true }]],
  fadeType: "fade-left",
});

const isAnimate = ref(false);

const isLocalAnimate = ref(false);

const loading = ref(false);

const localLoading = ref(false);

onMounted(() => {
  mineDB
    .getList()
    .then((res) => {
      const list = sliceArrayByLen(res, 5);
      if (list[list.length - 1].length < 5) {
        list[list.length - 1].push({
          isCreate: true,
        });
      } else {
        list.push([{ isCreate: true }]);
      }
      console.log("res", list);
      localConfig.list = list;
    })
    .catch((err) => {
      console.log(err);
    });
});

const handleShow = (page) => {
  if (page > pageConfig.list.length) {
    loadList();
  } else {
    doAnimate();
    pageConfig.page = page;
  }
};

const doAnimate = () => {
  isAnimate.value = true;
  setTimeout(() => {
    isAnimate.value = false;
  }, 500);
};

const nextPage = () => {
  pageConfig.fadeType = "fade-left";
  let page = pageConfig.page + 1;
  handleShow(page);
};

const lastPage = () => {
  pageConfig.fadeType = "fade-right";
  if (pageConfig.page === 1) return;
  let page = pageConfig.page - 1;
  handleShow(page);
};

const loadList = () => {
  loading.value = true;
  setTimeout(() => {
    pageConfig.list.push(new Array(Math.ceil(Math.random() * 6)).fill(1));
    pageConfig.page += 1;
    loading.value = false;
    isAnimate.value = false;
  }, 500);
};

const nextLocalPage = () => {
  let page = localConfig.page + 1;
  localConfig.fadeType = "fade-left";
  if (page <= localConfig.list.length) {
    localConfig.page = page;
    isAnimate.value = true;
    setTimeout(() => {
      isAnimate.value = false;
    }, 500);
  }
};

const lastLocalPage = () => {
  let page = localConfig.page - 1;
  localConfig.fadeType = "fade-right";
  if (page >= 1) {
    localConfig.page = page;
    isAnimate.value = true;
    setTimeout(() => {
      isAnimate.value = false;
    }, 500);
  }
};

const handleCreate = () => {
  router.push({
    path: "/create",
  });
};

const sliceArrayByLen = (target, len) => {
  const resArr = new Array(Math.ceil(target.length / len)).fill(1);
  return resArr.map((item, index) => {
    return target.slice(index * len, len * (index + 1));
  });
};

const handleSelectMap = (target) => {
  emit("select", target);
};
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
      border: 1px dashed #adbac7;
      border-radius: 4px;
      padding: 4px;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &.create {
        background-color: transparent;
        border: 1px dashed #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 50px;
      }
    }
  }
}

.fade-left-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.fade-left-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

.fade-left-leave-from {
  opacity: 1;
}
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.fade-left-enter-active,
.fade-left-leave-active {
  transition: all 0.5s ease;
}

.fade-right-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}
.fade-right-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

.fade-right-leave-from {
  opacity: 1;
}
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.fade-right-enter-active,
.fade-right-leave-active {
  transition: all 0.5s ease;
}
</style>
