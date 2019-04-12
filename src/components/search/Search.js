import React, { Component } from 'react'
import ChatList from '../home/ChatList'
import ChatWindow from '../home/ChatWindow'
import '../home/Home';
import './Search.css'
import { Button } from 'reactstrap';
import {_user as UserService} from '../App'
import {_conv as ConvService} from '../App'
import {socket} from '../App'
import { Container, Row, Col } from 'reactstrap';
import {BrowserRouter,Link,Route,Redirect,Switch} from 'react-router-dom';
import { FaComment } from 'react-icons/fa';
const _=require('underscore')

class Search extends Component{

    constructor(props){
        super(props);
        this.state={
            searchResults:null
        }
        this.results=null;
    }

    startConversation(id){
        //TODO:
        //check if the conversation already exists
        //if not, create a new record for the chat
        ConvService.startChat(UserService.user,id)
                .then(res=>{
                    if(res.data.success){
                        socket.emit('newChat',{name:res.data.docs.name,sender:UserService.user})
                    }
                })
        //redirect to home page with all the parameters selected for that chat
        //eg selected chat, chat history, all that
    }

    search=(e)=>{
        
        UserService.findUsers(e.target.value)
            .then(response=>{
                if(response.data.docs.length!==0 && e){
                    
                    this.setState({
                        searchResults:<div>{this.generate(response.data.docs)}</div>
                    })
                }
                else this.setState({
                    searchResults:(<div className="notFound">No Users Found :(</div>)
                })
            })
    }

    generate(data){
        return _.map(data,(user,key)=>{
            return (
            <Row key={key}>
                 <Col>
                {user.name}
                </Col>
                <Col>
                <Button color="secondary" onClick={()=>this.startConversation(user.id)}><FaComment></FaComment></Button>
                </Col>
            </Row>)
        })
    }


    render(){




        return (<div className="searchWrap">
            
            <input type="text" onChange={(event)=>{if(event.target.value!=='') this.search(event)}}></input>
            <div className="searchResults">
            <Container>
                {this.state.searchResults}
            </Container>
            </div>



        </div>)
    }
}

export default Search

