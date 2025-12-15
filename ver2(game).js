const ASSETS = {
    balls: ["assets/redball.png", "assets/blackball.png", "assets/blueball.png"],
    monsters:  ["assets/monster1.webp", "assets/monster2.webp", "assets/monster3.webp", "assets/monster4.webp", "assets/monster5.webp"
            , "assets/monster6.webp", "assets/monster7.webp", "assets/monster8.webp", "assets/monster9.webp", "assets/monster10.webp", 
            "assets/monster11.webp", "assets/monster12.webp"],   
    audioBgmEasy: "assets/beginMusic.mp3",
    audioHard: "assets/audioHard.mp3",
    audioEnd: "assets/audioEnd.mp3",
    // 배열 인덱스로 접근하기 위해 구조 유지
    playerEasy: ["assets/playerEasy1.png","assets/playerEasy2.png", "assets/playerEasy3.png"], 
    playerHard: "assets/playerHard.png",
    playerGameover:"assets/playerGameover.webp",
    bgVideo: "assets/bgVideo.mp4",
    bgImageLose: "assets/bgImageLose.webp",
    bgImageBase: "assets/bgImageBase.jpg"
};

const elems = {
    video: document.getElementById("video"),
    videobox: document.getElementById("videobox"),
    textbox: document.getElementById("textbox"),
    text: document.getElementById("text"),
    button: document.getElementById("button"),
    nickname: document.getElementById("nickname"),
    wellcome: document.getElementById("wellcome"),
    knight: document.getElementById("knight"),
    knightbox: document.getElementById("picbox"), // HTML ID는 picbox, 변수명은 knightbox
    section: document.getElementById("section"),
    drops: document.getElementsByClassName("ball"),
    audio: document.getElementById("audio"),
    aside: document.getElementById("main_aside")
};


const player = {
    box: elems.knightbox,
    img: elems.knight,

    // 상태 데이터
    x: 0,
    y: 0,
    width: "9.5vw",

    // CSS left = x축, top = y축
    setPosition() {
        this.box.style.left = `${this.x}%`;
        this.box.style.top = `${this.y}%`;
    },

    // [행위] x 위치 변경 (Logic)
    move(plusx) {
        // 값을 더함
        this.x += plusx;

        // 경계값 처리 (화면 밖으로 나가지 않도록 고정)
        if (this.x < -45) {
            this.x = -45;
        } else if (this.x > 45) {
            this.x = 45;
        }
        
        // 변경된 값을 화면에 반영
        this.setPosition();
    },

    // 위치 강제 설정 (초기화용)
    setCoord(newX, newY) {
        this.x = newX;
        this.y = newY;
        this.setPosition();
    },

    // 이미지 및 크기 변경 (Skin)
    setSkin(src, width) {
        this.img.src = src;
        if (width) {
            this.width = width;
            this.box.style.width = width;
        }
    }
};

//상태정의
const state = {
    real: false,
    counttime: 0,
    firstclick: 1,
    t: 0.15,
    count: [5, 5, 5, 5],
    gameover: false
};

// 온라인 상태일 때의 화면 처리
function handleOnlineState() {
    // 게임 화면 숨기기
    document.body.style.visibility = "hidden";
    document.body.style.backgroundImage = ""; // 기본 배경
    alert("와이파이를 끄면 게임이 가능합니다")
}

//오프라인 상태일 때의 화면 처리 (게임 준비)
function handleOfflineState() {
    // 배경 변경 및 게임 요소 준비
    document.body.style.backgroundImage = `url('${ASSETS.bgImageBase}')`;
    document.body.style.visibility = "visible";
    Array.from(elems.drops).forEach(element => element.style.visibility = "hidden");
    elems.wellcome.style.visibility = "hidden";
    
    // 플레이어 초기 위치 설정
    player.setCoord(0, 0); 
    
    // 입력창 및 버튼 활성화
    elems.text.value = "닉네임입력";
    elems.text.style.display = "inline-block";
    elems.button.style.display = "inline-block";
    
    elems.text.onclick = () => {
        elems.text.value = "";
    }
}

