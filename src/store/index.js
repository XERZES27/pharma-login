import { createStore } from "vuex";

export default createStore({
  state: {
    id: sessionStorage.getItem(`id`) || ``,
    token: sessionStorage.getItem(`token`) || ``,
    machineId: sessionStorage.getItem(`machineId`) || ``,
    deviceIsKnown: sessionStorage.getItem(`deviceIsKnown`) || true,
    tokenIsValid: sessionStorage.getItem(`tokenIsValid`) || false,
    hasProfile: sessionStorage.getItem(`hasProfile`) || false,
  },
  mutations: {
    addResponseData(state, {id, token, hasProfile,machineId}) {
      sessionStorage.setItem(`id`, `${id}`);
      sessionStorage.setItem(`token`, `${token}`);
      sessionStorage.setItem(
        `deviceIsKnown`,
        true
      );
      sessionStorage.setItem(
        `tokenIsValid`,
        true
      );
      sessionStorage.setItem(
        `hasProfile`,
        hasProfile
      );
      state.id = id;
      state.token = token;
      state.deviceIsKnown = true;
      state.tokenIsValid = true;
      state.hasProfile = hasProfile;
      state.machineId = machineId
    },
    addMachineId(state, machineId) {
      const sessionMachineId = sessionStorage.setItem(
        `machineId`,
        machineId
      );
      state.machineId = machineId;
    },
    setDeviceFalse(state) {
      const sessionDeviceIsKnown = sessionStorage.setItem(
        `deviceIsKnown`,
        false
      );
      state.deviceIsKnown = false;
    },
    setTokenFalse(state) {
      const sessionTokenIsValid = sessionStorage.setItem(
        `tokenIsValid`,
        false
      );
      state.tokenIsValid = false;
    },
    setHasProfileFalse(state) {
      const sessionHasProfile = sessionStorage.setItem(
        `hasProfile`,
        false
      );
      state.hasProfile = false;
    },
    setHasProfileTrue(state) {
      const sessionHasProfile = sessionStorage.setItem(
        `hasProfile`,
        true
      );
      state.hasProfile = true;
    },
  },
  actions: {
    setResponseData(context, {id, token, hasProfile,machineId}) {
      // console.log(token)
      return new Promise((resolve, reject) => {
        context.commit("addResponseData", {"id":id, "token":token, "hasProfile":hasProfile,"machineId":machineId});
        resolve();
      });
    },
    setMachineId(context, machineId) {
      return new Promise((resolve, reject) => {
        context.commit("addMachineId", machineId);
        resolve();
      });
    },
    denyDevice(context) {
      return new Promise((resolve, reject) => {
        context.commit("setDeviceFalse");
        resolve();
      });
    },
    denyToken(context) {
      return new Promise((resolve, reject) => {
        context.commit("setHasProfileFalse");
        resolve();
      });
    },
    denyProfile(context) {
      return new Promise((resolve, reject) => {
        context.commit("setTokenFalse");
        resolve();
      });
    },
    allowProfile(context){
      return new Promise((resolve, reject) => {
        context.commit("setHasProfileTrue");
        resolve();
      });
    },
    logout(context){
      return new Promise((resolve,reject)=>{
        context.commit("setTokenFalse");
        context.commit("setHasProfileFalse");
        resolve();
      })
    }
  },
  getters: {
    getPrerequisites: (state) => {
      return [state.tokenIsValid,state.deviceIsKnown,state.hasProfile];
    },
    getMachineId:(state)=>{
      return state.machineId
    },
    getHeader:(state)=>{
        return {
            'id':state.id,
            'X-Access-Token':state.token,
            'Machine-Id':state.machineId
          }
        
    }
  },
  modules: {},
});
