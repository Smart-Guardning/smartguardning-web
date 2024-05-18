<template>
  <div id="app">
    <RealTimeMonitoring />
    <!-- Add other components as needed -->
  </div>
</template>

<script>
import RealTimeMonitoring from './components/RealTimeMonitoring.vue'
// Import other components as needed

export default {
  components: {
    RealTimeMonitoring,
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
