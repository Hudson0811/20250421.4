let menu;
let subMenu; // 子選單容器
let balls = []; // 多個彈跳球物件
let trailLayer; // 拖尾圖層
let floatingBalls = []; // 浮現球的效果
let introOverlay; // 自我介紹的覆蓋層
let danmaku = []; // 儲存彈幕的陣列
let iframeContainer; // 全局變數，用於存放嵌入的 iframe 容器

function setup() {
  // 設定畫布大小為視窗大小
  createCanvas(windowWidth, windowHeight);

  // 初始化拖尾圖層
  trailLayer = createGraphics(windowWidth, windowHeight);
  trailLayer.clear(); // 確保拖尾圖層是透明的

  // 初始化多個彈跳球
  for (let i = 0; i < 20; i++) {
    balls.push(new Ball(random(width), random(height), random(20, 50), random(2, 5), random(2, 5)));
  }

  // 建立選單按鈕
  createMenu();

  // 每隔一段時間新增彈幕
  setInterval(() => {
    danmaku.push({
      x: 0, // 從畫布左側開始
      y: random(height * 0.1, height * 0.9), // 隨機高度，避免靠近邊界
      speed: random(2, 5), // 隨機速度
      text: "花生", // 彈幕文字
      color: color(random(150, 255), random(150, 255), random(150, 255)) // 隨機顏色
    });

    // 限制彈幕數量，避免占用太多畫面
    if (danmaku.length > 20) {
      danmaku.shift();
    }
  }, 500); // 每 500 毫秒新增一個彈幕
}

function draw() {
  // 清除畫布，保持透明背景
  clear();

  // 更新拖尾圖層（逐漸淡出）
  trailLayer.fill(0, 0, 0, 50); // 使用透明黑色覆蓋，製造淡出效果
  trailLayer.rect(0, 0, width, height);

  // 更新並顯示所有彈跳球
  for (let ball of balls) {
    ball.update();
    ball.display();

    // 繪製拖尾到拖尾圖層
    trailLayer.fill(ball.color);
    trailLayer.ellipse(ball.x, ball.y, ball.r * 2);

    // 檢查滑鼠是否在球上
    if (dist(mouseX, mouseY, ball.x, ball.y) < ball.r) {
      ball.accelerate(2); // 當滑鼠在球上時，球加速 2 秒
    }
  }

  // 顯示拖尾圖層
  image(trailLayer, 0, 0);

  // 滑鼠互動效果：隨滑鼠移動產生光暈
  fill(255, 255, 255, 150); // 提高光暈透明度
  ellipse(mouseX, mouseY, 100, 100); // 放大光暈尺寸

  // 更新並顯示浮現正方形效果
  updateFloatingSquares();

  // 更新並顯示彈幕
  updateDanmaku();
}

function updateFloatingSquares() {
  // 新增一個浮現正方形
  if (frameCount % 10 === 0) { // 每 10 幀新增一個浮現正方形
    floatingBalls.push({
      x: random(width * 0.1, width * 0.9), // 隨機位置，避免靠近邊界
      y: random(height * 0.1, height * 0.9),
      size: random(20, 50), // 隨機大小
      color: color(random(150, 255), random(150, 255), random(150, 255), 180) // 半透明顏色
    });

    // 如果浮現正方形超過 10 個，刪除最舊的一個
    if (floatingBalls.length > 10) {
      floatingBalls.shift();
    }
  }

  // 繪製所有浮現正方形
  for (let square of floatingBalls) {
    fill(square.color);
    rect(square.x, square.y, square.size, square.size); // 使用 rect 繪製正方形
  }
}

function updateDanmaku() {
  textSize(24); // 設定文字大小
  textAlign(LEFT, CENTER); // 文字靠左對齊，垂直置中
  for (let d of danmaku) {
    fill(d.color);
    text(d.text, d.x, d.y); // 繪製彈幕文字
    d.x += d.speed; // 彈幕向右移動

    // 如果彈幕超出畫布右側，將其移除
    if (d.x > width) {
      danmaku.splice(danmaku.indexOf(d), 1);
    }
  }
}

