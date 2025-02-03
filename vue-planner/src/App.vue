<template>
  <div id="app">
    <h1>BACHLOG</h1>

    <CourseSearch @add-course="addCourseToSemester" />
    <SemesterTable :semesters="semesters" />
  </div>
</template>

<script>
import CourseSearch from "./components/CourseSearch.vue";
import SemesterTable from "./components/SemesterTable.vue";

export default {
  name: "App",
  components: {
    CourseSearch,
    SemesterTable,
  },
  data() {
    return {
      semesters: [[], [], [], [], [], []], // Six semesters to hold courses
    };
  },
  methods: {
    addCourseToSemester(course) {
      // Add the selected course to the appropriate semester
      const semesterIndex = this.getAvailableSemester();
      if (semesterIndex !== -1) {
        this.semesters[semesterIndex].push(course);
      } else {
        alert("No available semester slots");
      }
    },
    getAvailableSemester() {
      // Check for the first empty semester
      for (let i = 0; i < this.semesters.length; i++) {
        if (this.semesters[i].length < 5) {
          return i; // Return first available semester
        }
      }
      return -1; // No available semester
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>
