// 변수 선언
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusElem = document.getElementById('status');
const dbValueElem = document.getElementById('dbValue');

let audioContext;
let analyser;
let microphone;
let bufferLength;
let dataArray;

function calculateDecibels(dataArray) {
    let sum = 0;

    // RMS 계산
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] ** 2;
    }
    const rms = Math.sqrt(sum / dataArray.length);

    // 기준 RMS 값 (조용한 상태의 RMS)
    const referenceRMS = 10; // 적절한 기준값 설정 (실험적으로 조정)

    // 데시벨 계산
    const decibels = 20 * Math.log10(rms / referenceRMS);

    return decibels.toFixed(2);
}



// 마이크와 사운드 분석 시작
function startSoundAnalysis() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // 사용자가 마이크 권한을 허용한 경우
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                // 오디오 컨텍스트 생성
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();

                // 마이크로부터 입력을 받아 오디오 소스를 연결
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);

                // AnalyserNode 설정
                analyser.fftSize = 256; // 샘플 크기
                bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);

                // 그래프 업데이트 함수 호출
                draw();
                statusElem.textContent = "상태: 사운드 분석 중...";
            })
            .catch(err => {
                statusElem.textContent = "마이크 권한을 허용하지 않았습니다.";
                console.error("Error accessing microphone: ", err);
            });
    } else {
        statusElem.textContent = "이 브라우저는 getUserMedia를 지원하지 않습니다.";
    }
}

// 주파수 데이터 분석 후 그래프 그리기
function draw() {
    analyser.getByteFrequencyData(dataArray); // 주파수 데이터 가져오기

    // 캔버스를 지우고 새로 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 그래프 그리기
    const barWidth = canvas.width / bufferLength; // 각 막대의 너비
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        // 색상 설정
        ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';

        // 막대 그리기
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1; // 다음 막대로 이동
    }

    // 데시벨 계산 및 표시
    const decibels = calculateDecibels(dataArray);
    dbValueElem.textContent = `데시벨: ${decibels} dB`;

    // 애니메이션을 위해 계속 호출
    requestAnimationFrame(draw);
}

// 페이지 로드 후 사운드 분석 시작
startSoundAnalysis();
