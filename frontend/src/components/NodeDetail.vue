<template>
  <div>
    <h2>Node Details for {{ nodeId }}</h2>
    <div>
      <h3>Sensor Data</h3>
      <canvas id="sensor-chart" width="600" height="400"></canvas>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import Chart from 'chart.js';

export default {
  name: 'NodeDetail',
  props: {
    nodeId: String
  },
  data() {
    return {
      chart: null,
      socket: null
    };
  },
  methods: {
    initializeChart() {
      const ctx = document.getElementById('sensor-chart').getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Soil Moisture',
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              data: []
            },
            {
              label: 'Water Level',
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              data: []
            },
            {
              label: 'Temperature',
              borderColor: 'rgba(255, 159, 64, 1)',
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              data: []
            },
            {
              label: 'Humidity',
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              data: []
            }
          ]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'minute'
              },
              distribution: 'linear'
            }]
          }
        }
      });
    },
    addDataToChart(data) {
      const timestamp = new Date();
      this.chart.data.labels.push(timestamp);
      this.chart.data.datasets[0].data.push({ t: timestamp, y: data.soil_moisture });
      this.chart.data.datasets[1].data.push({ t: timestamp, y: data.water_level });
      this.chart.data.datasets[2].data.push({ t: timestamp, y: data.temperature });
      this.chart.data.datasets[3].data.push({ t: timestamp, y: data.humidity });
      this.chart.update();
    },
    setupSocket() {
      this.socket = io('http://localhost:8081');
      this.socket.on('sensorData', (message) => {
        const data = JSON.parse(message);
        if (data.node_id === this.nodeId) {
          this.addDataToChart(data);
        }
      });
    }
  },
  created() {
    this.initializeChart();
    this.setupSocket();
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>

<style scoped>
</style>