//  페이지 로드 시 현재 상태 확인
if (navigator.onLine) {
    // 처음 접속했는데 온라인인 경우
    handleOnlineState();
} else {
    // 처음 접속했는데 이미 오프라인인 경우
    handleOfflineState();
}

// 상태가 '온라인'으로 변경될 때 (게임 중 인터넷 연결)
window.addEventListener('online', () => {
    // 리로드 의사 묻기
    if (confirm("인터넷 연결이 감지되었습니다. 게임을 종료 하시겠습니까?")) {
        window.location.reload();
    } else {
        // 취소하더라도 게임 진행은 막아야 하므로 안내 화면 유지
        handleOnlineState();
    }
});

// '오프라인'으로 변경될 때 (와이파이 끔 -> 게임 시작 가능)
window.addEventListener('offline', () => {
    handleOfflineState();
});


const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


//버튼 클릭시
elems.button.onclick = async function() {
    // 닉네임 설정
    if (elems.text.value === "닉네임입력" || elems.text.value === "") {
        elems.nickname.innerHTML = "noname";
    } else {
        elems.nickname.innerHTML = elems.text.value;
    }
    elems.knightbox.style.height="auto";    
    elems.audio.src = ASSETS.audioBgmEasy;
    elems.text.style.display = "none";
    elems.button.style.display = "none";

    await wait(1000);
    player.setSkin(ASSETS.playerEasy[1]); // "assets/playerEasy2.jpg"

    await wait(1000);
    player.setSkin(ASSETS.playerEasy[2]); // "assets/playerEasy3.png"
    elems.wellcome.style.visibility = "visible";

    await wait(2000);
    elems.wellcome.style.visibility = "hidden";
    
    // 게임 시작 위치로 플레이어 이동
    //player.width = "9.5vw";
    player.box.style.width = player.width;
    player.setCoord(0, 0);

    await wait(1000);

    // 타이머 시작
    setInterval(() => { ++state.counttime; }, 1000);

    // 공 생성 및 표시
    [0, 1, 2, 3].forEach(makeball);
    Array.from(elems.drops).slice(0, 3).forEach(drop => {
        drop.style.visibility = "visible";
    });

    // 공 낙하 시작 (시간차 적용)
    startGameLoop(0); 
    await wait(3000);
    startGameLoop(1);
    await wait(2000);
    startGameLoop(2);
    await wait(3000);
    startGameLoop(3);
    if(!state.gameover){
    //난이도 변경 (2페이즈)
    elems.drops[3].style.visibility = "visible";
    state.real = true;
    
    // 모든 공을 몬스터 이미지로 교체
    [0, 1, 2, 3].forEach(element => elems.drops[element].src = ASSETS.monsters[element]);
    
    // 플레이어 스킨 변경 (hard 모드)
    player.setSkin(ASSETS.playerHard, "7vw");
    
    state.t = 0.25;
    document.body.style.backgroundImage = "";
    elems.video.src = ASSETS.bgVideo;
    elems.audio.src = ASSETS.audioHard;
    
    //속도 증가 로직
    setInterval(() => {
        if (state.t < 1.5) { state.t += 0.05; }
    }, 1500);
    }
};


