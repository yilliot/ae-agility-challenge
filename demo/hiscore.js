(function() {
  // firebase config
  var config = {
    apiKey: "AIzaSyDY2koLmpABB65fwaf0HHhBfzuK6mc_jRc",
    authDomain: "ae-aglity-challenge.firebaseapp.com",
    databaseURL: "https://ae-aglity-challenge.firebaseio.com",
    projectId: "ae-aglity-challenge",
    storageBucket: "ae-aglity-challenge.appspot.com",
    messagingSenderId: "302554562396"
  };
  firebase.initializeApp(config);

  let database = firebase.database();

  let last_3 = database.ref('players').orderByChild('score').limitToLast(3);

  last_3.on('child_added', function(data) {
    console.log(data.key);
    console.log(data.val());
  });

})();