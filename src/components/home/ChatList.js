import React, { Component } from 'react'
import {_user as UserService} from '../App'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';





class ChatList extends Component{

    constructor(props){
        super(props);
        this.state={
            chats:null,
            renderedChats:[],
            selectedChat:this.props.selectedChat
        };

    }




    
    componentWillMount(){
        UserService.getChats()
        .then(resp=>{
            this.setState({chats:resp.data.docs})
            this.props.subscribeRooms(resp.data.docs)
        }).then(_=>{
            this.setState({renderedChats:this.renderChats()})
        })

    }

    handleclick=(e,chat)=>{
        
        this.props.selectChat(chat.id);
        this.setState({renderedChats:this.renderChats(chat.id)})
       
        
    }


    renderChats(selected){
        var chats=[];
        chats= this.state.chats.map((chat)=>{
            console.log(this.props.selectedChat)
            return   <div  key={chat.id} chat={chat.id} className={selected==chat.id?'selected':'not-selected'} onClick={(e)=>this.handleclick(e,chat)}>
            <ListItem  button>
                <ListItemText primary={chat.name}/>
            </ListItem>
            </div>
        })
        console.log(chats)
        return chats
    }

    render(){
        return(
            <div className='chatList'>
                <List component="nav">
                    {this.state.renderedChats}
                </List>
            </div>
        )

    }
}

export default ChatList;