import { ref, watch, onMounted } from "vue";
import { getSubscriptions } from "../../repository/notificationRepository";
import {validateInStockAmount} from '../../models/drug.js';
import {updateDrug} from "../../repository/inventoryRepository";
import { Modal } from 'bootstrap'

const notification = () => {
  const notificationType = ref("SUBSCRIPTIONS");
  const notifications = ref([]);
  const errorMessage = ref("");
  const successMessage = ref('');
  const isProcessing = ref(false);
  var pageNumber = 0;
  var currentDateAccordingToServer = Date.now();
  var hasScrolledToBottom = false;
  const defaultRestockAmount = 10;
  const currentSubscriptionToRestock = ref('');
  const confirmRestockModalRef = ref(false);
  var myModal = null;

  const filterExpiredUserSubscriptions = (expirationDates) => {
    const keys = Object.keys(expirationDates);
    keys.map((el) => {
      if (expirationDates[el] <= currentDateAccordingToServer) {
        delete expirationDates[el];
      }
    });
    const Count = Object.keys(expirationDates).length;
    return {expirationDates,Count};
  };

  onMounted(() => {
    confirmRestockModalRef.value.addEventListener("hidden.bs.modal", function(
        event
      ) {
        currentSubscriptionToRestock.value = '';
        errorMessage.value = '';
        successMessage.value = '';
        isProcessing.value = false;
      });


    getNotifications('reset')
  });

  const getNotifications = (Options = "reset") => {
    getSubscriptions(Options==="reset"?0:pageNumber)
      .then((response) => {
        if (Array.isArray(response.data)) {
          if (response.data.length === 0) {hasScrolledToBottom = true;} 
          else {
            if (hasScrolledToBottom === true) hasScrolledToBottom = false;
            pageNumber += 1;
            currentDateAccordingToServer = response.date;
            if (notifications.value.length === 0 || Options === "reset") {
              notifications.value = response.data;
              preloadNotifications();
            } else {
              postLoadNotifications(response.data);
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

  const preloadNotifications = () => {
    notifications.value.map((el) => {
      el["showEditable"] = false;
      el["amountInStockModel"] = defaultRestockAmount;
      el["amountInStockError"] = '';
      const {expirationDates,Count} = filterExpiredUserSubscriptions(
        el["expirationDates"]
      );
      el["expirationDates"] = expirationDates;
      el["userCount"] = Count;
      el["creationDate"] = new Date(el["creationDate"]).toLocaleString();
      el["editDate"] =
        el["editDate"] === undefined
          ? ""
          : new Date(el["editDate"]).toLocaleString();
      el["brandName"] = el["brandName"] === undefined ? "" : el["brandName"];
      el["processing"] = false;
    });
  };

  const postLoadNotifications = (Notfications) => {
    Notifications.value.map((el) => {
        el["showEditable"] = false;
        el["newAmountInStockModel"] = defaultRestockAmount;
        const {expirationDates,Count} = filterExpiredUserSubscriptions(
          el["expirationDates"]
        );
        el["expirationDates"] = expirationDates;
        el["userCount"] = Count;
        el["creationDate"] = new Date(el["creationDate"]).toLocaleString();
        el["editDate"] =
          el["editDate"] === undefined
            ? ""
            : new Date(el["editDate"]).toLocaleString();
        el["brandName"] = el["brandName"] === undefined ? "" : el["brandName"];
        el["processing"] = false;
    });
    Notifications.map((el) => {
      notifications.value.push(el);
    });
  };

  const confirmRestock=()=>{
    const amountInStock = Number(notifications.value[currentSubscriptionToRestock.value]["amountInStockModel"]);
    const drugId = notifications.value[currentSubscriptionToRestock.value]["drugId"]
    isProcessing.value = true;
    updateDrug({'id':drugId,"amountInStock":amountInStock})
    .then((response)=>{
        isProcessing.value = false;
        successMessage.value = 'You Have Successfully Restocked';
        setTimeout(()=>{
            closeModal();
        },1000)
        getNotifications('reset');
        
    })
    .catch((error)=>{
        isProcessing.value = false;
        if (error.status) {
            if (error.status === "Invalid Data") {
                errorMessage.value = `The Error was caused by ${error.Error}`;
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
          
    })
  }
  const showModal=()=>{
    myModal = new Modal(document.getElementById('confirmDelete'), {
      keyboard: false
    })
    myModal.show();
  }
  const closeModal=()=>{
      myModal.hide();
  }

  const restock = (index)=>{
    const amountInStock = Number(notifications.value[index]["amountInStockModel"]);
    if (!validateInStockAmount(amountInStock)){
        notifications.value[index]["amountInStockError"]='Please Make Sure that the amount in stock is a positive number less than 100,000';
        notifications.value[index]["amountInStockModel"]=10;
        setTimeout(() => {
            notifications.value[index]["amountInStockError"] = "";
          }, 5000);
    
    }else{
        currentSubscriptionToRestock.value = index;
        showModal();
        
    }
  }

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

  return { notificationType, notifications, errorMessage,successMessage,isProcessing,confirmRestockModalRef,currentSubscriptionToRestock, handleScroll,restock,confirmRestock };
};

export { notification };
