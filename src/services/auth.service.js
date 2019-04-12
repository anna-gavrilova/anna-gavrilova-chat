import {axios} from '../components/App';
const http=require('http');


export class Auth{
    constructor(){}
    login(body){
        return axios.post("http://127.0.0.1:3030/api/login",body)
    }

}
