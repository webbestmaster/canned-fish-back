const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app); // eslint-disable-line new-cap
const io = require('socket.io')(http);
const port = process.env.PORT || 3000; // eslint-disable-line no-process-env

app.use(express.static(path.join(__dirname, '/../canned-fish-front/dist/')));

io.on('connection', socket => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
});

http.listen(port, () => {
    console.log('listening on *:' + port);
});
