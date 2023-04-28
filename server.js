const express = require('express');
const helmet = require('helmet');
const body_parser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
var app = express();
app.use(helmet());
app.use(body_parser.json());
app.use(cors());
app.use(morgan('combined'));
const usersRepo = require('./repos/usersRepo');
const distanceRepo = require('./repos/distanceRepo');

app.get('/listUsers', async function (req, res) {
    const limitData = await usersRepo.getUsers({}, 0);
    res.send(limitData);
    //assert.equal(limitData.length, 3);
//    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
//       console.log( data );
//       res.end( data );
//    });
})
app.post('/nthLevelFriend', async (req, res) => {
    const parameters = req.body;
    const friendId = parameters.friendId;
    const level = parameters.level;
    const friendList = await distanceRepo.friends(friendId, level);
    res.send(friendList);
  });

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})