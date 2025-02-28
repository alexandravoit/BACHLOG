<template>
  <div class="semester-table" :key="componentKey">
    <div class="semester" v-for="(semester, index) in semesters" :key="semester.id">
      <div class="drop-zone" @dragover.prevent @drop="handleDrop($event, index)">
        <div
          v-for="(course, courseIndex) in semester.courses"
          :key="courseIndex"
          class="course-box"
          :style="{ backgroundColor: typeToColor[course.type] }"
          :class="{ 'invalid-course': (!isValidSemester(course, semester.id) && course.season !== 'Loading...') || !prerequisiteStatus[course.code] }"
          draggable="true"
          @dragstart="handleCourseDragStart($event, index, courseIndex)"
          @click="showCourseDetails(course)"
        >
          <span class="delete-btn" @click="deleteCourse($event, index, courseIndex)">×</span>
          <p class="bold">{{ course.code }}</p>
          <p class="title">{{ course.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const typeToColor = {
  määramata: '#e0e1dd',
  kohustuslik: '#0d1b2a',
  valikaine: '#1B263B',  
  vabaaine: '#415a77',   
  moodul1: '#778da9',    
  moodul2: '#ACB7C3',    
};

export default {
  name: "SemesterTable",
  props: {
    semesters: Array,
    componentKey: Number,
    prerequisiteStatus: Object,
    handleDrop: Function,
    handleCourseDragStart: Function,
    showCourseDetails: Function,
    deleteCourse: Function,
    getEAP: Function,
    isValidSemester: Function,
  },
  data() {
    return {
      typeToColor,
    };
  },
};
</script>

<style scoped>
.semester-table {
  background-color: rgb(24, 56, 100);
  margin-top: 1.5rem;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.semesterHeader {
  font-size: x-large;
  font-weight: bold;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.semesterHeader:hover {
    color: white;
    -webkit-text-stroke: 1px #333;
}

.drop-zone {
  aspect-ratio: 1/1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;


  border: 2px solid #ffffff;
  border-radius: 8px;
  padding: 10px;
  justify-items: center;
  align-items: center; 
  transition: background-color 0.2s;
}

.drop-zone:has(> :nth-child(10)) {
  aspect-ratio: auto; 
  grid-template-rows: repeat(4, 1fr);
}

.drop-zone:hover {
  background-color: #f0f0f0;
}

.course-box {
  width: 70%;
  padding: 10px;
  border-radius: 10px;
  cursor: move;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  word-wrap: break-word;
  aspect-ratio: 1 / 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  position: relative;
}

.course-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.course-box p {
  color: white;
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  transition: opacity 0.3s ease;
}

.course-box .title {
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  text-align: center;
  width: 100%;
  padding: 0 10px;
}

.course-box:hover .bold {
  opacity: 0;
}

.course-box:hover .title {
  opacity: 1;
}

.delete-btn {
  position: absolute;
  top: 3px;
  right: 3px;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
  width: auto;
  height: auto;
  transition: color 0.2s ease;
}

.delete-btn:hover {
  color: #bc0707;
}

@keyframes floatAnimation {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.invalid-course {
  background-color: #FB6376 !important;
  animation: floatAnimation 1.5s ease-in-out infinite;
}

.invalid-course:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>