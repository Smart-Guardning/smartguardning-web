<template>
  <div>
    <h1>Node Details for {{ node_id }}</h1>
    <canvas id="sensor-chart"></canvas>
  </div>
</template>

<script>
import io from 'socket.io-client';
import Chart from 'chart.js';

export default {
  props: ['node_id'],
  data() {
    return {
      socket: null,
      chart: null,
      sensorData: [],
    };
  },
  methods: {
    setupSocket() {
      this.socket = io('http://localhost:8081');

      this.socket.on('sensorData', (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.node_id === this.node_id) {
          this.sensorData.push(parsedData);
          this.updateChart();
        }
      });
    },
    fetchSensorData() {
      fetch(`http://localhost:3000/api/sensor-data/${this.node_id}`)
        .then(response => response.json())
        .then(data => {
          this.sensorData = data;
          this.initializeChart();
        });
    },
    initializeChart() {
      const ctx = document.getElementById('sensor-chart').getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.sensorData.map(d => d.timestamp),
          datasets: [
            {
              label: 'Soil Moisture',
              data: this.sensorData.map(d => d.soil_moisture),
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false,
            },
            {
              label: 'Water Level',
              data: this.sensorData.map(d => d.water_level),
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              fill: false,
            },
            {
              label: 'Temperature',
              data: this.sensorData.map(d => d.temperature),
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
              fill: false,
            },
            {
              label: 'Humidity',
              data: this.sensorData.map(d => d.humidity),
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
              fill: false,
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'minute'
              }
            }]
          }
        }
      });
    },
    updateChart() {
      this.chart.data.labels.push(this.sensorData[this.sensorData.length - 1].timestamp);
      this.chart.data.datasets.forEach((dataset, index) => {
        switch (index) {
          case 0:
            dataset.data.push(this.sensorData[this.sensorData.length - 1].soil_moisture);
            break;
          case 1:
            dataset.data.push(this.sensorData[this.sensorData.length - 1].water_level);
            break;
          case 2:
            dataset.data.push(this.sensorData[this.sensorData.length - 1].temperature);
            break;
          case 3:
            dataset.data.push(this.sensorData[this.sensorData.length - 1].humidity);
            break;
        }
      });
      this.chart.update();
    }
  },
  mounted() {
    this.fetchSensorData();
    this.setupSocket();
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>