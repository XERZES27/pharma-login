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
          </div>
        </div>
      </div>
      <img :src="croppedImage">
    </div>
    <button type="button" class="btn btn-primary" @click="modalToggle">
      My Modal
    </button>
    <div
      ref="modal"
      class="modal fade"
      :class="{ show: active, 'd-block': active }"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog" role="document">
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
                aspectRatio: 10 / 12,
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

function getMimeType(file, fallback = null) {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = "";
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case "89504e47":
      return "image/png";
    case "47494638":
      return "image/gif";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
      return "image/jpeg";
    default:
      return fallback;
  }
}

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
    });
    const dialog = ref(false);
    const acceptReq = ref(true);
    const showModal = ref(false);
    const fileList = ref([
      {
        name: "food.jpeg",
        url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
      },
    ]);
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
      // canvas.toBlob((blob) => {
      //   saveAs(blob);
      // }, this.image.type);
      // const { canvas } = this.$refs.cropper.getResult();
      croppedImage.value = canvas.toDataURL();
      
    };

    const modalToggle = () => {
      const body = document.querySelector("body");
      active.value = !active.value;
      active
        ? body.classList.add("modal-open")
        : body.classList.remove("modal-open");
    };

    const loadImage = (event) => {
      console.log(event);
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
        //const blob = event.url;
        // 3. The steps below are designated to determine a file mime type to use it during the
        // getting of a cropped image from the canvas. You can replace it them by the following string,
        // but the type will be derived from the extension and it can lead to an incorrect result:
        //
        // this.image = {
        //    src: blob;
        //    type: files[0].type
        // }
        // Create a new FileReader to read this image binary data
        const reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = () => {
          const result = reader.result;
          // console.log(result);
          // Note: arrow function used here, so that "this.image" refers to the image of Vue component
          image.value = {
            // Read image as base64 and set it as src:
            src: result,
            // Determine the image type to preserve it during the extracting the image from canvas:
            type: files[0].type, //getMimeType(e.target.result, files.type),
          };
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(files[0]);
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

    const handleRemove = (file, fileList) => {
      console.log(file, fileList);
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
      fileList,
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
</style>