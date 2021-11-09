<template>
  <section id="inventoryHome">
    <div class="container-md" v-scroll="handleScroll">
      <!-- Confirm Delete Modal -->
      <div
        class="modal fade"
        ref="confirmDeleteModalRef"
        id="confirmDelete"
        tabindex="-1"
        aria-labelledby="confirmDeleteLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title" id="confirmDeleteLabel">ARE YOU SURE?</h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <strong
                >YOU ARE ABOUT TO DELETE
                <p class="text-danger" v-if="currentDrugToDelete !== ''">
                  {{ inventoryList[currentDrugToDelete]["name"] }}
                </p>
                WITH BRAND NAME
                <p class="text-danger" v-if="currentDrugToDelete !== ''">
                  {{ inventoryList[currentDrugToDelete]["brandName"] }}
                </p></strong
              >
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
              >
                CLOSE
              </button>
              <button
                type="button"
                class="btn btn-danger performDeleteDrugInModal"
                @click="performDelete(currentDrugToDelete)"
                data-bs-dismiss="modal"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Create Drug Modal -->
      <div
        class="modal fade"
        ref="addDrugModalRef"
        data-bs-backdrop="static"
        id="addDrugModal"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-light">
              <h5 class="modal-title ps-2" id="exampleModalLabel">
                <strong>Add Drug</strong>
              </h5>
              <button
                :disabled="isProcessingCreateDrugPhase"
                type="button"
                class="btn-close closeAddDrugModal"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div v-if="initialCreateDrugPhase" class="container-md">
                <div v-if="!createDrugIsSuccessfull" class="row">
                  <p class="text-danger ps-2">
                    <strong id="createDrugErrorField">{{
                      createDrugError
                    }}</strong>
                  </p>
                </div>
                <div v-if="createDrugIsSuccessfull" class="row">
                  <p class="text-success ps-2">
                    <strong id="createDrugSuccessField"
                      >Congratulation, The Drug Has been Added to your
                      database</strong
                    >
                  </p>
                </div>
                <div class="row">
                  <span class="input-group-text bg-white border-0"
                    ><strong>Name</strong></span
                  >
                </div>
                <div class="row ms-1">
                  <input
                    v-model="nameModel"
                    type="text "
                    class="
                      fw-bold
                      form-control
                      border-2
                      border-top-0
                      border-end-0
                      border-start-0
                      border-dark
                      text-dark
                      Add-Drug-Name-Input
                    "
                    placeholder="Drug Name"
                  />
                  <p
                    v-if="nameError !== ''"
                    class="d-flex justify-content-start pt-1 text-danger"
                  >
                    <strong>{{ nameError }}</strong>
                  </p>
                </div>

                <div class="row" :class="{ 'mt-3': nameError === '' }">
                  <span class="input-group-text bg-white border-0"
                    ><strong>Price</strong></span
                  >
                </div>
                <div class="row ms-1">
                  <input
                    v-model="priceModel"
                    type="text "
                    class="
                      fw-bold
                      form-control
                      border-2
                      border-top-0
                      border-end-0
                      border-start-0
                      border-dark
                      text-dark
                      Add-Drug-Price-Input
                    "
                    placeholder="Price"
                  />
                  <p
                    v-if="priceError !== ''"
                    class="d-flex justify-content-start pt-1 text-danger"
                  >
                    <strong>{{ priceError }}</strong>
                  </p>
                </div>
                <div class="row" :class="{ 'mt-3': priceError === '' }">
                  <span class="input-group-text bg-white border-0"
                    ><strong>Amount In Stock</strong></span
                  >
                </div>
                <div class="row ms-1">
                  <input
                    v-model="amountInStockModel"
                    type="text "
                    class="
                      fw-bold
                      form-control
                      border-2
                      border-top-0
                      border-end-0
                      border-start-0
                      border-dark
                      text-dark
                      Add-Drug-Amount-Input
                    "
                    placeholder="Amount In Stock"
                  />
                  <p
                    v-if="amountInStockError !== ''"
                    class="d-flex justify-content-start pt-1 text-danger"
                  >
                    <strong>{{ amountInStockError }}</strong>
                  </p>
                </div>
                <div
                  class="row mb-2"
                  :class="{ 'mt-3': amountInStockError === '' }"
                >
                  <span class="input-group-text bg-white border-0"
                    ><strong>Requries Prescription</strong></span
                  >
                </div>
                <div class="row ms-2 mb-1">
                  <input
                    class="Add-Drug-RequiredPrescription-Input"
                    v-model="requiresPrescriptionModel"
                    type="checkbox"
                    id="Add-Drug-Switch"
                  /><label
                    class="Add-Drug-RequiredPrescription-Label"
                    for="Add-Drug-Switch"
                    >Toggle</label
                  >
                </div>
                <div class="row mt-2">
                  <span class="input-group-text bg-white border-0"
                    ><strong>Description</strong></span
                  >
                </div>
                <div class="row ms-1">
                  <textarea
                    v-model="descriptionModel"
                    type="text "
                    class="
                      fw-bold
                      form-control
                      border-2
                      border-top-0
                      border-end-0
                      border-start-0
                      border-dark
                      text-dark
                      Add-Drug-Description-Input
                    "
                    placeholder="Description"
                  />
                  <p
                    v-if="descriptionError != ''"
                    class="d-flex justify-content-start pt-1 text-danger"
                  >
                    <strong>{{ descriptionError }}</strong>
                  </p>
                </div>
                <div class="row" :class="{ 'mt-3': descriptionError === '' }">
                  <span class="input-group-text bg-white border-0"
                    ><strong>Brand Name</strong></span
                  >
                </div>
                <div class="row ms-1">
                  <input
                    v-model="brandNameModel"
                    type="text "
                    class="
                      fw-bold
                      form-control
                      border-2
                      border-top-0
                      border-end-0
                      border-start-0
                      border-dark
                      text-dark
                      Add-Drug-BrandName-Input
                    "
                    placeholder="Optional, Brand Name"
                  />
                  <p
                    v-if="brandNameError != ''"
                    class="d-flex justify-content-start pt-1 text-danger"
                  >
                    <strong>{{ brandNameError }}</strong>
                  </p>
                </div>
                <div class="row" :class="{ 'mt-3': brandNameError === '' }">
                  <span class="input-group-text bg-white border-0"
                    ><strong>Country Of Origin</strong></span
                  >
                </div>
                <div class="row ms-1">
                  <input
                    v-model="countryOfOriginModel"
                    type="text "
                    class="
                      fw-bold
                      form-control
                      border-2
                      border-top-0
                      border-end-0
                      border-start-0
                      border-dark
                      text-dark
                      Add-Drug-Country-Input
                    "
                    placeholder="Optional, Country Of Origin"
                  />
                  <p
                    v-if="countryOfOriginError != ''"
                    class="d-flex justify-content-start pt-1 text-danger"
                  >
                    <strong>{{ countryOfOriginError }}</strong>
                  </p>
                </div>
              </div>
              <div v-if="isProcessingCreateDrugPhase" class="container-md">
                <p class="text-info fs-4 pb-2">
                  Please wait while we process your request ...
                </p>
                <div
                  class="spinner-border text-info"
                  style="width: 3rem; height: 3rem"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
            <div class="modal-footer bg-light">
              <button
                :disabled="isProcessingCreateDrugPhase"
                type="button"
                class="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                :disabled="
                  nameError !== '' ||
                  priceError !== '' ||
                  amountInStockError !== '' ||
                  descriptionError !== '' ||
                  brandNameError !== '' ||
                  countryOfOriginError !== '' ||
                  isProcessingCreateDrugPhase
                "
                type="button"
                class="btn btn-dark Add-Drug-Create-Button"
                @click="performCreate"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Drug Reviews Modal -->
      <InventoryReviewComponent
        ref="drugReviewsModal"
        :reviews="currentlyLoadedDrugReviews['loadedReviews']"
        :index="currentlyLoadedDrugReviews['index']"
        :drugName="currentlyLoadedDrugReviews['drugName']"
        :drugBrandName="currentlyLoadedDrugReviews['drugBrandName']"
        :disableNextPage="currentlyLoadedDrugReviews['disableNextPage']"
        :fetchingReviews="currentlyLoadedDrugReviews['fetchingReviews']"
        :fetchingReviewsError="currentlyLoadedDrugReviews['fetchingReviewsError']"
        @getReviewsForDrugEvent="getReviewsForDrugEvent"
        @clearDataEvent="clearDataEvent"
      >
      </InventoryReviewComponent>

      <div class="row bg-light align-items-center text-start mb-4">
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
          id="Heading"
        >
          <span class="d-inline">Inventory</span>
          <div class="d-inline me-4">
            <div class="">
              <button
                @click="getInventory('reset')"
                class="btn btn-outline-dark d-md-inline me-2 d-none"
                type="button"
              >
                <i class="bi bi-arrow-clockwise"></i>
                REFRESH
              </button>
              <button
                @click="createInventory"
                class="btn btn-outline-dark d-inline me-2"
                type="button"
              >
                <i class="bi bi-cloud-arrow-up-fill"></i>
                UPLOAD
              </button>
              <button
                class="btn btn-outline-dark d-inline"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#addDrugModal"
              >
                <i class="bi bi-file-plus-fill" style="font-size: 15px"></i>
                ADD
              </button>
            </div>
          </div>
        </div>
      </div>

      <inventorySearchBar
        v-click-away="onClickAway"
        :resultCameEmpty="resultCameEmpty"
        :drugRecomendations="drugRecomendations"
        v-model:searchQuery="searchQuery"
        @update:searchQuery="callProcessChange"
        @queryDrugByIdEvent="queryDrugByIdEvent"
        @queryDrugByNameOrBrandNameEvent="queryDrugByNameOrBrandNameEvent"
      ></inventorySearchBar>

      <div class="row d-flex justify-content-end mt-5 mb-5 mx-md-1">
        <div
          class="
            col-md-11
            mt-md-0 mt-2
            d-flex
            justify-content-between
            align-items-center
            py-1
            ps-3
          "
          id="Heading"
        >
          <p class="fs-3 d-inline pt-4 d-flex">Drugs Sorted {{ pickedSort }}</p>
          <div class="d-inline me-4">
            <div class="d-inline me-2">
              <input
                type="radio"
                class="btn-check sortByAlpha"
                name="options-outlined"
                id="primary-outlined"
                value="Alphabetically"
                autocomplete="off"
                v-model="pickedSort"
                checked
              />
              <label class="btn btn-outline-dark" for="primary-outlined"
                >A-Z</label
              >
            </div>

            <div class="d-inline">
              <input
                type="radio"
                class="btn-check ps-3 sortByDate"
                name="options-outlined"
                id="danger-outlined"
                value="By Date"
                autocomplete="off"
                v-model="pickedSort"
              />
              <label class="btn btn-outline-dark" for="danger-outlined"
                >DATE</label
              >
            </div>
          </div>
        </div>
        <div class="col-md-11 border-top border-dark border-3 pt-2"></div>
      </div>
      <div
        v-if="loadingInventory"
        class="col-md-11 mb-4 d-flex justify-content-center"
      >
        <div
          class="spinner-border text-info text-center"
          style="width: 3rem; height: 3rem"
          role="status"
        >
          <span class="visually-hidden">Fetching Data...</span>
        </div>
      </div>
      <div
        v-for="(inventory, index) in inventoryList"
        :key="index"
        class="row d-flex justify-content-end mt-3 mb-5"
        :class="inventory['name'] + inventory['brandName']"
      >
        <div class="col-md-11">
          <div
            v-if="inventory['isProcessing']"
            class="
              d-flex
              justify-content-between
              align-items-center
              drugInIndexIsProcessing
            "
          >
            <p class="d-inline text-info pt-2 ps-3">
              <strong class="waitMessageForDrugInIndex"
                >Please Wait ....</strong
              >
            </p>
          </div>
          <div
            v-if="inventory['deleteFailed'] || inventory['deleteSuccess']"
            class="
              d-flex
              justify-content-between
              align-items-center
              drugInIndexDeleteMessage
            "
          >
            <p
              :class="{
                'text-danger': inventory['deleteFailed'],
                'text-success': inventory['deleteSuccess'],
              }"
              class="d-inline pt-2 ps-3"
            >
              <strong v-if="inventory['deleteFailed']">{{
                inventory["deleteError"]
              }}</strong>
              <strong
                class="deleteSucessForDrugInIndex"
                v-if="inventory['deleteSuccess']"
                >Deleted Successfully</strong
              >
            </p>
            <i
              type="button"
              @click="disableDeleteFailedMessage(index)"
              class="bi bi-x-circle pe-3"
            ></i>
          </div>
          <div
            v-if="inventory['updateFailed'] || inventory['updateSuccess']"
            class="d-flex justify-content-between align-items-center"
          >
            <p
              :class="{
                'text-danger': inventory['updateFailed'],
                'text-success': inventory['updateSuccess'],
              }"
              class="d-inline pt-2 ps-3"
            >
              <strong v-if="inventory['updateFailed']">{{
                inventory["updateError"]
              }}</strong>
              <strong
                class="drugInIndexUpdateSuccess"
                v-if="inventory['updateSuccess']"
                >Updated Successfully</strong
              >
            </p>
            <i
              type="button d-inline"
              @click="disableUpdateMessage(index)"
              class="bi bi-x-circle pe-3"
            ></i>
          </div>
          <div
            class="card border border-top-0 text-start mt-3"
            id="inventory-card"
            :style="{
              animation: inventory['isProcessing']
                ? 'pulse 1.8s ease-in-out infinite alternate'
                : 'none',
            }"
          >
            <div
              class="
                card-header
                border-bottom-0
                mb-2
                d-flex
                justify-content-between
              "
              id="Card-Header-Inventory"
            >
              <h5 class="pt-3">Name: {{ inventory["name"] }}</h5>
              <p class="pt-3">Created: {{ inventory["creationDate"] }}</p>
            </div>

            <div class="row card-body text-start ps-4" id="inventory-body">
              <div class="col-10">
                <p class="fs-5" v-if="inventory['brandName'] !== undefined">
                  Brand-Name :<strong class="ps-3 fs-6 text-secondary">{{
                    inventory["brandName"]
                  }}</strong>
                </p>

                <div class="input-group d-flex align-items-start">
                  <p class="fs-5 pe-1" id="basic-addon1">Price :</p>
                  <input
                    type="text"
                    :disabled="inventory['isNotEditable']"
                    class="form-control drugInIndexPriceInput"
                    v-model="inventory['priceModel']"
                    :style="{
                      'border-bottom':
                        inventory['isNotEditable'] === true
                          ? '0px none rgb(206, 206, 206)'
                          : inventory['priceError'] !== ''
                          ? '2px solid rgb(206, 0, 0)'
                          : '2px solid rgb(206, 206, 206)',
                    }"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
                <p
                  v-if="
                    inventory['priceError'] !== '' &&
                    inventory['isNotEditable'] == false
                  "
                  class="
                    text-danger text-end
                    ms-5
                    pe-1
                    drugInIndexPriceInputError
                  "
                >
                  <strong> {{ inventory["priceError"] }}</strong>
                </p>

                <div class="input-group d-flex align-items-start">
                  <p class="fs-5 pe-1" id="basic-addon1">Amount In Stock :</p>
                  <input
                    type="text"
                    :disabled="inventory['isNotEditable']"
                    class="form-control"
                    v-model="inventory['amountInStockModel']"
                    :style="{
                      'border-bottom':
                        inventory['isNotEditable'] === true
                          ? '0px none rgb(206, 206, 206)'
                          : inventory['amountInStockError'] !== ''
                          ? '2px solid rgb(206, 0, 0)'
                          : '2px solid rgb(206, 206, 206)',
                    }"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
                <p
                  v-if="
                    inventory['amountInStockError'] !== '' &&
                    !inventory['isNotEditable']
                  "
                  class="text-danger ms-5 pe-1 text-end"
                >
                  <strong>{{ inventory["amountInStockError"] }}</strong>
                </p>

                <div v-if="inventory['toggleMore']">
                  <div class="mb-2">
                    <div class="d-flex">
                      <p class="fs-5 d-inline">Requries Prescription :</p>
                      <Toggle
                        class="d-inline ms-2 d-flex align-items-center mb-3"
                        :disabled="inventory['isNotEditable']"
                        style="
                          --toggle-width: 35px;
                          --toggle-ring-color: #10b98130;
                          --toggle-text-on: #ffffff;
                          --toggle-text-off: #374151;
                          --toggle-bg-on: #383838;
                          --toggle-bg-off: #bdbdbd;
                          --toggle-border-on: #645c5c;
                          --toggle-border-off: #d4d4d4;
                          --toggle-font-size: 4px;
                          --toggle-border: 2px;
                          --toggle-ring-color: #948e8e25;
                          --toggle-ring-width: 1px;
                          --toggle-height: 17px;
                        "
                        
                        v-model="inventory['requiresPrescriptionModel']"
                      ></Toggle>
                    </div>
                  </div>

                  <div class="input-group d-flex align-items-start">
                    <p class="fs-5 pe-1" id="basic-addon1">
                      Country Of Origin :
                    </p>
                    <input
                      type="text"
                      :disabled="inventory['isNotEditable']"
                      class="form-control"
                      :style="{
                        'border-bottom':
                          inventory['isNotEditable'] === true
                            ? '0px none rgb(206, 206, 206)'
                            : inventory['countryOfOriginError'] !== ''
                            ? '2px solid rgb(206, 0, 0)'
                            : '2px solid rgb(206, 206, 206)',
                      }"
                      v-model="inventory['countryOfOriginModel']"
                      :placeholder="
                        inventory['countryOfOrigin'] == null
                          ? 'Not Assigned'
                          : inventory['countryOfOrigin']
                      "
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  <p
                    v-if="
                      inventory['countryOfOriginError'] !== '' &&
                      inventory['isNotEditable'] == false
                    "
                    class="text-danger ms-5 pe-1 text-end"
                  >
                    <strong>{{ inventory["countryOfOriginError"] }}</strong>
                  </p>

                  <p class="fs-5">
                    Description :<strong class="ps-3 fs-6 text-muted">{{
                      !inventory["description"] ? " " : inventory["description"]
                    }}</strong>
                  </p>
                  <p class="fs-5">
                    Rating :<strong class="ps-3 fs-6 text-muted">{{
                      inventory["rating"] === 0
                        ? "Has Not Been Rated"
                        : inventory["rating"]
                    }}</strong>
                  </p>
                  <p
                    v-if="inventory['fetchingReviews'] === false"
                    @click="getReviewsForDrug(index, 'reset', true)"
                    type="button"
                    :disabled="inventory['reviewsCount'] === 0"
                    :style="{
                      color:
                        inventory['reviewsCount'] === 0 ? '#81807C' : '#EBCA5E',
                        'pointer-events':inventory['reviewsCount']===0?'none':'auto'
                    }"
                    class="col-md-4 col-lg-2 fs-5 text-decoration-underline"
                  >
                    {{ "Load Reviews" }}
                  </p>
                  <div v-else>
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <p style="font-family: arial, verdana, sans-serif;" v-if="inventory['fetchingReviewsError']!==''"
                class="text-danger  "
                ><strong>{{inventory['fetchingReviewsError']}}</strong></p>
                </div>
                

                <div class="d-flex justify-content-center">
                  <div class="d-inline"></div>
                  <button
                    id="expandButton"
                    class="btn btn-white w-100 text-dark d-inline"
                    type="button"
                    @click="toggleMore(index)"
                  >
                    <i
                      :class="
                        inventory['toggleMore']
                          ? 'bi bi-chevron-up'
                          : 'bi bi-chevron-down'
                      "
                    ></i>
                  </button>
                </div>
              </div>

              <div
                :style="{
                  'pointer-events': inventory['isProcessing'] ? 'none' : 'auto',
                  opacity: inventory['isProcessing'] ? '0.7' : '1',
                }"
                class="col-2 h-50 d-flex mt-1 justify-content-end"
              >
                <i
                  type="button"
                  @click="toggleEditable(index)"
                  class="bi bi-pen me-4 editDrugInIndex"
                  style="font-size: 110%"
                ></i>
                <i
                  type="button"
                  @click="
                    {
                      currentDrugToDelete = index;
                    }
                  "
                  class="bi bi-trash deleteDrugInIndex"
                  style="font-size: 110%"
                  data-bs-toggle="modal"
                  data-bs-target="#confirmDelete"
                ></i>
              </div>
            </div>
          </div>
          <div
            v-if="inventory['showReviews'] && inventory['fetchingReviews']"
            class="col-10 d-grid mt-4 justify-content-center"
          >
            <div class="spinner-border text-warning" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div
            v-if="!inventory['isNotEditable']"
            class="
              d-grid
              mt-2
              me-md-4
              gap-2
              d-md-block d-md-flex
              justify-content-md-end
            "
          >
            <button
              class="btn btn-danger me-md-3 px-md-5 shadow cancelDrugEditIndex"
              type="button"
              :disabled="inventory['isProcessing']"
              @click="toggleEditable(index)"
            >
              Cancel
            </button>
            <button
              class="btn btn-success px-md-5 shadow updateDrugInIndex"
              type="button"
              :disabled="inventory['isProcessing']"
              @click="performUpdate(index)"
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="inventoryList.length === 0 && emptyInventory.length !== 0"
        class="row d-flex justify-content-end mt-3 mb-5"
      >
        <div class="col-md-11 border border-3">
          <p
            class="fs-3 py-3 text-secondary"
            style="text-decoration: underline"
          >
            <strong>
              {{ emptyInventory }}
            </strong>
          </p>
        </div>
      </div>

      <div
        v-if="!hasScrolledToBottom && inventoryList.length !== 0"
        class="col-md-11 mb-4 d-flex justify-content-center"
      >
        <div
          class="spinner-border text-info text-center"
          style="width: 3rem; height: 3rem"
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { inventoryHome } from "../../composables/Inventory/InventoryHome";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import inventorySearchBar from "./reusables/inventorySearchBar.vue";
import InventoryReviewComponent from "./reusables/InventoryReviewComponent";
import Toggle from "@vueform/toggle";
export default {
  components: { inventorySearchBar, Toggle, InventoryReviewComponent },
  name: "InventoryHomeComponent",
  data() {
    return {};
  },

  methods: {
    callProcessChange(event, value) {
      this.processChange();
    },
    queryDrugByNameOrBrandNameEvent(event, value) {
      this.queryDrugByNameOrBrandName(event);
    },
    queryDrugByIdEvent(event, value) {
      this.queryDrugById(event);
    },
    clearDataEvent(event, value) {
      this.currentlyLoadedDrugReviews["loadedReviews"] = [];
      this.currentlyLoadedDrugReviews["index"] = 0;
      this.currentlyLoadedDrugReviews["drugName"] = "";
      this.currentlyLoadedDrugReviews["drugBrandName"] = "";
      this.currentlyLoadedDrugReviews["disableNextPage"] = false;
      this.currentlyLoadedDrugReviews["fetchingReviewsError"] = "";
      
    },
    getReviewsForDrugEvent(event, value) {
      this.getReviewsForDrug(event,"load",false)
    },

    onClickAway(event) {
      if (this.drugRecomendations.length != 0) this.drugRecomendations = [];
    },
    createInventory() {
      this.$router.push({ name: "CreateInventory" });
    },
  },

  setup(props, context) {
    const {
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
    } = inventoryHome();
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
  },
};
</script>
<style src="@vueform/toggle/themes/default.css"></style>

