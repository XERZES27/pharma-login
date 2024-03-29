import { _ } from 'core-js';
import router from '../router';
import store from '../store';


const errorMiddleWare = (error)=>{
    let hasError = false;
    if(error.message==="Network Error") return true
    if(error.response.data.status){
        let status = error.response.data.status;
        if(status=="Invalid Token"){
            store.dispatch('denyToken').then((_)=>{
                router.replace({name:'Auth'})
            })
            hasError = true;
        }
        if(status=="Access Denied"){
            store.dispatch('denyToken').then((_)=>{
                router.replace({name:'Auth'})
            })
            //TODO could indicate forged token, implement device ban
            hasError = true;
        }
        if(status=="Device not recognized"){
            console.log('signed')
            store.dispatch('denyDevice').then((_)=>{
                router.replace({name:'UnknownDevice'})
            })
            
            hasError = true;
        }
        if(status=="Does not have profile"){
            store.dispatch('denyProfile').then((_)=>{
                router.replace({name:'CreateProfile'})
            })
            
        }


    }
    return hasError;

}

export {errorMiddleWare}