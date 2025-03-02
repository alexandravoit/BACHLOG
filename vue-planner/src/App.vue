<template>
  <div class="app">

    <div class="header">

      <img src="@/assets/logo.png" alt="">
      <router-link to="/">KODU</router-link>
      <router-link to="/stats">STATID</router-link>
      <router-link to="/search">PLANEERIJA</router-link>
      
    </div>
    
    <router-view />
  </div>
</template>

<script>

export default {
  name: "App",

  data() {
    return {
      
    };
  },
  methods: {
  },
};
</script>

<style scoped>

.app {
  font-family: RESQUARE;
  text-align: center;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.header {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 20px;
  gap: 20px;
  text-decoration: none;
}

.header a {
  color: #333;
  font-size: 2.5rem;
  font-weight: bolder;
  text-decoration: none; 
}

.header a:hover {
  text-decoration: none; 
  color: #ff7af4;

} 

img {
  width: 8%;
}

@media (max-width: 768px) {
  .header a {
  font-size: 2rem;
}
}

</style>
