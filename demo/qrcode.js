var QRCode = require('qrcode')
var canvas = document.getElementById('canvas')
 
QRCode.toCanvas(
  canvas,
  'QEASC2aafweFAWE@3',
  {
    // 'scale' : 100
    'width' : 940
  },
  function (error) {
  if (error) console.error(error)
  console.log('success!');
})