<template>
  <div class="create-page-container" ref="pageContainer">
    <n-grid x-gap="12" :cols="2" style="height: 100%">
      <n-gi>
        <div class="map-content">
          <div>
            <div
              class="map-row"
              v-for="(item, index) in mapConfig.map.mapData"
              :key="index"
            >
              <div
                class="mine-item"
                :class="{ 'dig-out': mine.isMine }"
                v-for="(mine, mIndex) in item"
                :key="mIndex"
                @click="toggleSetMine([index, mIndex])"
              >
                <div class="mine-mask">
                  <n-icon v-if="mine.isMine">
                    <IconMine />
                  </n-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-gi>
      <n-gi>
        <div class="map-setting">
          <n-alert type="info" style="margin-bottom: 20px">
            <n-space vertical>
              <p>1. 地图不要过分大了，较小分辨率显示屏可能会超出边界~</p>
              <p>
                2. 设计完的地图可以考虑上传到
                <n-button
                  text
                  tag="a"
                  href="https://github.com/Axpoii/mine-sweeping"
                  target="_blank"
                  type="primary"
                >
                  Github
                </n-button>
                噢，下方导出文件，然后提交个PR就行~
              </p>
            </n-space>
          </n-alert>
          <n-form
            ref="settingForm"
            :model="formData"
            size="medium"
            label-placement="left"
          >
            <n-form-item label="行数">
              <n-input-number
                :update-value-on-input="false"
                v-model:value="formData.row"
                clearable
              />
            </n-form-item>
            <n-form-item label="列数">
              <n-input-number
                :update-value-on-input="false"
                v-model:value="formData.column"
                clearable
              />
            </n-form-item>
            <n-form-item label="雷数">
              <n-space>
                <n-input-number
                  :update-value-on-input="false"
                  v-model:value="formData.mineCount"
                  :max="formData.row * formData.column - 1"
                  clearable
                />
                <n-button @click="randomSetMine">随机填充</n-button>
              </n-space>
            </n-form-item>
          </n-form>

          <div class="setting-actions">
            <n-space>
              <n-button secondary type="primary" @click="saveDialog = true"
                >保存本地</n-button
              >
              <n-button>导出</n-button>
            </n-space>
          </div>
        </div>
      </n-gi>
    </n-grid>

    <n-modal
      v-model:show="saveDialog"
      :to="pageContainer"
      :on-after-leave="modalClose"
    >
      <n-card
        class="custom-modal"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
      >
        <n-form size="medium">
          <n-form-item label="名称">
            <n-input
              v-model:value="saveForm.name"
              type="text"
              placeholder="请输入"
            />
          </n-form-item>
          <n-form-item label="头图">
            <n-upload
              action=""
              accept="image/*"
              :max="1"
              :default-upload="false"
              :show-preview-button="false"
              @change="upload"
              list-type="image-card"
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button @click="saveDialog = false">取消</n-button>
            <n-button type="primary" @click="saveMap">保存</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, toRaw, watch } from "vue";
import IconMine from "@/components/icons/IconMine.vue";
import MineDB from "@/utils/DB.js";
import { useMessage } from "naive-ui";

const message = useMessage();

const mineDB = new MineDB();

const pageContainer = ref(null);

const settingForm = ref(null);

const saveForm = ref({
  name: "",
  headImg: "",
});

const saveDialog = ref(false);

const formData = ref({
  row: 24,
  column: 24,
  mineCount: 10,
});

const mineConfig = {
  isMine: false,
};

const mapConfig = reactive({
  map: {
    mapData: [],
    mineData: [],
  },
});

watch(
  () => formData.value.row,
  (val, old) => {
    const diff = val - old;
    if (diff < 0) {
      mapConfig.map.mapData.splice(old - Math.abs(diff));
    } else {
      for (let i = 0; i < diff; i++) {
        mapConfig.map.mapData.push(generateMapRowData(formData.value.column));
      }
    }
  }
);

