/* Comme on n'a pas de composant pour faire office de micro, nous utilisons ce code
 disponible en libre service pour utiliser le micro de notre ordinateur */

 //On a éditez légrement le code pour qu'il soit adapté a nos benoins.

// Code by : https://codepen.io/travisholliday/pen/gyaJk


//------------------------- Debut du code de travisholliday :--------------------------//
let valeurMic = 0;

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
if (navigator.getUserMedia) {
  navigator.getUserMedia({
      audio: true
    },
    function(stream) {
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);
      javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);

      var canvasContext = document.getElementById('canvas');
      canvasContext = canvasContext.getContext('2d');

      javascriptNode.onaudioprocess = function() {
          var array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          var values = 0;

          var length = array.length;
          for (var i = 0; i < length; i++) {
            values += (array[i]);
          }
/****************** debut modification  ***********************/
          let average = values / length;

          canvasContext.clearRect(0,0, 500, 500);

          canvasContext.strokeStyle = '#F0E68C';
          canvasContext.beginPath();
          canvasContext.ellipse(250, 250, average*4, average*4, 0,0, 2 * Math.PI, false);
          canvasContext.stroke();

          canvasContext.fillStyle = '#F0E68C';
          canvasContext.lineWidth = 10;
          canvasContext.beginPath();
          canvasContext.ellipse(250, 250, average*2, average*2, 0,0, 2 * Math.PI, false);
          canvasContext.fill();
        
          valeurMic = Math.round(average);
          canvasContext.fillText(valeurMic, 250, 250);
/****************** fin modification  ***********************/        
        }
    },
    function(err) {
      console.log("The following error occured: " + err.name)
    });
} else {
  console.log("getUserMedia not supported");
}

//------------------------- Fin du code de travisholliday :--------------------------//

function envoieInfo(){
  console.log("val mic : ",valeurMic);
  fetch('http://localhost:3000/postMic',{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method:'POST',
    body:'{"valeurMic":'+valeurMic+'}',
  });
}

setInterval(envoieInfo,3000);