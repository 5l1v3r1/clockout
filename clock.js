(function() {

  var TRANSITION_DURATION = 2000;
  var FALLBACK_FPS = 30;

  function Clock() {
    this._hourHand = document.getElementById('hour-hand');
    this._minuteHand = document.getElementById('minute-hand');

    this._hour = 0;
    this._minute = 0;

    this._transitionStart = null;
    this._transitionFrom = 0;
    this._transitionTo = 0;

    this.setTime(0, 0);
  }

  Clock.prototype.setTime = function(hour, minute) {
    var minuteAngle = minute * 360 / 60;
    var hourAngle = (hour%12)*360/12 + minuteAngle/12;
    this._hourHand.setAttribute('transform', 'rotate(' +
      hourAngle.toFixed(3) + ')');
    this._minuteHand.setAttribute('transform', 'rotate(' +
      minuteAngle.toFixed(3) + ')');
    this._hour = hour;
    this._minute = minute;
  };

  Clock.prototype.transitionToTime = function(hour, minute) {
    var wasAnimating = (this._transitionStart !== null);
    this._transitionStart = new Date().getTime();
    this._transitionFrom = this._hour*60 + this._minute;
    this._transitionTo = hour*60 + minute;
    if (!wasAnimating) {
      this._requestAnimationFrame();
    }
  };

  Clock.prototype._animationFrame = function() {
    var elapsed = Math.max(new Date().getTime()-this._transitionStart, 0);
    var done = (elapsed >= TRANSITION_DURATION);
    var percent = done ? 1 : this._ease(elapsed / TRANSITION_DURATION);

    var midTime = (this._transitionTo-this._transitionFrom)*percent +
      this._transitionFrom;
    var hour = Math.floor(midTime / 60);
    var minute = midTime % 60;
    this.setTime(hour, minute);

    if (!done) {
      this._requestAnimationFrame();
    } else {
      this._transitionStart = null;
    }
  };

  Clock.prototype._ease = function(t) {
    // Code taken from https://github.com/mietek/ease
    if (t <= 0) {
      return 0;
    } else if (t >= 1) {
      return 1;
    }
    var a =  1.0042954579734844;
    var b = -6.4041738958415664;
    var c = -7.2908241330981340;
    return a * Math.exp(b * Math.exp(c * t));
  };

  Clock.prototype._requestAnimationFrame = function() {
    if ('requestAnimationFrame' in window) {
      window.requestAnimationFrame(this._animationFrame.bind(this));
    } else {
      setTimeout(this._animationFrame.bind(this), 1000/FALLBACK_FPS);
    }
  };

  window.app.Clock = Clock;

})();
