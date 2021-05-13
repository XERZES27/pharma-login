const axios = require('axios');
import {errorMiddleWare} from './errorMiddlewareRepository'
const hostAddress = "http://localhost:3000/api/";

const login=async(email,password,MachineId)=>{
    var id;
    var token;
    var emailError;
    var passwordError;

    const promise = new Promise((resolve,reject)=>{

        axios.post(hostAddress+'user/login', {
            email: email,
            password: password,
          },{
            headers: {
            'Machine-Id': MachineId
            }
          }
          )
          .then(function (response) {
            id = response.data.id;
            token = response.data['X-Access-Token'];
            const idtoken = {
                id:id,
                token:token
            }
            resolve(idtoken)
          })
          .catch( (error) =>{
            if(errorMiddleWare(error)){
              
                resolve();
                return
            }
            console.log(error.message)
            if(error.response.data.status=="Invalid Password"){
                passwordError = error.response.data.status;
            }
            else if(error.response.data.status){
                emailError = error.response.data.status;
            }
            else{
                emailError = error.message
            }
            const errorData={
                emailError:emailError,
                passwordError:passwordError
            }
            reject(errorData)
          });

    })
    return promise

     
      
      

}

export {login}