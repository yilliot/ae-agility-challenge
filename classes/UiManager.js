module.exports = class UiManager{
  constructor(ctrl)
  {
    this.ctrl = ctrl;
    this.initEvent();
  }

  initEvent()
  {
    let that = this;

    // 01 Screen Savaer
    $('#btn-to-waiting').click(function(){
      that.ctrl.gotoWaiting();
    })
  }

  initComEvent(ports)
  {
    let that = this;
    ports.forEach(function(port){
      $('#s01-select-port .container')
        .append('<button class="ui fluid basic button com" data-comname="' + port.comName + '">' + port.comName + '</button>');
    });

    $('.com').click(function(){
      let name = $(this).data('comname');
      that.ctrl.connectComPort(name);
      that.ctrl.loginUser()
    });
  }
}