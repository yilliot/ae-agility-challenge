module.exports = class FirebaseManager {
  constructor(firebase, ctrl, config)
  {
    this.Firebase = firebase;
    this.ctrl = ctrl;
    var config = {
      apiKey: config.api_key,
      authDomain: config.auth_domain,
      databaseURL: config.database_url,
      projectId: config.project_id,
      storageBucket: config.storage_bucket,
      messagingSenderId: config.messaging_sender_id
    };
    firebase.initializeApp(config);

    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();

    var that = this;
    this.auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log('user login : ' + user.email);
        that.ctrl.onDisconnected() // EVENT INIT
        that.ctrl.onOpponentData() // EVENT INIT

        that.ctrl.gotoScreenSaver()
        // that.ctrl.startGameAI()
      }
    });
  }
  getQrCode(callback) {
    console.log('Calling Qr Code');
    let that = this;
    this.database.ref('codes')
      .orderByChild('type')
      .equalTo('agile')
      .limitToFirst(1)
      .once('value', function(snapshot) {
        let code = Object.keys(snapshot.val())[0];
        console.log(code);
        callback(code);
        // is dispensed
        // that.database.ref('codes/' + code + '/isDispensed').set(true);
        // that.database.ref('codes/' + code + '/type').set('dispensedAgile');
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
  resetUser(user) {
    this.database
      .ref('users/' + user)
      .update({
        player_id: null,
        player_photo_url: null,
        player_name: null,
        is_winner : null,
        score : null,
      });
  }
  updatePlayerStage(player, stage)
  {
    this.database
      .ref('users/' + player)
      .update({
        stage: stage
      });
  }
  updateUserAttribute(user, key, value) {
    let data = {};
    data[key] = value;
    this.database
      .ref('users/' + user)
      .update(data);
  }

  uploadBlob(player_id, blob)
  {
    var camRef = this.storage.ref('players/' + player_id + '.jpg');
    camRef.put(blob).then((snapshot) => {
      camRef.getDownloadURL().then((url) => {
        this.ctrl.updateUserPhotoUrl(url);
        console.log('Uploaded image : ' + url);
      });
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

  newPlayer()
  {
    console.log('new player');
    let newPlayerRef = this.database.ref('players').push();
    newPlayerRef.set({
      'created_at' : this.Firebase.database.ServerValue.TIMESTAMP,
      'photo' : null,
      'name' : null,
      'email' : null,
      'qrcode' : null
    });
    return newPlayerRef.getKey();
  }
  updatePlayerAttribute(player, key, value) {
    let data = {};
    data[key] = value;
    this.database
      .ref('players/' + player)
      .update(data);
  }

}