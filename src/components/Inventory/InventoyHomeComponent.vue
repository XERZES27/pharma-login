<template>
  <section id="inventoryHome">
    <div class="container-md" v-scroll="handleScroll">
      <!-- Confirm Delete Modal -->
      <div
        ref="confirmDeleteModalRef"
        class="modal fade"
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
                class="btn btn-danger"
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
        ref="addDrugModalRef"
        class="modal fade"
        data-bs-backdrop="static"
        id="exampleModal"
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
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div v-if="initialCreateDrugPhase" class="container-md">
                <div v-if="!createDrugIsSuccessfull" class="row">
                  <p class="text-danger ps-2">
                    <strong>{{ createDrugError }}</strong>
                  </p>
                </div>
                <div v-if="createDrugIsSuccessfull" class="row">
                  <p class="text-success ps-2">
                    <strong
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
                    id="Add-Drug-Input"
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
                    v-model="requiresPrescriptionModel"
                    type="checkbox"
                    id="Add-Drug-Switch"
                  /><label for="Add-Drug-Switch">Toggle</label>
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
                class="btn btn-dark"
                @click="performCreate"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row bg-light align-items-center text-start mb-4">
        <div
          class="col-md-12 py-4 ps-5 display-4"
          id="Heading"
          style="font-family: 'Times New Roman', serif"
        >
          Inventory
        </div>
      </div>
      <div class="row mb-5 align-items-end">
        <div class="col text-end">
          <i
            type="button"
            @click="getInventory()"
            id="refresh-button"
            class="bi bi-arrow-counterclockwise px-md-5 px-4 border mx-2"
            style="font-size: 2rem"
          ></i>
          <i
            type="button"
            id="upload-button"
            @click="createInventory"
            class="bi bi-upload px-md-5 px-4 border mx-2"
            style="font-size: 2rem"
          ></i>

          <i
            type="button"
            id="add-button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            class="bi bi-plus px-md-5 px-4 border mx-2"
            style="font-size: 2rem"
          ></i>

          <i
            type="button"
            id="delete-button"
            class="bi bi-x px-md-5 px-4 border ms-2"
            style="font-size: 2rem"
          ></i>
        </div>
      </div>
      <div id="floating-search" v-click-away="onClickAway" class="mb-3">
        <div class="row d-flex align-items-center justify-content-end">
          <div class="col-md-11">
            <div
              class="input-group input-group-lg"
              id="search-bar"
              style="box-shadow: 10px 5px 12px #e2e2e2"
            >
              <input
                type="text"
                class="
                  form-control
                  border border-dark border-top-0 border-bottom-0
                "
                placeholder="Search Drugs"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                v-model="searchQuery"
                @keyup="processChange"
              />
              <button
                :disabled="searchQuery.trim() === ''"
                class="
                  input-group-text
                  border border-dark
                  text-white
                  bg-dark
                  px-6
                "
                @click="queryDrugByNameOrBrandName(searchQuery)"
                id="basic-addon2"
              >
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
        <div v-if="drugRecomendations.length != 0">
          <div
            v-for="(recommendation, index) in drugRecomendations"
            :key="index"
          >
            <div class="row d-flex justify-content-end pt-1">
              <div class="col-md-11">
                <div
                  class="card border border-top-0 border-end-0"
                  type="button"
                  @click="queryDrugById(recommendation['_id'])"
                >
                  <div class="row">
                    <div class="col">
                      <div class="card-body text-start">
                        <h5 class="card-title">{{ recommendation["name"] }}</h5>
                        <h6 class="card-subtitle text-muted">
                          {{ recommendation["brandName"] }}
                        </h6>
                      </div>
                    </div>
                    <div
                      class="col d-flex justify-content-end align-items-center"
                    >
                      <i class="bi bi-search pe-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="resultCameEmpty !== ''">
          <div class="row d-flex justify-content-center pt-3">
            <div class="col-md-10">
              <p class="fs-3">{{ resultCameEmpty }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row d-flex justify-content-end mt-5 mb-5">
        <div
          class="
            col-md-11
            mt-md-0 mt-2
            d-flex
            border border-3
            rounded
            justify-content-between
            py-1
            ps-3
          "
          id="Heading"
        >
          <span
            class="fs-3 d-inline pt-4"
            style="font-family: 'Times New Roman', serif"
            >Drugs Sorted {{ pickedSort }}</span
          >
          <div class="d-inline me-4">
            <div class="d-inline me-2">
              <input
                type="radio"
                class="btn-check"
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
                class="btn-check ps-3"
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
      </div>
      <div
        v-for="(inventory, index) in inventoryList"
        :key="index"
        class="row d-flex justify-content-end mt-3 mb-5"
      >
        <div class="col-md-11">
          <div
            v-if="inventory['isProcessing']"
            class="d-flex justify-content-between align-items-center"
          >
            <p class="d-inline text-info pt-2 ps-3">
              <strong> Please Wait ....</strong>
            </p>
          </div>
          <div
            v-if="inventory['deleteFailed'] || inventory['deleteSuccess']"
            class="d-flex justify-content-between align-items-center"
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
              <strong v-if="inventory['deleteSuccess']"
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
              <strong v-if="inventory['updateSuccess']"
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
              class="card-header border-bottom-0 mb-2"
              id="Card-Header-Inventory"
            >
              <h5 class="pt-3">Name: {{ inventory["name"] }}</h5>
            </div>
            <div class="row">
              <div class="col">
                <div class="card-body text-start ps-4">
                  <p class="fs-5">
                    Brand-Name :<strong class="ps-3 fs-6 text-secondary">{{
                      inventory["brandName"]
                    }}</strong>
                  </p>
                  <div class="input-group d-flex align-items-start">
                    <p class="fs-5 pe-1" id="basic-addon1">Price :</p>
                    <input
                      type="text"
                      :disabled="inventory['isNotEditable']"
                      class="form-control"
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
                    class="text-danger text-end ms-5 pe-1"
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
                      <div class="row">
                        <p class="fs-5 col-8 col-md-3">
                          Requries Prescription :
                        </p>
                        <div class="col-1 ps-0">
                          <input
                            class="
                              form-check-input
                              d-flex
                              justify-content-start
                            "
                            :disabled="inventory['isNotEditable']"
                            v-model="inventory['requiresPrescriptionModel']"
                            type="checkbox"
                            id="Edit-Drug-Switch"
                          /><label
                            for="Edit-Drug-Switch"
                            :style="{
                              'background-color': inventory['isNotEditable']
                                ? 'grey'
                                : '',
                              'pointer-events': inventory['isNotEditable']
                                ? 'none'
                                : 'auto',
                            }"
                            >Toggle</label
                          >
                        </div>
                      </div>
                      <!-- <input
                        class="form-check-input ms-3 "
                        :disabled="inventory['isNotEditable']"
                        type="checkbox"
                        v-model="inventory['requiresPrescriptionModel']"
                        id="requiresPrescriptioncheckbox"
                        style="background-color: black"
                      /> -->
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
                      Rating :<strong class="ps-3 fs-6 text-muted">{{
                        inventory["rating"] === 0
                          ? "Has Not Been Rated"
                          : inventory["rating"]
                      }}</strong>
                    </p>
                    <p class="fs-5">
                      Description :<strong class="ps-3 fs-6 text-muted">{{
                        !inventory["description"]
                          ? " "
                          : inventory["description"]
                      }}</strong>
                    </p>
                    <p class="fs-5">
                      Date of Creation :<strong class="ps-3 fs-6 text-muted">{{
                        inventory["creationDate"]
                      }}</strong>
                    </p>
                  </div>

                  <div class="d-flex justify-content-center">
                    <button
                      id="expandButton"
                      class="btn btn-white w-100 text-dark"
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
              </div>
              <div
                :style="{
                  'pointer-events': inventory['isProcessing'] ? 'none' : 'auto',
                  opacity: inventory['isProcessing'] ? '0.7' : '1',
                }"
                class="col-2 h-50 d-flex justify-content-end me-3 pe-4 mt-1"
              >
                <i
                  type="button"
                  @click="toggleEditable(index)"
                  class="bi bi-pen pe-4"
                  style="font-size: 110%"
                ></i>
                <i
                  type="button"
                  @click="
                    {
                      currentDrugToDelete = index;
                    }
                  "
                  class="bi bi-trash"
                  style="font-size: 110%"
                  data-bs-toggle="modal"
                  data-bs-target="#confirmDelete"
                ></i>
              </div>
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
              class="btn btn-danger me-md-3 px-md-5 shadow"
              type="button"
              :disabled="inventory['isProcessing']"
              @click="toggleEditable(index)"
            >
              Cancel
            </button>
            <button
              class="btn btn-success px-md-5 shadow"
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
      <div v-if="!hasScrolledToBottom" class="col-md-11 mb-4">
        <div
        class="spinner-border text-info"
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
export default {
  name: "InventoryHomeComponent",
  data() {
    return {};
  },

  methods: {
    handleScroll(el) {
      // console.log(el.target.scrollingElement.offsetHeight,
      // el.target.scrollingElement.scrollTop,
      // el.target.scrollingElement.scrollHeight)
      // console.log(el.path[1].innerHeight)
      if (this.hasScrolledToBottom === false) {
        if (
          el.target.scrollingElement.scrollTop + el.path[1].innerHeight + 30 >
          el.target.scrollingElement.scrollHeight
        ) {
          console.log("has reached the bottom");
          this.getInventory("Load");
          this.hasScrolledToBottom = true;
        }
      }
    },
    //TODO allow pagination
    onClickAway(event) {
      if (this.drugRecomendations.length != 0) this.drugRecomendations = [];
    },
    createInventory() {
      this.$router.push({ name: "CreateInventory" });
    },
  },

  setup(props, context) {
    const {
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
    } = inventoryHome();
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
      toggleEditable,
      getInventory,
      processChange,
      queryDrugById,
      queryDrugByNameOrBrandName,
      performCreate,
      performUpdate,
      performDelete,
    };
  },
};
</script>

<style>
#Card-Header-Inventory {
  background-color: #d9dae2;
}
#Heading {
  background-color: #edf2fa;
}
#Add-Drug-Input {
  outline: none;
  box-shadow: none;
}
#inventory-card {
  background-color: #fbfcff;
  box-shadow: -5px 5px 8px 1px #d2e1e6;
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

input[id="Edit-Drug-Switch"] {
  height: 0;
  width: 0;
  visibility: hidden;
  margin-top: -38px;
  display: inline-block;
}

label[for="Edit-Drug-Switch"] {
  cursor: pointer;
  text-indent: -9999px;
  width: 32px;
  height: 19px;
  background: grey;
  display: block;
  border-radius: 13px;
  position: relative;
}

label[for="Edit-Drug-Switch"]:after {
  content: "";
  position: absolute;
  top: 3.3px;
  left: 3px;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 10px;
  transition: 0.2s;
}

input[id="Edit-Drug-Switch"]:checked + label {
  background: black;
}

input[id="Edit-Drug-Switch"]:checked + label:after {
  left: calc(100% - 4px);
  transform: translateX(-100%);
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