const axios = require("axios");
import store from "../store";
import { errorMiddleWare } from "./errorMiddlewareRepository";

const replyToDrugReview = async (drugReviewId, reply, remove) => {
  const promise = new Promise((resolve, reject) => {
    axios.post(
      process.env.VUE_APP_HOSTADDRESS + `review/replyToDrugReviewOrDelete`,
      {
        drugReviewId: drugReviewId,
        reply: reply,
        remove: remove,
      },
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

const replyToPhammacyReview = async (pharmacyReviewId, reply,remove) => {
  const promise = new Promise((resolve, reject) => {
    axios.post(
      process.env.VUE_APP_HOSTADDRESS + `review/replyToPharmacyReviewOrDelete`,
      {
        pharmacyReviewId: pharmacyReviewId,
        reply: reply,
        remove: remove,
      },
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
      }else{reject(error.response.data);}
      
    });
  });
  return promise;
};

const getDrugReviews = async (filterBy, pageNumber) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(
        process.env.VUE_APP_HOSTADDRESS +
          `review/getDrugReviews?filterBy=${filterBy}&pageNumber=${pageNumber}`,
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

const getPharmacyReviews = async (filterBy, pageNumber) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(
        process.env.VUE_APP_HOSTADDRESS +
          `review/getPharmacyReviews?filterBy=${filterBy}&pageNumber=${pageNumber}`,
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

export {
  replyToDrugReview,
  replyToPhammacyReview,
  getDrugReviews,
  getPharmacyReviews,
};
