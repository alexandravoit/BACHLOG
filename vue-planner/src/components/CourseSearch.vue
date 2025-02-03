<template>
  <div class="main">
    <h2>KURSUSE OTSING</h2>

    <input
      v-model="query"
      type="text"
      placeholder="KURSUSE KOOD"
      @input="searchCourses"
    />
    
    <div v-if="courses.length > 0">
      <h3>LEITUD KURSUSED:</h3>

      <div class="kursused" v-for="course in courses" :key="course.id">
        <div class="kursus">
          <p>NIMI: {{ course.title.et }}</p>
          <p>EAP MAHT: {{ course.credits }}</p> 
        </div>
      </div>
    </div>

    <p v-else-if="hasInput && query && courses.length === 0">ÜHTEGI TULEMUST EI LEITUD</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      query: "",  // User input for course search
      courses: [],  // Array of courses returned by ois2 API
      hasInput: false,  // Flag to track whether the user has entered a query
    };
  },
  methods: {
    async searchCourses() {
      if (this.query.trim()) {
        try {
          const response = await axios.get(`https://ois2.ut.ee/api/courses/${this.query}`);
          
          console.log('API Response:', response.data);
          
          // If the response data is an object -> wrap it in an array
          if (response.data && !Array.isArray(response.data)) {
            this.courses = [response.data];
          } else {
            this.courses = response.data;
          }
          this.hasInput = true; 
        } catch (error) {
          console.error("Error fetching courses:", error);
          this.courses = []; // Reset courses on error
          this.hasInput = true;
        }
      } else {
        // Reset when input is empty
        this.courses = []; 
        this.hasInput = false;
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.main {
  display: flex;
  flex-direction: column;
}

.kursused {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.kursus {
  background-color: aquamarine;
  width: 20%;
}
</style>
