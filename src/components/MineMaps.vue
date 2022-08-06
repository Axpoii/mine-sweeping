<template>
  <div class="map-list-wrapper" ref="wrapper">
    <n-modal
      :show="show"
      :to="wrapper"
      :on-mask-click="() => emits('update:show', false)"
    >
      <n-card
        class="map-modal"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
      >
        <n-tabs type="line" animated>
          <n-tab-pane name="LOCAL" tab="LOCAL">
            <n-space vertical>
              <n-space>
                <div
                  v-for="(item, index) in localConfig.list.slice(
                    (localConfig.page - 1) * localConfig.pageSize,
                    localConfig.pageSize * localConfig.page
                  )"
                  :key="index"
                  class="map-item"
                  :class="{ actived: nowSelected === item.id }"
                  @click="nowSelected = item.id"
                >
                  <n-space vertical :align="'center'">
                    <div class="map-img">
                      <n-image
                        preview-disabled
                        style="width: 100%; height: 100%"
                        :src="item.headImg"
                      ></n-image>
                    </div>
                    <div class="map-info">
                      <n-space justify="space-around">
                        <n-tag
                          size="small"
                          :bordered="false"
                          :color="{
                            color: 'transparent',
                            textColor: '#70c0e8',
                          }"
                        >
                          {{ item.mapData.length }} *
                          {{ item.mapData[0].length }}
                          <template #avatar>
                            <n-icon>
                              <AppsRound />
                            </n-icon>
                          </template>
                        </n-tag>
                        <n-tag
                          size="small"
                          :bordered="false"
                          :color="{
                            color: 'transparent',
                            textColor: '#f2c97d',
                          }"
                        >
                          <template #avatar>
                            <n-icon>
                              <IconMine />
                            </n-icon>
                          </template>
                          {{ item.mineData.length }}
                        </n-tag>
                      </n-space>
                    </div>
                  </n-space>
                </div>
              </n-space>
              <n-card v-if="nowSelected">1</n-card>
            </n-space>
          </n-tab-pane>
          <n-tab-pane name="ONLINE" tab="ONLINE"> ONLINE </n-tab-pane>
        </n-tabs>
        <template #footer>
          <n-space justify="space-between">
            <n-pagination
              v-model:page="localConfig.page"
              :page-size="localConfig.pageSize"
              :item-count="localConfig.total"
            />
            <n-space justify="end">
              <n-button size="small" @click="handleCancel">取消</n-button>
              <n-button size="small" type="primary">确定</n-button>
            </n-space>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { AppsRound } from "@vicons/material";
import IconMine from "@/components/icons/IconMine.vue";
import MineDB from "@/utils/DB.js";

const mineDB = new MineDB();

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:show"]);

const wrapper = ref(null);

const nowSelected = ref(0);

const localConfig = reactive({
  list: [],
  page: ref(1),
  pageSize: 10,
  total: 0,
});

const handleCancel = () => {
  emits("update:show", false);
};

onMounted(() => {
  mineDB
    .getList()
    .then((res) => {
      //   const list = sliceArrayByLen(res, 10);
      //   if (list[list.length - 1].length < 10) {
      //     list[list.length - 1].push({
      //       isCreate: true,
      //     });
      //   } else {
      //     list.push([{ isCreate: true }]);
      //   }
      //   console.log("res", list);
      localConfig.total = res.length;
      localConfig.list = res;
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>

<style lang="scss" scoped>
.map-list-wrapper {
  .map-modal {
    position: fixed;
    left: 50%;
    top: 100px;
    transform: translateX(-50%);
    width: 60%;

    .map-item {
      width: 100%;
      padding: 10px;
      border: 1px dashed var(--base-tx-color);
      border-radius: 4px;
      transition: border-color 0.4s;
      cursor: pointer;

      &.actived {
        border-color: #63e2b7;
      }

      .map-img {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
