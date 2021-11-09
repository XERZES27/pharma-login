import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import {
  createProfile,
  getProfile,
  deletePhoto,
  updateProfile,
} from "../../repository/profileRepository";
import { Loader } from "@googlemaps/js-api-loader";
import { Toast, Modal } from "bootstrap";
import { useGeolocation } from "@/composables/Profile/useGeolocation.js";
import store from "../../store/index";
import router from "../../router/index";
import { useRoute } from "vue-router";

const profile = () => {
  const GOOGLE_MAPS_API_KEY = process.env.VUE_APP_MAPKEY;
  const route = useRoute();
  let markers = [];
  const profileForm = ref("");
  const nameModel = ref("");
  const nameError = ref("");
  const acceptsRequestsModel = ref(true);
  const locationDescriptionModel = ref("");
  const locationDescriptionError = ref("");
  const croppedImage = ref(null);
  const cropper = ref(null);
  const toastDiv = ref("");
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
  let mapModal = false;
  let tempLocation = 0;
  const imagesList = ref([]);
  const loadedImagesFromRepo = ref([]);
  const imagesFromRepoToBeDeleted = ref([]);
  const dataFromRepo = ref(null);
  const model = ref({
    username: "",
  });
  const loading = ref(false);
  const disableSubmit = ref(true);
  const errorMessage = ref("");
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
  let locationValidation = ref("");
  const otherPos = ref(null);
  const imageicn = ref(null);
  const showValidation = ref(false);

  const loadProfile = async () => {
    return new Promise((resolve, reject) => {
      getProfile()
        .then((response) => {
          dataFromRepo.value = response.data;
          nameModel.value = response.data.name;
          locationDescriptionModel.value = response.data.locationDescription;
          acceptsRequestsModel.value = response.data.acceptsRequests;
          var initialLocation = response.data.location.coordinates;
          var initialPos = { lat: initialLocation[0], lng: initialLocation[1] };
          loadedImagesFromRepo.value = response.data.pharmacyPhotos;

          addMarker(initialPos);
          resolve(initialPos);
        })
        .catch((error) => {
          console.log("error ", error);
        });
    });
  };

  const removePhotoFromRepo = async (index) => {
    imagesFromRepoToBeDeleted.value.push(loadedImagesFromRepo.value[index]);
    loadedImagesFromRepo.value.splice(index, 1);

    // deletePhoto(loadedImagesFromRepo.value[index])
    //   .then((result) => {
    //     loadedImagesFromRepo.value.splice(index, 1);
    //     console.log(result.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  //* On mounted map is initialized with and a click listener is attached.
  onMounted(async () => {
    await loader.load();
    var initialPos;
    if (route.path === "/updateProfile") {
      loading.value = true;
      initialPos = await loadProfile();
      loading.value = false;
      watch(
        [
          location,
          locationDescriptionModel,
          acceptsRequestsModel,
          imagesFromRepoToBeDeleted,
          imagesList,
          loadedImagesFromRepo,
        ],
        (newValue, oldValue) => {
          if (
            dataFromRepo.value.location.coordinates[0] !==
              newValue[0].latitude ||
            dataFromRepo.value.location.coordinates[1] !==
              newValue[0].longitude ||
            dataFromRepo.value.locationDescription !== newValue[1] ||
            dataFromRepo.value.acceptsRequests !== newValue[2] ||
            newValue[3].length !== 0 ||
            newValue[4].length !== 0
          ) {
            disableSubmit.value = false;
          } else {
            disableSubmit.value = true;
          }
          if (newValue[4].length + newValue[5].length === 0) {
            disableSubmit.value = true;
          }
        },
        { deep: true }
      );
    }
    map.value = new google.maps.Map(mapDiv.value, {
      center: route.path === "/updateProfile" ? initialPos : currPos.value,
      zoom: 16,
    });
    clickListener = map.value.addListener(
      "click",
      ({ latLng: { lat, lng } }) => {
        otherPos.value = { lat: lat(), lng: lng() };
        addMarker(otherPos.value);
      }
    );
    //* Custom marker icon for the map.
    imageicn.value = {
      // url: "https://i.im.ge/2021/07/21/seFIh.png",
      url: require("../../assets/pharmacy_marker_small.png"),
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(32, 36),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 37).
      anchor: new google.maps.Point(16, 40),
    };

    //* For Form Valdiation.
    var forms = document.querySelectorAll(".needs-validation");
    Array.prototype.slice.call(forms).forEach(function(form) {
      form.addEventListener("submit", function(event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();

          if (!location.value) {
            locationValidation.value.classList.add("text-danger");
          }
        } else {
          sendFile();
        }

        form.classList.add("was-validated");

        showValidation.value = true;
      });
    });
    route.path === "/updateProfile" && addMarker(initialPos);
  });

  //* On unmounted the map click listner is removed
  onUnmounted(async () => {
    if (clickListener) clickListener.remove();
  });

  const acceptUpdatedValues = (response) => {
    Object.keys(response.updatedValues).map((key) => {
      dataFromRepo.value[key] = response.updatedValues[key];
    });
    response.addedPhotos.map((el) => {
      loadedImagesFromRepo.value.push(el);

      // dataFromRepo.value.pharmacyPhotos.push(el)
    });
    response.removedPhotos.map((el) => {
      loadedImagesFromRepo.value.filter((value) => {
        return value !== el;
      });
      dataFromRepo.value.pharmacyPhotos.filter((value) => {
        return value !== el;
      });
    });
    imagesFromRepoToBeDeleted.value = [];
  };

  const sendFile = () => {
    var imgs = [];
    var bodyFormData = new FormData();
    imagesList.value.map((el) => {
      imgs.push(el["blob"]);
      bodyFormData.append("file", el["blob"], el["name"]);
    });

    route.path === "/createProfile" &&
      bodyFormData.set("name", nameModel.value);
    if (route.path === "/updateProfile") {
      if (
        dataFromRepo.value.location.coordinates[0] !==
          location.value.latitude ||
        dataFromRepo.value.location.coordinates[1] !== location.value.longitude
      ) {
        bodyFormData.set(
          "location",
          JSON.stringify([location.value.latitude, location.value.longitude])
        );
      }

      if (
        dataFromRepo.value.locationDescription !==
        locationDescriptionModel.value
      ) {
        bodyFormData.set("locationDescription", locationDescriptionModel.value);
      }

      if (dataFromRepo.value.acceptsRequests !== acceptsRequestsModel.value) {
        bodyFormData.set("acceptsRequests", acceptsRequestsModel.value);
      }
      if (imagesFromRepoToBeDeleted.value.length !== 0) {
        bodyFormData.set(
          "photosToDelete",
          JSON.stringify(imagesFromRepoToBeDeleted.value)
        );
      }
    } else {
      bodyFormData.set(
        "location",
        JSON.stringify([location.value.latitude, location.value.longitude])
      );
      bodyFormData.set("acceptsRequests", acceptsRequestsModel.value);
      bodyFormData.set("locationDescription", locationDescriptionModel.value);
    }
    const func =
      route.path === "/updateProfile" ? updateProfile : createProfile;
    imagesList.value = [];
    loading.value = true;

    func(bodyFormData)
      .then((response) => {
        loading.value = false;

        if (route.path === "/updateProfile") {
          acceptUpdatedValues(response.data);
          disableSubmit.value = true;
        }
      })
      .catch((error) => {
        loading.value = false;
        if (error.status) {
          if ((error.status = "Failed to upload all images")) {
            errorMessage.value = "Please Try Again";
            return;
          }
          if ((error.status = "Fail")) {
            errorMessage.value = "Please Contact The Developers";
            return;
          }
          errorMessage.value = error.status;
        }
      });
  };

  const loader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
  });

  //* Get current location of the user to center his/her map
  const { coords } = useGeolocation();
  const currPos = computed(() => ({
    lat: coords.value.latitude,
    lng: coords.value.longitude,
  }));

  //* Shows error toast.
  const showToast = () => {
    var toast = new Toast(toastDiv.value);
    toast.show();
  };

  //* Add marker of the pharmacy location on the map.
  const addMarker = (coords) => {
    if (markers.length !== 0) deleteMarker();
    const marker = new google.maps.Marker({
      position: coords,
      map: map.value,
      icon: imageicn.value,
      title: "Marker",
    });
    markers.push(marker);
    location.value = {
      latitude: coords.lat,
      longitude: coords.lng,
    };
  };

  const deleteMarker = () => {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  };

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
  const setNewCoordinates = () => {
    mapModal.hide();
  };

  const openMap = () => {
    tempLocation = location.value;
    mapModal = new Modal(document.getElementsByClassName("mapModal")[0], {
      keyboard: false,
    });
    mapModal.show();
  };

  const closeMap = () => {
    location.value = tempLocation;
    addMarker({ lat: location.value.latitude, lng: location.value.longitude });
    mapModal.hide();
  };

  //* Load the images selected and give it to the cropper modal.
  const loadImage = (event) => {
    const files = event.target.files;

    //   if (beforeImageAccept(files[0])) {
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
        name: files[0].name,
      };
    }
    //   }
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
    croppedImage.value = canvas.toDataURL("image/jpeg");
    var imageType = canvas.toBlob(
      (blob) => {
        if (blob.size / 1024 / 1024 > 2) {
          showToast();
        } else {
          imagesList.value.push({
            name: image.value.name,
            type: image.value.type,
            src: canvas.toDataURL("image/jpeg"),
            blob: blob,
          });
        }
      },
      "image/jpeg",
      1
    );

    modalToggle();
  };

  const handleRemove = (place) => {
    imagesList.value.splice(place, 1);
  };

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
};

export { profile };
