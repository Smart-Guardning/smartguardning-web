<template>
  <div id="app" class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
    <div class="flex-shrink-0">
      <img class="h-12 w-12" src="https://vuejs.org/images/logo.png" alt="Vue logo">
    </div>
    <div>
      <div class="text-xl font-medium text-black">Welcome to Vue.js App</div>
      <p class="text-gray-500">You are running this application in <span class="text-blue-500">{{ mode }}</span> mode.</p>
    </div>
    <RealTimeMonitoring v-if="currentPage === 'RealTimeMonitoring'" />
    <ADDESP32 v-if="currentPage === 'ADDESP32'" />
    <button @click="setCurrentPage('RealTimeMonitoring')">Show RealTimeMonitoring</button>
    <button @click="setCurrentPage('ADDESP32')">Show ADDESP32</button>
  </div>
</template>

<script>
import axios from 'axios';
import RealTimeMonitoring from './components/RealTimeMonitoring.vue'
import ADDESP32 from './components/ADDESP32.vue'

export default {
  components: {
    RealTimeMonitoring,
    ADDESP32,
  },
  data() {
    return {
      sensorData: null,
      mode: process.env.NODE_ENV,
      currentPage: null, // 초기에는 어떤 컴포넌트도 보여주지 않습니다.
    };
  },
  methods: {
    setCurrentPage(page) {
      this.currentPage = page;
    },
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3000/sensor-data');
      this.sensorData = response.data;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  },
}
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>