<style>
.toggle-handle {
  height: 15px;
  width: 15px;
  margin-top: 1px;
  margin-right: 5px;
  margin-left: 1px;
}

#Card-Header-Inventory {
  background-color: #d9dae2;
}
#Heading {
  background-color: #edf2fa;
  font-family: Times New Roman, serif;
}
#Add-Drug-Input {
  outline: none;
  box-shadow: none;
}
#inventory-body {
  font-family: Times New Roman, serif;
}
#inventory-card {
  background-color: #fbfcff;
  box-shadow: -5px 5px 8px 1px #d2e1e6;
  /* font-family: Times New Roman, serif ; */
}
#search-bar {
  background: #fbfeff;
}
input[id="Add-Drug-Switch"] {
  height: 0;
  width: 0;
  visibility: hidden;
}

label[for="Add-Drug-Switch"] {
  cursor: pointer;
  text-indent: -9999px;
  width: 50px;
  height: 25px;
  background: grey;
  display: block;
  border-radius: 25px;
  position: relative;
}

label[for="Add-Drug-Switch"]:after {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  width: 15px;
  height: 15px;
  background: #fff;
  border-radius: 15px;
  transition: 0.2s;
}

input[id="Add-Drug-Switch"]:checked + label {
  background: black;
}

input[id="Add-Drug-Switch"]:checked + label:after {
  left: calc(100% - 5px);
  transform: translateX(-100%);
}

