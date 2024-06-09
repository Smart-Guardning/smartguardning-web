<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <button @click="closeModal">Close</button>
      <div v-for="arduino in arduinos" :key="arduino">
        <p>{{ arduino }}</p>
        <button @click="addArduino(arduino)">Add</button>
      </div>
      <!-- 아두이노 선택 드롭다운 추가 -->
      <select v-model="selectedArduino" @change="selectArduino">
        <option disabled value="">--Select Arduino--</option>
        <option v-for="arduino in arduinos" :key="arduino" :value="arduino">
          {{ arduino }}
        </option>
      </select>
    </div>
    <!-- 노드 상태를 보여주는 섹션 추가 -->
    <div v-if="nodeStatus">
      <h3>Node Status</h3>
      <p>{{ nodeStatus }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';  // socket.io-client 임포트

export default {
  props: ['showModal'],
  data() {
    return {
      arduinos: [],
      selectedArduino: '', // 선택한 아두이노를 저장하는 데이터 속성
      nodeStatus: null, // 노드 상태를 저장하는 데이터 속성
      socket: null, // WebSocket 객체
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async findArduinos() {
      const response = await axios.get('http://localhost:3000/api/find-arduinos');
      this.arduinos = response.data; // 필터링 제거
    },
    async addArduino(id) {
      await axios.post('http://localhost:3000/api/add-arduino', { id });
      this.findArduinos();
    },
    selectArduino() {
      console.log('Selected Arduino:', this.selectedArduino);
      // 여기서 선택한 아두이노를 처리하십시오.
      // 예를 들어, 선택한 아두이노에 대한 정보를 가져오거나,
      // 선택한 아두이노를 사용하여 다른 작업을 수행할 수 있습니다.
    },
    setupSocket() {
      this.socket = io('http://localhost:8081');
      this.socket.on('sensorData', (data) => {
        this.nodeStatus = data;
      });
    },
  },
  created() {
    this.findArduinos();
    this.setupSocket(); // WebSocket 연결 설정
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
