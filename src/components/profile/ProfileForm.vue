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
                  <span class="remove-image" style="display: inline; cursor: pointer;">&#215;</span>
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
          </div>
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
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="crop">Crop</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="active" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { ref } from "vue";
import { Modal } from "bootstrap";

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

    const handleRemove = (file, imagesList) => {
      console.log(file, imagesList);
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