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
  export default {
    name: "SemesterView",
    data() {
      return {
        semesterId: this.$route.params.id, // Get semesterId from route params
        courses: [], // Array to store courses for the semester
        grades: [1, 2, 3, 4, 5], // Available grades
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
        try {
          // Fetch courses for the current semester
          const response = await fetch(`http://localhost:3000/api/courses?semester=${this.semesterId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          this.courses = await response.json(); // Update the courses array
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      },
      async saveCourse(course) {
        try {
          // Update both grade and comments in a single request
          const response = await fetch(`http://localhost:3000/api/courses/${course.id}/details`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              grade: course.grade,
              comments: course.comments,
            }),
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
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
        margin-top: 20px;
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