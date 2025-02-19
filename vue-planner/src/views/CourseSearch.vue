<template>
  <div class="main">
    <h1>KURSUSE OTSING</h1>
    <CourseSearchInput :handleDragStart="handleDragStart" />
    <SemesterTable
      :semesters="semesters"
      :componentKey="componentKey"
      :prerequisiteStatus="prerequisiteStatus"
      :handleDrop="handleDrop"
      :handleCourseDragStart="handleCourseDragStart"
      :showCourseDetails="showCourseDetails"
      :deleteCourse="deleteCourse"
      :getEAP="getEAP"
      :isValidSemester="isValidSemester"
    />
  </div>
</template>

<script>
import CourseSearchInput from "@/components/CourseSearchInput.vue";
import SemesterTable from "@/components/SemesterTable.vue";
import { fetchCoursesForSemester, updateCourseSemester, getSemester, isValidSemester } from "@/utils/utils";
import { forEach } from "lodash";

export default {
  name: "CourseSearch",
  components: {
    CourseSearchInput,
    SemesterTable,
  },
  data() {
    return {
      semesters: Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        courses: [],
      })),
      componentKey: 0,
      eeldused: {},
      courseProblems: {},
    };
  },
  async created() {
    for (let i = 0; i < this.semesters.length; i++) {
      this.semesters[i].courses = await fetchCoursesForSemester(i + 1);
    }
  },
  computed: {
    prerequisiteStatus() {
      const status = {};
      for (const semester of this.semesters) {
        for (const course of semester.courses) {
          if (!this.eeldused[course.code]) {
            status[course.code] = this.eeldusedOlemas(course, semester.id);
          } else {
            status[course.code] = this.kasLäbitud(semester.id, this.eeldused[course.code]);
          }
        }
      }
      return status;
    },
  },
  methods: {
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
        courseId: course.id,
        semesterIndex,
        courseIndex,
      }));
    },
    async handleDrop(event, semesterIndex) {
      const data = JSON.parse(event.dataTransfer.getData('text/plain'));
      if (data.type === 'new') {
        await this.addCourseToSemester(data.course, semesterIndex + 1);
      } else if (data.type === 'existing') {
        await this.moveCourseToSemester(data.courseId, semesterIndex + 1);
      }
    },
    async addCourseToSemester(course, semester) {
      try {
        const newCourse = {
          id: Date.now(),
          code: course.code,
          title: course.title.et,
          credits: course.credits,
          season: "Loading...",
        };
        this.semesters[semester - 1].courses.push(newCourse);
        const response = await fetch("http://localhost:3000/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            semester,
            code: course.code,
            title: course.title.et,
            credits: course.credits,
            season: "Loading...",
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to add course to database");
        }
        const result = await response.json();
        const courseId = result.id;
        const sem = await getSemester(course.code);
        const season = sem ? sem.conclusion : "N/A";
        const courseIndex = this.semesters[semester - 1].courses.findIndex(c => c.code === course.code);
        if (courseIndex !== -1) {
          this.semesters[semester - 1].courses[courseIndex].season = season;
        }
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
        const [course] = this.semesters[currentSemesterIndex].courses.splice(courseIndex, 1);
        await updateCourseSemester(courseId, semester);
        this.semesters[semester - 1].courses.push(course);
      } catch (error) {
        console.error('Error moving course:', error);
      }
    },
    async deleteCourse(event, semesterIndex, courseIndex) {
      event.stopPropagation();
      const course = this.semesters[semesterIndex].courses[courseIndex];
      try {
        const response = await fetch(`http://localhost:3000/api/courses/${course.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.semesters[semesterIndex].courses.splice(courseIndex, 1);
        }
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    },
    showCourseDetails(course) {
      const problems = this.courseProblems[course.code] || {};
      const problemMessages = [];

      if (problems.wrongSemester) {
        problemMessages.push("⚠️ Aine vales semestris.");
      }
      if (problems.missingPrerequisites) {
        problemMessages.push("⚠️ Eeldusained läbimata.");
        problemMessages.push(`Üks eeldusainetest peab olema läbitud: ${this.eeldused[course.code].join(", ")}`);
      }

      const problemMessage = problemMessages.length > 0
        ? `\n\nPROBLEMS:\n${problemMessages.join("\n")}`
        : "";

      alert(`
        ${course.title} (${course.code})
        ${course.credits} EAP
        SEMSTER: ${course.season}
        HINNE: ${ course.grade ? course.grade : "Puudub"}
        KOMMENTAAR: ${course.comments ? course.comments : "Puudub"}
        ${problemMessage}
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
    isValidSemester(course, semesterId) {
      const isValid = isValidSemester(course, semesterId);

      if (!isValid) {
        if (!this.courseProblems[course.code]) {
          this.courseProblems[course.code] = {};
        }
        this.courseProblems[course.code].wrongSemester = true;
      } else {
        if (!this.courseProblems[course.code]) {
          this.courseProblems[course.code] = {};
        }
        this.courseProblems[course.code].wrongSemester = false;
      }

      return isValid;
    },
    async eeldusedOlemas(course, semesterId) {
      if (this.eeldused[course.code]) {
        const prerequisitesMet = this.kasLäbitud(semesterId, this.eeldused[course.code]);

        if (!this.courseProblems[course.code]) {
          this.courseProblems[course.code] = {};
        }

        this.courseProblems[course.code].missingPrerequisites = !prerequisitesMet;

        return prerequisitesMet;
      }
      try {
        const response = await fetch(`https://ois2.ut.ee/api/courses/${course.code}`);
        const courseDetails = await response.json();
        const additional_info = courseDetails.additional_info;

        if (!this.courseProblems[course.code]) {
          this.courseProblems[course.code] = {};
        }

        if (!additional_info.prerequisites) {
          this.courseProblems[course.code].missingPrerequisites = false;
          return true;
        } else {
          const prereqs = additional_info.prerequisites;
          const mainPre = prereqs[0].code;
          const altPres = prereqs[0].alternatives;
          const eeldused = [mainPre, ...altPres.map(alt => alt.code)];

          this.eeldused[course.code] = eeldused;
          const prerequisitesMet = this.kasLäbitud(semesterId, eeldused);
          
          this.courseProblems[course.code].missingPrerequisites = !prerequisitesMet;
          
          return prerequisitesMet;
        }
      } catch (error) {
        console.error('Error fetching prerequisites:', error);
        return false;
      }
    },
    kasLäbitud(semesterId, eeldused) {
      let korras = false;
      for (const eeldus of eeldused) {
        for (let i = 0; i < semesterId; i++) {
          for (const course of this.semesters[i].courses) {
            if (course.code === eeldus) {
              korras = true;
              break;
            }
          }
          if (korras) break;
        }
        if (korras) break;
      }
      return korras;
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
    padding: 20px;
  }

</style>