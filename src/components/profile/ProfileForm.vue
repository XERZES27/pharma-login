<template>
  <div class="container-lg align-items-center">
    <div class="pb-3 pt-5">
      <div class="form">
        <div class="row justify-content-center align-items-center">
          <div
            class="
              col-md-6
              justify-space-around
              border
              rounded-3
              p-3
              shadow
              bg-light
              pb-5
              align-middle
            "
          >
            <div class="text-center text-muted">
              <h2 class="display-5">Create Profile</h2>
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text" id="basic-addon1">@</span>
              <input
                type="text"
                class="form-control"
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </div>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexSwitchCheckChecked"
                checked
              />
              <label class="form-check-label" for="flexSwitchCheckChecked"
                >Checked switch checkbox input</label
              >
            </div>
            <input
              class="form-control"
              type="file"
              id="formFile"
              @change="loadImage"
            />
            <div v-if="imagesList" class="row gx-1 pt-3 justify-content-around">
              <div v-for="(img, index) in imagesList" class="col-md-4" :key="index">
                <div class="image-area">
                  <img class="img-fluid img-thumbnail rounded w-100" :src="img.src" alt="iamge">
                  <span class="remove-image" style="display: inline; cursor: pointer;" @click="handleRemove(index)">&#215;</span>
                </div>
              </div>
              <!-- <div class="col-md-4">
                <div class="image-area">
                  <img class="img-fluid img-thumbnail rounded w-100" :src="croppedImage" alt="iamge">
                  <span class="remove-image" style="display: inline; cursor: pointer;">&#215;</span>
                </div>
              </div>
              <div class="col-md-4">
                <div class="image-area">
                  <img class="img-fluid img-thumbnail rounded w-100" :src="croppedImage" alt="iamge">
                  <span class="remove-image" style="display: inline; cursor: pointer;">&#215;</span>
                </div>
              </div> -->
            </div>
            <div class="d-grid">
              <button class="btn btn-success" type="button" @click="modalToggle">Choose location</button>
            </div>
          </div>
        </div>
      </div>
      Latitude: {{ currPos.lat.toFixed(2)}}, Longitude: {{ currPos.lng.toFixed(2)}}
      
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
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="crop">Crop</button>
          </div>
        </div>
      </div>
    </div>
    <div
      ref="mapModal"
      class="modal fade"
      :class="{ show: active, 'd-block': active }"
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
              @click="modalToggle"
            ></button>
          </div>
          <div class="modal-body">
            <div ref="mapDiv" style="width: 100%; height: 60vh"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="mapModal">Cancel</button>
            <button type="button" class="btn btn-primary">Crop</button>
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

const GOOGLE_MAPS_API_KEY = process.env.VUE_APP_MAPKEY;

export default {
  components: {
    Cropper,
  },
  setup() {
    const croppedImage = ref(null);
    const cropper = ref(null);
    const active = ref(false);
    const image = ref({
      src: null,
      type: null,
      name: null,
    });
    const dialog = ref(false);
    const acceptReq = ref(true);
    const showModal = ref(false);
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
    const mapDiv = ref(null);

    const { coords } = useGeolocation();
    const currPos = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude
    }));

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
    });

    // google.maps.event.addListener(mapDiv, 'click', (event) => {
    //   addMarker(event.latLng)
    // });
    const marker = ref(null)

    const addMarker = (coords) => {
      if(marker.value !== null) deleteMarker()
      marker.value = new google.maps.Marker({
        position: coords,
        map: map.value,
        icon: imageicn.value,
        title: 'aman'
      })
    }

    const deleteMarker = () => {
      marker.value = null
      marker.value.setMap(null);
    }
    

    let map = ref(null);
    let clickListener = null;
    const otherPos = ref(null);
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    const imageicn = ref(null);

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
      imageicn.value = {
        url: "https://resizeimage.net/mypic/7PhQINvh6ofWTAKc/8x4Fv/pngegg--4-.png",
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(33, 37),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32),
      };
    });

    onUnmounted(async () => {
      if (clickListener) clickListener.remove()
    })

    const crop = () => {
      const { canvas } = cropper.value.getResult();
      croppedImage.value = canvas.toDataURL();
      imagesList.value.push({
        name: image.value.name,
        type: image.value.type,
        src: canvas.toDataURL(),
      });
      console.log(imagesList.size);
    };

    const modalToggle = () => {
      const body = document.querySelector("body");
      active.value = !active.value;
      active
        ? body.classList.add("modal-open")
        : body.classList.remove("modal-open");
    };

    const loadImage = (event) => {
      modalToggle();
      showModal.value = true;
      // Reference to the DOM input element
      const files = event.target.files;
      console.log(files);
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
    };

    const reset = () => {
      showModal = false;
      image = {
        src: null,
        type: null,
      };
    };

    const beforeImageAccept = (file) => {
      const isSized = file.size / 1024 / 1024 < 2;
      if (!isSized) {
        $message.error("Image size can not exceed 2MB!");
      }

      return isSized;
    };

    const handleRemove = (place) => {
      imagesList.value.splice(place, 1);
      //console.log("Removed from list: ",imagesList.value.length);
    };

    const handlePreview = (file) => {
      console.log(file);
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
      showModal,
      imagesList,
      model,
      loading,
      rules,
      crop,
      loadImage,
      reset,
      handleRemove,
      handlePreview,
      submit,
      active,
      modalToggle,
      cropper,
      croppedImage,
      currPos,
      mapDiv,
    };
  },
};
</script>

<style scoped>
.container-lg {
  height: 100vh;
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