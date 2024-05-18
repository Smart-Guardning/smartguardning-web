<template>
  <div>
    <h1>실시간 모니터링</h1>
    <p>{{ sensorData }}</p>
  </div>
</template>

<script>
import io from 'socket.io-client';
export default {
  data() {
    return {
      sensorData: null,
    };
  },
  created() {
    this.socket = io('http://localhost:8080');
    this.socket.on('sensorData', (data) => {
      this.sensorData = data;
    });
  },
  beforeUnmount() {
    this.socket.close();
  },
};
</script>