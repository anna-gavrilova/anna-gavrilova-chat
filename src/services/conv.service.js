import {axios} from '../components/App'

class ConvService {

    openConversation=null;
  
    constructor(){

    }

    selectConversation=(conv)=>{
        this.openConversation=conv
    }

    sendMessage=(msg,dialog)=>{
        let body={
            message:msg,
            dialog:dialog
        }
        //body contains the message itself and the chat id
        return axios.post("http://127.0.0.1:3030/api/dialogs",body)
    }
    //gets chats for the specific user
    getChats=()=>{
        return axios.get("http://127.0.0.1:3030/api/dialogs/")
    }

    retrieveMessages=(chat)=>{
        return axios.get('http://127.0.0.1:3030/api/dialogs/'+chat)
    }

    startChat=(user,startWith)=>{
        let body={
            loggeduser:user,
            startWithId:startWith
        }
        return axios.post('http://127.0.0.1:3030/api/dialogs/new',body)
    }

    getlog=()=>{
        return axios.get('http://127.0.0.1:3030/api/eventlog')
    }

    gethistory=()=>{
        return axios.get('http://127.0.0.1:3030/api/history')
    }
    getroomhistory=(room)=>{
        return axios.post('http://127.0.0.1:3030/api/roomhistory',{room:room})
    }

    getallrooms=()=>{
        return axios.get('http://127.0.0.1:3030/api/rooms')
    }


    



}

export default ConvService