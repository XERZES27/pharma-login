<template>
  <div class="main-container container-fluid d-flex align-items-center">
    <div class="container">
      <form class="form row justify-content-center align-items-center needs-validation" novalidate>
        <div
          class="
            col-md-8
            col-lg-6
            col-xl-5
            col-sm-10
            col-11
            justify-space-around
            border
            rounded-3
            p-3
            shadow
            bg-light
            align-middle
          "
        >
          <div class="text-center text-muted">
            <h2 class="display-5">Create Profile</h2>
          </div>
          <div class="form-group mb-3">
            <label class="text-muted" for="pharmacyName">Pharmacy Name</label>
            <input type="text" class="form-control" id="pharmacyName" placeholder="Pharmacy Name" required/>
          </div>
          <span class="invalid-feedback" v-if="showValidation">

          </span>
          <div class="form-check form-switch mb-3">
            <input
              class="form-check-input"
              type="checkbox"
              id="flexSwitchCheckChecked"
              checked
            />
            <label class="form-check-label" for="flexSwitchCheckChecked"
              >Accept Request</label
            >
          </div>
          <div class="form-group mb-3">
            <label class="text-muted" for="formFile">Choose images of the Pharmacy(max: 3 images)</label>
            <input
              class="form-control"
              type="file"
              id="formFile"
              @change="loadImage"
              required
            />
          </div>
          <div v-if="imagesList.length > 0" class="row gx-1 mb-3 justify-content-around">
            <div v-for="(img, index) in imagesList" class="col-md-4 col-sm-4 col-xs-6 col-4" :key="index">
              <div class="image-area">
                <img class="img-fluid img-thumbnail rounded w-100" :src="img.src" alt="iamge">
                <span class="remove-image" style="display: inline; cursor: pointer;" @click="handleRemove(index)">&#215;</span>
              </div>
            </div>
          </div>
          <div class="form-group mb-3">
            <label class="text-muted" for="locationTextarea">Loction in words</label>
            <textarea class="form-control" id="locationTextarea" rows="3" style="resize: none;" placeholder="e.g. Megenana 20m below zefmesh" required/>
          </div>
          <p>Location 📍 : <span v-if="!location" class="fw-lighter" ref="locationValidation">Please choose the location of the Pharmacy</span>
            <span v-if="location" class="text-success fst-italic fw-bolder">
              {{location.latitude}}, {{location.longitude}}
            </span>
          </p>
          <div class="d-grid mb-3">
            <button class="btn btn-success" type="button" @click="mapToggle">Choose Pharmacy location</button>
          </div>
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="submit" class="btn btn-info text-light btn-labeled">
                  <span class="btn-label">✓︁ </span>Create
            </button>
          </div>
        </div>
      </form>
    </div>
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
      <div ref="toastDiv" id="liveToast" class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            Please select an image lessthan 2MB.
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div>
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
            <h5 class="modal-title">Modal title</h5>
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
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="modalToggle" >Cancel</button>
            <button type="button" class="btn btn-primary" @click="crop">Crop</button>
          </div>
        </div>
      </div>
    </div>
    <div
      ref="mapModal"
      class="modal fade"
      :class="{ show: activeMap, 'd-block': activeMap }"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-lg-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button
              type="button"
              class="btn-close"
              data-dismiss="mapModal"
              aria-label="Close"
              @click="mapToggle"
            ></button>
          </div>
          <div class="modal-body">
            <div ref="mapDiv" style="width: 100%; height: 60vh"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="mapModal" @click="mapToggle">Cancel</button>
            <button type="button" class="btn btn-success" @click="mapToggle">DONE!</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="active" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useGeolocation } from '@/composables/Profile/useGeolocation.js'
import { Loader } from '@googlemaps/js-api-loader';
import { Toast } from 'bootstrap'

const GOOGLE_MAPS_API_KEY = process.env.VUE_APP_MAPKEY;
let markers = [];

