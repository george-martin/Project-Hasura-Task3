import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import { saveOffline, getSavedToken } from './config';
 class Profile extends Component{
    render(){
        var url = "https://api.biodegrade88.hasura-app.io/profile"
        var token = getSavedToken();
        var requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              data: {
                "auth_token" : token
              }
            })
        };
        fetch(url, requestOptions)
        .then(function(response) {
            console.log(response.json());
        })
        .catch(function(error) {
            console.log('Request Failed:' + error);
        });
        return(
            <div>
                <h1>Yes</h1>
            </div>
        )
    }
}

  
export{ 
    Profile
}