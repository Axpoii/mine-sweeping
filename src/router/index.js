import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

console.log(import.meta.env);

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/create",
      name: "create",
      component: () => import("@/views/CreateView.vue"),
    },
    {
      path: "/room/:id",
      name: "room",
      component: () => import("@/views/RoomView.vue"),
    },
    {
      path: "/404",
      name: "404",
      component: () => import("@/views/error/NotFound.vue"),
    },
  ],
});

router.addRoute({
  path: "/:pathMatch(.*)",
  redirect: "/404",
});

export default router;
