<template>
    <div class="semester-view">
      <h2>SEMESTER {{ semesterId }}</h2>
      <p>ÜLEVAADE:</p>
      <table>
        <thead>
          <tr>
            <th>KOOD</th>
            <th>NIMI</th>
            <th>EAP</th>
            <th>HINNE</th>
            <th>KOMMENTAAR</th>
            <th>SALVESTA</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td>{{ course.code }}</td>
            <td>{{ course.title }}</td>
            <td>{{ course.credits }}</td>
            <td>
              <select v-model="course.grade">
                <option :value="null">-- Vali hinne --</option>
                <option v-for="grade in grades" :key="grade" :value="grade">
                  {{ grade }}
                </option>
              </select>
            </td>
            <td>
              <input v-model="course.comments" />
            </td>
            <td>
              <button @click="saveCourse(course)">SALVESTA</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
import { fetchCoursesForSemester, saveCourseDetails } from "@/utils/utils";

export default {
  name: "SemesterView",
  data() {
    return {
      semesterId: this.$route.params.id, // Get semesterId from route params
      courses: [], // Array to store courses for the semester
      grades: [1, 2, 3, 4, 5], // Available grades
      loading: false, // Loading state
      error: null, // Error message
    };
  },
  async mounted() {
    await this.fetchCourses(); // Fetch courses when the component is mounted
  },
  watch: {
    // Watch for changes in the route params (e.g., when navigating between semesters)
    "$route.params.id": {
      immediate: true,
      handler(newId) {
        this.semesterId = newId; // Update semesterId
        this.fetchCourses(); // Re-fetch courses
      },
    },
  },
  methods: {
    async fetchCourses() {
      this.loading = true;
      this.error = null;
      try {
        // Fetch courses using the utility function
        this.courses = await fetchCoursesForSemester(this.semesterId);
      } catch (error) {
        this.error = "Kursuste laadimine ebaõnnestus. Palun proovi uuesti.";
        console.error("Error fetching courses:", error);
      } finally {
        this.loading = false;
      }
    },
    async saveCourse(course) {
      try {
        // Save course details using the utility function
        await saveCourseDetails(course.id, {
          grade: course.grade,
          comments: course.comments,
        });
        alert("Kursuse andmed on salvestatud!");
      } catch (error) {
        console.error("Error saving course details:", error);
        alert("Kursuse andmete salvestamine ebaõnnestus. Palun proovi uuesti.");
      }
    },
  },
};
</script>
  
<style scoped>
    .semester-view {
        margin: 20px;
        display: flex;
        flex-direction: column;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px;
    }

    th,td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
    }

    input, select {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
    }

    button {
        padding: 5px 10px;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }

</style>