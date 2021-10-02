import { ref, watch, onMounted } from "vue";
import {
  getSubscriptions,
  getRequests,
  stockOrRemoveRequest,
  declineRequestOrRemoveDecline,
} from "../../repository/notificationRepository";
import { validateDrugName, validateInStockAmount } from "../../models/drug.js";
import {
  updateDrug,
  getRecommendations,
} from "../../repository/inventoryRepository";
import { Modal } from "bootstrap";

const notification = () => {
  const loadedNotificationType = ref("Subscriptions");
  const notificationType = ref("Subscriptions");
  const filterBy = ref("Subscriber-Count");
  const notifications = ref([]);
  const errorMessage = ref("");
  const successMessage = ref("");
  const isProcessing = ref(false);
  var pageNumber = 0;
  var currentDateAccordingToServer = Date.now();
  var hasScrolledToBottom = false;
  const defaultRestockAmount = 10;
  const currentSubscriptionToRestock = ref("");
  const currentRequest = ref("");
  const currentRequestToSearch = ref("");
  const currentRequestToDecline = ref("");
  const confirmRestockModalRef = ref(false);
  const confirmDeleteRequestedDrugModalRef = ref(false);
  const searchDrugModalRef = ref(false);
  const requestDeclineModalRef = ref(false);
  const deleteDeclineModalRef = ref(false);
  const searchQuery = ref("");
  const selectedSearchDrug = ref("");
  const recommendedDrugs = ref([]);
  var confirmRestockModal = null;
  var confirmDeleteDrugModal = null;
  var requestDeclineModal = null;
  var searchDrugModal = null;
  var deleteDeclineModal = null;

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const processChange = debounce(() => {
    if (searchQuery.value != "") {
      return processQuery();
    } else {
      return (recommendedDrugs.value = []);
    }
  });

  function processQuery() {
    getRecommendations(searchQuery.value)
      .then((response) => {
        recommendedDrugs.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const filterExpiredUserSubscriptions = (expirationDates) => {
    const keys = Object.keys(expirationDates);
    var lastExpirationDate = 0;
    keys.map((el) => {
      if (expirationDates[el] > lastExpirationDate) {
        lastExpirationDate = expirationDates[el];
      }
      if (expirationDates[el] <= currentDateAccordingToServer) {
        delete expirationDates[el];
      }
    });
    const Count = Object.keys(expirationDates).length;
    return { expirationDates, Count, lastExpirationDate };
  };

  onMounted(() => {
    confirmRestockModalRef.value.addEventListener("hidden.bs.modal", function(
      event
    ) {
      getNotifications("reset");
      setTempValueToDefault();
    });
    confirmDeleteRequestedDrugModalRef.value.addEventListener(
      "hidden.bs.modal",
      function(event) {
        setTempValueToDefault();
      }
    );
    searchDrugModalRef.value.addEventListener("hidden.bs.modal", function(
      event
    ) {
      setTempValueToDefault();
    });

    requestDeclineModalRef.value.addEventListener("hidden.bs.modal", function(
      event
    ) {
      currentRequestToDecline.value["replyModel"] = currentRequestToDecline.value["declineDescription"];
      setTempValueToDefault();
    });

    deleteDeclineModalRef.value.addEventListener("hidden.bs.modal", function(
      event
    ) {
      setTempValueToDefault();
    });

    function setTempValueToDefault() {

      currentRequestToDecline.value = "";
      currentSubscriptionToRestock.value = "";
      currentRequest.value = "";
      selectedSearchDrug.value = "";
      currentRequestToSearch.value = "";
      recommendedDrugs.value = [];
      selectedSearchDrug.value = "";
      currentRequestToDecline.value = "";
      errorMessage.value = "";
      successMessage.value = "";
      isProcessing.value = false;
    }

    getNotifications("reset");
  });

  watch(notificationType, (newValue, oldValue) => {
    pageNumber = 0;
    getNotifications("reset");
  });

  watch(filterBy, (newValue, oldValue) => {
    pageNumber = 0;
    getNotifications("reset");
  });

  const getNotifications = (Options = "reset") => {
    const getNotifictionType =
      notificationType.value === "Subscriptions"
        ? getSubscriptions
        : getRequests;
    getNotifictionType(filterBy.value, Options === "reset" ? 0 : pageNumber)
      .then((response) => {
        if (Array.isArray(response.data)) {
          if (response.data.length === 0) {
            hasScrolledToBottom = true;
          } else {
            if (hasScrolledToBottom === true) hasScrolledToBottom = false;
            pageNumber += 1;
            currentDateAccordingToServer = response.date;
            if (notifications.value.length === 0 || Options === "reset") {
              notifications.value = response.data;
              loadNotifications();
            } else {
              loadNotifications(response.data);
            }
          }
        } else {
          console.log("Please Report This Error ");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadNotifications = (defaultValue = null) => {
    var valueToBeParsed =
      defaultValue === null ? notifications.value : defaultValue;
    if (notificationType.value === "Subscriptions") {
      valueToBeParsed.map((el) => {
        el["showReplyBox"] = false;
        el["amountInStockModel"] = defaultRestockAmount;
        el["amountInStockError"] = "";
        const {
          expirationDates,
          Count,
          lastExpirationDate,
        } = filterExpiredUserSubscriptions(el["expirationDates"]);
        el["expirationDates"] = expirationDates;
        el["userCount"] = Count;
        el["expirationDate"] = new Date(lastExpirationDate).toLocaleString();
        el["creationDate"] = new Date(el["creationDate"]).toLocaleString();
        el["editDate"] =
          el["editDate"] === undefined
            ? ""
            : new Date(el["editDate"]).toLocaleString();
        el["brandName"] = el["brandName"] === undefined ? "" : el["brandName"];
        el["processing"] = false;
      });
    } else {
      valueToBeParsed.map((el) => {
        el["showReplyBox"] = false;
        el["replyModel"] = "";
        el["replyError"] = "";
        const {
          expirationDates,
          Count,
          lastExpirationDate,
        } = filterExpiredUserSubscriptions(el["expirationDates"]);
        el["expirationDates"] = expirationDates;
        el["userCount"] = Count;
        el["expirationDate"] = new Date(lastExpirationDate).toLocaleString();
        el["creationDate"] = new Date(el["creationDate"]).toLocaleString();
        el["editDate"] =
          el["editDate"] === undefined
            ? ""
            : new Date(el["editDate"]).toLocaleString();
        el["status"] = "Pending";
        if (el["isAvailable"] === true) {
          el["drug"] = el["drug"][0];
          el["status"] = "Completed";
          el['backgroundColor'] = '#E8FFE8'

        }
        if (el["decline"] === true) {
          el['backgroundColor'] = '#FDE6E6'
          el["status"] = "Declined";
          el["replyModel"] = el["declineDescription"];
        }
      });
      console.log(valueToBeParsed)
    }
    loadedNotificationType.value = notificationType.value;

    if (defaultValue !== null) {
      defaultValue.map((el) => {
        notifications.value.push(el);
      });
    }
  };

  const catchErrors = (error)=>{
    isProcessing.value = false;

        if (error.status) {
          if (error.status === "Invalid Data") {
            errorMessage.value = `The Error was caused by ${error.Error}`;
          }
          if (error.status === "Unable To Find Request") {
            errorMessage.value = `Unable To Find Request`;
          }
          if (error.status === "Unable To Find Drug") {
            errorMessage.value = `Coudn't find Drug, This should not be happening`;
          }
          if (error.status === "Incorrect Reply") {
            errorMessage.value = `Decline Description Was Incorrect, This should not be happening`;
          }
          if (error.status === "Drug Is Empty") {
            errorMessage.value = `You can't submit an empty Drug, Please consider restocking it`;
          }
          if (error.status === "Unsimilarity Error") {
            var brandName =
              selectedSearchDrug.value.brandName === undefined
                ? " "
                : `with Brand Name ${selectedSearchDrug.value.brandName} `;
            errorMessage.value =
              `${selectedSearchDrug.value.name}` +
              ` ${brandName} does not match ${currentRequestToSearch.value.name}`;
          }
          if (error.status === "Invalid Request") {
            errorMessage.value = `Please check your connection`;
          }
          if (error.status === "Data is required") {
            errorMessage.value = `Please stop making empty requests`;
          }
          if (error.status === "Fail D") {
            errorMessage.value = `Please contact the developers to report this error`;
          }
          if (error.status === "Fail") {
            console.log(error.data);
            errorMessage.value = `Please contact the developers to report this error`;
          }
        } else {
          errorMessage.value = `Please Check Your Connection`;
        }
  }

  const deleteDrugInRequest = () => {
    const id = notifications.value[currentRequest.value]["_id"];
    const drugId = notifications.value[currentRequest.value]["drugId"];
    const remove = true;
    isProcessing.value = true;
    stockOrRemoveRequest(id, drugId, remove)
      .then((response) => {
        isProcessing.value = false;
        successMessage.value =
          "You Have Successfully Removed The Drug From Your Request";
        setTimeout(() => {
          closeConfirmDrugDeleteModal();
        }, 1000);
        getNotifications("reset");
      })
      .catch((error) => {
        catchErrors(error)
        getNotifications("reset");
      });
  };

  const declineRequest = () => {
    const requestId = currentRequestToDecline.value._id;
    const declineDescription = currentRequestToDecline.value.replyModel;
    const remove = false;
    isProcessing.value = true;
    declineRequestOrRemoveDecline(requestId,declineDescription,remove).then(
      (response)=>{
        isProcessing.value = false;
        successMessage.value = "You Have Successfully Declined The Request, You Can Always Remove Your Decline If You Wish";
        setTimeout(() => {
          closeRequestDeclineModal();
        }, 1000);
        getNotifications("reset");
      })
      .catch((error)=>{
        catchErrors(error)
        getNotifications("reset");
      })

  }

  const deleteDecline = () => {
    const requestId = currentRequestToDecline.value._id;
    const declineDescription = currentRequestToDecline.value.replyModel;
    const remove = true;
    isProcessing.value = true;
    declineRequestOrRemoveDecline(requestId,declineDescription,remove).then(
      (response)=>{
        isProcessing.value = false;
        successMessage.value = `You Have Successfully Lifted The Restriction`;
        setTimeout(() => {
          closeDeleteDeclineModal();
        }, 1000);
        getNotifications("reset");
      })
      .catch((error)=>{
        catchErrors(error)
        getNotifications("reset");
      })
  }

  const submitDrugToRequest = () => {
    const requestId = currentRequestToSearch.value._id;
    const id = selectedSearchDrug.value._id;
    isProcessing.value = true;
    searchQuery.value = "";
    recommendedDrugs.value = [];
    stockOrRemoveRequest(requestId, id, false)
      .then((response) => {
        isProcessing.value = false;
        successMessage.value = `Drug Has Successfully Been Attached To Request`;
        setTimeout(() => {
          closeSearchDrugModal();
        }, 1000);
        getNotifications("reset");
      })
      .catch((error) => {
        catchErrors(error)
      });
  };

  const confirmRestock = () => {
    const amountInStock = Number(
      notifications.value[currentSubscriptionToRestock.value][
        "amountInStockModel"
      ]
    );
    const drugId =
      notifications.value[currentSubscriptionToRestock.value]["drugId"];
    isProcessing.value = true;
    updateDrug({ id: drugId, amountInStock: amountInStock })
      .then((response) => {
        isProcessing.value = false;
        successMessage.value = "You Have Successfully Restocked";
        getNotifications("reset");
        setTimeout(() => {
          closeConfirmRestockModal();
        }, 1000);
        
      })
      .catch((error) => {
        catchErrors(error)
        getNotifications("reset");
      });
  };

  const showConfirmRestockModal = () => {
    confirmRestockModal = new Modal(document.getElementById("confirmRestock"), {
      keyboard: false,
    });
    confirmRestockModal.show();
  };

  const closeConfirmRestockModal = () => {
    confirmRestockModal.hide();
  };

  const showConfirmDrugDeleteModal = (index) => {
    currentRequest.value = index;
    confirmDeleteDrugModal = new Modal(
      document.getElementById("confirmDeleteDrug"),
      { keyboard: false }
    );

    confirmDeleteDrugModal.show();
  };

  const closeConfirmDrugDeleteModal = () => {
    confirmDeleteDrugModal.hide();
  };

  const showSearchDrugModal = (notification) => {
    currentRequestToSearch.value = notification;
    searchDrugModal = new Modal(document.getElementById("searchDrug"), {
      keyboard: false,
    });

    searchDrugModal.show();
  };

  const closeSearchDrugModal = () => {
    searchDrugModal.hide();
  };

  const showRequestDeclineModal = (index) => {
    currentRequestToDecline.value = notifications.value[index];
    requestDeclineModal = new Modal(document.getElementById("requestDecline"), {
      keyboard: false,
    });

    requestDeclineModal.show();
  };

  const closeRequestDeclineModal = () => {
    requestDeclineModal.hide();
  };

  const showDeleteDeclineModal = (index)=> {
    currentRequestToDecline.value = notifications.value[index];
    deleteDeclineModal = new Modal(document.getElementById("deleteDecline"), {
      keyboard: false,
    });
    deleteDeclineModal.show();
  }
  const closeDeleteDeclineModal = () => {
    deleteDeclineModal.hide();
  };



  const restock = (index) => {
    const amountInStock = Number(
      notifications.value[index]["amountInStockModel"]
    );
    if (!validateInStockAmount(amountInStock)) {
      notifications.value[index]["amountInStockError"] =
        "Please Make Sure that the amount in stock is a positive number less than 100,000";
      notifications.value[index]["amountInStockModel"] = 10;
      setTimeout(() => {
        notifications.value[index]["amountInStockError"] = "";
      }, 5000);
    } else {
      currentSubscriptionToRestock.value = index;
      showConfirmRestockModal();
    }
  };

  const handleScroll = (el) => {
    if (hasScrolledToBottom === false) {
      if (
        el.target.scrollingElement.scrollTop + el.path[1].innerHeight + 30 >
        el.target.scrollingElement.scrollHeight
      ) {
        hasScrolledToBottom = true;
        getNotifications("load");
      }
    }
  };

  return {
    loadedNotificationType,
    notificationType,
    filterBy,
    notifications,
    errorMessage,
    successMessage,
    isProcessing,
    confirmRestockModalRef,
    currentSubscriptionToRestock,
    currentRequest,
    currentRequestToSearch,
    currentRequestToDecline,
    confirmDeleteRequestedDrugModalRef,
    recommendedDrugs,
    searchDrugModalRef,
    searchQuery,
    selectedSearchDrug,
    requestDeclineModalRef,
    requestDeclineModal,
    deleteDeclineModalRef,
    processChange,
    showSearchDrugModal,
    showConfirmDrugDeleteModal,
    showRequestDeclineModal,
    showDeleteDeclineModal,
    handleScroll,
    restock,
    confirmRestock,
    submitDrugToRequest,
    deleteDrugInRequest,
    declineRequest,
    deleteDecline
  };
};

export { notification };
