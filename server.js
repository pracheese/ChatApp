var express = require('express');
var parser = require('body-parser');

var app = express();

var http = require('http').Server(app)
var io = require('socket.io')(http)

var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(parser.json())
app.use(parser.urlencoded({extended:false}))

const dburl = 'mongodb+srv://pracheese:P0ppyj0hn@pracheese-3hhi1.mongodb.net/test?retryWrites=true&w=majority'

const Message = mongoose.model('Message', {
    name: String,
    message: String
})

let messages = [
    {name:'Prachi', message:'Hello'},
    {name:'Satish', message:'Hi'}
]

app.get('/messages',(req,res) => {
    Message.find({},(err, messages) => {
        res.send(messages)
    })
})

app.post('/messages',(req,res) => {
    let message = new Message(req.body)

    message.save((err) => {
        if(err)
            sendStatus(500)
        messages.push(req.body);
        io.emit('message',req.body);
        res.sendStatus(200)
    })

})

io.on('connection',(socket) => {
    console.log('a user connected')
})

mongoose.connect(dburl,{ useUnifiedTopology: true, useNewUrlParser: true },(err) => {
    console.log("mongoDB connection", err)
        
})

var server = http.listen(5000, () => {
    console.log('Server is listening to port', server.address().port)
})