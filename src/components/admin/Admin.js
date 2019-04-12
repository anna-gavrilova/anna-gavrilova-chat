import React, { Component } from 'react';
import ConvService from '../../services/conv.service'
import EnhancedTable from './CustomTable'

var _conv=new ConvService();
const _=require('underscore')

class Admin extends Component {

  constructor(props){
    super(props);
    this.state={
      logresult:[],
      isloading:true
    }


  }


  componentDidMount(){

    _conv.getlog()
    .then(resp=>{
      if(resp){
        this.setState({
          logresult:resp.data
        })
      }
    })
    .then(_=>{
      _conv.gethistory()
        .then(resp=>{

          if(resp){
            this.setState({
              historyresult:resp.data
            })
          }
        })
    })
    .then(_=>{
      _conv.getallrooms()
        .then(resp=>{
          if(resp){
            this.setState({
              roomsresult:resp.data
            },()=>{
              
              this.setState({
                isloading:false
              })
            })
            }
          })
        })
     
  }

  tables(){
    return(
      <div className="Admin">
        <h2>Log</h2>
        
        <EnhancedTable data={this.state.logresult} name="log"></EnhancedTable>
        <h2>Chat History</h2>
        <EnhancedTable data={this.state.historyresult} name="history"></EnhancedTable>
        <h2>Rooms</h2>
        <EnhancedTable data={this.state.roomsresult} name="roomresult"></EnhancedTable>


{/*        
        
         */}
      </div>
    )
  }
    
  

  




  render(){
    console.log(this.state.logresult)
    console.log(this.state.historyresult)
    console.log(this.state.roomsresult)
    const isLoading = this.state.isloading?"Still loading..":this.tables()
    return(
      isLoading
    )
  }

}

export default Admin