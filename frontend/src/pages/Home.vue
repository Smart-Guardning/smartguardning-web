<template>
  <div id="home">
    <div v-if="!isArduinoAdded" class="add-arduino fixed inset-0 flex items-center justify-center z-50">
      <div class="modal-content text-center bg-white p-10 rounded shadow-lg w-1/2 h-1/2">
        <h2 class="text-2xl mb-4" v-if="!showModal">ADD ARDUINO</h2>
        <button @click="addArduino" class="text-4xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" v-if="!showModal">
          +
        </button>
        <add-arduino-modal v-if="showModal" :showModal="showModal" @close="closeModal"></add-arduino-modal>
      </div>
      <div v-if="showModal" class="modal-backdrop fixed inset-0 bg-black opacity-50"></div>
    </div>
    <div :style="{ filter: isArduinoAdded ? 'none' : 'blur(10px)' }">
      <!-- breadcrumb -->
      <nav class="text-sm font-semibold mb-6" aria-label="Breadcrumb">
        <ol class="list-none p-0 inline-flex">
          <li class="flex items-center text-blue-500">
            <a href="#" class="text-gray-700">Home</a>
            <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
          </li>
          <li class="flex items-center">
            <a href="#" class="text-gray-600">Dashboard</a>
          </li>
        </ol>
      </nav>
      <!-- breadcrumb end -->

      <div class="lg:flex justify-between items-center mb-6">
        <button class="bg-blue-500 hover:bg-blue-600 focus:outline-none rounded-lg px-6 py-2 text-white font-semibold shadow">View Logs</button>
      </div>

      <div class="flex flex-wrap -mx-3 mb-20">
        <div class="w-1/2 xl:w-1/4 px-3" v-for="arduino in arduinos" :key="arduino.id">
          <div class="w-full bg-white border text-blue-400 rounded-lg flex items-center p-6 mb-6 xl:mb-0">
            <svg class="w-16 h-16 fill-current mr-4 hidden lg:block" viewBox="0 0 20 20">
              <path d="M17.35,2.219h-5.934c-0.115,0-0.225,0.045-0.307,0.128l-8.762,8.762c-0.171,0.168-0.171,0.443,0,0.611l5.933,5.934c0.167,0.171,0.443,0.169,0.612,0l8.762-8.763c0.083-0.083,0.128-0.192,0.128-0.307V2.651C17.781,2.414,17.587,2.219,17.35,2.219M16.916,8.405l-8.332,8.332l-5.321-5.321l8.333-8.332h5.32V8.405z M13.891,4.367c-0.957,0-1.729,0.772-1.729,1.729c0,0.957,0.771,1.729,1.729,1.729s1.729-0.772,1.729-1.729C15.619,5.14,14.848,4.367,13.891,4.367 M14.502,6.708c-0.326,0.326-0.896,0.326-1.223,0c-0.338-0.342-0.338-0.882,0-1.224c0.342-0.337,0.881-0.337,1.223,0C14.84,5.826,14.84,6.366,14.502,6.708"></path>
            </svg>
            <div class="text-gray-700">
              <p class="font-semibold text-3xl">{{ arduino.node_id }}</p>
              <p>{{ arduino.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap -mx-3">
        <div class="w-full xl:w-1/3 px-3">
          <p class="text-xl font-semibold mb-4">Recent Sales</p>
          <div class="w-full bg-white border rounded-lg p-4 mb-8 xl:mb-0">
            <canvas id="buyers-chart" width="600" height="400"></canvas>
          </div>
        </div>
        <div class="w-full xl:w-1/3 px-3">
          <p class="text-xl font-semibold mb-4">Recent Reviews</p>
          <div class="w-full bg-white border rounded-lg p-4 mb-8 xl:mb-0">
            <canvas id="reviews-chart" width="600" height="400"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddArduinoModal from '../components/AddArduinoModal.vue';
import axios from 'axios';
import Chart from 'chart.js';

export default {
  components: {
    'add-arduino-modal': AddArduinoModal
  },
  data() {
    return {
      showModal: false,
      isArduinoAdded: false,
      arduinos: [],
      buyersData: {
        type: 'line',
        data: {
          labels : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
          datasets:[{
            backgroundColor : "rgba(99,179,237,0.4)",
            strokeColor : "#63b3ed",
            pointColor : "#fff",
            pointStrokeColor : "#63b3ed",
            data : [203,156,99,251,305,247,256]
          },
          {
            backgroundColor : "rgba(198,198,198,0.4)",
            strokeColor : "#f7fafc",
            pointColor : "#fff",
            pointStrokeColor : "#f7fafc",
            data : [86,97,144,114,94,108,156]
          }]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              gridLines: {
                display:false
              },
              ticks: {
                display: false
              }
            }],
            xAxes: [{
              gridLines: {
                display: false
              }
            }]
          }
        }
      },
      reviewsData: {
        type: 'bar',
        data: {
          labels : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
          datasets:[{
            backgroundColor : "rgba(99,179,237,0.4)",
            strokeColor : "#63b3ed",
            pointColor : "#fff",
            pointStrokeColor : "#63b3ed",
            data : [203,156,99,251,305,247,256]
          }]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              gridLines: {
                display:false
              },
              ticks: {
                display: false
              }
            }],
            xAxes: [{
              gridLines: {
                display: false
              }
            }]
          }
        }
      }
    }
  },
  methods: {
    addArduino() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.fetchArduinos(); // 모달 닫을 때 다시 아두이노 목록 갱신
    },
    async fetchArduinos() {
      const response = await axios.get('http://localhost:3000/api/arduinos');
      this.arduinos = response.data.data;
      this.isArduinoAdded = this.arduinos.length > 0;
    }
  },
  created() {
    this.fetchArduinos();
  },
  mounted () {
    new Chart(document.getElementById('buyers-chart'), this.buyersData);
    new Chart(document.getElementById('reviews-chart'), this.reviewsData);
  }
}
</script>

<style scoped>
.modal-content {
  position: relative;
  z-index: 10;
}

.modal-backdrop {
  position: absolute;
}
</style>
