const axios = require("axios");
import store from "../store";
import { errorMiddleWare } from "./errorMiddlewareRepository";

const bulkUpload = async (drugs) => {
  console.log(store.getters.getHeader);
  const promise = new Promise((resolve, reject) => {
    axios
      .post(
        process.env.VUE_APP_HOSTADDRESS + "inventory/bulkUpload",
        {
          drugs: drugs,
        },
        {
          headers: store.getters.getHeader,
        }
      )
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        // console.log(error.response.data);
        if (errorMiddleWare(error)) {
          resolve();
          return;
        }
        reject(error.response.data)
      });
  });
  return promise;
};

export { bulkUpload };
