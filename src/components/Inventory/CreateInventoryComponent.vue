<template>
  <section id="inventory">
    <div class="container-lg">
      <div class="row justify-content-start align-items-center">
        <div class="col-md-8 text-center text-md-start">
          <p class="lead my-4 text-muted">
            This Page serves to allow you to upload all your entire inventory in
            one go by uploading an excel file(.xlsx) that has been properly
            formated.
          </p>

          <p class="lead my-4 text-muted d-inline">
            Please refer to the documentation to understand how to upload your
            inventory
          </p>

          <router-link
            :to="{ name: 'InventoryHelp' }"
            class="d-inline text-underline text-warning"
          >
            <u>Here</u>
          </router-link>

          <div
            v-if="initialPhase"
            class="d-flex align-items-center"
            style="height: 60vh"
          >
            <div
              class="drag-area"
              :class="[isActive ? activeClass : '']"
              ref="dragarea"
              @drop.prevent="onDrop"
              @dragleave="onDragLeave"
              @dragover.prevent="onDragOver"
            >
              <div class="icon"><i class="fas fa-cloud-upload-alt"></i></div>
              <header ref="header" class="px-2">{{ headerText }}</header>
              <span>OR</span>
              <button v-on:click="directToInput">Browse File</button>
              <input
                ref="input"
                type="file"
                accept=".xlsx"
                @change="onSelectedFile"
                hidden
              />
            </div>
          </div>
          <div
            v-else-if="isProcessingOnClient"
            class="w-100"
            style="height: 60vh"
          >
            <p class="fs-3 pt-5 text-info">Loading ....</p>
            <div class="d-flex justify-content-center">
              <div
                class="spinner-border text-info"
                role="status"
                style="width: 3rem; height: 3rem"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>

          <div v-else-if="userValidationPhase" class="w-100">
            <div class="mt-5">
              <div v-if="rowsWithRepetitionErrors.length != 0">
                <h3 class="py-4 text-danger"><u>Repetition Errors</u></h3>
                <p class="text-muted fs-5">
                  The Rows below have repeated values
                </p>
                <table class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Drug Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">In Stock</th>
                      <th scope="col">Prescription Required</th>
                      <th scope="col">Drug Description</th>
                      <th scope="col">Brand Name</th>
                      <th scope="col">Country of origin</th>
                    </tr>
                  </thead>
                  <tbody class="">
                    <tr
                      v-for="(rows, index) in rowsWithRepetitionErrors"
                      :key="rows.index"
                    >
                      <td scope="row">{{ rows.index + 1 }}</td>
                      <td
                        v-for="(cell, ind) in rows.row"
                        :key="cell + index"
                        :class="{
                          'bg-danger': !rows.cellColors[ind],
                          'text-white': !rows.cellColors[ind],
                        }"
                      >
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="rowsWithValidationErrors.length != 0">
                <h3 class="py-4 text-danger"><u>Validation Errors</u></h3>
                <p class="text-muted fs-5">
                  The Rows below have validation errors
                </p>
                <table class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Drug Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">In Stock</th>
                      <th scope="col">Prescription Required</th>
                      <th scope="col">Drug Description</th>
                      <th scope="col">Brand Name</th>
                      <th scope="col">Country of origin</th>
                    </tr>
                  </thead>
                  <tbody class="">
                    <tr
                      v-for="(rows, index) in rowsWithValidationErrors"
                      :key="rows.index"
                    >
                      <td scope="row">{{ rows.index + 1 }}</td>
                      <td
                        v-for="(cell, ind) in rows.row"
                        :key="cell + index"
                        :class="{
                          'bg-danger': !rows.cellColors[ind],
                          'text-white': !rows.cellColors[ind],
                        }"
                      >
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mt-5">
                <p
                  v-if="
                    rowsWithValidationErrors.length == 0 &&
                    rowsWithRepetitionErrors.length == 0
                  "
                  class="fs-5 fw-bold text-success"
                >
                  All your drugs have passed validation press
                  <strong class="bg-dark badge">Upload</strong> if you would
                  like to continue
                </p>

                <p v-else class="fs-5 fw-light text-danger">
                  The items above have <strong>Errors</strong> and will not be
                  sent to the server. <br />
                  If you would like to correct them, press
                  <strong class="badge bg-danger">Cancel</strong> then edit them
                  in your excel document then reupload them. <br />Press
                  <strong class="bg-dark badge">Upload</strong> if you would
                  like to discard them and continue
                </p>
              </div>
              <div class="my-5 d-flex justify-content-center">
                <button
                  type="button"
                  @click="cancelClientValidation"
                  class="btn btn-danger btn-lg me-3 w-50 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="btn btn-dark btn-lg w-50 shadow-sm"
                  @click="uploadToServer"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
          <div
            v-else-if="isProcessingOnServer"
            class="w-100"
            style="height: 60vh"
          >
            <p class="fs-3 pt-5 text-info">Loading ....</p>
            <div class="d-flex justify-content-center">
              <div
                class="spinner-border text-info"
                role="status"
                style="width: 3rem; height: 3rem"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
          <div v-else-if="finalPhase" class="w-100">
            <div class="mt-5">
              <h3
                v-if="stateOfResponse == `Complete Pass`"
                class="text-success"
              >
                Congratulations all your data has been successfully uploaded
              </h3>
              <h3 v-if="stateOfResponse == `Partial Fail`" class="text-warning">
                Some of your data has not been uploaded
              </h3>
              <h3 v-if="stateOfResponse == `Complete Fail`" class="text-danger">
                Please check that your data is not invalid, everything has
                failed (ﾉ*ФωФ)ﾉ
              </h3>
            </div>
            <div class="mt-5">
              <div v-if="rowsWithValidDrugModels.length != 0">
                <h3 class="py-4 text-success"><u>Validation Errors</u></h3>
                <p class="text-muted fs-5">
                  The Rows below do not have validation errors.
                </p>
                <table class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Drug Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">In Stock</th>
                      <th scope="col">Prescription Required</th>
                      <th scope="col">Drug Description</th>
                      <th scope="col">Brand Name</th>
                      <th scope="col">Country of origin</th>
                    </tr>
                  </thead>
                  <tbody class="">
                    <tr
                      v-for="(rows, index) in rowsWithValidDrugModels"
                      :key="rows.index"
                    >
                      <td scope="row">{{ rows.index + 1 }}</td>
                      <td
                        v-for="cell  in rows.row"
                        :key="cell + index"
                      >
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="rowsWithRepetitionErrors.length != 0">
                <h3 class="py-4 text-danger"><u>Repetition Errors</u></h3>
                <p class="text-muted fs-5">
                  The Rows below already exist on the server and cannot be
                  repeated <br />
                  Consider changing the brand name if you want to have the
                  different variants of a single drug
                </p>
                <table class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Drug Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">In Stock</th>
                      <th scope="col">Prescription Required</th>
                      <th scope="col">Drug Description</th>
                      <th scope="col">Brand Name</th>
                      <th scope="col">Country of origin</th>
                    </tr>
                  </thead>
                  <tbody class="">
                    <tr
                      v-for="(rows, index) in rowsWithRepetitionErrors"
                      :key="rows.index"
                    >
                      <td scope="row">{{ rows.index + 1 }}</td>
                      <td
                        v-for="(cell, ind) in rows.row"
                        :key="cell + index"
                        :class="{
                          'bg-danger': !rows.cellColors[ind],
                          'text-white': !rows.cellColors[ind],
                        }"
                      >
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="rowsWithValidationErrors.length != 0">
                <h3 class="py-4 text-danger"><u>Validation Errors</u></h3>
                <p class="text-muted fs-5">
                  The Rows below have validation errors <br />It is very likely
                  that you are not using the correct excel format <br />Please
                  follow the guide
                </p>
                <table class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Drug Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">In Stock</th>
                      <th scope="col">Prescription Required</th>
                      <th scope="col">Drug Description</th>
                      <th scope="col">Brand Name</th>
                      <th scope="col">Country of origin</th>
                    </tr>
                  </thead>
                  <tbody class="">
                    <tr
                      v-for="(rows, index) in rowsWithValidationErrors"
                      :key="rows.index"
                    >
                      <td scope="row">{{ rows.index + 1 }}</td>
                      <td
                        v-for="(cell, ind) in rows.row"
                        :key="cell + index"
                        :class="{
                          'bg-danger': !rows.cellColors[ind],
                          'text-white': !rows.cellColors[ind],
                        }"
                      >
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="my-5 d-flex justify-content-center">
                <button
                  v-if="stateOfResponse == `Complete Fail`"
                  type="button"
                  @click="cancelCreateInventory"
                  class="btn btn-danger btn-lg me-3 w-50 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  v-if="
                    stateOfResponse == `Partial Fail` ||
                    stateOfResponse == `Complete Pass`
                  "
                  type="button"
                  class="btn btn-primary btn-lg w-50 shadow-sm"
                  @click="retryCreateInventory"
                >
                  Upload Some More
                </button>
                <button
                  v-if="stateOfResponse == `Complete Fail`"
                  type="button"
                  class="btn btn-primary btn-lg w-50 shadow-sm"
                  @click="retryCreateInventory"
                >
                  Retry
                </button>
                <button
                  v-if="
                    stateOfResponse == `Partial Fail` ||
                    stateOfResponse == `Complete Pass`
                  "
                  type="button"
                  class="btn btn-success btn-lg w-50 shadow-sm"
                  @click="continueToInventory"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          <!-- Modal -->

          <div
            class="modal fade"
            :style="{ display: unknownErrors ? `block` : `none` }"
            :class="{ show: unknownErrors }"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-modal="true"
            role="dialog"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    Something real bad went down ψ(._. )>
                  </h5>
                  <button
                    type="button"
                    class="close"
                    aria-label="Close"
                    @click="closeModal"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div class="modal-body">
                  Please reload the page, make sure that you are connected
                  <br />
                  <p class="text-uppercase">
                    <strong>{{ unknownErrorsBody }}</strong>
                  </p>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="closeModal"
                  >
                    Close
                  </button>
                  <button type="button" class="btn btn-primary">Reload</button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="modal-backdrop fade show"
            id="backdrop"
            :style="{ display: unknownErrors ? `block` : `none` }"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { createInventory } from "../../composables/Inventory/CreateInventory";

