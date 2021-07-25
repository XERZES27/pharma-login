<template>
  <section id="inventoryHome">
    <div class="container-md">
      <div class="row bg-light align-items-center text-start mb-4">
        <div
          class="col-md-12 py-4 ps-5 display-4"
          style="font-family: 'Times New Roman', serif"
        >
          Inventory
        </div>
      </div>
      <div class="row mb-5 align-items-end">
        <div class="col text-end">
          <i
            type="button"
            @click="getInventory"
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
      <div id="floating-search" v-click-away="onClickAway">
        <div class="row d-flex align-items-center justify-content-center">
          <div class="col-md-10">
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
            <div class="row d-flex justify-content-center pt-1">
              <div class="col-md-10">
                <div class="card border border-top-0 border-end-0" type="button" @click="queryDrugById(recommendation['_id'])">
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
                <p class="fs-3">{{resultCameEmpty}}</p>
              </div>
            </div>
        </div>
      </div>
      <div class="row d-flex justify-content-end mt-5">
        <div
          class="
            col-md-11
            border border-light
            rounded
            py-1
            ps-3
            bg-light
            d-flex
            justify-content-between
          "
        >
          <span
            class="fs-3 pt-4"
            style="font-family: 'Times New Roman', serif"
            >Sorted {{ pickedSort }}</span
          >
          <div class=" me-4">
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
        class="row d-flex justify-content-end mt-5"
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
            v-if="inventory['deleteFailed']"
            class="d-flex justify-content-between align-items-center"
          >
            <p class="d-inline text-danger pt-2 ps-3">
              <strong>Failed to delete</strong>
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
            class="card border border-top-0 pt-3"
            :style="{
              animation: inventory['isProcessing']
                ? 'pulse 1.8s ease-in-out infinite alternate'
                : 'none',
            }"
          >
            <div class="row">
              <div class="col">
                <div class="card-body text-start">
                  <h5 class="card-title pb-2">Name: {{ inventory["name"] }}</h5>
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

                  <div class="mb-3">
                    <p class="fs-5 d-inline">Requries Prescription :</p>
                    <input
                      class="form-check-input ms-3 k"
                      :disabled="inventory['isNotEditable']"
                      type="checkbox"
                      v-model="inventory['requiresPrescriptionModel']"
                      id="requiresPrescriptioncheckbox"
                      style="background-color: black"
                    />
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
                  <p v-if="inventory['toggleMore']" class="fs-5">
                    Rating :<strong class="ps-3 fs-6 text-muted">{{
                      inventory["rating"] === 0
                        ? "Has Not Been Rated"
                        : inventory["rating"]
                    }}</strong>
                  </p>
                  <p v-if="inventory['toggleMore']" class="fs-5">
                    Description :<strong class="ps-3 fs-6 text-muted">{{
                      !inventory["description"] ? " " : inventory["description"]
                    }}</strong>
                  </p>
                  <p v-if="inventory['toggleMore']" class="fs-5">
                    Date of Creation :<strong class="ps-3 fs-6 text-muted">{{
                      inventory["creationDate"]
                    }}</strong>
                  </p>

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
                class="col-2 h-50 d-flex justify-content-end me-3 pe-4"
              >
                <i
                  type="button"
                  @click="toggleEditable(index)"
                  class="bi bi-pen pe-4"
                  style="font-size: 110%"
                ></i>
                <i
                  type="button"
                  class="bi bi-trash"
                  style="font-size: 110%"
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
    </div>
  </section>
</template>

<script>
import { inventoryHome } from "../../composables/Inventory/InventoryHome";
import "bootstrap-icons/font/bootstrap-icons.css";
export default {
  methods: {
    onClickAway(event) {
      if (this.drugRecomendations.length != 0) this.drugRecomendations = [];
    },
    createInventory(){
      this.$router.push({name:'CreateInventory'})
    }
  },

  setup(props, context) {
    const {
      searchQuery,
      inventoryList,
      pickedSort,
      drugRecomendations,
      resultCameEmpty,
      disableDeleteFailedMessage,
      disableUpdateMessage,
      toggleMore,
      toggleEditable,
      getInventory,
      processChange,
      queryDrugById,
      queryDrugByNameOrBrandName,
      performUpdate,
    } = inventoryHome();
    return {
      searchQuery,
      inventoryList,
      pickedSort,
      drugRecomendations,
      resultCameEmpty,
      disableDeleteFailedMessage,
      disableUpdateMessage,
      toggleMore,
      toggleEditable,
      getInventory,
      processChange,
      queryDrugById,
      queryDrugByNameOrBrandName,
      performUpdate,
    };
  },
};
</script>

<style>
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
  /* border-bottom: 2px solid rgb(206, 206, 206); */
}
input[type="text"]:disabled {
  background: transparent;

  /* border-style: none; */
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