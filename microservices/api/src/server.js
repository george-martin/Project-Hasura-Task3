var express = require('express');
var app = express();
var router = express.Router();

var server = require('http').Server(app);

var fetchAction = require('node-fetch');

var fs = require('file-system');

var path = require("path");

var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.send("heyyy");
})
app.get('/logout',function(req,res){ 
var auth_token = req.body.data.auth_token;
var url = "https://auth.biodegrade88.hasura-app.io/v1/user/logout";

var authority = "Bearer " + auth_token;
// If you have the auth token saved in offline storage
// var authToken = window.localStorage.getItem('HASURA_AUTH_TOKEN');
// headers = { "Authorization" : "Bearer " + authToken }
var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": authority
      }
  };

    fetchAction(url, requestOptions)
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      console.log(result);
      
	    res.send(result);
    })
    .catch(function(error) {
      console.log('Request Failed:' + error);
    });
  
})

app.post('/profile',function(req,res){
  var auth_token = req.body.data.auth_token;
  var authority = "Bearer " + auth_token;
  var url = "https://auth.biodegrade88.hasura-app.io/v1/user/info";
  var requestOptions = {
    "method": "GET",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": authority
    }
  };
  fetchAction(url, requestOptions)
  .then(function(response) {
    return response.json();
    })
  .then(function(result) {
    var userId = result.hasura_id;
    var username = result.username;
    var userurl = "https://data.biodegrade88.hasura-app.io/v1/query";
    var userrequestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json",
          "Authorization": authority
        }
      };
      var body = {
        "type": "select",
        "args": {
            "table": "files",
            "columns": [
                "fileid",
                "filename"
            ],
            "where": {
                "userid": {
                    "$eq": userId
                  }
                }
            }
        };
        userrequestOptions.body = JSON.stringify(body);

        fetchAction(userurl, userrequestOptions)
        .then(function(resp) {
          return resp.json();
          })
        .then(function(reslt) {
          var userinfo = {}
          userinfo.username = username;
          userinfo.files = reslt;
          console.log(userinfo);
          res.send(userinfo);
          })
        .catch(function(error) {
          console.log('Request Failed:' + error);
          });
      })
  .catch(function(error) {
    console.log('Request Failed:' + error);
    });
  
});


app.post('/login',function(req,res){
  var url = "https://auth.biodegrade88.hasura-app.io/v1/login";
  var sign_email= req.body.data.username;
  var sign_pass= req.body.data.password;
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
      }
  };
  var body = {
    "provider": "username",
    "data": {
        "username": sign_email,
        "password": sign_pass
      }
  };
  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
    return response.json();
    })
  .then(function(result) {
    res.send(result)  
    })
  .catch(function(error) {
    console.log('Request Failed:' + error);
   });
});

app.post('/signup',function(req,res){
  var url = "https://auth.biodegrade88.hasura-app.io/v1/signup";

  var sign_email= req.body.data.username;
  var sign_pass= req.body.data.password;
var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    }
};

var body = {
    "provider": "username",
    "data": {
        "username": sign_email,
        "password": sign_pass
    }
};

requestOptions.body = JSON.stringify(body);

fetchAction(url, requestOptions)
.then(function(response) {
	return response.json();
})
.then(function(result) {
  res.send(result);  
})
.catch(function(error) {
	console.log('Request Failed:' + error);
});

});


app.post('/upload',function(req,res){
  let sampleFile = req.files.sampleFile.data;
  var file_name = req.body.file_name;
  var authority = "Bearer " + auth_token;
  console.log(sampleFile)
  var type = req.files.sampleFile.mimetype;
  console.log(type)
  var url = "https://filestore.biodegrade88.hasura-app.io/v1/file";
  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-type" : type,
      "Authorization": authority
    },
    body: sampleFile
  }
  fetchAction(url, requestOptions)
  .then(function(response) {
    
    return response.json();
  })
  .then(function(result) {
    console.log(result);
    var file_id = result.file_id;
    var user_id = result.user_id;
    var fileurl = "https://data.biodegrade88.hasura-app.io/v1/query";
    var filerequestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json",
          "Authorization": authority
      }
  };
  var body = {
    "type": "insert",
    "args": {
        "table": "files",
        "objects": [
            {
                "fileid": file_id,
                "userid": user_id,
                "filename": file_name
            }
          ]
      }
    };
    filerequestOptions.body = JSON.stringify(body);

    fetchAction(fileurl, filerequestOptions)
    .then(function(resp) {
      return resp.json();
      })
    .then(function(reslt) {
      res.send(reslt)
      })
    .catch(function(error) {
      console.log('Request Failed:' + error);
      });
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
  });
})
// Uncomment to add a new route which returns hello world as a JSON
// app.get('/json', function(req, res) {
//   res.json({
//     message: 'Hello world'
//   });
// });

/*app.get('/download',function(req,res){
  
  var auth_token = "e7dbfd4b4d50992f26227d9200567bcf1ca42d51b0d81297";
  var authority = "Bearer " + auth_token;
  var fileid = "9a09f50d-8682-4c81-8cce-fc42f673ad5e"//req.body.fileid;  
  var url = "https://filestore.concavity27.hasura-app.io/v1/file/" + fileid;
  var userurl = "https://auth.concavity27.hasura-app.io/v1/user/info";
  var userrequestOptions = {
    "method": "GET",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": authority
    }
  };
  fetchAction(userurl, userrequestOptions)
  .then(function(userresponse) {
    return userresponse.json();
    })
    .then(function(userresult) {
      var userId = userresult.hasura_id;
      var furl = "https://data.concavity27.hasura-app.io/v1/query";
      var frequestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": authority
          }
        };
        var body = {
          "type": "select",
          "args": {
              "table": "files",
              "columns": [
                  "userid"
                  
              ],
              "where": {
                  "fileid": {
                      "$eq": fileid
                    }
                  }
              }
          };
          frequestOptions.body = JSON.stringify(body);
          fetchAction(furl, frequestOptions)
          .then(function(fresp) {
            return fresp.json();
          })
          .then(function(freslt) {
            var fileuserid = freslt[0].userid;
            if(fileuserid === userId){
              var requestOptions = {
                "method": "GET",
                "headers": {
                    "Authorization": authority
                }
            };
        
            fetchAction(url, requestOptions)
            .then(function(response){
              
              res.send(response);
            })
        
            .catch(function(error) {
              console.log('Request Failed:' + error);
            });
            }
            else{
                res.send("no")
            }
          })
          .catch(function(error) {
            console.log('Request Failed:' + error);
          });
    })
    .catch(function(error) {
      console.log('Request Failed:' + error);
    });
  
});
*/


// custom 404 page
app.use(function(req, res){
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');
});

// custom 500 page1
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