label[for="Add-Drug-Switch"]:active:after {
  width: 22px;
}

label[for="Add-Drug-Switch"]:active:after {
  width: 10px;
}

#expandButton:focus {
  outline: none;
  box-shadow: none;
}

#expandButton {
  border-style: none;
}
input[type="text"] {
  color: rgb(99, 98, 98);
  font-weight: bold;
  border-style: none;
  background: transparent;
  /* border-bottom: 2px solid rgb(206, 206, 206); */
}
input[type="text"]:disabled {
  background: transparent;

  /* border-style: none; */
}

.btn-check {
  width: 30px;
}
#floating-search {
  position: -webkit-sticky;
  position: sticky;
  top: 120px;
  z-index: 1;
}
#upload-button {
  transition: transform 0.2s;
}
#upload-button:hover {
  background-color: black;
  color: white;
  box-shadow: 3px 3px 3px rgb(226, 216, 216);
  transform: scale(1.05);
}
#add-button {
  transition: transform 0.2s;
}
#add-button:hover {
  background-color: rgb(19, 153, 15);
  color: white;
  box-shadow: 3px 3px 3px rgb(226, 216, 216);
  transform: scale(1.05);
}
#refresh-button {
  transition: transform 0.2s;
}
#refresh-button:hover {
  background-color: white;
  color: rgb(58, 102, 247);
  box-shadow: 3px 3px 3px rgb(226, 216, 216);
  transform: scale(1.05);
}
#delete-button {
  transition: transform 0.2s;
}
#delete-button:hover {
  background-color: rgb(245, 16, 16);
  color: white;
  box-shadow: 3px 3px 3px rgb(226, 216, 216);
  transform: scale(1.05);
}
@-webkit-keyframes pulse {
  0% {
    background: rgb(248, 248, 248);
  }
  50% {
    background: rgb(211, 211, 211);
  }
  100% {
    background: rgb(248, 248, 248);
  }
}
@keyframes pulse {
  0% {
    background: rgb(248, 248, 248);
  }
  50% {
    background: rgb(211, 211, 211);
  }
  100% {
    background: rgb(248, 248, 248);
  }
}
</style>