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

    this.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('user login : ' + user.email);

        // ON DISCONECTED EVENT
        this.database
          .ref('users/' + this.ctrl.pm.config_player_id)
          .onDisconnect()
          .update({stage: 0})

        // ON OPPONENET UPDATE EVENT
        this.database
          .ref('users/' + this.ctrl.pm.getOpponentConfigPlayerId())
          .on('value', (snapshot) => {
            this.ctrl.updateOpponentPlayerData(snapshot.val());
          });

        // ON HISCORE EVENT
        this.database
          .ref('scores')
          .orderByChild('score')
          .limitToLast(3)
          .on('child_added', (snapshot) => {
            this.ctrl.ui.updateHiScore(snapshot);
          });

        this.ctrl.gotoScreenSaver()
        // this.ctrl.startGameAI()
      }
    });
  }

  // AUTH
  loginUser(player) {
    let email = 'user' + player + '@mail.io';
    let pass = 'user' + player + '@mail.io';
    let promise = this.auth.signInAndRetrieveDataWithEmailAndPassword(email, pass);
    promise.catch(e => { console.log(e.message); });
  }
  logoutUser() {
    this.auth.signOut();
  }

  // USER
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
  updateUserAttribute(user, key, value) {
    let data = {};
    data[key] = value;
    this.database
      .ref('users/' + user)
      .update(data);
  }


  // PLAYER
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

  saveScores(data) {
    console.log('new score');
    this.database
      .ref('scores/' + data.id)
      .update(data);
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
        callback(code);
        // is dispensed
        // that.database.ref('codes/' + code + '/isDispensed').set(true);
        that.database.ref('codes/' + code + '/type').set('dispensedAgile');
      });
  }

  uploadBlob(player_id, blob) {
    var camRef = this.storage.ref('players/' + player_id + '.jpg');
    camRef.put(blob).then((snapshot) => {
      camRef.getDownloadURL().then((url) => {
        this.ctrl.updateUserPhotoUrl(url);
        console.log('Uploaded image : ' + url);
      });
    });
  }

}