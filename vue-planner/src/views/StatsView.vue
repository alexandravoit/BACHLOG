<template>
  <div class="stats-page">
    <p class="heading">STATID</p>

    <div class="gradeStats">
      <p> KAALUTUD KESKMINE: {{ avgGrade }}</p>
      <p> määramata: {{ eapStats['määramata'] }} EAP</p>
    </div>
    
    <div class="typeStats" v-for="(eap, type) in eapStats" :key="type">


      <div v-if="type !== 'määramata'">

        <div class="text-progress">

          <p>{{ type }} {{ eap }} EAP ehk {{ getPercent(type, eap) }}%</p>

          <div class="grid-progress-bar">
            <div
              v-for="index in 10"
              :key="index"
              class="grid-cell"
              :class="{ filled: index <= getFilledCells(type, eap) }"
            ></div>
          </div>

        </div>
        


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
    await this.fetchAverage();
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

    async fetchAverage() {
      try {
        const response = await fetch('http://localhost:3000/api/courses/stats/average');
        if (!response.ok) {
          throw new Error('Failed to fetch average grade');
        }
        const avg = await response.json();
        this.avgGrade = avg.average.toFixed(2);
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
      return ((eap / whole[type]) * 100).toFixed(2);
    },

    getFilledCells(type, eap) {
      const percent = this.getPercent(type, eap);
      return Math.round((percent / 100) * 10);
    },
  },
};
</script>
  
<style scoped>
* {
  font-size: 40px;
  color: #333;
}

.heading {
  font-size: 60px;
  font-weight: bolder;
}

.stats-page {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 20px;
}

.typeStats {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.gradeStats {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.grid-progress-bar {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 5px; 
  width: 300px;
  height: 30px;
}

.grid-cell {
  width: 100%;
  height: 100%;
  border: #9e9e9e 1px solid;
}

.grid-cell.filled {
  background-color: #ff7af4;
}

.text-progress {
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center; 
  gap: 20px;
}

.text-progress p {
  margin: 0;
}
</style>