<template>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <button @click="closeModal" class="close-button">Close</button>
      <div>
        <h2 class="title">Select Arduino Node to Add</h2>
        <div v-for="node in availableNodes" :key="node.node_id" class="node-item">
          <p class="node-name">{{ node.node_id }}</p>
          <button @click="addArduino(node.node_id, node.description)" class="add-button">Add</button>
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
        const response = await axios.get('http://localhost:3000/api/available-nodes');
        const existingNodesResponse = await axios.get('http://localhost:3000/api/arduinos');
        const existingNodeIds = new Set(existingNodesResponse.data.data.map(node => node.node_id));

        this.availableNodes = response.data.data.filter(node => !existingNodeIds.has(node.node_id));
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
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 600px;
}

.close-button {
  background: #df6961;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  right: -40%;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.node-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 10px 20px;
  border-radius: 4px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.node-name {
  font-size: 1.2em;
}

.add-button {
  background: #007bff;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:hover {
  background: #0056b3;
}
</style>
