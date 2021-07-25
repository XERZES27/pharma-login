const axios = require("axios");
import store from "../store";
import { errorMiddleWare } from "./errorMiddlewareRepository";

const bulkUpload = async (drugs) => {
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
        resolve(response.data);
      })
      .catch((error) => {
        // console.log(error.response.data);
        if (errorMiddleWare(error)) {
          resolve();
          return;
        }
        reject(error.response.data);
      });
  });
  return promise;
};
const updateDrug = async (updateJson) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .post(
        process.env.VUE_APP_HOSTADDRESS + "inventory/updateDrug",
        {
          updateJson: updateJson,
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
const deleteDrug = async (id) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .post(
        process.env.VUE_APP_HOSTADDRESS + "inventory/deleteDrug",
        {
          id: id,
        },
        {
          headers: store.getters.getHeader,
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        // console.log(error.response.data);
        if (errorMiddleWare(error)) {
          resolve();
          return;
        }
        reject(error.response.data);
      });
  });
  return promise;
};

const getRecommendations = (query) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(
        process.env.VUE_APP_HOSTADDRESS +
          `inventory/getRecommendations?query=${query}`,
        {
          headers: store.getters.getHeader,
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error.response);
        if (errorMiddleWare(error)) {
          resolve();
          return;
        }
        reject(error.response.data);
      });
  });
  return promise;
};

const getDrugById = (id) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(process.env.VUE_APP_HOSTADDRESS + `inventory/getDrugById?id=${id}`, {
        headers: store.getters.getHeader,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error.response);
        if (errorMiddleWare(error)) {
          resolve();
          return;
        }
        reject(error.response.data);
      });
  });
  return promise;
};

const getDrugByNameBrandName = (query) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(
        process.env.VUE_APP_HOSTADDRESS +
          `inventory/getDrugByNameBrandName?query=${query}`,
        {
          headers: store.getters.getHeader,
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error.response);
        if (errorMiddleWare(error)) {
          resolve();
          return;
        }
        reject(error.response.data);
      });
  });
  return promise;
};

const getDrugsAlphabetically = () => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(
        process.env.VUE_APP_HOSTADDRESS + `inventory/getDrugsAlphabetically`,
        {
          headers: store.getters.getHeader,
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error.response);
        if (errorMiddleWare(error)) {
          resolve();
          return;
        }
        reject(error.response.data);
      });
  });
  return promise;
};

const getDrugsByDate = () => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(process.env.VUE_APP_HOSTADDRESS + `inventory/getDrugsByTime`, {
        headers: store.getters.getHeader,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error.response);
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
  bulkUpload,
  getRecommendations,
  getDrugById,
  getDrugByNameBrandName,
  getDrugsAlphabetically,
  getDrugsByDate,
  updateDrug,
  deleteDrug,
};