watch(
  () => formData.value.column,
  (val, old) => {
    const diff = val - old;
    if (diff < 0) {
      mapConfig.map.mapData.forEach((item) => {
        item.splice(old - Math.abs(diff));
      });
    } else {
      mapConfig.map.mapData.forEach((item) => {
        for (let i = 0; i < diff; i++) {
          item.push(JSON.parse(JSON.stringify(mineConfig)));
        }
      });
    }
  }
);

watch(
  () => formData.value.mineCount,
  (val) => {
    const diff = val - mapConfig.map.settledMineCount;
    if (diff < 0) {
      const arr = JSON.parse(JSON.stringify(mapConfig.map.mineData));
      const removeMines = arr
        .sort((a, b) => b[0] - a[0] || b[1] - a[1])
        .splice(0, Math.abs(diff));
      removeMines.forEach((item) => {
        toggleSetMine(item);
      });
    }
  }
);

onMounted(() => {
  mapConfig.map = {
    ...toRaw(formData.value),
    settledMineCount: 0,
    mineData: [],
    mapData: new Array(formData.value.row)
      .fill(1)
      .map(() => generateMapRowData(formData.value.column)),
  };
});

const generateMapRowData = (len = 0) => {
  return new Array(len)
    .fill(1)
    .map(() => JSON.parse(JSON.stringify(mineConfig)));
};

const toggleSetMine = (location) => {
  const [x, y] = location;
  const flag = mapConfig.map.mapData[x][y].isMine;
  let settledCount = mapConfig.map.settledMineCount;
  if (flag) {
    const index = mapConfig.map.mineData.findIndex((item) => {
      return item[0] === x && item[1] === y;
    });
    mapConfig.map.mineData.splice(index, 1);
    mapConfig.map.settledMineCount -= 1;
  } else {
    // 达上限
    if (++settledCount > formData.value.mineCount) return;
    mapConfig.map.mineData.push([x, y]);
    mapConfig.map.settledMineCount += 1;
  }
  mapConfig.map.mapData[x][y].isMine = !flag;
};

const randomSetMine = () => {
  const remainCount = formData.value.mineCount - mapConfig.map.settledMineCount;
  for (let i = 1; i <= remainCount; i++) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const x = parseInt(Math.random() * formData.value.row);
      const y = parseInt(Math.random() * formData.value.column);
      if (!mapConfig.map.mapData[x][y].isMine) {
        toggleSetMine([x, y]);
        break;
      }
    }
  }
};

const upload = (options) => {
  const reader = new FileReader();
  reader.readAsDataURL(options.file.file);
  reader.onload = () => {
    console.log(reader.result);
    saveForm.value.headImg = reader.result;
  };
};

const modalClose = () => {
  saveForm.value = {
    name: "",
    headImg: "",
  };
};

const saveMap = () => {
  const params = {
    id: new Date().getTime(),
    name: saveForm.value.name || "-",
    headImg: saveForm.value.headImg,
    mapData: toRaw(mapConfig.map.mapData),
    mineData: toRaw(mapConfig.map.mineData),
  };
  console.log(params);
  mineDB
    .addOne(params)
    .then(() => {
      message.success("保存成功");
    })
    .catch(() => {
      message.error("保存失败");
    })
    .finally(() => {
      saveDialog.value = false;
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
        font-size: 18px;
        color: #63e2b7;
        box-shadow: -1px -1px 1px 0 var(--shadow-light),
          1px 1px 1px 0 var(--shadow-dark);
        padding: 2px;

        &:not(:last-child) {
          margin-right: 4px;
        }

        &.dig-out {
          box-shadow: inset -1px -1px 1px 0 var(--shadow-light),
            inset 1px 1px 1px 0 var(--shadow-dark);
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

  .map-setting {
    padding: 20px;
    height: 100%;
    position: relative;

    .setting-actions {
      position: absolute;
      bottom: 20px;
      left: 20px;
    }
  }

  .custom-modal {
    position: fixed;
    left: 50%;
    top: 100px;
    transform: translateX(-50%);
    width: 800px;
  }
}
</style>
