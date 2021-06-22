
import { createStore } from 'vuex'

export default createStore({
  state: {
    id:"",
    token:"",
    machineId:"",
    deviceIsKnown:true,
    tokenIsValid:false,
    hasProfile:false,
  },
  mutations: {
    addResponseData (state,id,token,hasProfile) {
      state.id = id;
      state.token = token;
      state.deviceIsKnown=true;
      state.tokenIsValid = true;
      state.hasProfile = hasProfile;
    },
    addMachineId(state,machineId){
      state.machineId = machineId;
    },
    setDeviceFalse(state){
      state.deviceIsKnown = false;
    },
    setTokenFalse(state){
      state.tokenIsValid = false;
    },
    setHasProfileFalse(state){
      state.hasProfile = false
    }
    

  },
  actions: {
    setResponseData (context,id,token,hasProfile) {
      console.log(id)
      return new Promise((resolve,reject)=>{
        context.commit('addResponseData',id,token,hasProfile)
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
        context.commit('setHasProfileFalse');
        resolve();
    })
    },
    denyProfile(context){
      return new Promise((resolve,reject)=>{
        context.commit('setTokenFalse');
        resolve();
    })
    }
    
  },
  getters:{
    getPrerequisites:(state)=>{
      
        return [state.deviceIsKnown,state.tokenIsValid,state.hasProfile]
    }

  },
  modules: {
  }
})
