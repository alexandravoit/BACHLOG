<template>
    <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ course.title }} ({{ course.code }})</h2>
        <p><strong>EAP:</strong> {{ course.credits }}</p>
        <p><strong>Semester:</strong> {{ course.season }}</p>
        <p v-if="course.grade"><strong>Hinne:</strong> {{ course.grade }}</p>
        <p v-if="course.comments"><strong>Kommentaar:</strong> {{ course.comments }}</p>
  
        <div v-if="problemMessages.length > 0" class="problems">
          <h3>Probleemid:</h3>
          <ul>
            <li v-for="message in problemMessages" :key="message">{{ message }}</li>
          </ul>
        </div>
  
        <div class="type-selector">
            <label for="course-type">Liik:</label>
            <select id="course-type" v-model="selectedType" @change="updateCourseType">
                <option value="määramata">Määramata</option>
                <option value="kohustuslik">Kohustuslik</option>
                <option value="valikaine">Valikaine</option>
                <option value="vabaaine">Vabaaine</option>
                <option value="moodul1">Moodul 1</option>
                <option value="moodul2">Moodul 2</option>
            </select>
        </div>
  
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      course: {
        type: Object,
        required: true,
      },
      problems: {
        type: Object,
        default: () => ({}),
      },
      isVisible: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        selectedType: this.course.type || null,
      };
    },
    watch: {
      course: {
        immediate: true,
        handler(newCourse) {
          this.selectedType = newCourse.type || null;
        },
      },
    },
    computed: {
      problemMessages() {
        const messages = [];
        if (this.problems.wrongSemester) {
          messages.push("⚠️ Aine vales semestris.");
        }
        if (this.problems.missingPrerequisites) {
          messages.push("⚠️ Eeldusained läbimata.");
        }
        return messages;
      },
    },
    methods: {
      closeModal() {
        this.$emit('close-modal');
      },

      async updateCourseType() {
        try {
            const response = await fetch(`http://localhost:3000/api/courses/${this.course.id}/type`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: this.selectedType }),
            });

            if (!response.ok) {
            throw new Error('Failed to update course type');
            }

            const updatedCourse = await response.json();

            console.log('API Response:', updatedCourse); // Log the full response

            this.$emit('update-type', updatedCourse.type); // Emit the type

            console.log('Emitted update-type event with type:', updatedCourse.type);


        } catch (error) {
            console.error('Error updating course type:', error);
        }
    },
    },
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .problems {
    margin-top: 20px;
    color: #d9534f;
  }
  
.type-selector {
    margin-top: 20px;
}

.type-selector label {
    margin-right: 10px;
}
  
  button {
    margin-top: 20px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>