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
  // birdX: 0,
  init: function () {
    this.initData();
    this.animate();

    this.handleStart();
    this.handleClick();
  },
  initData: function () {
    // this ？ bird
    // bird.
    this.el = document.getElementById('game');
    this.oBird = this.el.getElementsByClassName('bird')[0];
    this.oStart = this.el.getElementsByClassName('start')[0];
    this.oScore = this.el.getElementsByClassName('score')[0];

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
  judgePipe: function () {},
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
    })
  },
  pipeMove: function () {
    for(var i = 0; i < this.pipeLength; i ++) {
      var oUpPipe = this.pipeArr[i].up;
      var oDownPipe = this.pipeArr[i].down;
      var x = oUpPipe.offsetLeft - this.skyStep;


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

    this.oStart.onclick = function () {
      // this == this.oStart
      self.startFlag = true;
      self.oStart.style.display = 'none';
      self.oScore.style.display = 'block';
      self.oBird.style.left = '80px';
      self.oBird.style.transition = 'none';
      self.skyStep = 5;

      for(var i = 0; i < self.pipeLength; i ++) {
        self.createPipe(300 *(i + 1));
      }
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
  failGame: function () {
    console.log('end');
    clearInterval(this.timer);
  },
};



bird.init();