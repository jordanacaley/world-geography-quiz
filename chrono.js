export class Chronometer {
  constructor() {
    this.currentTime = 0;
    this.intervalId = 0;
  }

  startClick(callback) {
    this.intervalId = setInterval(() => {
      this.currentTime++;
      if (callback) {
        callback();
      }
    }, 1000);
  }

  getMinutes() {
    return Math.floor(this.currentTime / 60);
  }

  getSeconds() {
    return this.currentTime % 60;
  }

  twoDigitsNumber(num) {
    if (num < 10) {
      num = "0" + num;
    } 
    return num;
  }

  stopClick() {
    clearInterval(this.intervalId);
  }
  
  resetClick() {
    this.currentTime = 0;
  }

  splitClick(minutes, seconds) {
    minutes = this.getMinutes();
    seconds = this.getSeconds();
    return `${this.twoDigitsNumber(minutes)}:${this.twoDigitsNumber(seconds)}`;
  }
}