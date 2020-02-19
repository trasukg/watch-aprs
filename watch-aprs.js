#!/usr/bin/env node

/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

/*
  This is a command-line utility to monitor and print out APRS packets from a
  TCP KISS device, like an instance of the DireWolf sound card modem, or a port
  that's been shared out by 'share-tnc'
*/
var path=require('path');
var util=require('util');
var ax25utils=require('utils-for-aprs').ax25utils;
var SocketKISSFrameEndpoint=require('utils-for-aprs').SocketKISSFrameEndpoint;
var APRSProcessor=require('utils-for-aprs').APRSProcessor;
var moment = require('moment');

console.log("process.argv=" + process.argv);

if (process.argv.length != 3) {
  console.log("Usage: watch-aprs <host>:<port>");
  return;
}

var res=/([^\:]+):([0-9]+)/.exec(process.argv[2]);
if(!res) {
  console.log("Usage: watch-aprs <host>:<port>", path.basename(process.argv[1]));
}
var host=res[1];
var port=res[2];

/*
  The pipeline is sort of like this:
    Endpoint -> APRSProcessor -> Console
*/

//Create the endpoint
var endpoint=new SocketKISSFrameEndpoint();
endpoint.host=host;
endpoint.port=port;
var aprsProcessor=new APRSProcessor();

// When we get data on the aprsProcessor, show it on the console.
aprsProcessor.on('aprsData', function(frame) {
  frame.receivedAt=moment().format();

  console.log( "[" + frame.receivedAt + "] " + ax25utils.addressToString(frame.source) +
    '->' + ax25utils.addressToString(frame.destination) +
    ' (' + ax25utils.repeaterPathToString(frame.repeaterPath) + ')' +
    ((frame.forwardingSource!=undefined)?(
      " via " + ax25utils.addressToString(frame.forwardingSource) +
      '->' + ax25utils.addressToString(frame.forwardingDestination) +
      ' (' + ax25utils.repeaterPathToString(frame.forwardingRepeaterPath) + ')')
      : '') +
    frame.info);
});
aprsProcessor.on('error', function(err, frame) {
  console.log("Got error event:" + err);
  console.log("Frame is:" + JSON.stringify(frame));
});

// The endpoint provides de-escaped KISS frames.  Pass them on to the aprsProcessor


// Log interesting events...
endpoint.on('connect', function(connection) {
  console.log("Connected to port " + endpoint.port);
  connection.on('data', function(frame) {
    aprsProcessor.data(frame);
  });
  connection.on('disconnect', function() {
    console.log('Lost connection');
  });
});



// Turn on the endpoint.  It will attempt to connect in a persistent fashion.
endpoint.enable();
