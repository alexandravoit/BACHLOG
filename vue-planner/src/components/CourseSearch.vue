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

      <div class="kursused">
        <div 
          v-for="course in courses" 
          :key="course.id"
          class="kursus"
          draggable="true"
          @dragstart="handleDragStart($event, course)"
        >
          <p class="bold">{{ course.code }}</p>
        </div>
      </div>
    </div>

    <p v-else-if="hasInput && query && courses.length === 0">ÜHTEGI TULEMUST EI LEITUD</p>

    <div class="semester-table">

      <div class="semester" v-for="(semester, index) in semesters" :key="semester.id">
        <h3>SEMESTER {{ semester.id }}</h3>

        <div class="drop-zone" @dragover.prevent @drop="handleDrop($event, index)">

          <div
            v-for="(course, courseIndex) in semester.courses"
            :key="courseIndex"
            class="course-box"
            draggable="true"
            @dragstart="handleCourseDragStart($event, index, courseIndex)"
          >
            <span class="delete-btn" @click="deleteCourse(index, courseIndex)">×</span>
            <p>{{ course.title.et }}</p>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      query: "",
      courses: [],
      hasInput: false,
      semesters: Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        courses: []
      }))
    };
  },
  methods: {
    async searchCourses() {
      if (this.query.trim()) {
        try {
          // Fetch courses that start with the entered letters
          const response = await axios.get(`https://ois2.ut.ee/api/courses`, {
            params: {
              code: this.query.toUpperCase(),
              take: 20 // How many courses to fetch
            }
          });
          console.log("API Response:", response.data);
          console.log("Course count:", response.data.length);

          if (response.data && Array.isArray(response.data)) {
            this.courses = response.data.slice(0, response.length);
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
    handleDragStart(event, course) {
      event.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'new',
        course
      }));
    },
    handleCourseDragStart(event, semesterIndex, courseIndex) {
      event.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'existing',
        semesterIndex,
        courseIndex
      }));
    },
    handleDrop(event, targetSemesterIndex) {
      const data = JSON.parse(event.dataTransfer.getData('text/plain'));
      
      if (data.type === 'new') {
        this.semesters[targetSemesterIndex].courses.push(data.course);
      } else if (data.type === 'existing') {
        // RM from original semester and add to new
        const course = this.semesters[data.semesterIndex].courses[data.courseIndex];
        this.semesters[data.semesterIndex].courses.splice(data.courseIndex, 1);
        this.semesters[targetSemesterIndex].courses.push(course);
      }
    },
    deleteCourse(semesterIndex, courseIndex) {
      this.semesters[semesterIndex].courses.splice(courseIndex, 1);
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.bold {
  font-weight: bold;
}

.main {
  display: flex;
  flex-direction: column;
  padding: 20px;
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
}

.kursus:hover {
  background-color: aquamarine;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); 
  animation: floatAnimation 1.5s ease-in-out infinite; 
}

@keyframes floatAnimation {
  0%, 100% {
    transform: translateY(0); 
  }
  50% {
    transform: translateY(-10px); 
  }
}

.semester-table {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 2rem;
}

.semester {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  min-height: 200px;
}

.drop-zone {
  border: 2px solid #ffffff;
  border-radius: 8px;
  min-height: 150px;
  padding: 20px;
  margin-top: 20px;
  transition: background-color 0.2s;
}

.drop-zone:hover {
  background-color: #f0f0f0;
}

.course-box {
  background-color: aquamarine;
  padding: 20px;
  margin: 10px 0;
  border-radius: 8px;
  cursor: move;
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 1;
  width: auto;
  height: auto;
}

.delete-btn:hover {
  color: rgb(6, 94, 106)
}

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
</style>