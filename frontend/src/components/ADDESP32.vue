<template>
  <div>
    <h1>사용 가능한 ESP32 장치</h1>
    <ul>
      <li v-for="device in devices" :key="device.ip">
        <button @click="selectDevice(device.ip)">{{ device.ip }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      devices: []
    }
  },
  methods: {
    fetchDevices() {
      fetch('http://localhost:8080/devices')
        .then(response => response.json())
        .then(data => {
          this.devices = data;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    selectDevice(ip) {
      this.$router.push({ name: 'SensorData', params: { ip } });
    }
  },
  created() {
    this.fetchDevices();
  }
}
</script>