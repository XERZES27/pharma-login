const axios = require("axios");
import store from "../store";
import { errorMiddleWare } from "./errorMiddlewareRepository";



const getSubscriptions = async(pageNumber)=>{
    const promise = new Promise((resolve,reject)=>{
        axios
      .get(
        process.env.VUE_APP_HOSTADDRESS +
          `subscribe/getSubscriptions?pageNumber=${pageNumber}`,
        {
          headers: store.getters.getHeader,
        }
      ).then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        if (errorMiddleWare(error)) {
          resolve();
          return;
        }
        reject(error.response.data);
      });
    })
    return promise
}

export {
    getSubscriptions
  };