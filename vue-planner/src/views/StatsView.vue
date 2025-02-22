<template>
    <div class="stats-page">
      <h1>STATID</h1>

      <h2>KAALUTUD KESKMINE:</h2>
      <div class="gradeStats">
        <p> {{ avgGrade }}</p>

      </div>


      <h2>MOODULITE TÄITMINE:</h2>
      <div class="typeStats">

        <div v-for="(eap, type) in eapStats" :key="type">
            <p v-if="type === 'määramata'"> {{ type }}  {{ eap }}</p>
            <p v-else> {{ type }} ehk  {{ eap }} {{ getPercent(type, eap) }}%</p>
        </div>

      </div>

      

    
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        eapStats: {},
        avgGrade: 0,
      };
    },
    async created() {
      await this.fetchEapStats();
      await this.fetchAvergae();
    },
    methods: {
      async fetchEapStats() {
        try {
          const response = await fetch('http://localhost:3000/api/courses/stats/eap-by-type');
          if (!response.ok) {
            throw new Error('Failed to fetch EAP stats');
          }
          this.eapStats = await response.json();
        } catch (error) {
          console.error('Error fetching EAP stats:', error);
        }
      },

      async fetchAvergae() {
        try {
          const response = await fetch('http://localhost:3000/api/courses/stats/average');
          if (!response.ok) {
            throw new Error('Failed to fetch average grade');
          }
          const avg = await response.json();
          this.avgGrade = avg.average;
        } catch (error) {
          console.error('Error fetching average grade:', error);
        }
      },

      getPercent(type, eap) {
        const whole = {
            kohustuslik: 60,
            valikaine: 12,  
            vabaaine: 9,   
            moodul1: 24,    
            moodul2: 24,
        };
        return eap / whole[type] * 100;
      }
    },
  };
  </script>
  
  <style scoped>

  .typeStats {
    border: 1px black solid;
  }



  </style>