const express = require('express');
const fs = require('fs');
const { port } = require('./config'); // port defines at file .env
const rateLimit = require('express-rate-limit');

// express server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

// logging middleware
app.use((req, res, next) => {
  var log = 'IP address is: ' + req.ip;

  // write to a new file named log.txt
  fs.writeFile('log.txt', log, err => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    // console.log('File saved!');
  });
  next();
});

// get sum of inputs
app.post('/api/sum', (req, res) => {
  var sum = 0;

  for (var key in req.body) {
    // itterates through the given array
    for (var i = 0; i < req.body[key].length; i++) {
      // converts all array inputs to float
      sum = sum + parseFloat(req.body[key][i]);
    }
    //console.log(`value for ${key} is ${sum}`);
  }

  res.status(200).send({
    success: true,
    error: null,
    stack: null,
    result: sum || null
  });
});

// get sqrt of inputs
app.post('/api/sqrt', (req, res) => {
  var sqrt = {};

  for (var key in req.body) {
    // itterates through the given array
    for (var i = 0; i < req.body[key].length; i++) {
      // converts all array inputs to float then takes their absolute values up to 4 decimal points
      sqrt[i] = parseFloat(Math.sqrt(Math.abs(req.body[key][i])).toFixed(4));
    }
    //console.log(`value for ${key} is ${sqrt[key]}`);
  }

  res.status(200).send({
    success: true,
    error: null,
    stack: null,
    result: sqrt || null
  });
});

// get acronym of inputs
app.post('/api/acronym', (req, res) => {
  var acronym = '';

  for (var key in req.body) {
    // itterates through the given array
    for (var i = 0; i < req.body[key].length; i++) {
      // skips two letter words
      if (req.body[key][i].length > 2) {
        // converts all to capital
        acronym += req.body[key][i][0].toUpperCase();
      } else {
        continue;
      }
    }
    //console.log(`value for ${key} is ${acronym}`);
  }

  // add dots between letters
  acronym = acronym.split('').join('.');

  res.status(200).send({
    success: true,
    error: null,
    stack: null,
    result: acronym || null
  });
});

// check for contained substrings
app.post('/api/contained', (req, res) => {
  // collect values from json object
  var arrValues = Object.values(req.body);

  // incomplete
  for (var key in req.body) {
    for (var i = 0; i < req.body[key].length; i++) {
      // add two series of characters
      var x = arrValues[0][0].toString() + arrValues[0][1].toString();
      //third series of characters
      var y = arrValues[1].toString();
      // checkes if string contains substring
      var contained = x.includes(y);
    }
    //console.log(`value for ${key} is ${contained}`);
  }

  // different approach
  // for (var key in req.body) {
  //   for (var i = 0; i < req.body[key].length; i++) {
  //     // add two series of characters
  //     var z = arrValues[0][0].toString() + arrValues[0][1].toString();
  //     var x = new RegExp(z);
  //     //third series of characters
  //     var y = arrValues[1].toString();
  //     // checkes if string contains regex expression
  //     var contained = x.test(y);
  //   }
  //   //console.log(`value for ${key} is ${contained}`);
  // }

  res.status(200).send({
    success: true,
    error: null,
    stack: null,
    result: contained
  });
});

// get all routes
app.get('/api', (req, res) => {
  var routes = '';

  app._router.stack.forEach(function(r) {
    if (r.route && r.route.path) {
      routes = routes + 'http://localhost:3000' + r.route.path + ', ';
    }
  });

  res.status(200).send({
    routes: routes || null
  });
});

// server runs at port 3000
app.listen(port, () => console.log(`Server running on port: ${port}`));
