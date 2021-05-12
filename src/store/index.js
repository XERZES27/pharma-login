
import { createStore } from 'vuex'

export default createStore({
  state: {
    id:"",
    token:"",
    machineId:"",
  },
  mutations: {
    addIdToken (state,id,token) {
      state.id = id;
      state.token = token;
    },
    addMachineId(state,machineId){
      state.machineId = machineId;
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
    }
  },
  modules: {
  }
})