function createMenu() {
  // 建立選單容器
  menu = createDiv();
  menu.id('menu');
  menu.style('position', 'absolute');
  menu.style('top', '20px');
  menu.style('left', '20px');
  menu.style('background', 'rgba(255, 255, 255, 0.9)'); // 更高透明度的背景
  menu.style('padding', '10px');
  menu.style('border-radius', '8px');
  menu.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)');
  menu.style('z-index', '10'); // 確保選單在最上層

  // 新增首頁按鈕
  let homeButton = createButton('首頁').parent(menu);
  homeButton.style('width', '120px'); // 設定按鈕寬度
  homeButton.style('height', '40px'); // 設定按鈕高度
  homeButton.style('margin-bottom', '5px'); // 增加按鈕間距
  homeButton.style('font-size', '16px'); // 調整字體大小
  homeButton.mousePressed(() => {
    // 清除畫布並重置背景和彈跳球
    balls = []; // 清空彈跳球陣列
    trailLayer.clear(); // 清除拖尾圖層
    for (let i = 0; i < 20; i++) {
      balls.push(new Ball(random(width), random(height), random(20, 50), random(2, 5), random(2, 5)));
    }

    // 移除嵌入的 iframe 容器（如果存在）
    if (iframeContainer) {
      iframeContainer.remove();
      iframeContainer = null; // 清空變數
    }

    // 移除自我介紹覆蓋層（如果存在）
    if (introOverlay) {
      introOverlay.remove();
      introOverlay = null; // 清空變數
    }

    // 提示用戶已回到首頁
    alert('回到首頁！');
  });

  // 新增自我介紹按鈕
  let introButton = createButton('自我介紹').parent(menu);
  introButton.style('width', '120px');
  introButton.style('height', '40px');
  introButton.style('margin-bottom', '5px');
  introButton.style('font-size', '16px');
  introButton.mousePressed(() => {
    // 建立自我介紹的覆蓋層
    introOverlay = createDiv();
    introOverlay.style('position', 'fixed');
    introOverlay.style('top', '50%');
    introOverlay.style('left', '50%');
    introOverlay.style('transform', 'translate(-50%, -50%)');
    introOverlay.style('width', '60%'); // 長方形寬度
    introOverlay.style('padding', '20px');
    introOverlay.style('background', 'rgba(0, 0, 0, 0.8)'); // 半透明黑色背景
    introOverlay.style('color', 'white'); // 白色文字
    introOverlay.style('border-radius', '10px');
    introOverlay.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)');
    introOverlay.style('text-align', 'center'); // 文字置中
    introOverlay.style('z-index', '20'); // 確保在最上層

    // 新增標題
    let title = createElement('h2', '自我介紹').parent(introOverlay);
    title.style('margin-bottom', '20px'); // 增加標題與內文的間距

    // 新增內文
    let content = createP('你好，我叫賴渙升，基隆人，今年18歲，可以叫我花生。').parent(introOverlay);
    content.style('font-size', '18px'); // 調整內文字體大小
    content.style('line-height', '1.6'); // 增加行距，方便閱讀

    // 新增關閉按鈕
    let closeButton = createButton('關閉').parent(introOverlay);
    closeButton.style('margin-top', '20px');
    closeButton.style('padding', '10px 20px');
    closeButton.style('background', '#f44336');
    closeButton.style('color', 'white');
    closeButton.style('border', 'none');
    closeButton.style('border-radius', '5px');
    closeButton.style('cursor', 'pointer');
    closeButton.mousePressed(() => introOverlay.remove());
  });

  // 新增教學影片按鈕
  let videoButton = createButton('教學影片').parent(menu);
  videoButton.style('width', '120px');
  videoButton.style('height', '40px');
  videoButton.style('margin-bottom', '5px');
  videoButton.style('font-size', '16px');
  videoButton.mousePressed(() => {
    // 建立影片容器
    let videoContainer = createDiv();
    videoContainer.style('position', 'fixed');
    videoContainer.style('top', '50%');
    videoContainer.style('left', '50%');
    videoContainer.style('transform', 'translate(-50%, -50%)');
    videoContainer.style('width', '80%'); // 設置寬度為視窗的 80%
    videoContainer.style('height', '60%'); // 設置高度為視窗的 60%
    videoContainer.style('background', 'rgba(0, 0, 0, 0.8)'); // 半透明背景
    videoContainer.style('border-radius', '10px');
    videoContainer.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)');
    videoContainer.style('z-index', '20'); // 確保在最上層

    // 新增影片元素
    let video = createElement('video');
    video.attribute('src', '20250324_092538.mp4'); // 指定影片檔案
    video.attribute('controls', 'true'); // 顯示播放控制
    video.attribute('autoplay', 'true'); // 自動播放
    video.style('width', '100%'); // 影片寬度填滿容器
    video.style('height', '100%'); // 影片高度填滿容器
    video.parent(videoContainer);

    // 新增關閉按鈕
    let closeButton = createButton('關閉').parent(videoContainer);
    closeButton.style('position', 'absolute');
    closeButton.style('top', '10px');
    closeButton.style('right', '10px');
    closeButton.style('padding', '10px 20px');
    closeButton.style('background', '#f44336');
    closeButton.style('color', 'white');
    closeButton.style('border', 'none');
    closeButton.style('border-radius', '5px');
    closeButton.style('cursor', 'pointer');
    closeButton.style('z-index', '21');
    closeButton.mousePressed(() => videoContainer.remove());
  });

  // 建立子選單容器（預設隱藏）
  subMenu = createDiv();
  subMenu.id('subMenu');
  subMenu.style('position', 'absolute');
  subMenu.style('top', '0px'); // 子選單初始位置
  subMenu.style('left', '0px'); // 與父容器對齊
  subMenu.style('background', 'rgba(255, 255, 255, 0.9)');
  subMenu.style('padding', '5px');
  subMenu.style('border-radius', '8px');
  subMenu.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)');
  subMenu.style('display', 'none'); // 預設隱藏
  subMenu.style('z-index', '11'); // 確保子選單在選單上方

  // 子選單按鈕
  let button1 = createButton('作品集1').parent(subMenu);
  button1.style('width', '120px'); // 放大按鈕寬度
  button1.style('margin-bottom', '5px'); // 增加按鈕間距
  button1.mousePressed(() => {
    // 嵌入網站 iframe
    if (iframeContainer) iframeContainer.remove(); // 移除之前的 iframe
    iframeContainer = createDiv();
    iframeContainer.style('position', 'fixed');
    iframeContainer.style('top', '50%');
    iframeContainer.style('left', '50%');
    iframeContainer.style('transform', 'translate(-50%, -50%)');
    iframeContainer.style('width', '80%');
    iframeContainer.style('height', '80%');
    iframeContainer.style('background', 'white');
    iframeContainer.style('border', '1px solid #ccc');
    iframeContainer.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)');
    iframeContainer.style('z-index', '20');

    let iframe = createElement('iframe');
    iframe.attribute('src', 'https://hudson0811.github.io/20250324/');
    iframe.attribute('width', '100%');
    iframe.attribute('height', '100%');
    iframe.attribute('frameborder', '0');
    iframe.parent(iframeContainer);

    // 新增關閉按鈕
    let closeButton = createButton('關閉').parent(iframeContainer);
    closeButton.style('position', 'absolute');
    closeButton.style('top', '10px');
    closeButton.style('right', '10px');
    closeButton.style('padding', '10px 20px');
    closeButton.style('background', '#f44336');
    closeButton.style('color', 'white');
    closeButton.style('border', 'none');
    closeButton.style('border-radius', '5px');
    closeButton.style('cursor', 'pointer');
    closeButton.style('z-index', '21');
    closeButton.mousePressed(() => {
      iframeContainer.remove();
      iframeContainer = null; // 清空變數
    });
  });

  let button2 = createButton('作品集2').parent(subMenu);
  button2.style('width', '120px'); // 放大按鈕寬度
  button2.style('margin-bottom', '5px'); // 增加按鈕間距
  button2.mousePressed(() => {
    // 嵌入網站 iframe
    if (iframeContainer) iframeContainer.remove(); // 移除之前的 iframe
    iframeContainer = createDiv();
    iframeContainer.style('position', 'fixed');
    iframeContainer.style('top', '50%');
    iframeContainer.style('left', '50%');
    iframeContainer.style('transform', 'translate(-50%, -50%)');
    iframeContainer.style('width', '80%');
    iframeContainer.style('height', '80%');
    iframeContainer.style('background', 'white');
    iframeContainer.style('border', '1px solid #ccc');
    iframeContainer.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)');
    iframeContainer.style('z-index', '20');

    let iframe = createElement('iframe');
    iframe.attribute('src', 'https://hudson0811.github.io/20250317/');
    iframe.attribute('width', '100%');
    iframe.attribute('height', '100%');
    iframe.attribute('frameborder', '0');
    iframe.parent(iframeContainer);

    // 新增關閉按鈕
    let closeButton = createButton('關閉').parent(iframeContainer);
    closeButton.style('position', 'absolute');
    closeButton.style('top', '10px');
    closeButton.style('right', '10px');
    closeButton.style('padding', '10px 20px');
    closeButton.style('background', '#f44336');
    closeButton.style('color', 'white');
    closeButton.style('border', 'none');
    closeButton.style('border-radius', '5px');
    closeButton.style('cursor', 'pointer');
    closeButton.style('z-index', '21');
    closeButton.mousePressed(() => {
      iframeContainer.remove();
      iframeContainer = null; // 清空變數
    });
  });

  let button3 = createButton('作品集3').parent(subMenu);
  button3.style('width', '120px'); // 放大按鈕寬度
  button3.style('margin-bottom', '5px'); // 增加按鈕間距
  button3.mousePressed(() => {
    // 嵌入網站 iframe
    if (iframeContainer) iframeContainer.remove(); // 移除之前的 iframe
    iframeContainer = createDiv();
    iframeContainer.style('position', 'fixed');
    iframeContainer.style('top', '50%');
    iframeContainer.style('left', '50%');
    iframeContainer.style('transform', 'translate(-50%, -50%)');
    iframeContainer.style('width', '80%');
    iframeContainer.style('height', '80%');
    iframeContainer.style('background', 'white');
    iframeContainer.style('border', '1px solid #ccc');
    iframeContainer.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)');
    iframeContainer.style('z-index', '20');

    let iframe = createElement('iframe');
    iframe.attribute('src', 'https://hudson0811.github.io/20250303/');
    iframe.attribute('width', '100%');
    iframe.attribute('height', '100%');
    iframe.attribute('frameborder', '0');
    iframe.parent(iframeContainer);

    // 新增關閉按鈕
    let closeButton = createButton('關閉').parent(iframeContainer);
    closeButton.style('position', 'absolute');
    closeButton.style('top', '10px');
    closeButton.style('right', '10px');
    closeButton.style('padding', '10px 20px');
    closeButton.style('background', '#f44336');
    closeButton.style('color', 'white');
    closeButton.style('border', 'none');
    closeButton.style('border-radius', '5px');
    closeButton.style('cursor', 'pointer');
    closeButton.style('z-index', '21');
    closeButton.mousePressed(() => {
      iframeContainer.remove();
      iframeContainer = null; // 清空變數
    });
  });

  let button4 = createButton('作品集4').parent(subMenu);
  button4.style('width', '120px'); // 放大按鈕寬度
  button4.style('margin-bottom', '5px'); // 增加按鈕間距
  button4.mousePressed(() => {
    // 嵌入網站 iframe
    if (iframeContainer) iframeContainer.remove(); // 移除之前的 iframe
    iframeContainer = createDiv();
    iframeContainer.style('position', 'fixed');
    iframeContainer.style('top', '50%');
    iframeContainer.style('left', '50%');
    iframeContainer.style('transform', 'translate(-50%, -50%)');
    iframeContainer.style('width', '80%');
    iframeContainer.style('height', '80%');
    iframeContainer.style('background', 'white');
    iframeContainer.style('border', '1px solid #ccc');
    iframeContainer.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)');
    iframeContainer.style('z-index', '20');

    let iframe = createElement('iframe');
    iframe.attribute('src', 'https://hudson0811.github.io/20250303/');
    iframe.attribute('width', '100%');
    iframe.attribute('height', '100%');
    iframe.attribute('frameborder', '0');
    iframe.parent(iframeContainer);

    // 新增關閉按鈕
    let closeButton = createButton('關閉').parent(iframeContainer);
    closeButton.style('position', 'absolute');
    closeButton.style('top', '10px');
    closeButton.style('right', '10px');
    closeButton.style('padding', '10px 20px');
    closeButton.style('background', '#f44336');
    closeButton.style('color', 'white');
    closeButton.style('border', 'none');
    closeButton.style('border-radius', '5px');
    closeButton.style('cursor', 'pointer');
    closeButton.style('z-index', '21');
    closeButton.mousePressed(() => {
      iframeContainer.remove();
      iframeContainer = null; // 清空變數
    });
  });

  // 將子選單綁定到「作品」按鈕
  let portfolioButton = createButton('作品').parent(menu);
  portfolioButton.style('width', '120px'); // 與「自我介紹」按鈕寬度一致
  portfolioButton.style('height', '40px'); // 與「自我介紹」按鈕高度一致
  portfolioButton.style('margin-bottom', '5px'); // 增加按鈕間距
  portfolioButton.style('font-size', '16px');

  // 顯示子選單
  portfolioButton.mouseOver(() => {
    subMenu.style('display', 'block');
    subMenu.style('top', `${portfolioButton.elt.offsetTop + portfolioButton.elt.offsetHeight}px`); // 將子選單顯示在按鈕下方
    subMenu.style('left', `${portfolioButton.elt.offsetLeft}px`); // 將子選單與按鈕對齊
  });

  // 隱藏子選單
  portfolioButton.mouseOut(() => {
    setTimeout(() => {
      if (!subMenu.matches(':hover')) {
        subMenu.style('display', 'none');
      }
    }, 200); // 延遲隱藏，避免滑鼠快速移動導致子選單消失
  });

  // 子選單保持顯示
  subMenu.mouseOver(() => subMenu.style('display', 'block'));
  subMenu.mouseOut(() => subMenu.style('display', 'none'));

  // 新增測驗卷按鈕
  let quizButton = createButton('測驗卷').parent(menu);
  quizButton.style('width', '120px'); // 與其他按鈕寬度一致
  quizButton.style('height', '40px'); // 與其他按鈕高度一致
  quizButton.style('margin-bottom', '5px'); // 增加按鈕間距
  quizButton.style('font-size', '16px'); // 調整字體大小
  quizButton.mousePressed(() => {
    // 嵌入 iframe
    let iframeContainer = createDiv();
    iframeContainer.style('position', 'fixed'); // 使用 fixed 讓 iframe 固定在視窗中
    iframeContainer.style('top', '50%'); // 設置 iframe 的位置為視窗中間
    iframeContainer.style('left', '50%');
    iframeContainer.style('transform', 'translate(-50%, -50%)'); // 將容器中心對齊
    iframeContainer.style('width', '80%'); // 設置寬度為視窗的 80%
    iframeContainer.style('height', '80%'); // 設置高度為視窗的 80%
    iframeContainer.style('background', 'white');
    iframeContainer.style('border', '1px solid #ccc');
    iframeContainer.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)');
    iframeContainer.style('z-index', '20'); // 確保 iframe 在最上層

    let iframe = createElement('iframe');
    iframe.attribute('src', 'https://hudson0811.github.io/20250310/');
    iframe.attribute('width', '100%');
    iframe.attribute('height', '100%');
    iframe.attribute('frameborder', '0');
    iframe.parent(iframeContainer);

    // 新增關閉按鈕
    let closeButton = createButton('關閉').parent(iframeContainer);
    closeButton.style('position', 'absolute');
    closeButton.style('top', '10px');
    closeButton.style('right', '10px');
    closeButton.style('padding', '10px 20px');
    closeButton.style('background', '#f44336');
    closeButton.style('color', 'white');
    closeButton.style('border', 'none');
    closeButton.style('border-radius', '5px');
    closeButton.style('cursor', 'pointer');
    closeButton.style('z-index', '21');
    closeButton.mousePressed(() => iframeContainer.remove());
  });
}

