<template>
  <div class="main">
    <h2>KURSUSE OTSING</h2>

    <input
      v-model="query"
      type="text"
      placeholder="KURSUSE KOOD"
      @input="searchCourses()"
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
          <p class="title">{{ course.title.et }}</p>
        </div>
      </div>
    </div>

    <p v-else-if="hasInput && query && courses.length === 0">ÜHTEGI TULEMUST EI LEITUD</p>

    <div class="semester-table" :key="componentKey">

      <div class="semester" v-for="(semester, index) in semesters" :key="semester.id">
        
        <router-link :to="`/semester/${semester.id}`" class="semesterHeader">SEMESTER {{ semester.id }}</router-link>
        <p>EAP: {{ getEAP(semester.id) }}</p>

        <div class="drop-zone" @dragover.prevent @drop="handleDrop($event, index)">

          <div
            v-for="(course, courseIndex) in semester.courses"
            :key="courseIndex"
            class="course-box"
            :class="{ 'invalid-course': !isValidSemester(course, semester.id) && course.season !== 'Loading...' }"
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
  </div>
</template>

<script>
import axios from "axios";
import { forEach } from "lodash";

export default {
  name: "CourseSearch",
  data() {
    return {
      query: "",
      courses: [],
      hasInput: false,
      componentKey: 0,
      semesters: Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        courses: [],
      }))
    };
  },

  async created() {
    // Fetch courses for all semesters when the component is created
    for (let i = 0; i < this.semesters.length; i++) {
      await this.fetchCoursesForSemester(i + 1);
    }
  },


  
  methods: {
    // SEARCH COURSES
    async searchCourses() {
      if (this.query.trim() && this.query.length >= 2) {
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
            this.courses = response.data.slice(0, response.data.length);
            console.log("Final Courses to Display:", this.courses);
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

    // FETCH FROM API
    async fetchCourses(semester) {
      try {
        const response = await fetch(`http://localhost:3000/api/courses?semester=${semester}`);
        this.courses = await response.json();
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    },

    async fetchCoursesForSemester(semester) {
      try {
        const response = await fetch(`http://localhost:3000/api/courses?semester=${semester}`);
        const courses = await response.json();

        // Add the fetched courses to the semester's courses array
        this.semesters[semester - 1].courses = courses.map((course) => ({
          id: course.id,
          code: course.code,
          title: course.title,
          credits: course.credits,
          season: course.season,
          grade: course.grade,
          comments: course.comments,
        }));
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    },

    // UPDATE ON DRAG
    async updateCourseSemester(courseId, semester) {
      try {
        const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ semester }),
        });
        const data = await response.json();
        console.log('Course updated:', data);
      } catch (error) {
        console.error('Error updating course:', error);
      }
    },

    // HANDLE DRAG AND DROP
    handleDragStart(event, course) {
      event.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'new',
        course
      }));
    },

    handleCourseDragStart(event, semesterIndex, courseIndex) {
      const course = this.semesters[semesterIndex].courses[courseIndex];
      event.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'existing',
        courseId: course.id, // Ensure the courseId is passed
        semesterIndex,
        courseIndex,
      }));
    },

    handleDrop(event, semesterIndex) {
      const data = JSON.parse(event.dataTransfer.getData('text/plain'));

      if (data.type === 'new') {
        // Add a new course to the semester
        this.addCourseToSemester(data.course, semesterIndex + 1); // semesterIndex + 1 because semesters are 1-6

      } else if (data.type === 'existing') {
        // Move an existing course to a new semester
        this.moveCourseToSemester(data.courseId, semesterIndex + 1); // semesterIndex + 1 because semesters are 1-6
      }
    },

    async addCourseToSemester(course, semester) {
      try {
        // STEP 1: Create a new course for the frontend
        const newCourse = {
          id: Date.now(), // Placeholder ID
          code: course.code,
          title: course.title.et,
          credits: course.credits,
          season: "Loading...", // Placeholder until the actual season is fetched
        };

        this.semesters[semester - 1].courses.push(newCourse);

        // STEP 2: Add the course to the database
        const response = await fetch("http://localhost:3000/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            semester,
            code: course.code,
            title: course.title.et,
            credits: course.credits,
            season: "Ootel...", // Placeholder
          }),
        });


        if (!response.ok) {
          throw new Error("Failed to add course to database");
        }

        const result = await response.json();
        const courseId = result.id; // Get the actual ID from the database

        // STEP 3: Fetch the actual season
        const sem = await this.getSemester(course.code);
        const season = sem ? sem.conclusion : "mdea";

        // STEP 4: Update season in frontend
        const courseIndex = this.semesters[semester - 1].courses.findIndex(c => c.code === course.code);
        if (courseIndex !== -1) {
          this.semesters[semester - 1].courses[courseIndex].season = season;
        }

        // STEP 5: Update season in backend
        await fetch(`http://localhost:3000/api/courses/${courseId}/season`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ season }),
        });

      } catch (error) {
        console.error("Error adding course:", error);
      }
    },


    async moveCourseToSemester(courseId, semester) {
      try {
        // Find the course in the current semester
        const currentSemesterIndex = this.semesters.findIndex((sem) =>
          sem.courses.some((course) => course.id === courseId)
        );

        if (currentSemesterIndex === -1) {
          console.error('Course not found in any semester');
          return;
        }

        const courseIndex = this.semesters[currentSemesterIndex].courses.findIndex(
          (course) => course.id === courseId
        );

        if (courseIndex === -1) {
          console.error('Course not found in the current semester');
          return;
        }

        // Remove the course from the current semester
        const [course] = this.semesters[currentSemesterIndex].courses.splice(courseIndex, 1);

        // Update the course's semester in the database
        await this.updateCourseSemester(courseId, semester);

        // Add the course to the new semester
        this.semesters[semester - 1].courses.push(course);
      } catch (error) {
        console.error('Error moving course:', error);
      }
    },

    // DELETE COURSE
    async deleteCourse(event, semesterIndex, courseIndex) {
      event.stopPropagation();

      const course = this.semesters[semesterIndex].courses[courseIndex];

      try {
        const response = await fetch(`http://localhost:3000/api/courses/${course.id}`, {
          method: 'DELETE',
        });

        console.log("Response Status:", response.status);

        // UI deletion
        this.semesters[semesterIndex].courses.splice(courseIndex, 1);

      } catch (error) {
        console.error('Error deleting course:', error);
      }
    },

    // SHOW COURSE DETAILS
    showCourseDetails(course) {
      alert(`
        ${course.title} (${course.code})
        ${course.credits} EAP
        SEMSTER: ${course.season}
        HINNE: ${ course.grade ? course.grade : "Puudub"}
        KOMMENTAAR: ${ course.comments ? course.comments : "Puudub"}
      `);
    },

    getEAP(semesterId) {
      let eap = 0;
      let courses = this.semesters[semesterId - 1].courses;

      forEach(courses, (course) => {
        eap += course.credits;
      });
      return eap;
    },

    // very confusing name, should be season, TODO rename everything that means autumn/spring to season
    async getSemester(courseCode) {
      try {
        const response = await fetch(`http://localhost:5001/course/${courseCode}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const semester = await response.json();
        console.log('Fetched semester info:', semester); // Log the fetched data
        return semester;
      } catch (error) {
        console.error('Error getting semester:', error);
        return null;
      }
    },

    isValidSemester(course, semesterId) {
      const isAutumnCourse = course.season === 'sügis';
      const isSpringCourse = course.season === 'kevad';

      // Autumn course are 1,3,5
      if (isAutumnCourse && semesterId % 2 !== 0) {
        return true;
      }

      // Spring courses are 2, 4, 6
      if (isSpringCourse && semesterId % 2 == 0) {
        return true;
      }

      return false;
    },



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
  position: relative;
}

.kursus:hover {
  background-color: aquamarine;
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
  color: aquamarine;
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
  background-color: aquamarine;
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
  color: #ffffff;
}

.invalid-course {
  background-color: #ffebee; /* Light red background */
  border: 2px solid #ff6b6b; /* Red border */
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3); /* Red shadow */
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