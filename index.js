'use strict';
import fs from 'fs';
import dgram from 'dgram';
import {Buffer} from 'buffer';
import bencode from '@substrate-system/bencode';

// Read the torrent file and decode it
const torrent = bencode.decode(fs.readFileSync('puppy.torrent'), 'utf8');

// Extract the announce URL from the torrent metadata
const announceUrl = new URL(torrent.announce.toString('utf8'));

//create a UDP socket
const socket = dgram.createSocket('udp4');

// create a buffer to hold the message to be sent
const message = Buffer.from('Hello, tracker!');
console.log(`this is the message: ${message}`);

//send the message to the tracker using the socket
socket.send(message, 0, message.length, announceUrl.port, announceUrl.hostname, (err) => {
  if (err) {
    console.error(`Error sending message: ${err}`);
  }
}); 

// checks if the socket receives a message and logs it to the console
socket.on('message', (msg, rinfo) => {
  console.log(`Received message from ${rinfo.address}:${rinfo.port}`);
  console.log(msg);
});

// checks if the socket encounters an error and logs it to the console
socket.on('error', (err) => {
  console.error(`Socket error:\n${err.stack}`);
  socket.close();
});

// checks to see if the socket is listening and logs it to the console
socket.on('listening', () => {
  const address = socket.address();
  console.log(`Socket listening on ${address.address}:${address.port}`);
});

//bind the socket to a specific port (6881) and logs it to the console
//socket.bind(6881);
