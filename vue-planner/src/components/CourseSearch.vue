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
          <p>{{ course.title.et }}</p>
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
          // OIS2 api
          const response = await axios.get(`https://ois2.ut.ee/api/courses/${this.query}`);
          if (response.data && !Array.isArray(response.data)) {
            this.courses = [response.data];
          } else {
            this.courses = response.data;
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
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.kursus {
  background-color: aquamarine;
  padding: 20px;
  border-radius: 8px;
  cursor: move;
  width: 33%;
  position: relative;
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