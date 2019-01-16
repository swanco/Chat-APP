var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

mongoose.promise = Promise

var dbURL="mongodb://User:mongo123@ds159208.mlab.com:59208/swanco"

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))



var Message = mongoose.model('Message', {
    name: String,
    message:String
})
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
   
})

app.post('/messages', async (req, res) => {
    try{
        var message = new Message(req.body)
        var savedMessage = await message.save()
    
        console.log("saved")
        var findMessage= await Message.findOne({message:'badword'})
  
    
        if(findMessage)
            await Message.deleteOne({_id:findMessage.id})
        else
        io.emit('message', req.body)

        res.sendStatus(200)
    }
    catch(error){
        res.sendStatus(500)
        console.error(error)
    }
   
  

        
    })
    


io.on('connection',(socket)=>{
    console.log("user connected")
})


mongoose.connect(dbURL, { useNewUrlParser: true }, (err) => {
    console.log("Mongo Connected",err)
})
var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})