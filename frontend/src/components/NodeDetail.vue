<template>
  <div>
    <h1>노드 이름 : {{ node_id }}</h1>
    <div>
      <label for="timeRange">시간:</label>
      <select id="timeRange" v-model="timeRange" @change="filterData" class="border border-gray-300 rounded p-2">
        <option value="1min">1 분</option>
        <option value="5min">5 분</option>
        <option value="hour">1 시간</option>
        <option value="day">24 시간</option>
        <option value="week">1 주</option>
      </select>
      <button @click="fetchSensorData" title="Refresh Data"
        class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        🔄
      </button>
    </div>
    <div class="mt-4">
      <button @click="testPump" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">물 펌프 테스트</button>
      <button @click="showSettings" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">노드 설정</button>
    </div>
    <div class="chart-container mt-6">
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
      <div class="chart-item small-chart">
        <canvas id="battery-level-chart"></canvas>
      </div>
    </div>
    <div v-if="showSettingsModal" class="modal-backdrop">
      <div class="modal bg-white p-6 rounded shadow-lg w-1/2">
        <h2 class="text-2xl mb-4">설정</h2>
        <label for="targetMoisture" class="block text-gray-700 text-sm font-bold mb-2">임계 토양 습도:</label>
        <input type="number" v-model="settings.targetMoisture" id="targetMoisture"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        <label for="wateringDuration" class="block text-gray-700 text-sm font-bold mb-2 mt-4">펌프 작동 시간 (초):</label>
        <input type="number" v-model="settings.wateringDuration" id="wateringDuration"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        <label for="measurementInterval" class="block text-gray-700 text-sm font-bold mb-2 mt-4">센싱 대기 시간 (초):</label>
        <input type="number" v-model="settings.measurementInterval" id="measurementInterval"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        
        <!-- 추가된 필드 -->
        <label for="autoWater" class="block text-gray-700 text-sm font-bold mb-2 mt-4">자동 물주기:</label>
        <select v-model="settings.autoWater" id="autoWater" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="ON">ON</option>
          <option value="OFF">OFF</option>
        </select>
        <label for="sleepMode" class="block text-gray-700 text-sm font-bold mb-2 mt-4">슬립 모드:</label>
        <select v-model="settings.sleepMode" id="sleepMode" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="ON">ON</option>
          <option value="OFF">OFF</option>
        </select>
        
        <div class="modal-buttons flex justify-end mt-6">
          <button @click="saveSettings"
            class="btn btn-blue bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">저장</button>
          <button @click="closeSettings"
            class="btn btn-gray bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">취소</button>
        </div>
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
      batteryLevelChart: null,
      sensorData: [],
      timeRange: '1min',
      refreshInterval: null,
      showSettingsModal: false,
      settings: {
        targetMoisture: 2500,
        wateringDuration: 3,  // 초 단위로 변경
        measurementInterval: 30,
        autoWater: 'OFF',
        sleepMode: 'OFF'
      }
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
    testPump() {
      fetch(`http://localhost:3000/api/control-pump/${this.node_id}?action=on`)
        .then(() => setTimeout(() => {
          fetch(`http://localhost:3000/api/control-pump/${this.node_id}?action=off`);
        }, this.settings.wateringDuration * 1000));  // 초 단위로 변환
    },
    showSettings() {
      this.showSettingsModal = true;
    },
    closeSettings() {
      this.showSettingsModal = false;
    },
    saveSettings() {
  const settingsToSave = { 
    ...this.settings, 
    wateringDuration: this.settings.wateringDuration * 1000,
    autoWater: this.settings.autoWater,
    sleepMode: this.settings.sleepMode
  };
  fetch(`http://localhost:3000/api/save-settings/${this.node_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settingsToSave)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    this.closeSettings();
  })
  .catch(error => {
    console.error('Error:', error);
  });
},
    initializeChart(ctx, label, data, color, yAxisLimits = null) {
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0 // 애니메이션 비활성화
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: this.timeUnit(),
              displayFormats: {
                millisecond: 'MMM DD HH:mm',
                second: 'MMM DD HH:mm',
                minute: 'MMM DD HH:mm',
                hour: 'MMM DD HH:mm',
                day: 'MMM DD HH:mm',
                week: 'MMM DD HH:mm',
                month: 'MMM DD HH:mm',
                quarter: 'MMM DD HH:mm',
                year: 'MMM DD HH:mm',
              }
            }
          }]
        }
      };

      if (yAxisLimits) {
        options.scales.yAxes = [{
          ticks: {
            min: yAxisLimits.min,
            max: yAxisLimits.max
          }
        }];
      }

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
        options
      });
    },
    initializeCharts() {
      const soilMoistureCtx = document.getElementById('soil-moisture-chart').getContext('2d');
      const waterLevelCtx = document.getElementById('water-level-chart').getContext('2d');
      const temperatureCtx = document.getElementById('temperature-chart').getContext('2d');
      const humidityCtx = document.getElementById('humidity-chart').getContext('2d');
      const batteryLevelCtx = document.getElementById('battery-level-chart').getContext('2d');

      const filteredData = this.getFilteredData();

      this.soilMoistureChart = this.initializeChart(
        soilMoistureCtx,
        'Soil Moisture',
        filteredData.map(d => ({ timestamp: d.timestamp, value: d.soil_moisture })),
        'rgba(75, 192, 192, 1)',
        { min: 0, max: 3500 }
      );
      this.waterLevelChart = this.initializeChart(
        waterLevelCtx,
        'Water Level',
        filteredData.map(d => ({ timestamp: d.timestamp, value: d.water_level })),
        'rgba(54, 162, 235, 1)',
        { min: 0, max: 2500 }
      );
      this.temperatureChart = this.initializeChart(
        temperatureCtx,
        'Temperature',
        filteredData.map(d => ({ timestamp: d.timestamp, value: d.temperature })),
        'rgba(255, 206, 86, 1)',
        { min: -40, max: 80 }
      );
      this.humidityChart = this.initializeChart(
        humidityCtx,
        'Humidity',
        filteredData.map(d => ({ timestamp: d.timestamp, value: d.humidity })),
        'rgba(153, 102, 255, 1)',
        { min: 0, max: 100 }
      );
      this.batteryLevelChart = this.initializeChart(
        batteryLevelCtx,
        'Battery Level',
        filteredData.map(d => ({ timestamp: d.timestamp, value: d.battery_level })),
        'rgba(255, 99, 132, 1)',
        { min: 3.0, max: 5.0 }
      );
    },
    updateCharts() {
      ['soilMoistureChart', 'waterLevelChart', 'temperatureChart', 'humidityChart', 'batteryLevelChart'].forEach(chart => {
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

      // 데이터 간격이 3초 이상인 경우 누락된 데이터를 채워넣음
      const resultData = [];
      for (let i = 0; i < filteredData.length; i++) {
        resultData.push(filteredData[i]);
        if (i < filteredData.length - 1) {
          const nextTime = new Date(filteredData[i + 1].timestamp).getTime();
          const currentTime = new Date(filteredData[i].timestamp).getTime();
          const diff = nextTime - currentTime;
          if (diff > 3000) {
            resultData.push({
              timestamp: new Date(currentTime + 3000),
              soil_moisture: null,
              water_level: null,
              temperature: null,
              humidity: null,
              battery_level: null
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
          return 'hour';
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
  max-width: calc(33.33% - 20px);
  /* 제한된 최대 너비 추가 */
}

.large-chart {
  flex-basis: 100%;
  height: 400px;
  max-width: 100%;
  /* 제한된 최대 너비 추가 */
}

.small-chart {
  flex-basis: calc(33.33% - 20px);
  height: 200px;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  /* 높은 z-index 설정 */
}

.modal {
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
}

.btn-green {
  background-color: #38a169;
  color: white;
  transition: background-color 0.3s;
}

.btn-green:hover {
  background-color: #2f855a;
}

.btn-blue {
  background-color: #3182ce;
  color: white;
  transition: background-color 0.3s;
}

.btn-blue:hover {
  background-color: #2b6cb0;
}

.btn-gray {
  background-color: #a0aec0;
  color: white;
  transition: background-color 0.3s;
}

.btn-gray:hover {
  background-color: #718096;
}
</style>
