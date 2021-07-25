import { ref, watch, onMounted } from "vue";
import {
  getRecommendations,
  getDrugsAlphabetically,
  getDrugById,
  getDrugByNameBrandName,
  getDrugsByDate,
  updateDrug,
  deleteDrug,
} from "../../repository/inventoryRepository";

import {
  validatePrice,
  validateInStockAmount,
  validatePrescriptionRequired,
  validateCountryOfOrigin,
} from "../../models/drug.js";


const inventoryHome = () => {
  const searchQuery = ref("");
  const drugRecomendations = ref([]);
  const inventoryList = ref([]);
  const pickedSort = ref("Alphabetically");
  const resultCameEmpty = ref('');

  watch(pickedSort, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      getInventory();
    }
  });
  onMounted(() => {
    getInventory();
  });

  function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }
  function processQuery() {
    getRecommendations(searchQuery.value)
      .then((response) => {
        drugRecomendations.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const processChange = debounce(() => {
    if (searchQuery.value != "") {
      return processQuery();
    } else {
      return (drugRecomendations.value = []);
    }
  });
  const checkIfUpdateIsAllowed = (index)=>{
    if(Number(inventoryList.value[index]["priceModel"]) !==
    inventoryList.value[index]["price"] && Number(inventoryList.value[index]["amountInStockModel"]) !==
    inventoryList.value[index]["amountInStock"] && inventoryList.value[index]["requiresPrescriptionModel"] !==
    inventoryList.value[index]["requiresPrescription"] && inventoryList.value[index]["countryOfOriginModel"] !==
    inventoryList.value[index]["countryOfOrigin"] &&
  !(
    inventoryList.value[index]["countryOfOriginModel"] === "" &&
    !inventoryList.value[index]["countryOfOrigin"]
  ))return true
  else return false
  }

  const resetToInitialData = (index) => {
    inventoryList.value[index]["priceModel"] =
      inventoryList.value[index]["price"];
    inventoryList.value[index]["amountInStockModel"] =
      inventoryList.value[index]["amountInStock"];
    inventoryList.value[index]["requiresPrescriptionModel"] =
      inventoryList.value[index]["requiresPrescription"];
    inventoryList.value[index]["countryOfOriginModel"] =
      inventoryList.value[index]["countryOfOrigin"];
      inventoryList.value[index]["priceError"] = "";
    inventoryList.value[index]["amountInStockError"] = "";
    inventoryList.value[index]["requiresPrescriptionError"] = "";
    inventoryList.value[index]["countryOfOriginError"] = "";
  };

  const toggleEditable = (index) => {
    inventoryList.value[index]["isNotEditable"] = !inventoryList.value[index][
      "isNotEditable"
    ];
    resetToInitialData(index);
  };
  const disableDeleteFailedMessage = (index) => {
    inventoryList.value[index]["deleteFailed"] = false;
  };
  const disableUpdateMessage = (index) => {
    inventoryList.value[index]["updateFailed"] = false;
    inventoryList.value[index]["updateSuccess"] = false;
    inventoryList.value[index]["updateError"] = "";
  };

  const toggleMore = (index) => {
    inventoryList.value[index]["toggleMore"] = !inventoryList.value[index][
      "toggleMore"
    ];
  };

  const preloadInventory = () => {
    inventoryList.value.map((el) => {
      el["isNotEditable"] = true;
      el["updateFailed"] = false;
      el["updateError"] = "";
      el["updateSuccess"] = false;
      el["deleteFailed"] = false;
      el["priceModel"] = el["price"];
      el["amountInStockModel"] = el["amountInStock"];
      el["requiresPrescriptionModel"] = el["requiresPrescription"];
      el["countryOfOriginModel"] = el["countryOfOrigin"];
      el["priceError"] = "";
      el["amountInStockError"] = "";
      el["requiresPrescriptionError"] = "";
      el["countryOfOriginError"] = "";
      el["toggleMore"] = false;
      el["creationDate"] = new Date(el["creationDate"]).toLocaleString();
      el["isProcessing"] = false;
    });
  };

  

  const queryDrugById = (id)=>{
    getDrugById(id).then(
      (response)=>{
        if(response.data.length!==0){
        inventoryList.value = response.data
          preloadInventory()
      }
        else{
          resultCameEmpty.value = `Well this is awkward (・_・ヾ`
          setTimeout(() => {
            resultCameEmpty.value = '';
          },10000);
        }
      })
      .catch((error)=>{
        console.log(error)
      })
      drugRecomendations.value = []

  }
  const queryDrugByNameOrBrandName = (query)=>{
    if(query.trim()!=='')
    {
      getDrugByNameBrandName(query).then(
      (response)=>{
        console.log(response)
        if(response.data.length!==0){
        inventoryList.value = response.data
          preloadInventory()
      }
        else{
          resultCameEmpty.value = `Sorry we couldn't find anything ¯\\_(ツ)_/¯`
          setTimeout(() => {
            resultCameEmpty.value = '';
          },10000);
        }
      })
      .catch((error)=>{
        console.log(error)
      })}
      drugRecomendations.value = []
  }

 

  const performUpdate = async (index) => {
    const updateJson = {};
    inventoryList.value[index]["priceError"] = "";
    inventoryList.value[index]["amountInStockError"] = "";
    inventoryList.value[index]["requiresPrescriptionError"] = "";
    inventoryList.value[index]["countryOfOriginError"] = "";
    inventoryList.value[index]["updateFailed"] = false;
    inventoryList.value[index]["updateSuccess"] = false;
    inventoryList.value[index]["deleteFailed"] = false;
    var hasErrors = false;

    if (
      Number(inventoryList.value[index]["priceModel"]) !==
      inventoryList.value[index]["price"]
    ) {
      var price = Number(inventoryList.value[index]["priceModel"]);
      if (validatePrice(price)) {
        updateJson["price"] = price;
      } else {
        inventoryList.value[index]["priceError"] =
          "Please Make Sure that the price is a positive number less than 10,000,000";
        hasErrors = true;
      }
    }
    if (
      Number(inventoryList.value[index]["amountInStockModel"]) !==
      inventoryList.value[index]["amountInStock"]
    ) {
      var amountInStock = Number(
        inventoryList.value[index]["amountInStockModel"]
      );
      if (validateInStockAmount(amountInStock)) {
        updateJson["amountInStock"] = amountInStock;
      } else {
        inventoryList.value[index]["amountInStockError"] =
          "Please Make Sure that the amount in stock is a positive number less than 100,000";
        hasErrors = true;
      }
    }
    if (
      inventoryList.value[index]["requiresPrescriptionModel"] !==
      inventoryList.value[index]["requiresPrescription"]
    ) {
      var requiresPrescription =
        inventoryList.value[index]["requiresPrescriptionModel"];
      if (validatePrescriptionRequired(requiresPrescription)) {
        updateJson["requiresPrescription"] = requiresPrescription;
      } else {
        inventoryList.value[index]["requiresPrescriptionError"] =
          "Please Make Sure that the value is true or false";
        hasErrors = true;
      }
    }

    if (
      inventoryList.value[index]["countryOfOriginModel"] !==
        inventoryList.value[index]["countryOfOrigin"] &&
      !(
        inventoryList.value[index]["countryOfOriginModel"] === "" &&
        !inventoryList.value[index]["countryOfOrigin"]
      )
    ) {
      var countryOfOrigin = inventoryList.value[index]["countryOfOriginModel"];
      if (validateCountryOfOrigin(countryOfOrigin)) {
        updateJson["countryOfOrigin"] = countryOfOrigin;
      } else {
        inventoryList.value[index]["countryOfOriginError"] =
          "Please Make Sure that the country is valid, Numbers and symbols aren`t allowed  ";
        hasErrors = true;
      }
    }
    const updateJsonKeys = Object.keys(updateJson);
    if (hasErrors === false && updateJsonKeys.length !==0) {
      updateJson["id"] = inventoryList.value[index]["_id"];
      inventoryList.value[index]["isProcessing"] = false;
      
      updateDrug(updateJson)
        .then((response) => {
          inventoryList.value[index]["isProcessing"] = false;
          if (response.status === "Pass") {
            inventoryList.value[index]["updateSuccess"] = true;
            inventoryList.value[index]["isNotEditable"] = true;
            updateJsonKeys.forEach(key => {
              inventoryList.value[index][key] = updateJson[key]
            });
            setTimeout(() => {
              inventoryList.value[index]["updateSuccess"] = false;
            }, 2000);
          }
        })
        .catch((error) => {
          inventoryList.value[index]["isProcessing"] = false;
          inventoryList.value[index]["updateFailed"] = true;
          if (error.status === "Invalid Data") {
            inventoryList.value[index][
              "updateError"
            ] = `The Error was caused by ${error.Error}`;
            inventoryList.value[index][`${error.Error}Error`] =
              "Rejected By Server";
          }
          if(error.status==="Invalid Request"){
            inventoryList.value[index][
              "updateError"
            ] = `Please check your connection`;
          }
          if(error.status==="Data is required"){
            inventoryList.value[index][
              "updateError"
            ] = `Please stop making empty requests`;
          }
          if(error.status==="Fail D"){
            inventoryList.value[index][
              "updateError"
            ] = `Please contact the developers to report this error`;
          }
          if(error.status==="Fail"){
            console.log(error.data)
            inventoryList.value[index][
              "updateError"
            ] = `Please contact the developers to report this error`;
          }
        });
    }
  };

  const getInventory = () => {
    if (pickedSort.value == "Alphabetically") {
      getDrugsAlphabetically()
        .then((response) => {
          inventoryList.value = response.data;
          preloadInventory();
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (pickedSort.value == "By Date") {
      getDrugsByDate()
        .then((response) => {
          inventoryList.value = response.data;
          preloadInventory();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return {
    searchQuery,
    inventoryList,
    pickedSort,
    drugRecomendations,
    resultCameEmpty,
    disableDeleteFailedMessage,
    disableUpdateMessage,
    toggleMore,
    checkIfUpdateIsAllowed,
    toggleEditable,
    getInventory,
    processChange,
    queryDrugById,
    queryDrugByNameOrBrandName,
    performUpdate,
  };
};

export { inventoryHome };
