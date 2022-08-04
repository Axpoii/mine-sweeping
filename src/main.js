import { createApp } from "vue";
import { createPinia } from "pinia";
import {
  create,
  NModal,
  NCard,
  NForm,
  NFormItem,
  NSpace,
  NRadioGroup,
  NRadio,
  NRadioButton,
  NButton,
  NInputNumber,
  NPopselect,
  NDivider,
  NIcon,
  NGrid,
  NGridItem,
  NGi,
  NSpin,
  NAlert,
  NInput,
  NUpload,
  NEmpty,
} from "naive-ui";
import "amfe-flexible";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

const naive = create({
  components: [
    NModal,
    NCard,
    NForm,
    NFormItem,
    NSpace,
    NRadioGroup,
    NRadio,
    NRadioButton,
    NButton,
    NInputNumber,
    NPopselect,
    NDivider,
    NIcon,
    NGrid,
    NGridItem,
    NGi,
    NSpin,
    NAlert,
    NInput,
    NUpload,
    NEmpty,
  ],
});

app.use(createPinia());
app.use(naive);
app.use(router);

app.mount("#app");
