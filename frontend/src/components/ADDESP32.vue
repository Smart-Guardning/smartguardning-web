<template>
    <div>
        <h2>Add a new ESP32</h2>
        <form @submit.prevent="addESP32">
            <label for="ip">ESP32 IP Address:</label>
            <input id="ip" v-model="ip" type="text" required>
            <button type="submit">Add</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ip: ''
        }
    },
    methods: {
        addESP32() {
        }
    }
}
</script>