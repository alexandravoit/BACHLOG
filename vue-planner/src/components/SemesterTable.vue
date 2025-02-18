<template>
  <div class="semester-table" :key="componentKey">
    <div class="semester" v-for="(semester, index) in semesters" :key="semester.id">
      <router-link :to="`/semester/${semester.id}`" class="semesterHeader">SEMESTER {{ semester.id }}</router-link>
      <p>EAP: {{ getEAP(semester.id) }}</p>
      <div class="drop-zone" @dragover.prevent @drop="handleDrop($event, index)">
        <div
          v-for="(course, courseIndex) in semester.courses"
          :key="courseIndex"
          class="course-box"
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
};
</script>

<style scoped>
.semester-table {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 1.5rem;
}

.semester {
  border: solid 1px #ddd;
  border-radius: 12px;
  padding: 15px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  border: 2px solid #ffffff;
  border-radius: 8px;
  min-height: 100px;
  padding: 10px;
  margin-top: 10px;
  transition: background-color 0.2s;
}

.drop-zone:hover {
  background-color: #f0f0f0;
}

.course-box {
  background-color: #ffffff;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  position: relative;
}

.course-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: #333 solid 1px;
}

.course-box p {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
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
  color: #333;
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
  -webkit-text-stroke: 1px #333;
}

.invalid-course {
  border: 1px dashed #bc0707;
}

.invalid-course:hover {
  border: 1px solid #bc0707;
}
</style>
