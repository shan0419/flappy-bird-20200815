// 用对象收编变量
// x = 0



var bird = {
  skyPosition: 0,
  skyStep: 2,
  birdTop: 235,
  startColor: 'blue',

  // birdX: 0,
  init: function () {
    this.initData();
    this.animate();
  },
  initData: function () {
    // this ？ bird
    // bird.
    this.el = document.getElementById('game');
    this.oBird = this.el.getElementsByClassName('bird')[0];
    this.oStart = this.el.getElementsByClassName('start')[0];
  },
  animate: function () {
    var count = 0;
    var self = this;

    setInterval(function () {
      self.skyMove();

      if(++ count % 10 === 0) {
        self.birdJump();
        self.startBound();
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
  startBound: function () {
    var prevColor = this.startColor;
    this.startColor = this.startColor === 'blue' ? 'white' : 'blue';

    this.oStart.classList.remove('start-' + prevColor);
    this.oStart.classList.add('start-' + this.startColor);
  },
};



bird.init();