"use strict";
var express = require('express');
var app = express();
var http = require('http');
var httpserver = http.Server(app);
var decode = require('urldecode')
var fs = require('fs');
var windows1252 = require('windows-1252');
app.use(express.static('public'));
app.set('views', './views')
app.set('view engine', 'pug')

var dico;

function readFiles(next){
    
    fs.readFile('dicovisu_171204.new', function(err, data) {  
      
      if (err) throw err;
      data = data.toString('binary');
      data = windows1252.decode(data);
      data = data.split('\n');
      
      for (var i = 0; i < data.length; i++) {
        data[i] = data[i].split(':');
        if(data[i][1] != undefined){
          data[i][1] = data[i][1].split(',');
          data[i][1].push(data[i][0]);
          data[i][1].sort();
        }else{
          data[i][1] = "";
        }

      }

      dico = new Map(data);
      data= null;

      fs.readFile("indexclic_171204.visu",  function(err, data2) {
        if (err) throw err;
        data2 = data2.toString('binary');
        data2 = windows1252.decode(data2);
        data2 = data2.split('\n');
        for (var j = 0; j < data2.length; j++) {
          data2[j] = data2[j].split(",");
          dico.set(data2[j][0], {
            mot : data2[j][0],
            synonymes : dico.get(data2[j][0]),
            nbClic : data2[j][1],
            indexClic : data2[j][2],
          });
        }
        data2=null;
        console.log("loading dico...");
    fs.readFile("clicmemo_171204.visu",  function(err, data3) {
          
          if (err) throw err;
          data3 = data3.toString('binary');
          data3 = windows1252.decode(data3);
          var splice;
          var cliques;
          dico.forEach(function(valeur, clé) {
            splice = data3.substr(valeur.indexClic);
            cliques = splice.split('\n', valeur.nbClic);
            splice=null;
            for (var i = 0; i < cliques.length; i++) {
              cliques[i] = cliques[i].split(",");
            }
            valeur.cliques = cliques;
          });
          splice=null;
          data3=null;
          
    fs.readFile("indexacp_171204.extr",  function(err, data4) {
          
         if (err) throw err;
          data4 = data4.toString('binary');
          data4 = windows1252.decode(data4);
          data4 = data4.split('\n');
          for (var j = 0; j < data4.length; j++) {
            data4[j] = data4[j].split(",");
            var a = dico.get(data4[j][0]);
            a.coordPos = data4[j][2];
            a.coordNbLine = data4[j][1]
            dico.set(data4[j][0], a);
          }
          data4=null;
          fs.readFile("acpmemo_171204.extr",  function(err, data5) {
          if (err) throw err;
          data5 = data5.toString('binary');
          var splice;
          var coords;
          dico.forEach(function(valeur, clé) {
            splice = data5.substr(valeur.coordPos);
            coords = splice.split('\n', valeur.coordNbLine);
            for (var i = 0; i < coords.length; i++) {
              coords[i]= coords[i].split(',');
            }
            splice=null;
            valeur.coords = coords;
          });
          data5=null;
         console.log("ok");
          next(dico);
        });
        });
        });
        });
    
    });
}

readFiles(function(result){});

app.get('/data/*', function (req, res) {
    
    
    let mot = req.originalUrl.split("/");
    mot = mot[mot.length - 1];
    mot = decode(mot);
    let date = new Date(Date.now());
    date = date.toString();
    console.log("Nouvelle requete espsem pour : \n mot : " + mot + "\n IP : " + req.ip + " \n date : " + date);
    
    if(dico.has(mot)){
      res.json(dico.get(mot));
    }else{
      res.json("ERROR WORD DOESN'T EXIST");
    }
   });
app.get('/*', function (req, res) {
  req = req.originalUrl.split("/");
  req = req[req.length - 1];
  if(req==""){
    req = 'lien';
  }
  req = decode(req);
  if(dico.has(req)){
      res.render('espsem', {word : req});
    }else{
      res.send(req + " n'est pas dans le DES")
    }
});



httpserver.listen(8085, 'localhost', function () {
  console.log('Server ouvert');
});