// 當視窗大小改變時，動態調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // 重新調整拖尾圖層大小
  trailLayer = createGraphics(windowWidth, windowHeight);
  trailLayer.clear(); // 確保拖尾圖層是透明的
}

// 彈跳球類別
class Ball {
  constructor(x, y, r, dx, dy) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = dx;
    this.dy = dy;
    this.color = color(random(255), random(255), random(255), 200); // 隨機顏色
    this.accelerationTimer = 0; // 加速計時器
  }

  update() {
    // 如果加速計時器大於 0，則加速
    if (this.accelerationTimer > 0) {
      this.accelerationTimer--;
    } else {
      this.dx = constrain(this.dx, -5, 5); // 恢復到原始速度範圍
      this.dy = constrain(this.dy, -5, 5);
    }

    this.x += this.dx;
    this.y += this.dy;

    // 碰撞邊界反彈
    if (this.x - this.r < 0 || this.x + this.r > width) {
      this.dx *= -1;
    }
    if (this.y - this.r < 0 || this.y + this.r > height) {
      this.dy *= -1;
    }

    // 檢查與其他球的碰撞
    for (let other of balls) {
      if (other !== this) {
        let distBetween = dist(this.x, this.y, other.x, other.y);
        if (distBetween < this.r + other.r) {
          // 簡單的碰撞處理：交換速度方向
          let tempDx = this.dx;
          let tempDy = this.dy;
          this.dx = other.dx;
          this.dy = other.dy;
          other.dx = tempDx;
          other.dy = tempDy;

          // 防止球重疊，將它們稍微分開
          let angle = atan2(this.y - other.y, this.x - other.x);
          let overlap = (this.r + other.r) - distBetween;
          this.x += cos(angle) * overlap / 2;
          this.y += sin(angle) * overlap / 2;
          other.x -= cos(angle) * overlap / 2;
          other.y -= sin(angle) * overlap / 2;
        }
      }
    }
  }

  display() {
    // 繪製球
    fill(this.color);
    ellipse(this.x, this.y, this.r * 2);
  }

  accelerate(seconds) {
    this.dx *= 1.5; // 加速
    this.dy *= 1.5;
    this.accelerationTimer = frameRate() * seconds; // 設置加速持續時間
  }
}