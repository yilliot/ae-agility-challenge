module.exports = class FirebaseManager {
  constructor(firebase, ctrl)
  {
    this.ctrl = ctrl;
    var config = {
      apiKey: "AIzaSyDY2koLmpABB65fwaf0HHhBfzuK6mc_jRc",
      authDomain: "ae-aglity-challenge.firebaseapp.com",
      databaseURL: "https://ae-aglity-challenge.firebaseio.com",
      projectId: "ae-aglity-challenge",
      storageBucket: "ae-aglity-challenge.appspot.com",
      messagingSenderId: "302554562396"
    };
    firebase.initializeApp(config);

    this.auth = firebase.auth();
    this.database = firebase.database();

    var that = this;
    this.auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log('user login : ' + user.email);
        that.ctrl.onDisconnected() // EVENT INIT
        that.ctrl.onOpponentData() // EVENT INIT

        that.ctrl.gotoScreenSaver()
      }
    });
  }

  loginUser(player) {
    let email = 'user' + player + '@mail.io';
    let pass = 'user' + player + '@mail.io';
    let promise = this.auth.signInAndRetrieveDataWithEmailAndPassword(email, pass);
    promise.catch(e => { console.log(e.message); });
  }
  logoutUser() {
    this.auth.signOut();
  }

  updatePlayerStage(player, stage)
  {
    console.log(player + ' changed stage' + stage);
    this.database
      .ref('users/' + player)
      .update({
        stage: stage
      });
  }

  onPlayerData(player)
  {
    let that = this;
    this.database
      .ref('users/' + player)
      .on('value', function(snapshot){
        that.ctrl.updateOpponentPlayerData(snapshot.val());
      });
  }

  onDisconnected(player)
  {
    this.database.ref('users/' + player).onDisconnect().update({
      stage: 0
    })
  }


}