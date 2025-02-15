import { createRouter, createWebHistory } from "vue-router";
import CourseSearch from "@/views/CourseSearch.vue";
import HomeView from "@/views/HomeView.vue";
import SemesterView from "@/views/SemesterView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/search", component: CourseSearch },
  { path: "/semester/:id", component: SemesterView, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