function startGameLoop(index) {
    function loop() {
        if (state.count[index] > 85) {
        state.count[index] = 0;
        makeball(index);
        } else {
            state.count[index] += state.t;
        }
        elems.drops[index].style.top = `${state.count[index]}%`;
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

function makeball(index) {
    let num = Math.random();
    // state.real 값에 따라 몬스터/공 구분
    if (state.real) {
        elems.drops[index].src = ASSETS.monsters[Math.floor(num * 12)];
    } else {
        elems.drops[index].src = ASSETS.balls[Math.floor(num * 3)];
    }
    
    elems.drops[index].style.left = `${(num * 95)}%`;
    elems.drops[index].style.maxWidth = `${(num * 3 + 5)}vw`;
    elems.drops[index].style.maxHeight = `${(num * 3 + 5)}vw`;
}

//키보드 입력처리
const [KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_ENTER] = [37, 38, 39, 40, 13];

//키보드와 스마트폰 터치 처리
const InputHandler = {
    // 설정값
    touchInterval: null, // 터치 반복 실행용 타이머
    touchSensitivity: 3.5, // 터치 이동 속도

    init() {
        // 1. 키보드 이벤트 등록
        document.body.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // 2. 터치 이벤트 등록 (패시브 옵션 false: 스크롤 방지용)
        const body = document.body;
        body.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        body.addEventListener('touchend', this.stopTouch.bind(this));
        body.addEventListener('touchcancel', this.stopTouch.bind(this));
    },

    // [키보드] 로직 처리
    handleKeydown(event) {
        if (state.gameover) return;

        switch (event.keyCode) {
            case 37: // LEFT
                player.move(-3.5);
                break;
            case 39: // RIGHT
                player.move(3.5);
                break;
            case 13: // ENTER
                if (state.firstclick > 0) {
                    elems.button.onclick();
                    --state.firstclick;
                }
                break;
        }
    },

    // [터치] 시작 로직
    handleTouchStart(e) {
        // 게임오버거나 버튼/입력창 터치 시 무시
        if (state.gameover || e.target === elems.button || e.target === elems.text) return;

        // 브라우저 기본 스크롤/확대 방지
        if (e.cancelable) e.preventDefault();

        const touchX = e.touches[0].clientX;
        const center = window.innerWidth / 2;

        // 기존 움직임 초기화
        this.stopTouch();

        // 화면 왼쪽/오른쪽 판별하여 방향 결정
        const direction = touchX < center ? -1 : 1;
        const moveAmount = this.touchSensitivity * direction;

        // 누르고 있는 동안 30ms마다 계속 이동 (부드러운 움직임)
        this.touchInterval = setInterval(() => {
            player.move(moveAmount);
        }, 30);
    },

    // [터치] 종료 로직
    stopTouch() {
        if (this.touchInterval) {
            clearInterval(this.touchInterval);
            this.touchInterval = null;
        }
    }
};

// 입력 핸들러 가동
InputHandler.init();



const CollisionManager = {
    loopId: null,

    // 충돌 감지 루프 시작
    start() {
        const checkLoop = () => {
            if (state.gameover) return;

            this.checkAll();
            this.loopId = requestAnimationFrame(checkLoop);
        };
        this.loopId = requestAnimationFrame(checkLoop);
    },

    // 충돌 감지 루프 정지
    stop() {
        if (this.loopId) {
            cancelAnimationFrame(this.loopId);
            this.loopId = null;
        }
    },

    // 모든 적과 플레이어 간의 충돌 검사
    checkAll() {
        const playerRect = elems.knight.getBoundingClientRect();

        // Array.from 대신 for 루프 사용 
        for (let i = 0; i < elems.drops.length; i++) {
            const drop = elems.drops[i];
            
            // 화면 상단(65%) 아래에 있는 물체만 검사를 했다가, 성능에 큰변화를 주지않아서 제거
            //if (state.count[i] > 65) {
                const dropRect = drop.getBoundingClientRect();

                if (this.isColliding(playerRect, dropRect)) {
                    GameDirector.handleGameOver();
                    break; // 한 번 충돌하면 루프 종료
                }
            //}
        }
    },

    
    isColliding(player, drop) {
        return (
            drop.bottom >= player.top &&
            drop.top <= player.bottom && 
            drop.left + drop.width >= player.left && 
            drop.left <= player.left + player.width 
        );
    }
};

// 게임 시작 시 충돌 감지기 가동 
CollisionManager.start();


const RankingService = {
    STORAGE_KEY: 'playerData',

    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("랭킹 로드 실패:", e);
            return [];
        }
    },

    save(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    // 기록 추가 및 상위 5위 반환
    registerScore(nickname, time) {
        const currentRecord = { nickname, time };
        const data = this.load();

        data.push(currentRecord);
        data.sort((a, b) => b.time - a.time); // 내림차순 정렬

        const top5 = data.slice(0, 5);
        this.save(top5);

        return { currentRecord, top5 };
    }
};


const RankingUI = {
    clear() {
        elems.aside.innerHTML = "";
    },

    // DOM 엘리먼트 생성 헬퍼
    createElement(tag, className, text) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text) el.textContent = text;
        return el;
    },

    renderHeader(text, isMyRecord = false) {
        const header = this.createElement("p", "textaside", text);
        header.style.border = "2px solid black";
        if (isMyRecord) header.style.marginTop = "20px";
        elems.aside.appendChild(header);
    },

    renderItem(record, isSelf) {
        let text = `${record.nickname} : ${record.time}초`;
        if (isSelf) text += '  [you]';

        const item = this.createElement("li", "textaside", text);

        if (isSelf) {
            item.style.border = "2px solid red";
            item.style.fontWeight = "bold";
        }
        
        elems.aside.appendChild(item);
        return item;
    },

    renderRetryButton() {
        const btn = this.createElement("button", "", "retry?");
        btn.id = "button"; // 기존 CSS ID 유지
        btn.onclick = () => location.reload(true);
        elems.section.appendChild(btn);
    },

    // 전체 랭킹 화면 그리기 메인 함수
    displayRanking(currentRecord, top5) {
        this.clear();

        // 내 기록
        this.renderHeader(`${currentRecord.nickname}님의 기록\n`, true);
        const myItem = this.renderItem(currentRecord, false);
        myItem.style.marginBottom = "30px";

        // 전체 랭킹
        this.renderHeader("모든 플레이어의 기록\n");
        top5.forEach(record => {
            // 이름이 같고 noname이 아닐 경우 본인으로 간주
            const isSelf = (record.nickname !== 'noname' && record.nickname === currentRecord.nickname);
            this.renderItem(record, isSelf);
        });

        //재시작 버튼
        this.renderRetryButton();
    }
};



   //4. 게임 오버 연출 및 관리 (Director)
   //- theymet 함수와 stopGameSystem을 통합하여 관리
