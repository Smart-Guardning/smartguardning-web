<template>
  <div id="app">
    <RealTimeMonitoring />
    <ADDESP32 />
    <!-- Add other components as needed -->
  </div>
</template>

<script>
import RealTimeMonitoring from './components/RealTimeMonitoring.vue'
import ADDESP32 from './components/ADDESP32.vue'
// Import other components as needed

export default {
  components: {
    RealTimeMonitoring,
    ADDESP32,
    // Add other components as needed
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>