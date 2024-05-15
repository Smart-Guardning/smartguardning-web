# smartguardning-web
smartguardning의 웹(온습도 모니터링)입니다.

## 구조
프로젝트는 `frontend`와 `backend` 두 부분으로 나뉩니다.

### Backend
`backend/` 디렉토리는 Node.js 백엔드 코드를 담당합니다.

- `server.js`: 서버의 시작점입니다. express, socket.io, http 패키지를 이용하여 모든 미들웨어와 라우트를 설정합니다.
- `routes/`: 각각의 라우트를 처리하는 파일들이 위치합니다. 각 파일은 express의 Router 인스턴스를 사용하여 라우트를 정의하고, 이를 app.js에서 가져와 사용합니다.
- `controllers/`: 각 라우트에 대한 로직을 처리하는 컨트롤러 파일들이 위치합니다. 컨트롤러는 모델과 뷰 사이의 연결고리 역할을 합니다.
- `models/`: 데이터베이스와 상호작용하는 모델 파일들이 위치합니다. SQLite와 상호작용하는 코드를 여기에 작성하게 될 것입니다.
- `mqtt.js`: Mosca 패키지를 이용하여 MQTT 브로커 기능을 구현합니다.
- `websocket.js`: 웹 소켓 서버를 설정하고, 실시간 데이터를 클라이언트로 전송하는 기능을 구현합니다.

### Frontend
`frontend/` 디렉토리는 Vue.js 프론트엔드 코드를 담당합니다.

- `src/`: Vue.js 애플리케이션의 소스 코드가 위치합니다.
    - `App.vue`: 애플리케이션의 메인 컴포넌트입니다.
    - `components/`: Vue.js 컴포넌트가 위치합니다. 각 컴포넌트는 웹 애플리케이션의 특정 부분을 담당합니다.
        - `RealTimeMonitoring.vue`: 실시간 모니터링 데이터를 표시합니다.
        - `SensorDataChart.vue`: 센서 데이터를 차트로 표시합니다.
        - `WaterPumpControl.vue`: 물 펌프 제어 인터페이스를 제공합니다.
        - `ADDESP32.vue` : 같은 wifi내의 ESP32 아두이노를 추가하는 페이지입니다.
    - `main.js`: Vue.js 애플리케이션의 진입점입니다.
- `public/`: 정적 파일들이 위치합니다. 예를 들어, `index.html` 파일이 여기에 위치합니다.
- `package.json`: 프로젝트의 의존성과 스크립트를 정의합니다.
- `babel.config.js`: Babel의 설정 파일입니다. Babel은 최신 JavaScript 문법을 지원하지 않는 브라우저에서도 코드가 동작하도록 JavaScript 코드를 변환하는 도구입니다.
- `vue.config.js`: Vue CLI의 설정 파일입니다.