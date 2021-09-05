import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { createProfile } from "../../repository/profileRepository";
import { Loader } from "@googlemaps/js-api-loader";
import { Toast } from "bootstrap";
import { useGeolocation } from "@/composables/Profile/useGeolocation.js";
import store from '../../store/index';
import router from '../../router/index'

const profile = () => {
  const GOOGLE_MAPS_API_KEY = process.env.VUE_APP_MAPKEY;
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
  const imagesList = ref([]);
  const model = ref({
    username: "",
  });
  const loading = ref(false);
  const errorMessage = ref('');
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
  let locationValidation = ref('');
  const otherPos = ref(null);
  const imageicn = ref(null);
  const showValidation = ref(false);

  //* On mounted map is initialized with and a click listener is attached.
  onMounted(async () => {
    await loader.load();
    map.value = new google.maps.Map(mapDiv.value, {
      center: currPos.value,
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
      url: "https://i.im.ge/2021/07/21/seFIh.png",
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(33, 37),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 37).
      anchor: new google.maps.Point(16, 40),
    };

    //* For Form Valdiation.
    var forms = document.querySelectorAll(".needs-validation");
    Array.prototype.slice.call(forms).forEach(function(form) {
      form.addEventListener(
        "submit",
        function(event) {
            
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            
            if(!location.value){
                locationValidation.value.classList.add("text-danger");
            }
            console.log('prevent propagation')
          }else{
              
                sendFile()
                  
                  
          }

          form.classList.add("was-validated");
          
          showValidation.value = true;
        },
      );
    });
  });

  

  //* On unmounted the map click listner is removed
  onUnmounted(async () => {
    if (clickListener) clickListener.remove();
  });

  const sendFile = ()=>{
    console.log("reh")
    loading.value = true;
    var imgs = []
    var bodyFormData = new FormData();
    imagesList.value.map((el)=>{
                   imgs.push(el['blob'])
                   bodyFormData.append('file',el['blob'],el['name'])
      })
    
    bodyFormData.set('name',nameModel.value);
    bodyFormData.set('location',JSON.stringify([location.value.latitude,location.value.longitude]))
    bodyFormData.set('acceptsRequests',acceptsRequestsModel.value)
    bodyFormData.set('locationDescription',locationDescriptionModel.value)
    
    
    createProfile(bodyFormData)
    .then((response)=>{
        loading.value = false;
        
    })
    .catch((error)=>{
        loading.value = false;
        if(error.status){
          if(error.status = "Failed to upload all images"){
            errorMessage.value = "Please Try Again";
            return;
          }
          if(error.status = "Fail"){
            errorMessage.value = "Please Contact The Developers";
            return;
          }
          errorMessage.value = error.status;

        }
    })
    
     
  }


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
    console.log("isSized");
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
      title: "aman",
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

  

  const submit = async () => {
    // let valid = await profileForm.value.validate();
    // if (!valid) {
    //   return;
    // }
    // console.log(profileForm.value);
    // loading.value = true;
    // await simulateSubmit();
    // loading.value = false;
    // if (
    //   model.username === validCredentials.username &&
    //   model.password === validCredentials.password
    // ) {
    //   $message.success("Submit successfull");
    // } else {
    //   $message.error("Username or password is invalid");
    // }
  };

  return {
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
    model,
    loading,
    errorMessage,
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
    showToast,
    showValidation,
  };
};

export { profile };
