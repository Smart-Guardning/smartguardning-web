const SensorDataController = {
  handleRequest: async (req, res) => {
    // TODO: Replace with your actual data fetching logic 임시로 센서 데이터를 반환합니다.
    const sensorData = {
      temperature: 24,
      humidity: 50
    };

    res.json(sensorData);
  }
};

module.exports = SensorDataController;