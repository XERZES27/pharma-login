import { createStore } from 'vuex'

export default createStore({
  state: {
    id:"",
    token:"",
  },
  mutations: {
    setIdAndGuilt (state,id,token) {
      state.id = id;
      state.token = token;
      
    }
  },
  actions: {
    increment (context,id,token) {
      console.log(id)
      return new Promise((resolve,reject)=>{

        context.commit('setIdAndGuilt',id,token)
        resolve()
      })
    }
  },
  modules: {
  }
})
