import { ref, watch, onMounted } from "vue";
import {
  getRecommendations,
  getDrugsAlphabetically,
  getDrugById,
  getDrugByNameBrandName,
  getDrugsByDate,
  createDrug,
  updateDrug,
  deleteDrug,
} from "../../repository/inventoryRepository";

import {
  DrugModel,
  validateDrugName,
  validateDrugDescription,
  validateBrandName,
  validatePrice,
  validateInStockAmount,
  validatePrescriptionRequired,
  validateCountryOfOrigin,
} from "../../models/drug.js";
// const io = require("socket.io-client");
// const socket = io("http://localhost:5000/",{
//   path: "/socket.io/",
//   extraHeaders: {
//   }
// });

const inventoryHome = () => {
  const initialCreateDrugPhase = ref(true);
  const createDrugError = ref("");
  const isProcessingCreateDrugPhase = ref(false);
  const createDrugIsSuccessfull = ref(false);
  const addDrugModalRef = ref(false);
  const confirmDeleteModalRef = ref(false);
  const nameModel = ref("");
  const nameError = ref("");
  const priceModel = ref("");
  const priceError = ref("");
  const amountInStockModel = ref("");
  const amountInStockError = ref("");
  const requiresPrescriptionModel = ref(false);
  const descriptionModel = ref("");
  const descriptionError = ref("");
  const brandNameModel = ref("");
  const brandNameError = ref("");
  const countryOfOriginModel = ref("");
  const countryOfOriginError = ref("");
  const searchQuery = ref("");
  const drugRecomendations = ref([]);
  const inventoryList = ref([]);
  const pickedSort = ref("Alphabetically");
  const resultCameEmpty = ref("");
  const emptyInventory = ref("");
  const currentDrugToDelete = ref("");
  const hasScrolledToBottom = ref(false)
  //pagination
  var pageNumber = 0;

  watch(nameModel, (newValue, oldValue) => {
    if (newValue !== "") {
      if (validatePrice(newValue)) nameError.value = "";
    }
  });

  watch(priceModel, (newValue, oldValue) => {
    if (newValue !== "") {
      if (validatePrice(newValue)) priceError.value = "";
      else
        priceError.value =
          "Price Must be a Number Greater than 0 and less than 100,000";
    }
  });
  watch(amountInStockModel, (newValue, oldValue) => {
    if (newValue !== "") {
      if (validateInStockAmount(newValue)) amountInStockError.value = "";
      else
        amountInStockError.value =
          "Amount In Stock Must be a Positive Integer Number less than 10,000,000";
    }
  });
  watch(descriptionModel, (newValue, oldValue) => {
    if (newValue !== "") {
      if (validateDrugDescription(newValue)) descriptionError.value = "";
      else
        descriptionError.value =
          "Description Must be greater than 10 characters and less than 500 characters";
    }
  });
  watch(brandNameModel, (newValue, oldValue) => {
    if (newValue !== "") {
      if (validateBrandName(newValue)) brandNameError.value = "";
      else brandNameError.value = "Description Must be less than 50 characters";
    }
  });
  watch(countryOfOriginModel, (newValue, oldValue) => {
    if (newValue !== "") {
      if (validateCountryOfOrigin(newValue)) countryOfOriginError.value = "";
      else countryOfOriginError.value = "Please Use a real country";
    }
  });

  watch(pickedSort, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      getInventory();
    }
  });
  onMounted(() => {
    getInventory();
    confirmDeleteModalRef.value.addEventListener("hidden.bs.modal", function(
      event
    ) {
      currentDrugToDelete.value = "";
    });
    addDrugModalRef.value.addEventListener("show.bs.modal", function(event) {
      // console.log("opened");
    });
    addDrugModalRef.value.addEventListener("hidden.bs.modal", function(event) {
      nameModel.value = "";
      priceModel.value = "";
      amountInStockModel.value = "";
      requiresPrescriptionModel.value = false;
      descriptionModel.value = "";
      brandNameModel.value = "";
      countryOfOriginModel.value = "";
      createDrugError.value = "";
      nameError.value = "";
      priceError.value = "";
      amountInStockError.value = "";
      descriptionError.value = "";
      brandNameError.value = "";
      countryOfOriginError.value = "";
    });
  });

  function debounce(func, timeout = 300) {
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
  const checkIfUpdateIsAllowed = (index) => {
    if (
      Number(inventoryList.value[index]["priceModel"]) !==
        inventoryList.value[index]["price"] &&
      Number(inventoryList.value[index]["amountInStockModel"]) !==
        inventoryList.value[index]["amountInStock"] &&
      inventoryList.value[index]["requiresPrescriptionModel"] !==
        inventoryList.value[index]["requiresPrescription"] &&
      inventoryList.value[index]["countryOfOriginModel"] !==
        inventoryList.value[index]["countryOfOrigin"] &&
      !(
        inventoryList.value[index]["countryOfOriginModel"] === "" &&
        !inventoryList.value[index]["countryOfOrigin"]
      )
    )
      return true;
    else return false;
  };

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
    inventoryList.value[index]["toggleMore"] = !inventoryList.value[index][
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
      el["deleteSuccess"] = false;
      el["deleteFailed"] = false;
      el["deleteError"] = "";
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

  const postLoadInventory = (inventory)=>{
    var currentInventory = inventory;
    currentInventory.map((el) => {
      el["isNotEditable"] = true;
      el["updateFailed"] = false;
      el["updateError"] = "";
      el["updateSuccess"] = false;
      el["deleteSuccess"] = false;
      el["deleteFailed"] = false;
      el["deleteError"] = "";
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
    return currentInventory;


  }

  const queryDrugById = (id) => {
    getDrugById(id)
      .then((response) => {
        if (response.data.length !== 0) {
          inventoryList.value = response.data;
          hasScrolledToBottom.value = true;
          preloadInventory();
        } else {
          resultCameEmpty.value = `Well this is awkward (・_・ヾ`;
          setTimeout(() => {
            resultCameEmpty.value = "";
          }, 10000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    drugRecomendations.value = [];
  };
  const queryDrugByNameOrBrandName = (query) => {
    if (query.trim() !== "") {
      getDrugByNameBrandName(query)
        .then((response) => {
          if (response.data.length !== 0) {
            inventoryList.value = response.data;
          hasScrolledToBottom.value = true;
            preloadInventory();
          } else {
            resultCameEmpty.value = `Sorry we couldn't find anything ¯\\_(ツ)_/¯`;
            setTimeout(() => {
              resultCameEmpty.value = "";
            }, 10000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    drugRecomendations.value = [];
  };

  const loadData = (response,Options)=>{
    
    if(response.data.length!==0){
      pageNumber += 1;
      hasScrolledToBottom.value = false
      if(Options==="reset"){
        inventoryList.value = response.data;
        preloadInventory();
      }
      else{
        
        
        var toInventory = postLoadInventory(response.data)
        toInventory.map((el)=>{
          inventoryList.value.push(el)
        })

      }
      
      
    }
    else {
      emptyInventory.value =
        "Your Inventory Is Currently Empty, Press The Upload Button To Import Data From An Excel(.xlsx) File Or Press The Add Button To Create A Single Drug";
    }
  }
  const getInventory = async (Options="reset") => {
    if(Options==="reset")pageNumber = 0
    emptyInventory.value = "";
    if (pickedSort.value == "Alphabetically") {
      getDrugsAlphabetically(pageNumber)
        .then((response) => loadData(response,Options))
        .catch((error) => {
          console.log(error);
        });
    }
    if (pickedSort.value == "By Date") {
      getDrugsByDate(pageNumber)
        .then((response) => loadData(response,Options))
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const performCreate = async () => {
    var hasErrors = false;
    if (nameModel.value === "") {
      nameError.value = "Field Is Required";
      hasErrors = true;
    }
    if (priceModel.value === "") {
      priceError.value = "Field Is Required";
      hasErrors = true;
    }
    if (amountInStockModel.value === "") {
      amountInStockError.value = "Field Is Required";
      hasErrors = true;
    }
    if (descriptionModel.value === "") {
      descriptionError.value = "Field Is Required";
      hasErrors = true;
    }
    const drug = DrugModel([
      nameModel.value,
      Number(priceModel.value),
      Number(amountInStockModel.value),
      requiresPrescriptionModel.value,
      descriptionModel.value,
      brandNameModel.value === "" ? null : brandNameModel.value,
      countryOfOriginModel.value === "" ? null : countryOfOriginModel.value,
    ]);
    if(drug ===false){
      hasErrors = true;
      }
    if (!hasErrors) {
      createDrugIsSuccessfull.value = false;
      initialCreateDrugPhase.value = false;
      isProcessingCreateDrugPhase.value = true;
      createDrug(
        drug
      )
        .then((response) => {
          createDrugIsSuccessfull.value = true;
          initialCreateDrugPhase.value = true;
          isProcessingCreateDrugPhase.value = false;
        })
        .catch((error) => {
          isProcessingCreateDrugPhase.value = false;
          initialCreateDrugPhase.value = true;
          if (error.status === "Invalid Data") {
            console.log(error.data);
            const errKeys = Object.keys(error.data);
            if (errKeys.includes("repetitionError"))
              createDrugError.value =
                "This Drug Already Exists In Your Database";
            if (errKeys.includes("validationError"))
              createDrugError.value = "Validation Errors Occured In Server";
          } else if (error.status === "drug is required") {
            createDrugError.value = "Something went wrong while data was being sent";
          } else {
            console.log(error);
            createDrugError.value = "Please Check Your Connection";
          }
        });
    }else{
      createDrugError.value = "An Error In Validation";
    }
  };

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
    if (hasErrors === false && updateJsonKeys.length !== 0) {
      updateJson["id"] = inventoryList.value[index]["_id"];
      inventoryList.value[index]["isProcessing"] = true;

      updateDrug(updateJson)
        .then((response) => {
          inventoryList.value[index]["isProcessing"] = false;
          if (response.status === "Pass") {
            inventoryList.value[index]["updateSuccess"] = true;
            inventoryList.value[index]["isNotEditable"] = true;
            updateJsonKeys.forEach((key) => {
              inventoryList.value[index][key] = updateJson[key];
            });
            setTimeout(() => {
              inventoryList.value[index]["updateSuccess"] = false;
            }, 2000);
          }
        })
        .catch((error) => {
          inventoryList.value[index]["isProcessing"] = false;
          inventoryList.value[index]["updateFailed"] = true;
          if (error.status) {
            if (error.status === "Invalid Data") {
              inventoryList.value[index][
                "updateError"
              ] = `The Error was caused by ${error.Error}`;
              inventoryList.value[index][`${error.Error}Error`] =
                "Rejected By Server";
            }
            if (error.status === "Invalid Request") {
              inventoryList.value[index][
                "updateError"
              ] = `Please check your connection`;
            }
            if (error.status === "Data is required") {
              inventoryList.value[index][
                "updateError"
              ] = `Please stop making empty requests`;
            }
            if (error.status === "Fail D") {
              inventoryList.value[index][
                "updateError"
              ] = `Please contact the developers to report this error`;
            }
            if (error.status === "Fail") {
              console.log(error.data);
              inventoryList.value[index][
                "updateError"
              ] = `Please contact the developers to report this error`;
            }
          } else {
            inventoryList.value[index][
              "updateError"
            ] = `Please Check Your Connection`;
          }
        });
    }
  };

  const performDelete = async (index) => {
    const id = inventoryList.value[index]["_id"];
    inventoryList.value[index]["isProcessing"] = true;
    deleteDrug(id)
      .then((response) => {
        inventoryList.value[index]["isProcessing"] = false;
        if (response.status === "Pass") {
          inventoryList.value[index]["deleteSuccess"] = true;
          setTimeout(() => {
            inventoryList.value.splice(index, 1);
          }, 2000);
        }
      })
      .catch((error) => {
        inventoryList.value[index]["isProcessing"] = false;
        inventoryList.value[index]["deleteFailed"] = true;
        if (error.status) {
          if (error.status === "ID is required") {
            inventoryList.value[index]["deleteError"] = "Request Is Missing ID";
          } else if (error.status === "Fail D") {
            inventoryList.value[index]["deleteError"] = "Unknown Error";
          } else if (error.status === "Fail") {
            inventoryList.value[index]["deleteError"] = error.data;
          }
        } else {
          inventoryList.value[index]["deleteError"] =
            "Please Check Your Connection";
        }
      });
  };

  return {
    initialCreateDrugPhase,
    createDrugError,
    isProcessingCreateDrugPhase,
    createDrugIsSuccessfull,
    addDrugModalRef,
    confirmDeleteModalRef,
    nameModel,
    nameError,
    priceModel,
    priceError,
    amountInStockModel,
    amountInStockError,
    requiresPrescriptionModel,
    descriptionModel,
    descriptionError,
    brandNameModel,
    brandNameError,
    countryOfOriginModel,
    countryOfOriginError,
    searchQuery,
    inventoryList,
    pickedSort,
    drugRecomendations,
    resultCameEmpty,
    emptyInventory,
    currentDrugToDelete,
    hasScrolledToBottom,
    disableDeleteFailedMessage,
    disableUpdateMessage,
    toggleMore,
    checkIfUpdateIsAllowed,
    toggleEditable,
    getInventory,
    processChange,
    queryDrugById,
    queryDrugByNameOrBrandName,
    performCreate,
    performUpdate,
    performDelete,
  };
};

export { inventoryHome };
