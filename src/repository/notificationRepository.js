const axios = require("axios");
import store from "../store";
import { errorMiddleWare } from "./errorMiddlewareRepository";

const getSubscriptions = async (filterBy, pageNumber) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(
        process.env.VUE_APP_HOSTADDRESS +
          `subscribe/getSubscriptions?pageNumber=${pageNumber}&filterBy=${filterBy}`,
        {
          headers: store.getters.getHeader,
        }
      )
      .then((response) => {
        resolve(response.data);
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

const getRequests = async (filterBy, pageNumber) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(
        process.env.VUE_APP_HOSTADDRESS +
          `request/getRequests?pageNumber=${pageNumber}&filterBy=${filterBy}`,
        {
          headers: store.getters.getHeader,
        }
      )
      .then((response) => {
        resolve(response.data);
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

const stockOrRemoveRequest = async (requestId, drugId, remove) => {
  const promise = new Promise((resolve,reject)=>{
    axios.post(process.env.VUE_APP_HOSTADDRESS +`request/stockOrRemoveRequest`,
    {
      requestId:requestId,
      drugId:drugId,
      remove:remove
    },
    {
      headers: store.getters.getHeader,
    })
    .then((response) => {
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
  return promise;
};

const declineRequestOrRemoveDecline = async(requestId,declineDescription,remove)=>{
  const promise = new Promise((resolve,reject)=>{
    axios.post(process.env.VUE_APP_HOSTADDRESS +`request/declineRequestOrRemoveDecline`,
    {
      requestId:requestId,
      declineDescription:declineDescription,
      remove:remove
    },{
      headers: store.getters.getHeader,
    })
    .then((response) => {
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
  return promise;
}

export { getSubscriptions, getRequests, stockOrRemoveRequest, declineRequestOrRemoveDecline };