export default {
  setup(props, context) {
    const {
      onFilePicked,
      drugModelsAndErrors,
      rowsWithValidationErrors,
      rowsWithRepetitionErrors,
      rowsWithValidDrugModels,
      unknownErrors,
      unknownErrorsBody,
      isActive,
      activeClass,
      stateOfResponse,
      finalPhase,
      headerText,
      initialPhase,
      isProcessingOnClient,
      userValidationPhase,
      isProcessingOnServer,
      uploadToServer,
    } = createInventory();
    return {
      onFilePicked,
      drugModelsAndErrors,
      rowsWithValidationErrors,
      rowsWithRepetitionErrors,
      rowsWithValidDrugModels,
      unknownErrors,
      unknownErrorsBody,
      isActive,
      activeClass,
      stateOfResponse,
      finalPhase,
      headerText,
      initialPhase,
      isProcessingOnClient,
      userValidationPhase,
      isProcessingOnServer,
      uploadToServer,
    };
  },
  data() {
    return {};
  },

  methods: {
    cancelCreateInventory() {
      //TODO router back
    },
    retryCreateInventory() {
      // TODO reload create inventory
    },
    continueToInventory() {
      // TODO forward to inventory
    },

    openModal() {
      this.unknownErrors = true;
      unknownErrorsBody = "";
    },
    closeModal() {
      this.unknownErrors = false;
      unknownErrorsBody = "";
    },
    // Get the modal

    directToInput() {
      this.$refs.input.click();
    },
    cancelClientValidation() {
      (this.userValidationPhase = false), (this.initialPhase = true);
    },
    onSelectedFile(event) {
      this.validateSelectedFile(event.target.files[0]);
    },

    async validateSelectedFile(file) {
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        await this.onFilePicked(file);
      } else {
        this.headerText = ` ${file.type} is not a valid type, Please select a valid Excel File(.xlsx)`;
      }
    },
    onDragOver(event) {
      // this.$refs.dragarea.classlist.add("active")
      if (this.isActive === false) {
        this.isActive = true;
        this.headerText = "Release to Upload File";

        console.log("onDragOver", this.$refs.dragarea);
      }
    },
    onDragLeave(event) {
      // this.$refs.dragarea.classlist.remove("active")
      if (this.isActive === true) {
        this.isActive = false;
        this.headerText = "Drag & Drop to Upload File";
        console.log("onDragLeave", this.$refs.dragarea);
      }
    },
    onDrop(event) {
      console.log("onDrop");
      if (this.isActive === true) {
        this.isActive = false;
        this.headerText = "Drag & Drop to Upload File";
      }
      this.validateSelectedFile(event.dataTransfer.files[0]);
    },
  },
};
</script>

<style>
.drag-area {
  border: 2px dashed #505050;
  height: 500px;
  width: 700px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.drag-area.active {
  border: 2px #505050;
}
.drag-area .icon {
  font-size: 100px;
  color: #505050;
}
.drag-area header {
  font-size: 30px;
  font-weight: 500;
  color: #505050;
}
.drag-area span {
  font-size: 25px;
  font-weight: 500;
  color: #505050;
  margin: 10px 0 15px 0;
}
.drag-area button {
  padding: 10px 25px;
  font-size: 20px;
  font-weight: 500;
  border: none;
  outline: none;
  background: #505050;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}
</style>