const GameDirector = {
    // 게임 시스템 정지 (내부 호출용)
    stopSystem() {
        state.gameover = true;
        elems.audio.src = ASSETS.audioEnd;
        
        CollisionManager.stop();
        // 적 숨기기
        Array.from(elems.drops).forEach(el => el.style.display = "none");
    },

    // 플레이어 피격 시 흔들림 효과
    async playShakeEffect() {
        for (let i = 0; i < 10; i++) {
            player.move(-1);
            await wait(50);
            player.move(1);
            await wait(50);
        }
    },

    // 게임 오버 메인 시퀀스 (theymet 대체)
    async handleGameOver() {
        // 1. 시스템 정지
        this.stopSystem();

        // 2. 흔들림 효과
        await this.playShakeEffect();

        // 3. 사망 이미지 변경
        await wait(1000);
        player.setSkin(ASSETS.playerGameover, "9vw");

        // 4. 배경 변경 및 플레이어 숨김
        await wait(2000);
        elems.knightbox.style.visibility = "hidden";
        elems.videobox.style.visibility = "hidden";
        document.body.style.backgroundImage = ""
        elems.section.style.backgroundImage = `url('${ASSETS.bgImageLose}')`;;
        elems.section.style.backgroundSize = "70% 100%"
        // 5. 랭킹 데이터 처리 및 렌더링
        const currentNickname = elems.nickname.innerHTML;
        const { currentRecord, top5 } = RankingService.registerScore(currentNickname, state.counttime);
        
        RankingUI.displayRanking(currentRecord, top5);
    }
};
