const axios = require("axios");
import store from "../store/index"
import { errorMiddleWare } from "./errorMiddlewareRepository";
import router from '../router/index'

const getProfile = async()=>{
  const promise = new Promise((resolve,reject)=>{
    axios.get(
      process.env.VUE_APP_HOSTADDRESS + "profile/getProfile",
      {
        headers: store.getters.getHeader,
      }
    ).then((response)=>{
      resolve(response.data);
    }).catch((error) => {
      if (errorMiddleWare(error)) {
        resolve();
        return;
      }
      reject(error.response.data);
    });
  })
  return promise;
}

const deletePhoto = async(photoName)=>{
  const promise = new Promise((resolve,reject)=>{
    axios.post(
      process.env.VUE_APP_HOSTADDRESS + "profile/deletePhoto",
      {
        'pharmacyPhoto':photoName
      }
      ,
      {
        headers: store.getters.getHeader,
      }
    ).then((response)=>{
      resolve(response.data);
    }).catch((error) => {
      if (errorMiddleWare(error)) {
        resolve();
        return;
      }
      reject(error.response.data);
    });
  })
  return promise;
}

const createProfile = async (formData) => {
  const promise = new Promise((resolve, reject) => {
    axios.post(
      process.env.VUE_APP_HOSTADDRESS + "profile/createProfile",
      formData,
      {
        headers: {
          'id':store.getters.getHeader['id'],
          'X-Access-Token':store.getters.getHeader['X-Access-Token'],
          'Machine-Id':store.getters.getHeader['Machine-Id'],
          'Content-Type': 'multipart/form-data'
        },
      }
    ).then((response) => {
        const id = response.data.id;
        const token = response.data["X-Access-Token"];
        const hasProfile = response.data.hasProfile;
        store.dispatch("setResponseData",
          {"id":id,
          "token":token,
          "hasProfile":hasProfile,
          "machineId":store.getters.getMachineId
        }).then(()=>{
          if(hasProfile===false){
              router.replace({"name":"CreateProfile"})
          }
          else{
            router.replace({"name":"InventoryHome"})

          }
        })
        resolve("Pass");
      })
      .catch((error) => {
        if (errorMiddleWare(error)) {
          resolve();
          return;
        }
        reject(error.response.data);
      });
  });
  return promise;
};

const updateProfile = async (formData) => {
  const promise = new Promise((resolve, reject) => {
    axios.post(
      process.env.VUE_APP_HOSTADDRESS + "profile/updateProfile",
      formData,
      {
        headers: {
          'id':store.getters.getHeader['id'],
          'X-Access-Token':store.getters.getHeader['X-Access-Token'],
          'Machine-Id':store.getters.getHeader['Machine-Id'],
          'Content-Type': 'multipart/form-data'
        },
      }
    ).then((response) => {
      console.log(response.status)
        resolve(response.data);
      })
      .catch((error) => {
      console.log(error.response.data)
        
        if (errorMiddleWare(error)) {
          resolve();
          return;
        }
        reject(error.response.data);
      });
  });
  return promise;
};

export {createProfile,updateProfile,getProfile,deletePhoto}
