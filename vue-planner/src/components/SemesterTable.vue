<template>
  <div class="semester-table">
    <h2>SEMESTRID</h2>
    <table>
      <thead>
        <tr>
          <th>KURSUSED</th>
          <th v-for="(semester, index) in semesters" :key="index">Semester {{ index + 1 }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Courses</td>
          <td v-for="(semester, index) in semesters" :key="index">
            <ul>
              <li v-for="course in semester" :key="course.id">
                {{ course.name }}
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    semesters: Array, // Array of semesters, where each semester is an array of courses
  },
};
</script>

<style scoped>
.semester-table {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

li {
  padding: 5px 0;
}
</style>
