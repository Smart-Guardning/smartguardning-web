<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <button @click="closeModal">Close</button>
      <div>
        <h2>Select Arduino Node to Add</h2>
        <div v-for="node in availableNodes" :key="node.node_id" class="node-item">
          <p>{{ node.node_id }} - {{ node.description }}</p>
          <button @click="addArduino(node.node_id, node.description)">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    showModal: Boolean,
  },
  data() {
    return {
      availableNodes: [],
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async fetchAvailableNodes() {
      try {
        const response = await axios.get('http://localhost:3000/api/find-arduinos');
        this.availableNodes = response.data.data.filter(node => !node.is_active);
      } catch (error) {
        console.error('Error fetching available nodes:', error);
      }
    },
    async addArduino(node_id, description) {
      try {
        await axios.post('http://localhost:3000/api/add-arduino', {
          node_id,
          description,
        });
        this.$emit('close'); // Close the modal after adding
      } catch (error) {
        console.error('Error adding Arduino:', error);
      }
    },
  },
  created() {
    this.fetchAvailableNodes();
  }
};
</script>

<style scoped>
.modal-content {
  position: relative;
  z-index: 10;
}

.modal-backdrop {
  position: absolute;
}

.node-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
