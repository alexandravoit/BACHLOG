<template>
  <div class="app">

    <div class="header">

      <p>BACHLOG</p>
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.header {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-self: center;
  align-items: center;
  border: 2px solid #333;

  width: 100%;
  margin: 20px;
  padding: 20px;
  gap: 20px;

  color: #333;
  font-size: xx-large;
  font-weight: bold;
  text-decoration: none;
}

.header a {
  text-decoration: none; 
  color: inherit; 
}

.header a:hover {
  text-decoration: none; 
  color: white;
  -webkit-text-stroke: 1px #333;
}

</style>
