const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const request = require("request");
const https = require("https");
const { METHODS } = require("http");
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"))

const apiKey = "399a172790827796daa09da6cf881ebc-us18";
const uniqueID = "38fb3669d5";

app.get("/",function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req, res){
    var firstName = req.body.f;
    var lastName = req.body.l;
    var userEmail = req.body.e;
    var data = {
        members: [
            {
                email_address : userEmail,
                status : "subscribed",
                merge_fields: {
                    FNAME : firstName,
                    LNAME : lastName
                }
                
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us18.api.mailchimp.com/3.0/lists/38fb3669d5";
    const options = {
        method : "POST",
        auth: "jerwin1:399a172790827796daa09da6cf881ebc-us18"
    }
    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
            // console.log(response.statusCode);
        })

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
})