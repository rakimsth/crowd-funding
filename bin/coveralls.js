#!/usr/bin/env node
 
'use strict';
 
const { handleInput } = require('..');
 
process.stdin.resume();
process.stdin.setEncoding('utf8');
 
let input = '';
 
process.stdin.on('data', chunk =&gt; {
 input += chunk;
});
 
process.stdin.on('end', () =&gt; {
 handleInput(input, err =&gt; {
   if (err) {
     throw err;
   }
 });
});