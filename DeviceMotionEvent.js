// 기존 코드와 함께 추가

// 진동 데이터 감지
function startVibrationDetection() {
    if (window.DeviceMotionEvent) {
        // 장치의 움직임 이벤트 등록
        window.addEventListener('devicemotion', event => {
            const acc = event.acceleration; // 가속도 데이터
            if (acc) {
                const x = acc.x ? acc.x.toFixed(2) : 0;
                const y = acc.y ? acc.y.toFixed(2) : 0;
                const z = acc.z ? acc.z.toFixed(2) : 0;

                // 진동 데이터 표시
                const vibrationDataElem = document.getElementById('vibrationData');
                vibrationDataElem.textContent = `진동 데이터: X: ${x}, Y: ${y}, Z: ${z}`;
            }
        });
    } else {
        console.log("DeviceMotionEvent를 지원하지 않는 브라우저입니다.");
    }
}

// 페이지 로드 후 진동 감지 시작
startVibrationDetection();
