

const express = require('express');
var request = require('request');
const path = require('path');
var querystring = require('querystring');

const app = express();

app.use(express.static(path.join(__dirname, '/public')));

var client_id = '5f68501ea370413f8fe5e7c028be3a71'; // Your client id
var client_secret = 'a83f1a0042ba4ba6a5002f874706a62d'; // Your secret
var redirect_uri = 'http://localhost:8080/callback';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email user-library-read';
  
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
      console.log("estou no fim do login")
});

app.get('/callback', function(req, res) {
    console.log("cheguei aqui no callback")
    var code = req.query.code || null;
    var state = req.query.state || null;
  
    if (state === null) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
              if (!error && response.statusCode === 200) {
        
                var access_token = body.access_token,
                    refresh_token = body.refresh_token;
                // window.localStorage.setItem(access_token, access_token);
                console.log(access_token);
                var options = {
                  url: 'https://api.spotify.com/v1/me',
                  headers: { 'Authorization': 'Bearer ' + access_token },
                  json: true
                };
        
                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log("bodyyyyy")
                    console.log(body);
                });
        
                // we can also pass the token to the browser to make requests from there
                res.redirect('http://localhost:8080/index.html?' +
                  querystring.stringify({
                    access_token: access_token ,
                    refresh_token: refresh_token
                  }));
              } else {
                res.redirect('/#' +
                  querystring.stringify({
                    error: 'invalid_token'
                  }));
              }
            });
    console.log("cheguei no fim do callback");
    }
  });
  

app.get('/refresh_token', function(req, res) {

      // requesting access token from refresh token
      var refresh_token = req.query.refresh_token;
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
          grant_type: 'refresh_token',
          refresh_token: refresh_token
        },
        json: true
      };
    
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token;
          res.send({
            'access_token': access_token
          });
        }
      });
    });

 

app.use((req, res) => {
    res.status(404);
    res.send(`<h1>Error 404: We are sorry!</h1> <p>The page you are looking for is not available.</p>`);
})

app.listen(8080, () => {
    console.log("App listening on port 8080");
})