<script>
import axios from 'axios';

export default {
  data() {
    return {
      devices: [],
    };
  },
  methods: {
    async fetchDevices() {
      try {
        const response = await axios.get('http://localhost:3000/devices');
        this.devices = response.data;
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    },
  },
  created() {
    this.fetchDevices();
  },
};
</script>