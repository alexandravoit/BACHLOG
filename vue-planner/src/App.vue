<template>
  <div id="app">
    <h1>BACHLOG</h1>
    <CourseSearch @add-course="addCourseToSemester" />
  </div>
</template>

<script>
import CourseSearch from "./components/CourseSearch.vue";

export default {
  name: "App",
  components: {
    CourseSearch,
  },
  data() {
    return {
      
    };
  },
  methods: {
  },
};
</script>

<style scoped>
h1 {
  color: aquamarine;
  font-size: 50px;
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>
