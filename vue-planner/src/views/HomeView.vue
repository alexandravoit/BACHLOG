<template>
  <div class="big-main">
    <h1>BACHLOG EHK SU BAKA BACKLOG!</h1>

    <div class="main">
    <div class="left">
      <img src="@/assets/logo2.png" alt="logo">
    </div>

    <div class="right">
      <p>Backlog AKA "an accumulation of uncompleted work or matters needing to be dealt with"</p>
    </div>
  
  </div>
  <p>Siia peaks tekkima mingid õpetused moodulitest ja valikutest</p>

  </div>


</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.big-main {
  padding: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
}

.main {
  display: flex;
  flex-direction: row;
  height: auto;
}

.left {
  display: flex;
  justify-content: center; 
  align-items: center; 
  width: 30%;
  margin-right: 20px;
}

.right {
  width: 70%;
  font-size: 30px;
  text-align: left; 
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0; 
  margin: 0;
}

.right p {
  margin: 0; 
  padding: 0;
  text-align: left; 
}

img {
  width: 100%;
  max-width: 100%;
  height: auto;
}
</style>
