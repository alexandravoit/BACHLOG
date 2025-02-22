<template>
    <div class="semester-view">
      <h1>SEMESTER {{ semesterId }}</h1>
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
      semesterId: this.$route.params.id, 
      courses: [],
      grades: [1, 2, 3, 4, 5],
      loading: false, 
      error: null,
    };
  },
  async mounted() {
    await this.fetchCourses(); 
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler(newId) {
        this.semesterId = newId; 
        this.fetchCourses(); 
      },
    },
  },
  methods: {
    async fetchCourses() {
      this.loading = true;
      this.error = null;
      try {
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
        await saveCourseDetails(course.id, {
          grade: course.grade,
          comments: course.comments.replace(/\\/g, ''), // Remove any backslashes
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
        border: 1px solid #333;
        padding: 8px;
        text-align: left;
    }

    th {
        color: white;
        background-color: #333;
    }

    input, select {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
    }

    button {
        padding: 5px 10px;
        color: #333;
        border: #333 solid 1px;
        background-color: white;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
      color: white;
      background-color: #333;
    }

</style>