"use strict";
var express = require('express');
var app = express();
var http = require('http');
var httpserver = http.Server(app);
var fs = require('fs');
var windows1252 = require('windows-1252');
app.use(express.static('public'));

function readFiles(next){
    var synonymes, cliques, coordonnees;
    fs.readFile('171019_154123_90.syn', function(err, data) {  
      
      if (err) throw err;
      data = data.toString('binary');
      synonymes = windows1252.decode(data);
      synonymes = synonymes.split('\n');
      
      fs.readFile('171019_154123_90.cli', 'utf8', function(err, data) {

        if (err) throw err;
        cliques = data.split('\n');
        cliques.pop();
        for (var i = 0; i < cliques.length; i++) {
          cliques[i] = cliques[i].split(",");
        }
        
        fs.readFile('171019_154123_90.jva', 'utf8', function(err, data) {

          if (err) throw err;
          coordonnees = data.split('\n');
          for (var j = 0; j < coordonnees.length; j++) {
            coordonnees[j] = coordonnees[j].split(" ");
          }
          next({synonymes, cliques, coordonnees});
        });
      });
    });
}

readFiles(function(result){

  //binds words with their coords :
  /*for (var i = 0; i < result.synonymes.length; i++) {
    result.synonymes[i] =  {
      mot : result.synonymes[i],
      coord : result.coordonnees[i + result.cliques.length]
    };
  }*/

  //binds cliques with their coords and words :
  /*for (var i = 0; i < result.cliques.length; i++) {
    var clique =  {
      mots : []
    };
    for (var j = 0; j < result.cliques[i].length; j++) {
      var b = parseInt(result.cliques[i][j], 10) - 1;
      clique.mots[j] = b;
    }
    result.cliques[i] = clique;
  }*/

  app.get('/data', function (req, res) {
    res.json({result});
  });
});

app.get('/', function (req, res) {
  var options = {
    root: __dirname + '/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  res.sendFile('espsem.html', options, function(err){
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent');
    }
  });
});

app.get('/2', function (req, res) {
  var options = {
    root: __dirname + '/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  res.sendFile('espsem2.html', options, function(err){
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent');
    }
  });
});

app.get('/3', function (req, res) {
  var options = {
    root: __dirname + '/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  res.sendFile('espsem3.html', options, function(err){
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent');
    }
  });
});

httpserver.listen(8084, 'localhost', function () {
  
  console.log('ok');

});







