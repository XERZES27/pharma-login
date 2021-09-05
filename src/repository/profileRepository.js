const axios = require("axios");
import store from "../store/index"
import { errorMiddleWare } from "./errorMiddlewareRepository";
import router from '../router/index'

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

export {createProfile}
