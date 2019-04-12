import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'
import './Home.css';
import {_conv as ConvService} from '../App'
import {socket} from '../App'
import openSocket from "socket.io-client"
const _=require('underscore')

class Home extends Component{

    constructor(props){
        super(props);
        this.state={
            user:this.props.user,
            selectedChat:null,
            chatHistory:null,
            newmessages:null,
            newmessagetrigger:true
        }



        this.selectChat=this.selectChat.bind(this)
        this.subscribeRooms=this.subscribeRooms.bind(this)
        this.getMessages=this.getMessages.bind(this)

       console.log(socket)
       if(socket.disconnected){
           socket.connect()
       }
       console.log(socket.disconnected)
        socket.on('message',messageData=>{
            if(this.state.selectedChat==messageData.room){
                this.getMessages(messageData.room)
            }
        
        })
    }

    

 

    componentDidMount(){
        if(this.props.chatSelected){
            this.selectChat(this.props.chatSelected)
        }
    }
    selectChat(id){
        
        this.setState({
            selectedChat:id
        })

        this.getMessages(id)
    }

    getMessages(id){
        ConvService.retrieveMessages(id)
        .then(messages=>{
            this.setState({
                chatHistory:messages.data.docs
            })
        })
    }

    subscribeRooms(rooms){
        _.pluck(rooms,"id").forEach(room=>{
            socket.emit('goOnline',{sender:this.state.user.id,room:room})
        })

        this.setState({rooms:rooms})
    }




    render(){

        var isChatSelected=this.state.selectedChat?
        <Grid item xs={12} sm={9} className='wrap'><ChatWindow selectedChat={this.state.selectedChat} chatHistory={this.state.chatHistory} className='chatList' user={this.props.user} newmessages={this.state.newmessages}/></Grid>:
        (this.state.rooms&&this.state.rooms.length?<div className="noInfo">Select chat from the left </div>:
                        <div className="noInfo"> You don't have any chats. Find a friend!</div>)
        return(
            <div className="homeWrapper">
                 <Grid container spacing={0} className='wrap'>
                    <Grid item xs={12} sm={3} className='chatList'><ChatList  selectChat={this.selectChat} selectedChat={this.state.selectedChat} subscribeRooms={this.subscribeRooms}/></Grid>
                    {isChatSelected}
                    
                </Grid>
            </div>
        );
    }
}

export default Home;