export default {
  components: {
    Cropper,
  },
  setup() {
    const croppedImage = ref(null);
    const cropper = ref(null);
    const toastDiv = ref(null);
    const active = ref(false);
    const activeMap = ref(false);
    const image = ref({
      src: null,
      type: null,
      name: null,
    });
    const dialog = ref(false);
    const acceptReq = ref(true);
    const showMap = ref(false);
    const imagesList = ref([]);
    const model = ref({
      username: "",
    });
    const loading = ref(false);
    const rules = {
      username: [
        {
          required: true,
          message: "Username is required",
          trigger: "blur",
        },
        {
          min: 4,
          message: "Username length should be at least 5 characters",
          trigger: "blur",
        },
      ],
    };
    const location = ref(null);
    const mapDiv = ref(null);
    let map = ref(null);
    let clickListener = null;
    let locationValidation = ref(null);
    const otherPos = ref(null);
    const imageicn = ref(null);

    //* On mounted map is initialized with and a click listener is attached.
    onMounted(async () => {
      await loader.load()
      map.value = new google.maps.Map(mapDiv.value, {
        center: currPos.value,
        zoom: 16
      })
      clickListener = map.value.addListener(
        'click',
        ({ latLng: { lat, lng } }) => {
          otherPos.value = { lat: lat(), lng: lng() }
          console.log(otherPos.value);
          addMarker(otherPos.value);
        }
      )
      //* Custom marker icon for the map.
      imageicn.value = {
        url: "https://i.im.ge/2021/07/21/seFIh.png",
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(33, 37),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 37).
        anchor: new google.maps.Point(16, 40),
      };

      //* For Form Valdiation.
      var forms = document.querySelectorAll('.needs-validation');
      Array.prototype.slice.call(forms)
        .forEach(function (form) {
          form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
              event.preventDefault()
              event.stopPropagation()
            }

            form.classList.add('was-validated')
            locationValidation.value.classList.add('text-danger');
          }, false)
        });
    });

    //* On unmounted the map click listner is removed
    onUnmounted(async () => {
      if (clickListener) clickListener.remove()
    });

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
    });

    //* Get current location of the user to center his/her map
    const { coords } = useGeolocation();
    const currPos = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude
    }));

    //* Shows error toast.
    const showToast = () => {
      var toast = new Toast(toastDiv.value)
      toast.show()
    }

    //* Add marker of the pharmacy location on the map.
    const addMarker = (coords) => {
      if(markers.length !== 0) deleteMarker()
      const marker = new google.maps.Marker({
        position: coords,
        map: map.value,
        icon: imageicn.value,
        title: 'aman'
      })
      markers.push(marker);
      location.value = {
        latitude: coords.lat,
        longitude: coords.lng
      }
      console.log(location.value);
    }

    const deleteMarker = () => {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }

    //* Toggles the crop modal.
    const modalToggle = () => {
      const body = document.querySelector("body");
      active.value = !active.value;
      active
        ? body.classList.add("modal-open")
        : body.classList.remove("modal-open");
    };

    //* Toggle the map modal.
    const mapToggle = () => {
      const body = document.querySelector("body");
      activeMap.value = !activeMap.value;
      active
        ? body.classList.add("modal-open")
        : body.classList.remove("modal-open");
    };

    //* Load the images selected and give it to the cropper modal.
    const loadImage = (event) => {
      const files = event.target.files;

      if (beforeImageAccept(files[0])) {
        console.log(files);
        modalToggle();
        showMap.value = true;
        // Ensure that you have a file before attempting to read it
        if (files) {
          // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
          if (image.src) {
            URL.revokeObjectURL(image.src);
          }
          // 2. Create the blob link to the file to optimize performance:
          const blob = URL.createObjectURL(files[0]);
          
          image.value = {
            src: blob,
            type: files[0].type,
            name: files[0].name
          };
        }
      }
    };

    //* Check if the image size is appropriate(not too big).
    const beforeImageAccept = (file) => {
      const isSized = file.size / 1024 / 1024 < 2;
      if (!isSized) {
        showToast();
      }
      return isSized;
    };

    //* Crop the image and preview it.
    const crop = () => {
      const { canvas } = cropper.value.getResult();
      croppedImage.value = canvas.toDataURL();
      imagesList.value.push({
        name: image.value.name,
        type: image.value.type,
        src: canvas.toDataURL(),
      });
      modalToggle();
    };

    const handleRemove = (place) => {
      imagesList.value.splice(place, 1);
    };

    const simulateSubmit = () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 800);
      });
    };

    const submit = async () => {
      let valid = await $refs.form.validate();
      if (!valid) {
        return;
      }
      loading = true;
      await simulateSubmit();
      loading = false;
      if (
        model.username === validCredentials.username &&
        model.password === validCredentials.password
      ) {
        $message.success("Submit successfull");
      } else {
        $message.error("Username or password is invalid");
      }
    };

    return {
      image,
      dialog,
      acceptReq,
      showMap,
      imagesList,
      model,
      loading,
      rules,
      crop,
      loadImage,
      handleRemove,
      submit,
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
      showToast
    };
  },
};
</script>

<style scoped>
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
color: #FFF;
box-shadow: 0 2px 6px rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.3);
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  -webkit-transition: background 0.5s;
  transition: background 0.5s;
}
.remove-image:hover {
 background: #E54E4E;
  padding: 3px 7px 5px;
  top: -6px;
right: -6px;
}
.remove-image:active {
 background: #E54E4E;
  top: -5px;
right: -6px;
}
</style>