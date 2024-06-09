<template>
  <div>
    <h1>Node Details for {{ node_id }}</h1>
    <div>
      <label for="timeRange">Select Time Range:</label>
      <select id="timeRange" v-model="timeRange" @change="filterData">
        <option value="30sec">30 sec</option>
        <option value="1min">1 min</option>
        <option value="5min">5 min</option>
        <option value="hour">Last Hour</option>
        <option value="day">Last 24 Hours</option>
        <option value="week">Last Week</option>
      </select>
    </div>
    <div class="chart-container">
      <div class="chart-item large-chart">
        <canvas id="soil-moisture-chart"></canvas>
      </div>
      <div class="chart-item small-chart">
        <canvas id="water-level-chart"></canvas>
      </div>
      <div class="chart-item small-chart">
        <canvas id="temperature-chart"></canvas>
      </div>
      <div class="chart-item small-chart">
        <canvas id="humidity-chart"></canvas>
      </div>
    </div>
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
      soilMoistureChart: null,
      waterLevelChart: null,
      temperatureChart: null,
      humidityChart: null,
      sensorData: [],
      timeRange: '1min', // Default time range
    };
  },
  methods: {
    setupSocket() {
      this.socket = io('http://localhost:8081');

      this.socket.on('sensorData', (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.node_id === this.node_id) {
          this.sensorData.push(parsedData);
          this.filterData(); // Apply filter when new data arrives
        }
      });
    },
    fetchSensorData() {
      fetch(`http://localhost:3000/api/sensor-data/${this.node_id}`)
        .then(response => response.json())
        .then(data => {
          this.sensorData = data;
          this.initializeCharts();
        });
    },
    initializeCharts() {
      const soilMoistureCtx = document.getElementById('soil-moisture-chart').getContext('2d');
      const waterLevelCtx = document.getElementById('water-level-chart').getContext('2d');
      const temperatureCtx = document.getElementById('temperature-chart').getContext('2d');
      const humidityCtx = document.getElementById('humidity-chart').getContext('2d');

      this.soilMoistureChart = new Chart(soilMoistureCtx, {
        type: 'line',
        data: {
          labels: this.getFilteredData().map(d => d.timestamp),
          datasets: [{
            label: 'Soil Moisture',
            data: this.getFilteredData().map(d => d.soil_moisture),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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

      this.waterLevelChart = new Chart(waterLevelCtx, {
        type: 'line',
        data: {
          labels: this.getFilteredData().map(d => d.timestamp),
          datasets: [{
            label: 'Water Level',
            data: this.getFilteredData().map(d => d.water_level),
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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

      this.temperatureChart = new Chart(temperatureCtx, {
        type: 'line',
        data: {
          labels: this.getFilteredData().map(d => d.timestamp),
          datasets: [{
            label: 'Temperature',
            data: this.getFilteredData().map(d => d.temperature),
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            fill: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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

      this.humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: {
          labels: this.getFilteredData().map(d => d.timestamp),
          datasets: [{
            label: 'Humidity',
            data: this.getFilteredData().map(d => d.humidity),
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            fill: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
    updateCharts() {
      if (this.soilMoistureChart) {
        this.soilMoistureChart.destroy();
      }
      if (this.waterLevelChart) {
        this.waterLevelChart.destroy();
      }
      if (this.temperatureChart) {
        this.temperatureChart.destroy();
      }
      if (this.humidityChart) {
        this.humidityChart.destroy();
      }

      this.initializeCharts();
    },
    filterData() {
      this.updateCharts();
    },
    getFilteredData() {
      const now = new Date();
      let cutoffTime;

      switch (this.timeRange) {
        case '30sec':
          cutoffTime = new Date(now - 30 * 1000);
          break;
        case '1min':
          cutoffTime = new Date(now - 60 * 1000);
          break;
        case '5min':
          cutoffTime = new Date(now - 5 * 60 * 1000);
          break;
        case 'hour':
          cutoffTime = new Date(now - 60 * 60 * 1000);
          break;
        case 'day':
          cutoffTime = new Date(now - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          cutoffTime = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffTime = new Date(now - 24 * 60 * 60 * 1000);
      }

      return this.sensorData.filter(d => new Date(d.timestamp) >= cutoffTime);
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

<style scoped>
.chart-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

.chart-item {
  flex-grow: 1;
  border: 1px solid #000;
  max-width: calc(33.33% - 20px); /* 제한된 최대 너비 추가 */
}

.large-chart {
  flex-basis: 100%;
  height: 400px;
  max-width: 100%; /* 제한된 최대 너비 추가 */
}

.small-chart {
  flex-basis: calc(33.33% - 20px);
  height: 200px;
}
</style>
