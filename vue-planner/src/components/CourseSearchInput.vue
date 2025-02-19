<template>
  <div>
    <input
      v-model="query"
      type="text"
      placeholder="KURSUSE KOOD"
      @input="searchCourses"
    />
    <div v-if="courses.length > 0">
      <h1 class="leitud">LEITUD KURSUSED:</h1>
      <div class="kursused">
        <div 
          v-for="course in courses" 
          :key="course.id"
          class="kursus"
          draggable="true"
          @dragstart="handleDragStart($event, course)"
        >
          <p class="bold">{{ course.code }}</p>
          <p class="title">{{ course.title.et }}</p>
        </div>
      </div>
    </div>
    <p v-else-if="hasInput && query && courses.length === 0">ÜHTEGI TULEMUST EI LEITUD</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CourseSearchInput",
  props: {
    handleDragStart: Function,
  },
  data() {
    return {
      query: "",
      courses: [],
      hasInput: false,
    };
  },
  methods: {
    async searchCourses() {
      if (this.query.trim() && this.query.length >= 2) {
        try {
          const response = await axios.get(`https://ois2.ut.ee/api/courses`, {
            params: {
              code: this.query.toUpperCase(),
              take: 20,
              states: ["confirmed"],
            },
          });
          if (response.data && Array.isArray(response.data)) {
            this.courses = response.data.slice(0, response.data.length);
          } else {
            this.courses = [];
          }
          this.hasInput = true;
        } catch (error) {
          console.error("Error fetching courses:", error);
          this.courses = [];
          this.hasInput = true;
        }
      } else {
        this.courses = [];
        this.hasInput = false;
      }
    },
  },
};
</script>

<style scoped>
input {
  width: 33%;
  align-self: center;
  border: none;
  height: 50px;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-align: center;
  font-size: large;
}

.kursused {
  border: solid 1px #ddd;
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.kursus {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  cursor: move;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  word-wrap: break-word;
  aspect-ratio: 1 / 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  position: relative;
}

.kursus:hover {
  border: #333 solid 1px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: floatAnimation 1.5s ease-in-out infinite;
}

.kursus p {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  transition: opacity 0.3s ease;
}

.kursus .title {
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  text-align: center;
  width: 100%;
  padding: 0 10px;
}

.kursus:hover .bold {
  opacity: 0;
}

.kursus:hover .title {
  opacity: 1;
}

@keyframes floatAnimation {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.leitud {
    color: white;
    -webkit-text-stroke: 1px #333;
}
</style>
