<template>
  <div class="container-md">
    <div
      ref="modal"
      class="modal fade"
      :class="{ show: active, 'd-block': active }"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Crop Image</h5>
            <button
              type="button"
              class="btn-close"
              data-dismiss="modal"
              aria-label="Close"
              @click="modalToggle"
            ></button>
          </div>
          <div class="modal-body">
            <cropper
              ref="cropper"
              check-orientation
              :src="image.src"
              :stencil-props="{
                aspectRatio: 16 / 9,
              }"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="modalToggle"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="crop">
              Crop
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      ref="mapModal"
      class="modal fade mapModal"
      :class="{ show: activeMap, 'd-block': activeMap }"
      tabindex="-1"
      role="dialog"
    >
      <div
        class="
          modal-dialog modal-dialog-centered modal-xl modal-fullscreen-lg-down
        "
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Select Location</h5>
            <button
              type="button"
              class="btn-close"
              data-dismiss="mapModal"
              aria-label="Close"
              @click="closeMap"
            ></button>
          </div>
          <div class="modal-body">
            <div ref="mapDiv" style="width: 100%; height: 60vh"></div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="mapModal"
              @click="closeMap"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-success" @click="setNewCoordinates">
              DONE!
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="active" class="modal-backdrop fade show"></div>
    <div class="row bg-light align-items-center text-start mb-4">
      <div class="col-md-12 py-4 ps-5 display-4" id="Heading">
        Update Profile
      </div>
    </div>
    <div class="row ms-5 d-flex justify-content-center">
      <div
        ref="toastDiv"
        id="liveToast"
        class="toast col-6 bg-dark text-white"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body ps-2 mt-1">
            <strong>Please select an image less than 2MB.</strong>
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
    <div class="row d-flex align-items-center justify-content-end mt-2 mb-5">
      <form
        class="col-md-11 form needs-validation"
        @submit.prevent="submit"
        novalidate="true"
        ref="profileForm"
      >
        <div v-if="loading === false" class="border rounded-3 p-3 align-middle">
          <div class="form-group mb-4">
            <span v-if="errorMessage !== ''" class="row text-danger mt-2 mb-2">
              <strong>{{ errorMessage }}</strong>
            </span>
            <div class="row">
              <span class="mb-1"><strong>Name</strong></span>
            </div>
            <div class="row ms-1">
              <input
                v-model="nameModel"
                maxlength="30"
                disabled="true"
                type="text"
                pattern="[A-Za-z0-9-\x27\s]+"
                title="Greater than 5 Characters, cannot contain special characters"
                class="form-control text-dark fw-bold border-2 border-bottom"
                id="pharmacyName"
                placeholder="Pharmacy Name, Choose Carefully this field Cannot Be Easily Changed"
                required
              />
            </div>
            <span v-if="nameError !== ''" class="text-danger mt-2 ps-2">
              <strong
                >Greater than 5 Characters, cannot contain special
                characters</strong
              >
            </span>
          </div>

          <div
            v-if="imagesList.length + loadedImagesFromRepo.length < 3"
            class="row form-group mb-4"
          >
            <label class="mb-3" for="formFile"
              ><strong
                >Choose images of the Pharmacy(max: 3 images)</strong
              ></label
            >
            <div class="ms-1 upload-btn-wrapper">
              <button
                class="form-control btn btn-outline-dark"
                @click.prevent="rando"
              >
                Select Images
              </button>
              <input
                class="form-control"
                name="myfile"
                type="file"
                id="formFile"
                @change="loadImage"
              />
            </div>
            <span
              v-if="imagesList.length + loadedImagesFromRepo.length === 0"
              class="text-danger mt-2 ms-2"
            >
              <strong>Please select an image.</strong>
            </span>
          </div>
          <div class="mb-4" v-else>
            <span class="" for="formFile"
              ><strong>Pharmacy Images</strong></span
            >
          </div>
          <div
            v-if="imagesList.length > 0 || loadedImagesFromRepo.length > 0"
            class="row gx-1 mb-4 justify-content-around"
          >
            <div
              v-for="(img, index) in loadedImagesFromRepo"
              class="col-md-4 col-sm-4 col-xs-6 col-4"
              :key="index"
            >
              <div class="image-area">
                <vue-load-image style="background-color:#FFFFFF;" >
                  <template v-slot:image>
                    <img
                      class="img-fluid img-thumbnail rounded w-100"
                      :src="img"
                      alt="iamge"
                    />
                     <span
                  class="remove-image"
                  style="display: inline; cursor: pointer"
                  @click="removePhotoFromRepo(index)"
                  >&#215;</span
                >
                  </template>
                  <template class="bg-light" v-slot:preloader>
                    <img class="rounded mx-auto d-block"  src="../../assets/pharmacyPhotosLoader48.gif" />
                  </template>
                </vue-load-image>
                
              </div>
            </div>

            <div
              v-for="(img, index) in imagesList"
              class="col-md-4 col-sm-4 col-xs-6 col-4"
              :key="index"
            >
              <div class="image-area">
                <img
                  class="img-fluid img-thumbnail rounded w-100"
                  :src="img.src"
                  alt="iamge"
                />
                <span
                  class="remove-image"
                  style="display: inline; cursor: pointer"
                  @click="handleRemove(index)"
                  >&#215;</span
                >
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="" style="width: 160px">
              <span class="" for="flexSwitchCheckChecked"
                ><strong>Accepts Requests</strong></span
              >
            </div>
            <div class="col form-check form-switch ms-3 mb-3 d-inline">
              <input
                v-model="acceptsRequestsModel"
                class="form-check-input"
                type="checkbox"
                id="flexSwitchCheckChecked"
                checked
              />
            </div>
          </div>
          <div class="form-group mb-4">
            <div class="row">
              <span class="mb-3"><strong>Location Description</strong></span>
            </div>
            <div class="row ms-1">
              <input
                maxlength="100"
                pattern="[A-Za-z0-9-\x27\s]+"
                title="Greater than 5 Characters, cannot contain special characters"
                v-model="locationDescriptionModel"
                class="
                  form-control
                  fw-bold
                  border-2
                  border-start-0
                  border-end-0
                  border-top-0
                  border-bottom
                "
                placeholder="e.g. Megenana 20m below zefmesh"
                required
              />
            </div>
            <span
              v-if="locationDescriptionError !== ''"
              class="text-danger mt-2 ps-2"
            >
              <strong
                >Greater than 5 Characters, cannot contain special
                characters</strong
              >
            </span>
          </div>
          <p>
            <strong>Location 📍 : </strong>
            <span v-if="!location" class="" ref="locationValidation"
              ><strong>Please choose the location of the Pharmacy</strong></span
            >
            <span v-if="location" class="text-success fst-italic fw-bolder">
              {{ location.latitude }}, {{ location.longitude }}
            </span>
          </p>
          <div class="d-grid mb-3">
            <button class="btn btn-success" type="button" @click="openMap">
              Edit Pharmacy location
            </button>
          </div>
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button
              :disabled="disableSubmit"
              type="submit"
              class="btn btn-dark text-light btn-labeled px-4"
            >
              <span class="btn-label">✓︁ </span>Update Profile
            </button>
          </div>
        </div>
        <div v-else>
          <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { computed, onMounted, onUnmounted, ref } from "vue";

