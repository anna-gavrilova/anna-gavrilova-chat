var http = require('http');
const host='127.0.0.1';
const port=process.env.PORT || 3030;
const app=require('./app');
const Log=require('./models/log');

app.set("port",port);
const server=http.createServer(app);
const io=require('socket.io')();

io.on('connection',client=>{

    Log.newRecord('Connection',`${client.id} is connected`,`Client ${client.id}`,(err,doc)=>{
    })

    client.on('message',data=>{
        io.sockets.in(data.room).emit('message', data);
        Log.newRecord('Message',`New message in room ${data.room}`,`Sent by ${data.sender}`,(err,doc)=>{
        })
    });

    //user log in and subscribes
    client.on('goOnline',data=>{
        client.join(data.room)
        Log.newRecord('Subscription',`${data.sender} is online for ${data.room}`,`Client ${data.sender}`,(err,doc)=>{
        })
    })

    client.on('disconnect',data=>{
        Log.newRecord('Disconnection',`${client.id} has disconnected`,`Client ${client.id}`,(err,doc)=>{
        })
    })

    client.on('typing',data=>{
        client.broadcast.to(data.room).emit('typing',data)
    })
    client.on('newChat',data=>{
        Log.newRecord('New Room',`New room was created for ${data.name}`,`By ${data.sender}`,(err,doc)=>{
        })})

        

})

io.listen(8000)
console.log('listening for sockets on port 8000')

server.listen(port,host,()=>{
    console.log(`Server is listening on port ${port}`)
})