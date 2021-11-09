<template>
  <section id="Notification">
    <div class="modal fade confirmRestockModal"
      ref="confirmRestockModalRef"
      id="confirmRestock"
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
            <div
              v-if="
                isProcessing === false &&
                errorMessage === '' &&
                successMessage === ''
              "
            >
              <strong
                >YOU ARE ABOUT TO RESTOCK
                {{
                  notifications[currentSubscriptionToRestock][
                    "amountInStockModel"
                  ]
                }}
                UNITS OF
                <p
                  class="text-success"
                  v-if="currentSubscriptionToRestock !== ''"
                >
                  {{ notifications[currentSubscriptionToRestock]["name"] }}
                </p>
                <p
                  v-if="
                    notifications[currentSubscriptionToRestock]['brandName'] !==
                    ''
                  "
                >
                  WITH BRAND NAME
                  <span class="text-success">{{
                    notifications[currentSubscriptionToRestock]["brandName"]
                  }}</span>
                </p></strong
              >
            </div>
            <div
              v-if="isProcessing === true"
              class="d-flex justify-content-center"
            >
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-if="errorMessage !== ''">
              <p class="text-danger">
                <strong>{{ errorMessage }}</strong>
              </p>
            </div>
            <div v-if="successMessage !== ''">
              <p class="text-success">
                <strong>{{ successMessage }}</strong>
              </p>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal">
              CLOSE
            </button>
            <button
              :disabled="
                isProcessing || errorMessage !== '' || successMessage !== ''
              "
              type="button"
              class="btn btn-success confirmRestockButton"
              @click="confirmRestock()"
            >
              RESTOCK
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade confirmRemoveSubmittedDrugForRequest"
      ref="confirmDeleteRequestedDrugModalRef"
      id="confirmDeleteDrug"
      tabindex="-1"
      aria-labelledby="confirmDeleteDrugLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="confirmDeleteDrugLabel">
              ARE YOU SURE?
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div v-if="currentRequest !== ''" class="modal-body">
            <div
              v-if="
                isProcessing === false &&
                errorMessage === '' &&
                successMessage === ''
              "
            >
              <p class="text-success" v-if="currentRequest !== ''">
                <strong class="text-dark"> YOU ARE ABOUT TO DELETE </strong>
                <strong class="fw-bold">{{
                  notifications[currentRequest]["drug"]["name"]
                }}</strong>

                <strong
                  class="text-dark"
                  v-if="
                    notifications[currentRequest]['drug']['brandName'] !== ''
                  "
                >
                  WITH BRAND NAME
                  <span class="text-success fw-bold">{{
                    notifications[currentRequest]["drug"]["brandName"]
                  }}</span>
                </strong>
                <strong class="text-dark"> FROM REQUEST </strong>
                <strong> {{ notifications[currentRequest]["name"] }}</strong>
              </p>
            </div>
            <div
              v-if="isProcessing === true"
              class="d-flex justify-content-center"
            >
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-if="errorMessage !== ''">
              <p class="text-danger">
                <strong>{{ errorMessage }}</strong>
              </p>
            </div>
            <div v-if="successMessage !== ''">
              <p class="text-success">
                <strong>{{ successMessage }}</strong>
              </p>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal">
              CLOSE
            </button>
            <button
              :disabled="
                isProcessing || errorMessage !== '' || successMessage !== ''
              "
              type="button"
              class="btn btn-danger confirmDeleteDrugInRequest"
              @click="deleteDrugInRequest()"
            >
              REMOVE
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade searchDrugForSubmit"
      ref="searchDrugModalRef"
      id="searchDrug"
      tabindex="-1"
      aria-labelledby="searchDrugModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="searchDrugModalLabel">
              <i
                type="button"
                @click="
                  errorMessage = '';
                  selectedSearchDrug = '';
                "
                v-if="errorMessage !== ''"
                class="bi bi-arrow-left fs-4 d-inline backButtonForInvalidDrugSubmit"
              ></i>
              <p class="d-inline">
                SEARCH DRUG IN INVENTORY MATCHING
                {{ currentRequestToSearch.name }}
              </p>
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div
              v-if="
                isProcessing === false &&
                errorMessage === '' &&
                successMessage === ''
              "
            >
              <input
                v-if="selectedSearchDrug === ''"
                type="text"
                class="
                  form-control
                  border border-dark border-top-0 border-bottom-0
                  searchDrugInputForSubmit
                "
                placeholder="Search Drugs"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                v-model="searchQuery"
                @keyup="processChange"
              />
              <div v-else class="card w-100">
                <div class="card-header d-flex justify-content-end">
                  <button
                    @click="selectedSearchDrug = ''"
                    type="button"
                    class="btn-close"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="card-body">
                  <h5 class="card-title">{{ selectedSearchDrug.name }}</h5>
                  <p class="card-text">
                    {{ selectedSearchDrug.brandName }}
                  </p>
                </div>
              </div>
              <div v-if="recommendedDrugs.length != 0">
                <div
                  v-for="(recommendation, index) in recommendedDrugs"
                  :key="index"
                  class="recommendedDrugsForSubmitList"
                  :class="recommendation['name']+recommendation['brandName']+'DG'"
                >
                  <div class="row d-flex justify-content-end pt-1">
                    <div class="col-md-12">
                      <div
                        class="card border border-top-0 border-end-0 recommendedDrugForRequestSubmit"
                        type="button"
                        @click="
                          selectedSearchDrug = recommendation;
                          recommendedDrugs = [];
                          searchQuery = '';
                        "
                      >
                        <div class="row">
                          <div class="col">
                            <div class="card-body text-start">
                              <h5 class="card-title">
                                {{ recommendation["name"] }}
                              </h5>
                              <h6 class="card-subtitle text-muted">
                                {{ recommendation["brandName"] }}
                              </h6>
                            </div>
                          </div>
                          <div
                            class="
                              col
                              d-flex
                              justify-content-end
                              align-items-center
                            "
                          >
                            <i class="bi bi-search pe-4"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="isProcessing === true"
              class="d-flex justify-content-center"
            >
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-if="errorMessage !== ''">
              <p class="text-danger errorMessageForSubmittedDrugRequest">
                <strong>{{ errorMessage }}</strong>
              </p>
            </div>
            <div v-if="successMessage !== ''">
              <p class="text-success">
                <strong>{{ successMessage }}</strong>
              </p>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
            >
              CLOSE
            </button>
            <button
              :disabled="
                isProcessing ||
                errorMessage !== '' ||
                successMessage !== '' ||
                selectedSearchDrug === ''
              "
              type="button"
              class="btn btn-dark submitDrugToRequestButton"
              @click="submitDrugToRequest()"
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade confirmRequestDenialModal"
      ref="requestDeclineModalRef"
      id="requestDecline"
      tabindex="-1"
      aria-labelledby="requestDeclineLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="requestDeclineLabel">ARE YOU SURE?</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div v-if="currentRequestToDecline !== ''" class="modal-body">
            <div
              v-if="
                isProcessing === false &&
                errorMessage === '' &&
                successMessage === ''
              "
            >
              <strong class="text-danger"
                >YOU ARE ABOUT TO DECLINE THE REQUEST FOR
                {{ currentRequestToDecline.name }},
                {{ currentRequestToDecline.userCount }} OF YOUR CLIENTS WILL BE
                AFFECTED
              </strong>
            </div>
            <div
              v-if="isProcessing === true"
              class="d-flex justify-content-center"
            >
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-if="errorMessage !== ''">
              <p class="text-danger">
                <strong>{{ errorMessage }}</strong>
              </p>
            </div>
            <div v-if="successMessage !== ''">
              <p class="text-success">
                <strong>{{ successMessage }}</strong>
              </p>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal">
              CLOSE
            </button>
            <button
              :disabled="
                isProcessing || errorMessage !== '' || successMessage !== ''
              "
              type="button"
              class="btn btn-danger confirmDeclineRequestButton"
              @click="declineRequest()"
            >
              DECLINE REQUEST
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade confirmDeleteDeclineRequest"
      ref="deleteDeclineModalRef"
      id="deleteDecline"
      tabindex="-1"
      aria-labelledby="deleteDeclineLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="deleteDeclineLabel">ARE YOU SURE?</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div v-if="currentRequestToDecline !== ''" class="modal-body">
            <div
              v-if="
                isProcessing === false &&
                errorMessage === '' &&
                successMessage === ''
              "
            >
              <strong class="text-secondary"
                >YOU ARE ABOUT TO START ACCEPTING REQUESTS FOR {{currentRequestToDecline.name}}
              </strong>
            </div>
            <div
              v-if="isProcessing === true"
              class="d-flex justify-content-center"
            >
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-if="errorMessage !== ''">
              <p class="text-danger">
                <strong>{{ errorMessage }}</strong>
              </p>
            </div>
            <div v-if="successMessage !== ''">
              <p class="text-success">
                <strong>{{ successMessage }}</strong>
              </p>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
              CLOSE
            </button>
            <button 
              :disabled="
                isProcessing || errorMessage !== '' || successMessage !== ''
              "
              type="button"
              class="btn btn-success confirmDeleteDeclineRequestButton"
              @click="deleteDecline()"
            >
              APPROVE
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container-md" v-scroll="handleScroll">
      <div
        class="
          row
          align-items-center
          text-start
          mb-4
          d-flex
          justify-content-end
        "
        
      >
        <div
          class="
            col-md-12
            py-4
            ps-md-5 ps-2
            display-4
            d-flex
            justify-content-between
            align-items-end
          "
          id="Heading"
        >
          <span class="me-1">{{ notificationType }}</span>
          <div class="d-inline me-md-4 me-1 d-flex justify-content-end">
            <div class="d-inline me-2">
              <input
                type="radio"
                class="btn-check toggleToSubscriptions"
                name="options-outlined"
                id="primary-outlined"
                value="Subscriptions"
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
                class="btn-check ps-3 toggleToRequests"
                name="options-outlined"
                id="danger-outlined"
                value="Requests"
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
      <div class="row d-flex justify-content-center">
        <div
          class="
            col-md-12
            d-flex
            justify-content-center
            border-bottom border-3
            pb-3
          "
        >
          <div class="d-inline me-2">
            <input
              type="radio"
              class="btn-check"
              name="filterby-outlined"
              id="Subscriber-Count-outlined"
              value="Subscriber-Count"
              autocomplete="off"
              v-model="filterBy"
              checked
            />
            <label class="btn btn-outline-dark" for="Subscriber-Count-outlined"
              >SUBSCRIBER-COUNT</label
            >
          </div>
          <div class="d-inline me-2">
            <input
              type="radio"
              class="btn-check"
              name="filterby-outlined"
              id="Recent-outlined"
              value="Recent"
              autocomplete="off"
              v-model="filterBy"
            />
            <label class="btn btn-outline-dark" for="Recent-outlined"
              >RECENT</label
            >
          </div>
        </div>
      </div>
      <div class="mb-3">
        <div
          v-for="(notification, index) in notifications"
          :key="index"
          class="row d-flex justify-content-center mt-5"
          :class="notification['name']+notification['brandName']"
        >
          <div
            v-if="loadedNotificationType === 'Subscriptions'"
            class="col-md-12 justify-content-start border rounded border-2"
          >
            <div class="row w-100 mt-2">
              <div class="col d-flex justify-content-between">
                <p
                type='button'
                @click="routeToInventory(notification['drugId'])"
                  v-if="notification['brandName'] === ''"
                  class="d-inline mt-2 ps-2 fs-4"
                  style="font-family: 'Times New Roman', serif"
                >
                  {{ notification["name"] }}
                </p>
                <p
                type='button'
                @click="routeToInventory(notification['drugId'])"
                  v-else
                  class="d-inline mt-2 ps-2 fs-4"
                  style="font-family: 'Times New Roman', serif"
                >
                  {{ notification["name"] }} - {{ notification["brandName"] }}
                </p>
                <p
                  v-if="notification['editDate'] === ''"
                  class="d-inline d-flex align-items-center text-secondary"
                >
                  {{ notification["creationDate"] }}
                </p>
                <p
                  v-else
                  class="d-inline d-flex align-items-center text-secondary mt-2"
                >
                  {{ notification["creationDate"] }} <br />
                  Edited {{ notification["editDate"] }}
                </p>
              </div>
            </div>
            <div class="row ps-2">
              <div class="col">
                <p class="fw-light">
                  Users Subscribed: <span>{{ notification["userCount"] }}</span>
                </p>
              </div>
            </div>
            <div class="row ps-2">
              <div class="col">
                <p class="fw-light">
                  Expiration Date:
                  <span>{{ notification["expirationDate"] }}</span>
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
                  <input
                    type="number"
                    min=1
                    v-model="notification['amountInStockModel']"
                    class="me-2 d-inline"
                    style="
                      width: 60px;
                      backgroundcolor: #edf2fa;
                      border-radius: 5px;
                    "
                  />
                  <div class="restockButton d-inline" @click="restock(index)" type="button" >
                    <i class="d-inline bi bi-reply-all-fill me-2"></i>
                    <p class="d-inline">Restock</p>
                  </div>
                </button>
              </div>
            </div>
            <div
              v-if="notification['amountInStockError'] !== ''"
              class="row mt-2 mb-1 pe-5"
            >
              <div class="col d-flex justify-content-end">
                <p
                  class="d-flex justify-content-start pt-1 text-danger fw-bold"
                >
                  {{ notification["amountInStockError"] }}
                </p>
              </div>
            </div>
          </div>
          <div
            :style="{
              backgroundColor: notification[`backgroundColor`],
            }"
            v-if="loadedNotificationType === 'Requests'"
            class="col-md-12 justify-content-start border rounded border-2"
          >
            <div
              v-if="notification['status'] !== 'Pending'"
              class="d-flex justify-content-start ms-1 mt-2"
            >
              <i
                :class="{
                  'bi bi-check-square':
                    notification['status'] === 'Completed',
                  'bi bi-x-square': notification['status'] === 'Declined',
                  'bi bi-hourglass-split': notification['status'] === 'Pending',
                  'text-success': notification['status'] === 'Completed',
                  'text-info': notification['status'] === 'Pending',
                  'text-danger': notification['status'] === 'Declined',
                }"
                class="fs-3 notificationStatus"
                >&#160; {{ notification["status"] }}</i
              >
            </div>
            <div class="row w-100 mt-2">
              <div class="col d-flex justify-content-between">
                <p
                  class="fs-4 d-inline mt-2 ps-2"
                  style="font-family: 'Times New Roman', serif"
                >
                  Requested Drug : {{ notification["name"] }}
                </p>

                <p
                  v-if="notification['editDate'] === ''"
                  class="d-inline d-flex align-items-center text-secondary"
                >
                  {{ notification["creationDate"] }} 
                </p>
                <p
                  v-else
                  class="d-inline d-flex align-items-center text-secondary mt-2"
                >
                  {{ notification["creationDate"] }} <br />
                  Edited {{ notification["editDate"] }} 
                </p>
              </div>
            </div>
            <div class="row ps-2">
              <div class="col">
                <p class="fw-light">
                  Users Subscribed: <span>{{ notification["userCount"] }}</span>
                </p>
              </div>
            </div>
            <div class="row ps-2">
              <div class="col">
                <p class="fw-light">
                  Expiration Date:
                  <span>{{ notification["expirationDate"] }}</span>
                </p>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col d-flex justify-content-between">
                <div v-if="notification['decline'] !== true" class="d-inline">
                  <div
                    v-if="notification['isAvailable']===true"
                    style="width: 290px;backgroundcolor:'#28CA28';"
                    class="card me-3 "
                    
                  >
                    <div class="card-body">
                      <h5 class="card-title">
                        {{ notification["drug"]["name"] }}
                      </h5>
                      <h6 class="card-subtitle mb-2 text-muted">
                        {{ notification["drug"]["brandName"] }}
                      </h6>
                      <p class="card-text text-secondary">
                        {{ notification["drug"]["description"] }} <br />
                        Price: {{ notification["drug"]["price"] }}
                      </p>
                    </div>
                    <div
                      type="button"
                      @click="showConfirmDrugDeleteModal(index)"
                      class="
                        card-footer
                        text-light
                        bg-dark
                        d-flex
                        justify-content-center
                        removeSubmittedDrugButton
                      "
                    >
                      <div>
                        <i class="bi bi-trash d-inline me-1"></i>
                        <p class="d-inline">Remove</p>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <button
                      @click="showSearchDrugModal(notification)"
                      type="button"
                      class="btn btn-secondary shadow-none ms-2 px-5 d-inline submitADrug"
                      style="border: none"
                    >
                      SUBMIT A DRUG
                    </button>
                  </div>
                </div>
                <div v-else class="d-inline w-75 me-2">
                  <div
                    class="
                      border-start border-3 border-danger
                      p-2
                      pe-3
                      bg-light
                    "
                  >
                    <p
                      class="fs-5"
                      style="font-family: 'Times New Roman', serif"
                    >
                      Reasons You Declined The Request
                    </p>
                    <p class="ps-3 text-decoration-underline">
                      {{ notification["declineDescription"] }}
                    </p>
                    
                  </div>
                  <button
                  @click="showDeleteDeclineModal(index)"
                      type="button"
                      class="btn btn-danger shadow-none mt-2 deleteRequestDeclineButton"
                    >
                      Delete Request Decline
                    </button>
                </div>
                <div class="d-inline" style="width: 220px">
                  <button
                    @click="toggleShowReplyBox(index)"
                    type="button"
                    class="btn  shadow-none declineRequestButton"
                    :class="{
                      'btn-secondary': notification['decline']===true,
                      'btn-secondary': notification['showReplyBox']===false,
                      'btn-dark': notification['showReplyBox']===true,
                      
                    }"
                    style="border: none"
                  >
                    <div v-if="!notification['showReplyBox']" class="d-inline">
                      <i class="d-inline bi bi-eraser-fill me-2"></i>
                      <p v-if="notification['decline']" class="d-inline declineType">
                        Edit Decline
                      </p>
                      <p v-else class="d-inline declineType">Decline Request</p>
                    </div>
                    <div v-else class="d-inline">
                      <p class="d-inline declineType">Submit Decline</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="row mt-2 d-flex"
            v-if="notification['showReplyBox'] === true"
          >
            <div class="input-group input-group">
              <textarea
                rows="3"
                cols="1"
                maxlength="500"
                v-model="notification['replyModel']"
                type="text "
                class="
                  form-control
                  shadow-none
                  form-control
                  border-2 border-top-0 border-end-0 border-start-0 border-dark
                  text-dark
                  declineReplyBox
                "
                placeholder="Reasons For Decline"
              />
              <button
                type="button"
                @click="cancelShowReplyBox(index)"
                class="btn-close input-group-text pt-3 shadow-none"
                aria-label="Close"
              ></button>
            </div>
            <p
              v-if="notification['replyError'] !== ''"
              class="d-flex justify-content-start pt-1 text-danger"
            >
              {{ notification["replyError"] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { notification } from "../../composables/Notification/Notification";
export default {
  methods: {
    routeToInventory(id){
            this.$router.push({name:"InventoryHome",params: { 'loadType':'getDrug','drugId':id }})
        },
    toggleShowReplyBox(index) {
      if (this.notifications[index]["showReplyBox"] === false) {
        this.notifications[index]["showReplyBox"] = true;
      } else {
        if (
          this.notifications[index]["declineDescription"] ===
          this.notifications[index]["replyModel"]
        ) {
          this.notifications[index]["replyError"] =
            "Decline Description Has Not Changed";
          setTimeout(() => {
            this.notifications[index]["replyError"] = "";
          }, 5000);
        } else if (this.notifications[index]["replyModel"].trim().length < 10) {
          this.notifications[index]["replyError"] =
            "Decline Description Has To Be Greater Than 10 Characters";
          setTimeout(() => {
            this.notifications[index]["replyError"] = "";
          }, 5000);
        } else {
          this.notifications[index]["showReplyBox"] = false;
          this.notifications[index]["replyError"] = "";
          this.showRequestDeclineModal(index);
        }
      }
    },
    cancelShowReplyBox(index) {
      this.notifications[index]["showReplyBox"] = false;
      this.notifications[index]["replyModel"] =
        this.notifications[index]["declineDescription"];
    },
  },
  setup(props, context) {
    const {
      loadedNotificationType,
      notificationType,
      filterBy,
      notifications,
      errorMessage,
      successMessage,
      isProcessing,
      getNotifications,
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
      showDeleteDeclineModal,
      showRequestDeclineModal,
      handleScroll,
      restock,
      confirmRestock,
      submitDrugToRequest,
      deleteDrugInRequest,
      declineRequest,
      deleteDecline
    } = notification();

    return {
      loadedNotificationType,
      notificationType,
      filterBy,
      notifications,
      errorMessage,
      successMessage,
      isProcessing,
      getNotifications,
      confirmRestockModalRef,
      currentSubscriptionToRestock,
      currentRequestToDecline,
      currentRequest,
      currentRequestToSearch,
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
      showDeleteDeclineModal,
      showRequestDeclineModal,
      handleScroll,
      restock,
      confirmRestock,
      submitDrugToRequest,
      deleteDrugInRequest,
      declineRequest,
      deleteDecline
    };
  },
};
</script>

<style>
</style>