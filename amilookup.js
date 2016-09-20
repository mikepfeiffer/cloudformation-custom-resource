'use strict';

var AWS = require('aws-sdk');

exports.handler = function(event, context) {
    var ec2 = new AWS.EC2({region: event.ResourceProperties.Region});

    var params = {
        Filters: [
            {
                Name: 'name',
                Values: [
                    event.ResourceProperties.OSType
                ]            
            }       
        ],
        Owners: ["amazon"]        
    };

    var responseStatus = "FAILED";
    var responseData = {};    

    ec2.describeImages(params, function(err, data){
        if(err){
            console.log(err.message);
        }
        else {
            var imageResult = data.Images;
            var sortedImages = imageResult.sort(function(a,b){
                var dateA = new Date(a.CreationDate), dateB = new Date(b.CreationDate);
                return dateB-dateA;
            });
            responseStatus = "SUCCESS";
            responseData["Id"] = sortedImages[0].ImageId;
        }
        sendResponse(event, context, responseStatus, responseData);
    });
}

function sendResponse(event, context, responseStatus, responseData) {
 
    var responseBody = JSON.stringify({
        Status: responseStatus,
        Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
        PhysicalResourceId: context.logStreamName,
        StackId: event.StackId,
        RequestId: event.RequestId,
        LogicalResourceId: event.LogicalResourceId,
        Data: responseData
    });
 
    console.log("RESPONSE BODY:\n", responseBody);
 
    var https = require("https");
    var url = require("url");
 
    var parsedUrl = url.parse(event.ResponseURL);
    var options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: "PUT",
        headers: {
            "content-type": "",
            "content-length": responseBody.length
        }
    };
 
    console.log("SENDING RESPONSE...\n");
 
    var request = https.request(options, function(response) {
        console.log("STATUS: " + response.statusCode);
        console.log("HEADERS: " + JSON.stringify(response.headers));
        // Tell AWS Lambda that the function execution is done  
        context.done();
    });
 
    request.on("error", function(error) {
        console.log("sendResponse Error:" + error);
        // Tell AWS Lambda that the function execution is done  
        context.done();
    });
  
    // write data to request body
    request.write(responseBody);
    request.end();
}