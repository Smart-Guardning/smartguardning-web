<template>
  <div>
    <h2>Add a new ESP32</h2>
    <form @submit.prevent="addESP32">
      <label for="ip">ESP32 IP Address:</label>
      <input id="ip" v-model="ip" type="text" required>
      <button type="submit">Add</button>
    </form>
    <button @click="getSensorData">Get Sensor Data</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ip: ''
    }
  },
  methods: {
    addESP32() {
      fetch('http://localhost:8080/add-esp32', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip: this.ip }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    },
    getSensorData() {
      fetch('http://localhost:8080/sensor-data')
        .then(response => response.json())
        .then(data => {
          console.log(data); // Log the sensor data
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
}
</script>