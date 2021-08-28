<template>
  <section id="Notification">
    <div class="modal fade" 
        ref="confirmRestockModalRef"
        
        id="confirmDelete"
        tabindex="-1"
        aria-labelledby="confirmRestockLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-dark text-white">
              <h5 class="modal-title" id="confirmRestockLabel">ARE YOU SURE?</h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div v-if="currentSubscriptionToRestock !== ''" class="modal-body">
              <div v-if="isProcessing===false && errorMessage==='' && successMessage===''">
                <strong
                >YOU ARE ABOUT TO RESTOCK {{notifications[currentSubscriptionToRestock]['amountInStockModel']}} UNITS OF
                <p class="text-success" v-if="currentSubscriptionToRestock !== ''">
                  {{notifications[currentSubscriptionToRestock]['name']}}
                </p>
                <p  v-if="notifications[currentSubscriptionToRestock]['brandName']!==''">
                  WITH BRAND NAME <span class="text-success">{{notifications[currentSubscriptionToRestock]['brandName']}}</span>
                </p></strong>
              </div>
              <div v-if="isProcessing===true" class="d-flex justify-content-center">
                  <div class="spinner-border " role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
              </div>
              <div v-if="errorMessage!==''">
                <p class="text-success"> <strong>{{errorMessage}}</strong></p>
              </div>
              <div v-if="successMessage!==''">
                <p class="text-success"><strong>{{successMessage}}</strong></p>
              </div>
            </div>
            
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-dark"
                data-bs-dismiss="modal"
              >
                CLOSE
              </button>
              <button
                :disabled="isProcessing || errorMessage!=='' || successMessage!==''"
                type="button"
                class="btn btn-success"
                @click="confirmRestock()"
              >
                RESTOCK
              </button>
            </div>
          </div>
        </div>
      </div> 
    <div class="container-md"  v-scroll="handleScroll">
      
      <div
        class="row align-items-center text-start mb-5 d-flex  justify-content-end"
        id="Heading"
      >
        <div
          class="
            col-md-12
            py-4
            ps-5
            display-4
            d-flex
            justify-content-between
            align-items-end
          "
          style="font-family: 'Times New Roman', serif"
        >
          <span class="fs-1">Notifications</span>
          <div class="d-inline me-4">
            <div class="d-inline me-2">
              <input
                type="radio"
                class="btn-check"
                name="options-outlined"
                id="primary-outlined"
                value="SUBSCRIPTIONS"
                autocomplete="off"
                v-model="notificationType"
                checked
              />
              <label class="btn btn-outline-dark" for="primary-outlined"
                >SUBSCRIPTIONS</label
              >
            </div>

            <div class="d-inline">
              <input
                type="radio"
                class="btn-check ps-3"
                name="options-outlined"
                id="danger-outlined"
                value="REQUESTS"
                v-model="notificationType"
                autocomplete="off"
              />
              <label class="btn btn-outline-dark" for="danger-outlined"
                >REQUESTS</label
              >
            </div>
          </div>
        </div>
      </div>
      <div class="row d-flex justify-content-center ">
        <div class="col-md-12 d-flex justify-content-center border-bottom border-3">
          <p class="fs-2" style="font-family: 'Times New Roman', serif">{{notificationType}}</p>
        </div>
      </div>
      <div class="mb-3">
        <div v-for="(notification,index) in notifications" :key="index" class="row d-flex justify-content-center mt-5">
          <div class="col-md-12 justify-content-start border rounded border-2">
          <div class="row w-100  mt-2">
            <div class="col d-flex justify-content-between">
              <p v-if="notification['brandName'] ===''"
                  class="text-uppercase d-inline mt-2 ps-2 fw-bold"
                  style="font-family: 'Times New Roman', serif">
                  {{notification["name"]}}
                </p>
                <p v-else class="text-uppercase d-inline mt-2 ps-2 fw-bold"
                  style="font-family: 'Times New Roman', serif"
                >
                 {{notification["name"]}} - {{notification["brandName"]}}
                </p>
              <p v-if="notification['editDate']===''"
                class="d-inline d-flex  align-items-center  text-secondary">
               {{notification["creationDate"]}}
              </p>
              <p v-else  class="d-inline d-flex  align-items-center  text-secondary mt-2">
               {{notification["creationDate"]}} <br> Edited {{notification["editDate"]}}
              </p>
            </div>
            
          </div>
          <div class="row ps-2">
            <div class="col">
              <p
                class=""
                style="font-family: 'WildWest', Helvetica, sans-serif"
              >
               Subscriber Count {{notification["userCount"]}}
              </p>
            </div>
          </div>
          <div class="row mt-2 mb-1 pe-5">
             <div class="col d-flex justify-content-end">
               <button
                type="button"
                
                class="btn btn-dark shadow-none"
                style="border: none"
              >
                <input type="number" v-model="notification['amountInStockModel']" class="me-2 d-inline" style="width:60px;backgroundColor:#edf2fa;border-radius: 5px;">
                <div @click="restock(index)" type='button' class="d-inline">
                  <i  class="d-inline bi bi-reply-all-fill me-2"></i>
                <p class="d-inline">Restock</p>
                </div>
              </button>
             </div>
           
           </div>
           <div v-if="notification['amountInStockError']!==''" class="row mt-2 mb-1 pe-5">
             <div class="col d-flex justify-content-end">
               <p
            class="d-flex justify-content-start pt-1 text-danger fw-bold"
          >
             {{notification['amountInStockError']}}
          </p>
             </div>
           
           </div>
          </div>
           
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import {notification} from '../../composables/Notification/Notification';
export default {
  setup(props, context){
    const {notificationType,notifications,errorMessage,successMessage,isProcessing,getNotifications,confirmRestockModalRef,currentSubscriptionToRestock,handleScroll,restock,confirmRestock} = notification();
    
    
    
    
    return {notificationType,notifications,errorMessage,successMessage,isProcessing,getNotifications,confirmRestockModalRef,currentSubscriptionToRestock,handleScroll,restock,confirmRestock}

  },

}
</script>

<style>

</style>