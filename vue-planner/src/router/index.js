import { createRouter, createWebHistory } from "vue-router";
import CourseSearch from "@/views/CourseSearch.vue";
import HomeView from "@/views/HomeView.vue";
import SemesterView from "@/views/SemesterView.vue";
import StatsView from "@/views/StatsView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/search", component: CourseSearch },
  { path: "/semester/:id", component: SemesterView, props: true },
  { path: "/stats", component: StatsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
