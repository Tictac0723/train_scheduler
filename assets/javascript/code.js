 $(document).ready(function() {

     var config = {
         apiKey: "AIzaSyBpLY9KNCjR4fSF8MBtwS7KjZPw1M8_gdU",
         authDomain: "train-scheduler-ea318.firebaseapp.com",
         databaseURL: "https://train-scheduler-ea318.firebaseio.com",
         projectId: "train-scheduler-ea318",
         storageBucket: "train-scheduler-ea318.appspot.com",
         messagingSenderId: "777883440477"
     };

     firebase.initializeApp(config);

     var database = firebase.database();

     var trainName = "";
     var destination = "";
     var frequency = "";
     var nextTrain= "";
     var minutesAway = "";

     $("#button").on("click", function() {
         event.preventDefault();

         trainName = $("#trainInput").val().trim();
         destination = $("#destinationInput").val().trim();
         frequency = $("#frequencyInput").val().trim();
         firstTrain = $("#timeInput").val().trim();

         
         database.ref().push({
             train: trainName,
             destination: destination,
             frequency: frequency,
             firstTrain: firstTrain
         });

         alert("Train added!");

         $("#trainInput").val("");
         $("#destinationInput").val("");
         $("#frequencyInput").val("");
         $("#timeInput").val("");
     });

     database.ref().on("child_added", function(childSnapshot, prevChildKey) {
     	 var frequency = childSnapshot.val().frequency;
         var firstTrain = childSnapshot.val().firstTrain;
         var trainName = childSnapshot.val().train;
         var destination = childSnapshot.val().destination;

         var nextTrain = calculateArrivalTime(firstTrain, frequency);
         var minutesTillTrain =  calculateMinutesTillTrain(firstTrain, frequency);

         $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrain +"</td><td>" + minutesTillTrain + "</td></tr>");
     });

     function calculateArrivalTime (firstTrain, frequency) {
         var minutesTillTrain = calculateMinutesTillTrain(firstTrain, frequency);
         console.log(minutesTillTrain);
         var nextTrain = moment().add(minutesTillTrain, "minutes");
         var formatedTrainTime = moment(nextTrain).format("hh:mm");
         console.log("Arrival Time: " + formatedTrainTime);
         return formatedTrainTime;
     }

      function calculateMinutesTillTrain (firstTrain, frequency) {
     	var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
         console.log(firstTimeConverted);
         var currentTime = moment();
         console.log("Current Time: " + moment(currentTime).format("hh:mm"));
         var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
         console.log(timeDifference);
         var timeRemaining = timeDifference % frequency;
         console.log(timeRemaining);
         var minutesTillTrain = frequency - timeRemaining;
         console.log(minutesTillTrain);
         return minutesTillTrain;
     }
});
