import { ref, watch, onMounted, onUnmounted } from "vue";
import {
  getRecommendations,
  getDrugsAlphabetically,
  getDrugById,
  getDrugByNameBrandName,
  getDrugsByDate,
  createDrug,
  updateDrug,
  deleteDrug,
  getReviewsByDrugId,
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

import { useRoute } from "vue-router";
// const io = require("socket.io-client");
// const socket = io("http://localhost:5000/",{
//   path: "/socket.io/",
//   extraHeaders: {
//   }
// });
import store from "../../store";

function navigationType() {
  var result;
  var p;

  if (window.performance.navigation) {
    result = window.performance.navigation;
    if (result == 255) {
      result = 4;
    } // 4 is my invention!
  }

  if (window.performance.getEntriesByType("navigation")) {
    p = window.performance.getEntriesByType("navigation")[0].type;

    if (p == "navigate") {
      result = 0;
    }
    if (p == "reload") {
      result = 1;
    }
    if (p == "back_forward") {
      result = 2;
    }
    if (p == "prerender") {
      result = 3;
    } //3 is my invention!
  }
  return result;
}

const inventoryHome = () => {
  const currentScrollPosition = ref(0);
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
  const hasScrolledToBottom = ref(true);
  var disableScrollBehavior = false;
  const loadingInventory = ref(false);
  const getInventoryError = ref("");
  const route = useRoute();
  const drugReviewsModal = ref("");
  const currentlyLoadedDrugReviews = ref({
    loadedReviews: [],
    index: 0,
    drugName: "",
    drugBrandName: "",
    disableNextPage: false,
    fetchingReviews: false,
    fetchingReviewsError: "",
  });
  //pagination
  var pageNumber = 0;

  onUnmounted(() => {
    disableScrollBehavior = true;
    store.dispatch("setInventoryState", {
      drugsInSession: inventoryList.value,
      scrollDistanceInInventory: currentScrollPosition.value,
      pageNumberInInventory: pageNumber,
      sortFieldInventory: pickedSort.value,
      hasScrolledToBottomInInventory: hasScrolledToBottom.value,
    });
  });

  watch(nameModel, (newValue, oldValue) => {
    if (newValue !== "") {
      if (validateDrugName(newValue)) nameError.value = "";
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

  onMounted(() => {
    if (navigationType() == 0 && route.params.loadType === undefined) {
      // console.log("page was backed up to");
      // console.log(store.getters.getInventoryState)
      var [
        drugsInSession,
        scrollDistanceInInventory,
        pageNumberInInventory,
        sortFieldInventory,
        hasScrolledToBottomInInventory,
      ] = store.getters.getInventoryState;
      if (drugsInSession === false) {
        getInventory();
      } else {
        pickedSort.value = sortFieldInventory;
        inventoryList.value = drugsInSession;
        pageNumber = pageNumberInInventory;
        hasScrolledToBottom.value = hasScrolledToBottomInInventory;

        setTimeout(() => {
          // hasScrolledToBottom.value = false;
          window.scroll({
            top: scrollDistanceInInventory,
            left: 0,
            behavior: "smooth",
          });
        }, 100);
      }
    } else {
      if (
        route.params.loadType === "discardSession" ||
        route.params.loadType === undefined
      ) {
        getInventory();
      }
      if (route.params.loadType === "getDrug") {
        queryDrugById(route.params.drugId);
      }
    }

    watch(pickedSort, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        getInventory();
      }
    });

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

  const handleScroll = (el) => {
    if (
      hasScrolledToBottom.value === false &&
      disableScrollBehavior === false
    ) {
      currentScrollPosition.value = el.target.scrollingElement.scrollTop;
      if (
        el.target.scrollingElement.scrollTop + el.path[1].innerHeight + 30 >
        el.target.scrollingElement.scrollHeight
      ) {
        console.log("has reached the bottom");
        getInventory("Load");
        hasScrolledToBottom.value = true;
      }
    }
  };

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
    resultCameEmpty.value = "";
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

  const preloadInventory = (inventory = null) => {
    var currentInventory = inventory === null ? inventoryList.value : inventory;
    
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
      el["reviewsCount"] = el["reviewsCount"];
      el["reviewsPageNumber"] = 0;
      el["loadedReviews"] = [];
      el["disableNextPage"] = false;
      el["fetchingReviews"] = false;
      el["fetchingReviewsError"] = "";
    });
    if (inventory !== null) {
      currentInventory.map((el) => {
        inventoryList.value.push(el);
      });
    }
  };

  const formatReviews = (index, reviews) => {
    reviews.map((el) => {
      el["showReplyBox"] = false;
      el["replyError"] = "";
      el["replyModel"] = el.pharmacyReply === undefined ? "" : el.pharmacyReply;
      el["creationDate"] = new Date(el["creationDate"]).toLocaleString();
      el["editDate"] =
        el.editDate === undefined
          ? ""
          : new Date(el["editDate"]).toLocaleString();
      el.pharmacyReply = el.pharmacyReply === undefined ? "" : el.pharmacyReply;
      el["processing"] = false;
    });
    reviews.map((el) => {
      inventoryList.value[index]["loadedReviews"].push(el);
    });
    currentlyLoadedDrugReviews.value["loadedReviews"] =
      inventoryList.value[index]["loadedReviews"];
    currentlyLoadedDrugReviews.value["index"] = index;
    currentlyLoadedDrugReviews.value["drugName"] =
      inventoryList.value[index]["name"];
    currentlyLoadedDrugReviews.value["drugBrandName"] =
      inventoryList.value[index]["brandName"];
  };

  const getReviewsForDrug = (index, Option = "load", openModal = false) => {
    const drugId = inventoryList.value[index]["_id"];
    if (
      inventoryList.value[index]["disableNextPage"] === true &&
      Option !== "reset"
    )
      return;
    if (Option === "reset") inventoryList.value[index]["loadedReviews"] = [];
    inventoryList.value[index]["fetchingReviews"] = true;
    currentlyLoadedDrugReviews.value["fetchingReviews"] = true;
    var pageNumber;
    if (Option === "load") {
      pageNumber = inventoryList.value[index]["reviewsPageNumber"];
    } else {
      pageNumber = 0;
      inventoryList.value[index]["reviewsPageNumber"] = 0;
      inventoryList.value[index]["loadedReviews"] = [];
    }

    getReviewsByDrugId(drugId, pageNumber)
      .then((response) => {
        inventoryList.value[index]["fetchingReviews"] = false;
        currentlyLoadedDrugReviews.value["fetchingReviews"] = false;
        if (response.data.length !== 0) {
          if (response.data.length < 10) {
            inventoryList.value[index]["disableNextPage"] = true;
            currentlyLoadedDrugReviews.value["disableNextPage"] = true;
          } else
            inventoryList.value[index]["reviewsPageNumber"] = pageNumber + 1;
          formatReviews(index, response.data);
          if (pageNumber === 0 && openModal === true) {
            drugReviewsModal.value.showDrugReviewModal();
          }
        } else {
          inventoryList.value[index]["disableNextPage"] = true;
          currentlyLoadedDrugReviews.value["disableNextPage"] = true;
        }
      })
      .catch((error) => {
        inventoryList.value[index]["fetchingReviews"] = false;
        inventoryList.value[index]["fetchingReviewsError"] =
          "Couldn`t fetch reviews, Try Again...";
        currentlyLoadedDrugReviews.value["fetchingReviews"] = false;
        currentlyLoadedDrugReviews.value["fetchingReviewsError"] =
          "Couldn`t fetch reviews, Try Again...";

        setTimeout(() => {
          inventoryList.value[index]["fetchingReviewsError"] = "";
          currentlyLoadedDrugReviews.value["fetchingReviewsError"] = "";
        }, 5000);
      });
  };

  const queryDrugById = (id) => {
    loadingInventory.value = true;
    getDrugById(id)
      .then((response) => {
        loadingInventory.value = false;
        if (response.data.length !== 0) {
          inventoryList.value = response.data;
          hasScrolledToBottom.value = true;
          preloadInventory();
        } else {
          resultCameEmpty.value = `Well this is awkward (・_・ヾ`;
          if (route.params.drugId !== undefined) {
            emptyInventory.value = "The Drug Is No Longer In Your Inventory";
          }
          setTimeout(() => {
            resultCameEmpty.value = "";
          }, 5000);
        }
      })
      .catch((error) => {
        loadingInventory.value = false;
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
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    drugRecomendations.value = [];
  };

  const loadData = (response, Options) => {
    if (response.data.length !== 0) {
      pageNumber += 1;
      if (Options === "reset") {
        inventoryList.value = response.data;
        preloadInventory();
      } else {
        preloadInventory(response.data);
      }
      hasScrolledToBottom.value = false;
    } else {
      emptyInventory.value =
        "Your Inventory Is Currently Empty, Press The Upload Button To Import Data From An Excel(.xlsx) File Or Press The Add Button To Create A Single Drug";
    }
  };
  const getInventory = async (Options = "reset") => {
    if (Options === "reset") pageNumber = 0;
    loadingInventory.value = true;
    emptyInventory.value = "";
    if (pickedSort.value == "Alphabetically") {
      getDrugsAlphabetically(pageNumber)
        .then((response) => {
          loadingInventory.value = false;
          loadData(response, Options);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (pickedSort.value == "By Date") {
      getDrugsByDate(pageNumber)
        .then((response) => {
          loadingInventory.value = false;
          loadData(response, Options);
        })
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
    if (drug === false) {
      hasErrors = true;
    }
    if (!hasErrors) {
      createDrugIsSuccessfull.value = false;
      initialCreateDrugPhase.value = false;
      isProcessingCreateDrugPhase.value = true;
      createDrug(drug)
        .then((response) => {
          createDrugIsSuccessfull.value = true;
          initialCreateDrugPhase.value = true;
          isProcessingCreateDrugPhase.value = false;
          getInventory();
        })
        .catch((error) => {
          isProcessingCreateDrugPhase.value = false;
          initialCreateDrugPhase.value = true;
          if (error.status === "Invalid Data") {
            const errKeys = Object.keys(error.data);
            if (errKeys.includes("repetitionError"))
              createDrugError.value =
                "This Drug Already Exists In Your Database";
            if (errKeys.includes("validationError"))
              createDrugError.value = "Validation Errors Occured In Server";
          } else if (error.status === "drug is required") {
            createDrugError.value =
              "Something went wrong while data was being sent";
          } else {
            console.log(error);
            createDrugError.value = "Please Check Your Connection";
          }
        });
    }
    // else{
    //   createDrugError.value = "An Error In Validation";
    // }
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
    } else if (updateJsonKeys.length === 0) {
      inventoryList.value[index]["updateFailed"] = true;
      inventoryList.value[index]["updateError"] = `Drug Has Not Been Edited`;
      setTimeout(() => {
        inventoryList.value[index]["updateFailed"] = false;
        inventoryList.value[index]["updateError"] = "";
      }, 2000);
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
    currentScrollPosition,
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
    handleScroll,
    loadingInventory,
    getInventoryError,
    getReviewsForDrug,
    drugReviewsModal,
    currentlyLoadedDrugReviews,
  };
};

export { inventoryHome };
