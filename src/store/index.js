
import { createStore } from 'vuex'

export default createStore({
  state: {
    id:"",
    token:"",
    machineId:"",
    deviceIsKnown:true,
    tokenIsValid:false,
  },
  mutations: {
    addIdToken (state,id,token) {
      state.id = id;
      state.token = token;
      state.deviceIsKnown=true;
      state.tokenIsValid = true;
    },
    addMachineId(state,machineId){
      state.machineId = machineId;
    },
    setDeviceFalse(state){
      state.deviceIsKnown = false;
    },
    setTokenFalse(state){
      state.tokenIsValid = false;
    }

  },
  actions: {
    setIdToken (context,id,token) {
      console.log(id)
      return new Promise((resolve,reject)=>{

        context.commit('addIdToken',id,token)
        resolve()
      })
    },
    setMachineId(context,machineId){
      return new Promise((resolve,reject)=>{
        context.commit('addMachineId',machineId);
        resolve()
      })
    },
    denyDevice(context){
      return new Promise((resolve,reject)=>{
          context.commit('setDeviceFalse');
          resolve();
      })
    },
    denyToken(context){
      return new Promise((resolve,reject)=>{
        context.commit('setTokenFalse');
        resolve();
    })
    }
    
  },
  getters:{
    getIsDeviceValidAndIsTokenValid:(state)=>{
      
        return [state.deviceIsKnown,state.tokenIsValid]
    }

  },
  modules: {
  }
})
