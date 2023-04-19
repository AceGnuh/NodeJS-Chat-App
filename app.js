const createError = require('http-errors');
const http = require('http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('express-session');
const cookie = require('cookie-parser')
const socketio = require('socket.io');

var app = express();

global.user;

const Message = require('./models/message.js');

const _passport = require('./utils/passport.js')

const credential = require('./credentials.js')

const connection = require('./utils/database.js')
connection()

const PORT = 3000

var indexRouter = require('./routes/index')
var authRouter = require('./routes/auth.js')
var accountRouter = require('./routes/account.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secret: 'secret'
    })
)

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const httpServer = app.listen(PORT, function() {
    console.log('Listening on port: ' + PORT);
})

const io = socketio(httpServer)

io.on('connection', client => {
    //console.log('Socket id connected: ' + client.id);
    var friend;

    client._id = global.user.data._id.toString();
    client.name = global.user.data.name;
    client.loginAt = global.user.loginAt;
    client.free = true;

    let users = Array.from(io.sockets.sockets.values())
        .map(socket => {
            return {
                id: socket.id,
                name: socket.name,
                _id: socket._id.toString(),
                loginAt: socket.loginAt,
                free: true
            }
        })

    client.emit('list-users', users)

    client.broadcast.emit('new-user', {
        id: client.id,
        name: client.name,
        _id: client._id.toString(),
        loginAt: client.loginAt,
        free: true
    });

    client.on("private message", ({ to, message }) => {
        //console.log("data message", to, message)
        friend = users.find(user => user.id === to)
        let me = users.find(user => user.id === client.id)

        console.log("friend", friend)
        console.log("me", me)

        // new Message({
        //     userId1: user1._id,
        //     userId2: user2._id,
        //     message: message,
        // }).save();

        client.to(to).emit("private message", {
            from: client.id,
            message: message,
        });
    });

    client.on("typing", ({ to, name }) => {
        client.to(to).emit("typing", {
            from: client.id,
            name: name,
        })
    });

    client.on('disconnect', () => {
        console.log(`user id: ${client.id} disconnected`);
        client.broadcast.emit('user-leave', {
            id: client.id,
            name: client.name
        })
    });
})