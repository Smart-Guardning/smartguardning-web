<template>
    <div>
        <!-- Chart goes here -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            sensorData: []
        }
    },
    methods: {
        fetchSensorData() {
            // Fetch sensor data from the backend
        }
    },
    created() {
        this.fetchSensorData();
    }
}
</script>