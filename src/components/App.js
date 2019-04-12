import React, { Component } from 'react';
import './App.css';
import Login from './login/Login'
import {BrowserRouter,Link,Route,Redirect,Switch} from 'react-router-dom';
import Home from './home/Home';
import Search from './search/Search'
import Grid from '@material-ui/core/Grid';
import UserService from '../services/user.service'
import ConvService from '../services/conv.service'
import Button from '@material-ui/core/Button';
import openSocket from "socket.io-client"
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Admin from './admin/Admin';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';




var  axios=require('axios')
var _user=new UserService();
var _conv=new ConvService();
var socket=io('http://localhost:8000');







class App extends Component {
  
  constructor(props){
    super(props);
    this.state={
      loggeduser:JSON.parse(localStorage.getItem('loggedUser')),
      apiresult:null,
      roomapi:null
    }

    this.handleLogoutClick=this.handleLogoutClick.bind(this)
    this.logout=this.logout.bind(this)



    window.addEventListener('storage', event=>{
      if (event.key == 'logout-event') { 
        this.logout()
      }
      else if(event.key=='loggedUser'){
        axios.defaults.headers.common['loggeduser'] = localStorage.getItem('loggedUser') // for all requests
        _user.setUser(JSON.parse(localStorage.getItem('loggedUser')));
        this.setState({loggeduser:JSON.parse(localStorage.getItem('loggedUser'))},()=>{

          socket.connect()
        })
      }
  });
    
   
}

componentWillMount(){
  if(localStorage.getItem('loggedUser')){
    socket.connect()
  }
}


homeTemp=(user,chat)=>{
  return user?<Home user={user} chatSelected={chat}/>:this.loginEl();
}

// api=(user)=>{
//   return !user?this.loginEl():
//   <div className="Api_calls">

//     <Button variant="contained" color="primary" className='menuBtn' onClick={this.getlog}> Get log</Button> <br/>
//     <Button variant="contained" color="primary" className='menuBtn' onClick={this.getallhistory}> Get All History</Button> <br/>
//     <input type='text' placeholder="room id" onChange={(event)=>this.setState({roomapi:event.target.value})}></input>
//     <Button variant="contained" color="primary" className='menuBtn' onClick={this.getroomhistory}> Get Room History</Button> 

//     <div className="apiResult">
//       {this.state.apiresult}
//     </div>
//   </div>
// }


api=(user)=>{

  
  return (!user?this.loginEl():<Admin></Admin>)
}

getroomhistory=()=>{
  if(this.state.roomapi){
    _conv.getroomhistory(this.state.roomapi)
      .then(resp=>{
        console.log(resp.data.data)
        if(resp.data.success){
          this.setState({
            apiresult:JSON.stringify(resp.data.data)
          })

        }
        else{
          this.setState({
            apiresult:'room not found'
          })
        }
      })
  }
  else{
    this.setState({
      apiresult:'room name is empty'
    })
  }
}

getallhistory=()=>{
  _conv.gethistory()
    .then(resp=>{
      this.setState({
        apiresult:JSON.stringify(resp.data)
      })
    })
}

getlog=()=>{
  _conv.getlog()
    .then(resp=>{
      this.setState({
        apiresult:JSON.stringify(resp.data)
      })
    })
}

search=(user)=>{
  return user?<Search user={user}/>:this.loginEl();
}



handleLogoutClick=()=>{

  localStorage.setItem('logout-event','logout'+Math.random())
  socket.close()
  this.logout()
 
}

logout=()=>{
  _user.user=null;
  localStorage.removeItem('loggedUser');
  this.setState({
    loggeduser:null
  });
  axios.defaults.headers.common['loggeduser'] = null
  
}

login=(user)=>{
  axios.defaults.headers.common['loggeduser'] = JSON.stringify(user) // for all requests
  _user.setUser(user);
  this.setState({loggeduser:user},()=>{
    socket.connect()
  });
  
}

loginEl(){
  return(
  <Login login={(user)=>this.login(user)}/>
  )
}


  render() {

    let button;
    if (this.state.loggeduser) {
      button =<Link to="/login" className="buttonLink"> <Button variant="contained" color="primary" className='menuBtn' onClick={this.handleLogoutClick} >
                  Logout
               </Button> 
               </Link>
    } else {
      button =
                <Link to="/login" className="buttonLink"><Button variant="contained" color="primary" className='menuBtn'>Login</Button> </Link>
                
    }


    return (
  
      
      <div className="App">
      
      <BrowserRouter>
     
      <div className="router">
            <div className="menuVisual">
            <Grid container spacing={0} className='menuContainer'>

              <Grid item xs={12} sm={4} className='menuBtn'><Link to="/"><Button variant="contained" color="primary" >Home</Button> </Link></Grid>
              <Grid item xs={12} sm={4} className='menuBtn'><Link to="/search"><Button variant="contained" color="primary" >Find</Button> </Link></Grid>
              <Grid item xs={12} sm={4} className='menuBtn'><Link to="/api"><Button variant="contained" color="primary" >API</Button> </Link></Grid>
              <Grid item xs={12} sm={4} className='menuBtn'>{button} </Grid>

            </Grid>

            </div>




                {/* Route for / condition on logged in and not logged in */}
              <Switch className="routeWindow">
                <Route exact path="/" render={()=>this.homeTemp(this.state.loggeduser)}/>
                <Route path="/login" render={()=>this.homeTemp(this.state.loggeduser)}/>
                <Route path="/search" render={()=>this.search(this.state.loggeduser)}/>
                <Route path="/api" render={()=>this.api(this.state.loggeduser)}/>
                <Redirect from="/*" to="/" />
              
             </Switch>
        </div>
        </BrowserRouter>
      </div>
    );
  }
}

export {App,axios,_user,_conv,socket}
