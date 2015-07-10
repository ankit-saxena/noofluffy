/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';
var unirest = require('unirest');
var noodle = require('noodlejs');
var _ = require('lodash');
var extractor = require('unfluff');
var async = require('async');
var request = require('request');
var Thing = require('./thing.model');

// Get list of things
exports.index = function(req, res) {
  Thing.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};


exports.query = function(req,res){
  
  var queries = {
    url: 'http://google.com/search?q='+req.params.querystring,
    type: 'html',
    selector: 'h3.r a',
    extract: ['text','href']
  }
      
      noodle.query(queries).then(function (data) {
      //console.log(JSON.stringify(results));
      noodle.stopCache();
      //res.send(results.results);
      
      var ufRes = [];
      
      var links = data.results[0].results;
      
      async.each(links,function(link,dne){
      
      
      var n = link.href.indexOf('&');
      var url = link.href.substring(7, n != -1 ? n : link.href.length);
      
      
      
      
      //get html response from link
      
      request(url,function(err,response,body){
        
        if(!err && response.statusCode=='200'){
          
        
          var unfluffed = extractor(body);
          
        ufRes.push(unfluffed);      
                              
          // unirest.post("https://textanalysis-text-summarization.p.mashape.com/text-summarizer")
          //       .header("X-Mashape-Key", "ISaRnkbnzMmshoQOGteKgACKwk0vp1mgIUyjsn5xeMB8NOY62c")
          //       .header("Content-Type", "application/json")
          //       .header("Accept", "application/json")
          //       .send({"url":"http://en.wikipedia.org/wiki/Automatic_summarization","text":unfluffed.text,"sentnum":4})
          //       .end(function (result) {
                  
                  
          //                   console.log(result.status, result.headers, result.body);
                            
                            
          //                   unfluffed.summary = result.status==200 ? result.body.sentences : "Mashape query error";
          //                   ufRes.push(unfluffed);      
          //                   dne();
                  
          //       });
          
        }
        
        dne();
        
      });
      
      },function(err){
        
        
        res.send(ufRes);
        
      });
      
      
      
      
    });
  
}

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}