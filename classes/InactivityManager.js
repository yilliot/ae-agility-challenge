module.exports = class InactivityManager {

  constructor() {
    this.idle_interval = null;
    this.seconds_to_timeout = 10;
    this.timeoutAction = () => {};
  }

  start(seconds_to_timeout, timeoutAction) {

    this.idle_time = 0;
    this.seconds_to_timeout = seconds_to_timeout;
    this.timeoutAction = timeoutAction;
    console.log('im.start')

    //Increment the idle time counter every seconds.
    this.idle_interval = setInterval(() => { this.timerIncrement() }, 1000); // 1 seconds

    //Zero the idle timer on mouse movement.
    $(document).mousemove((e) => {
      this.idle_time = 0;
    });
    $(document).keypress((e) => {
      this.idle_time = 0;
    });
  }

  zeroIdeaTimer() {
    this.idle_time = 0;
  }

  timerIncrement() {
      this.idle_time = this.idle_time + 1;
      console.log('im:count-' + this.idle_time);
      if (this.idle_time >= this.seconds_to_timeout) {
        console.log('im.trigger done!');
        clearInterval(this.idle_interval);
        this.timeoutAction();
      }
  }
}