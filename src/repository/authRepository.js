const axios = require('axios');
const hostAddress = "http://localhost:3000/api/";

const login=async(email,password)=>{
    var id;
    var token;
    var emailError;
    var passwordError;

    const promise = new Promise((resolve,reject)=>{

        axios.post(hostAddress+'user/login', {
            email: email,
            password: password
          })
          .then(function (response) {
            id = response.data.id;
            token = response.data.token;
            const idtoken = {
                id:id,
                token:token
            }
            resolve(idtoken)
          })
          .catch(function (error) {
            
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