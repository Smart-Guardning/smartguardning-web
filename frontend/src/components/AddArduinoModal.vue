<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <div v-for="arduino in arduinos" :key="arduino">
        <button @click="addArduino(arduino)">{{ arduino }}</button>
      </div>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      showModal: true,
      arduinos: [],
      selectedArduino: '', // 선택한 아두이노를 저장하는 데이터 속성
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async findArduinos() {
      const response = await axios.get('http://localhost:3000/api/find-arduinos');
      this.arduinos = response.data;
    },
    async addArduino(name) {
      await axios.post('/api/add-arduino', { name });
      this.findArduinos();
    },
  },
  created() {
    this.findArduinos();
  }
}
</script>