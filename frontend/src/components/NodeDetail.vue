<template>
  <div>
    <h1>Node Details for {{ node_id }}</h1>
    <div>
      <label for="timeRange">Select Time Range:</label>
      <select id="timeRange" v-model="timeRange" @change="filterData">
        <option value="1min">1 min</option>
        <option value="5min">5 min</option>
        <option value="hour">Last Hour</option>
        <option value="day">Last 24 Hours</option>
        <option value="week">Last Week</option>
      </select>
      <button @click="fetchSensorData" title="Refresh Data">
        🔄
      </button>
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
import Chart from 'chart.js';

export default {
  props: ['node_id'],
  data() {
    return {
      soilMoistureChart: null,
      waterLevelChart: null,
      temperatureChart: null,
      humidityChart: null,
      sensorData: [],
      timeRange: '1min', // Default time range
      refreshInterval: null,
    };
  },
  methods: {
    fetchSensorData() {
      fetch(`http://localhost:3000/api/sensor-data/${this.node_id}`)
        .then(response => response.json())
        .then(data => {
          this.sensorData = data;
          this.filterData();
        });
    },
    initializeChart(ctx, label, data, color) {
      return new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(d => d.timestamp),
          datasets: [{
            label,
            data: data.map(d => d.value),
            borderColor: color,
            borderWidth: 1,
            fill: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0 // 애니메이션 비활성화
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: this.timeUnit()
              }
            }]
          }
        }
      });
    },
    initializeCharts() {
      const soilMoistureCtx = document.getElementById('soil-moisture-chart').getContext('2d');
      const waterLevelCtx = document.getElementById('water-level-chart').getContext('2d');
      const temperatureCtx = document.getElementById('temperature-chart').getContext('2d');
      const humidityCtx = document.getElementById('humidity-chart').getContext('2d');

      const filteredData = this.getFilteredData();

      this.soilMoistureChart = this.initializeChart(soilMoistureCtx, 'Soil Moisture', filteredData.map(d => ({ timestamp: d.timestamp, value: d.soil_moisture })), 'rgba(75, 192, 192, 1)');
      this.waterLevelChart = this.initializeChart(waterLevelCtx, 'Water Level', filteredData.map(d => ({ timestamp: d.timestamp, value: d.water_level })), 'rgba(54, 162, 235, 1)');
      this.temperatureChart = this.initializeChart(temperatureCtx, 'Temperature', filteredData.map(d => ({ timestamp: d.timestamp, value: d.temperature })), 'rgba(255, 206, 86, 1)');
      this.humidityChart = this.initializeChart(humidityCtx, 'Humidity', filteredData.map(d => ({ timestamp: d.timestamp, value: d.humidity })), 'rgba(153, 102, 255, 1)');
    },
    updateCharts() {
      ['soilMoistureChart', 'waterLevelChart', 'temperatureChart', 'humidityChart'].forEach(chart => {
        if (this[chart]) {
          this[chart].destroy();
        }
      });

      this.initializeCharts();
    },
    filterData() {
      this.updateCharts();
    },
    getFilteredData() {
      const now = new Date();
      let cutoffTime;

      switch (this.timeRange) {
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

      const filteredData = this.sensorData.filter(d => new Date(d.timestamp) >= cutoffTime);

      // Add missing data points
      const resultData = [];
      for (let i = 0; i < filteredData.length; i++) {
        resultData.push(filteredData[i]);
        if (i < filteredData.length - 1) {
          const nextTime = new Date(filteredData[i + 1].timestamp).getTime();
          const currentTime = new Date(filteredData[i].timestamp).getTime();
          const diff = nextTime - currentTime;
          if (diff > 3000) { // If the difference is greater than 3 seconds, add an empty data point
            resultData.push({
              timestamp: new Date(currentTime + 3000),
              soil_moisture: null,
              water_level: null,
              temperature: null,
              humidity: null
            });
          }
        }
      }

      return resultData;
    },
    timeUnit() {
      switch (this.timeRange) {
        case '1min':
        case '5min':
          return 'minute';
        case 'hour':
          return 'hour';
        case 'day':
          return 'hour'; // Display in hours for the last 24 hours
        case 'week':
          return 'day';
        default:
          return 'hour';
      }
    }
  },
  mounted() {
    this.fetchSensorData();
    this.refreshInterval = setInterval(this.fetchSensorData, 5000); // 5초 간격으로 자동 새로고침
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
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
