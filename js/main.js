var app = angular.module('pomodoroApp', []);
app.controller('ctrl', function($scope, $interval) {
  'use strict';
  $scope.breakLength = 5;
  $scope.sessionLength = 25;
  $scope.sessionType = 'Session';
  $scope.timeLeft = $scope.sessionLength;
  $scope.fillHeight = '0%';

  var timerRunning = false;
  var secs = 60 * $scope.timeLeft;
  $scope.originalTime = $scope.sessionLength;

  function displayTimeRemaining(d) {
    d = Number(d);
    var hours = Math.floor(d / 3600);
    var minutes = Math.floor(d % 3600 / 60);
    var seconds = Math.floor(d % 3600 % 60);
    return (
      (hours > 0 ? hours + ':' + (minutes < 10 ? '0' : '') : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    );
  }

  $scope.sessionIncrement = function(time) {
    if (!timerRunning) {
      if ($scope.sessionType === 'Session') {
        $scope.sessionLength += time;
        if ($scope.sessionLength < 1) {
          $scope.sessionLength = 1;
        }
        $scope.timeLeft = $scope.sessionLength;
        $scope.originalTime = $scope.sessionLength;
        secs = 60 * $scope.sessionLength;
      }
    }
  }

  $scope.breakIncrement = function(time) {
    if (!timerRunning) {
      $scope.breakLength += time;
      if ($scope.breakLength < 1) {
        $scope.breakLength = 1;
      }
      if ($scope.sessionType === 'Break!') {
        $scope.timeLeft = $scope.breakLength;
        $scope.originalTime = $scope.breakLength;
        secs = 60 * $scope.breakLength;
      }
    }
  }

  $scope.timerStartStop = function() {
    if (!timerRunning) {
      if ($scope.currentName === 'Session') {
        $scope.currentLength = $scope.sessionLength;
      } else {
        $scope.currentLength = $scope.breakLength;
      }
      updateTimer();
      timerRunning = $interval(updateTimer, 1000);
    } else {
      $interval.cancel(timerRunning);
      timerRunning = false;
    }
  }

  function updateTimer() {
    secs -= 1;
    if (secs < 0) {
      var wav = 'http://www.oringz.com/oringz-uploads/sounds-917-communication-channel.mp3';
      var audio = new Audio(wav);
      audio.play();

      $scope.fillColor = '#333';
      if ($scope.sessionType === 'Break!') {
        $scope.sessionType = 'Session';
        $scope.currentLength = $scope.sessionLength;
        $scope.timeLeft = 60 * $scope.sessionLength;
        $scope.originalTime = $scope.sessionLength;
        secs = 60 * $scope.sessionLength;
      } else {
        $scope.sessionType = 'Break!';
        $scope.currentLength = $scope.breakLength;
        $scope.timeLeft = 60 * $scope.breakLength;
        $scope.originalTime = $scope.breakLength;
        secs = 60 * $scope.breakLength;
      }
    } else {
      if ($scope.sessionType === 'Break!') {
        $scope.fillColor = '#E88B8B';
      } else {
        $scope.fillColor = '#7DE891';
      }
      $scope.timeLeft = displayTimeRemaining(secs);

      var totalTime = 60 * $scope.originalTime;
      var perc = Math.abs((secs / totalTime) * 100 - 100);
      $scope.fillHeight = perc + '%';
    }
  }
});
