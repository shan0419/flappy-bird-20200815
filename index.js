// 用对象收编变量
// x = 0

var bird = {
  skyPosition: 0,
  skyStep: 2,
  birdTop: 235,
  startColor: 'blue',
  startFlag: false,
  birdStepY: 0,
  minTop: 0,
  maxTop: 570,
  pipeLength: 7,
  pipeArr: [],
  pipeLastIndex: 6,
  score: 0,
  scoreArr: [],
  // birdX: 0,
  init: function () {
    this.initData();
    this.animate();

    this.handleStart();
    this.handleClick();
    this.handleReStart();

    if(sessionStorage.getItem('play')) {
      this.start();
    }
  },
  initData: function () {
    // this ？ bird
    // bird.
    this.el = document.getElementById('game');
    this.oBird = this.el.getElementsByClassName('bird')[0];
    this.oStart = this.el.getElementsByClassName('start')[0];
    this.oScore = this.el.getElementsByClassName('score')[0];
    this.oMask = this.el.getElementsByClassName('mask')[0];
    this.oEnd = this.el.getElementsByClassName('end')[0];
    this.oFinalScore = this.el.getElementsByClassName('final-score')[0];
    this.oRankList = this.el.getElementsByClassName('rank-list')[0];
    this.oRestart = this.el.getElementsByClassName('restart')[0];


    this.scoreArr = this.getScore();
  },
  getScore: function () {
    var scoreArr = getLocal('score');
    return scoreArr ? scoreArr : [];
  },
  animate: function () {
    var count = 0;
    var self = this;

    this.timer = setInterval(function () {
      self.skyMove();

      if(self.startFlag) {
        self.birdDrop();
        self.pipeMove();
      }

      if(++ count % 10 === 0) {
        if(!self.startFlag) {
          self.startBound();
          self.birdJump();
        }

        self.birdFly(count);
      }

    }, 30)

  },
  skyMove: function () {
    this.skyPosition -= this.skyStep;
    this.el.style.backgroundPositionX = this.skyPosition + 'px';
  },
  birdJump: function () {
    this.birdTop = this.birdTop === 220 ? 260 : 220;
    this.oBird.style.top = this.birdTop + 'px';
  },
  birdFly: function (count) {
    this.oBird.style.backgroundPositionX = count % 3 * -30 + 'px';
  },
  birdDrop: function () {
    this.birdTop += ++ this.birdStepY;
    this.oBird.style.top = this.birdTop + 'px';

    this.judgeKnock();
    this.addScore();
  },
  addScore: function () {
    var index = this.score % this.pipeLength;
    var pipeX = this.pipeArr[index].up.offsetLeft;

    if(pipeX < 13) {
      this.oScore.innerText = ++ this.score;
    }
  },
  judgeKnock: function () {
    this.judgeBoundary();
    this.judgePipe();
  },
  judgeBoundary: function () {
    if(this.birdTop <= this.minTop || this.birdTop >= this.maxTop) {
      this.failGame();
    }
  },
  judgePipe: function () {
    // 0 1 2 3 4 5 6 7 8 9 
    var index = this.score % this.pipeLength;
    var pipeX = this.pipeArr[index].up.offsetLeft;
    var pipeY = this.pipeArr[index].y; // []
    var birdY = this.birdTop;

    if((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
      this.failGame();
    }
  },
  createPipe: function (x) {
    // Math.random() 0-1     0 - 100  50 - 150 50 - 225
    // 上下距离相等 150 
    // （600 - 150） / 2 = 225
    var upHeight = 50 + Math.floor(Math.random() * 175);
    var downHeight = 450 - upHeight;

    var oUpPipe = createEle('div', ['pipe', 'pipe-up'], {
      height: upHeight + 'px',
      left: x + 'px',
    });
    var oDownPipe = createEle('div', ['pipe', 'pipe-down'], {
      height: downHeight + 'px',
      left: x + 'px',
    });

    this.el.appendChild(oUpPipe);
    this.el.appendChild(oDownPipe);

    this.pipeArr.push({
      up: oUpPipe,
      down: oDownPipe,
      y: [upHeight, upHeight + 150 - 30],
    })
  },
  pipeMove: function () {
    for(var i = 0; i < this.pipeLength; i ++) {
      var oUpPipe = this.pipeArr[i].up;
      var oDownPipe = this.pipeArr[i].down;
      var x = oUpPipe.offsetLeft - this.skyStep;

      if(x < -52) {
        var lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
        oUpPipe.style.left = lastPipeLeft + 300 + 'px';
        oDownPipe.style.left = lastPipeLeft + 300 + 'px';

        this.pipeLastIndex = i;

        continue
      }

      oUpPipe.style.left = x + 'px';
      oDownPipe.style.left = x + 'px';

    }
  },
  startBound: function () {
    var prevColor = this.startColor;
    this.startColor = this.startColor === 'blue' ? 'white' : 'blue';

    this.oStart.classList.remove('start-' + prevColor);
    this.oStart.classList.add('start-' + this.startColor);
  },
  handleStart: function () {
    var self = this;
    this.oStart.onclick = this.start.bind(this);
  },
  start: function () {
    var self = this;
    self.startFlag = true;
    self.oStart.style.display = 'none';
    self.oScore.style.display = 'block';
    self.oBird.style.left = '80px';
    self.oBird.style.transition = 'none';
    self.skyStep = 5;

    for(var i = 0; i < self.pipeLength; i ++) {
      self.createPipe(300 *(i + 1));
    }
  },
  handleClick: function () {
    var self = this;
    this.el.onclick = function (e) {
      var dom = e.target;
      var isStart = dom.classList.contains('start');

      if(!isStart) {
        self.birdStepY = -10;
      }

    };
  },
  handleReStart: function () {
    this.oRestart.onclick = function () {
      sessionStorage.setItem('play', true);
      window.location.reload();
    };
  },
  failGame: function () {
    clearInterval(this.timer);
    this.setScore();

    // console.log(JSON.stringify(this.scoreArr));

    this.oMask.style.display = 'block';
    this.oEnd.style.display = 'block';
    this.oBird.style.display = 'none';
    this.oScore.style.display = 'none';
    this.oFinalScore.innerText = this.score;

    this.renderRankList();
  },
  setScore: function () {
    this.scoreArr.push({
      score: this.score,
      time: this.getDate()
    })

    this.scoreArr.sort(function (a, b) {
      return b.score - a.score;
    })

    var scoreLength = this.scoreArr.length;
    this.scoreArr.length = scoreLength > 8 ? 8 : scoreLength;

    setLocal('score', this.scoreArr);
  },
  getDate: function () {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();

    return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
  },
  renderRankList: function () {
    var template = '';

    for(var i = 0; i < this.scoreArr.length; i ++) {
      var scoreObj = this.scoreArr[i];
      var degreeClass = '';
      switch (i) {
        case 0:
          degreeClass = 'first';
          break;
        case 1:
          degreeClass = 'second';
          break;
        case 2:
          degreeClass = 'third';
          break;
      }
      template += `
        <li class="rank-item">
          <span class="rank-degree ${degreeClass}">${i + 1}</span>
          <span class="rank-score">${scoreObj.score}</span>
          <span class="rank-time">${scoreObj.time}</span>
        </li>
      `;
    }

    this.oRankList.innerHTML = template;
  },
};

// dom.innerHTML = ;

var c = 'ccc';
var str = 'a' + c +'b'; // acccb


// ab
var c = 'ccc';
var str = `a${c}b`;



bird.init();

// 8

var score = [
  {
    score: 1,
    time: '2020.8.18 20:48'
  },{
    score: 2,
    time: 'xxx',
  }
];

// 6

// 1 2 3 4 5 6 0 

// < 95
// > 13

// 13 - 95
// upHeight, upHeight + 150