const GOOGLE_MAPS_API_KEY = process.env.VUE_APP_MAPKEY;

import { profile } from "../../composables/Profile/CreateProfile";
import VueLoadImage from "vue-load-image";

export default {
  methods: {
    rando() {
      console.log("here");
    },
  },
  components: {
    Cropper,
    "vue-load-image": VueLoadImage,
  },
  setup() {
    const {
      setNewCoordinates,
      openMap,
closeMap,
      profileForm,
      nameModel,
      nameError,
      acceptsRequestsModel,
      locationDescriptionModel,
      locationDescriptionError,
      image,
      dialog,
      acceptReq,
      showMap,
      imagesList,
      loadedImagesFromRepo,
      model,
      loading,
      disableSubmit,
      errorMessage,
      rules,
      crop,
      loadImage,
      handleRemove,
      removePhotoFromRepo,
      active,
      activeMap,
      modalToggle,
      mapToggle,
      cropper,
      croppedImage,
      currPos,
      mapDiv,
      locationValidation,
      toastDiv,
      deleteMarker,
      location,
      showToast,
      showValidation,
    } = profile();
    return {
      setNewCoordinates,
      openMap,
closeMap,
      profileForm,
      nameModel,
      nameError,
      acceptsRequestsModel,
      locationDescriptionModel,
      locationDescriptionError,
      image,
      dialog,
      acceptReq,
      showMap,
      imagesList,
      loadedImagesFromRepo,
      model,
      loading,
      disableSubmit,
      errorMessage,
      rules,
      crop,
      loadImage,
      handleRemove,
      removePhotoFromRepo,
      active,
      activeMap,
      modalToggle,
      mapToggle,
      cropper,
      croppedImage,
      currPos,
      mapDiv,
      locationValidation,
      toastDiv,
      deleteMarker,
      location,
      showToast,
      showValidation,
    };
  },
};
</script>

<style scoped>
.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.upload-btn-wrapper input[type="file"] {
  font-size: 58px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.main-container {
  height: 100vh;
  background-color: rgb(185, 185, 185);
}

.image-area {
  position: relative;
  background: #333;
}
.remove-image {
  display: none;
  position: absolute;
  top: -5px;
  right: -5px;
  border-radius: 5em;
  padding: 2px 6px 3px;
  text-decoration: none;
  font: 700 21px/20px sans-serif;
  background: #555;
  border: 3px solid #fff;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  -webkit-transition: background 0.5s;
  transition: background 0.5s;
}
.remove-image:hover {
  background: #e54e4e;
  padding: 3px 7px 5px;
  top: -6px;
  right: -6px;
}
.remove-image:active {
  background: #e54e4e;
  top: -5px;
  right: -6px;
}

#Heading {
  background-color: #edf2fa;
  font-family: Times New Roman, serif;
}
</style>