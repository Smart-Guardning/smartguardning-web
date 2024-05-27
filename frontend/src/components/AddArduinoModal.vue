<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <button @click="closeModal">Close</button>
      <div v-for="arduino in arduinos" :key="arduino.id">
        <p>{{ arduino.name }}</p>
        <button @click="addArduino(arduino.id)">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      showModal: true,
      arduinos: []
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async findArduinos() {
      const response = await axios.get('/api/find-arduinos');
      this.arduinos = response.data;
    },
    async addArduino(id) {
      await axios.post('/api/add-arduino', { id });
      this.findArduinos();
    }
  },
  created() {
    this.findArduinos();
  }
}
</script>