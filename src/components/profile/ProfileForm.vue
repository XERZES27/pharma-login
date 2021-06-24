<template>
  <div class="profile">
    <el-card class="box-card">
      <h2>Profile</h2>
      <el-form
        class="profile-form"
        :model="model"
        :rules="rules"
        ref="form"
        @submit.prevent.native="submit"
      >
        <el-form-item prop="username">
          <el-input v-model="model.username" placeholder="Name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :before-upload="loadImage"
            list-type="picture"
            accept="image/png, image/jpeg"
            :auto-upload="dialog"
            @change="loadImage($event)"
          >
            <el-button size="small" type="primary">Click to upload</el-button>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <div class="accSwitch">
            <el-tooltip
              :content="'Accept Orders: ' + acceptReq"
              placement="top"
            >
              <el-switch v-model="acceptReq" active-text="Accept Orders">
              </el-switch>
            </el-tooltip>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            class="profile-button"
            type="primary"
            native-type="submit"
            block
            >Submit</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      title="Crop Image"
      v-model="showModal"
      :show-close="dialog"
      :close-on-press-escape="dialog"
      :close-on-click-modal="dialog"
    >
      <cropper
        ref="cropper"
        check-orientation
        :src="image.src"
        :stencil-props="{
          aspectRatio: 10 / 12,
        }"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reset">Cancel</el-button>
          <el-button type="primary" @click="crop">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

// This function is used to detect the actual image type,
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
  name: "profile",
  props: {
    value: {},
    pk: { default: "image_key" },
    dialogMaxWidth: { default: "600px" },
    dialogMaxHeight: { default: "0.8vh" },
    maxWidth: { default: 1920 },
    maxHeight: { default: 1200 },
    // the URL of the blob image
    objectUrl: { default: "" },
  },
  data() {
    return {
      image: {
        src: null,
        type: null,
      },
      cropImg: null,
      dialog: false,
      acceptReq: true,
      showModal: false,
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
      validCredentials: {
        username: "lightscope",
        password: "lightscope",
      },
      model: {
        username: "",
      },
      loading: false,
      rules: {
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
      },
    };
  },
  components: {
    Cropper,
  },
  methods: {
    crop() {
      const { canvas } = this.$refs.cropper.getResult();
      // canvas.toBlob((blob) => {
      //   saveAs(blob);
      // }, this.image.type);
      // const { canvas } = this.$refs.cropper.getResult();
      const newTab = window.open();
      newTab.document.body.innerHTML = `<img src="${canvas.toDataURL()}"></img>`;
    },
    loadImage(event) {
      console.log(event);
      this.showModal = true;
      // Reference to the DOM input element
      const files = event.raw;
      console.log(event.url);
      // Ensure that you have a file before attempting to read it
      if (files) {
        // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
        if (this.image.src) {
          URL.revokeObjectURL(this.image.src);
        }
        // 2. Create the blob link to the file to optimize performance:
        const blob = event.url;
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
        reader.onload = (e) => {
          console.log(files);
          // Note: arrow function used here, so that "this.image" refers to the image of Vue component
          this.image = {
            // Read image as base64 and set it as src:
            src: blob,
            // Determine the image type to preserve it during the extracting the image from canvas:
            type: getMimeType(e.target.result, files.type),
          };
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(files);
      }
    },
    reset() {
      this.showModal = false;
      this.image = {
        src: null,
        type: null,
      };
    },

    beforeImageAccept(file) {
      const isSized = file.size / 1024 / 1024 < 2;
      if (!isSized) {
        this.$message.error("Image size can not exceed 2MB!");
      }

      return isSized;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    simulateSubmit() {
      return new Promise((resolve) => {
        setTimeout(resolve, 800);
      });
    },
    async submit() {
      let valid = await this.$refs.form.validate();
      if (!valid) {
        return;
      }
      this.loading = true;
      await this.simulateSubmit();
      this.loading = false;
      if (
        this.model.username === this.validCredentials.username &&
        this.model.password === this.validCredentials.password
      ) {
        this.$message.success("Submit successfull");
      } else {
        this.$message.error("Username or password is invalid");
      }
    },
  },
  unmounted() {
    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    if (this.image.src) {
      URL.revokeObjectURL(this.image.src);
    }
  },
};
</script>

<style scoped>

.box-card {
  width: 600px;
}

.accSwitch{
  display: flex;
}

.profile {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-button {
  width: 100%;
  margin-top: 40px;
}
.profile-form {
  width: 290px;
}
</style>

<style lang="scss">
$teal: rgb(0, 124, 137);
.el-button--primary {
  background: $teal;
  border-color: $teal;

  &:hover,
  &.active,
  &:focus {
    background: lighten($teal, 7);
    border-color: lighten($teal, 7);
  }
}
.profile .el-input__inner:hover {
  border-color: $teal;
}
.profile .el-input__prefix {
  background: rgb(238, 237, 234);
  left: 0;
  height: calc(100% - 2px);
  left: 1px;
  top: 1px;
  border-radius: 3px;
  .el-input__icon {
    width: 30px;
  }
}
.profile .el-card {
  padding-top: 0;
  padding-bottom: 30px;
}
h2 {
  font-family: "Open Sans";
  letter-spacing: 1px;
  font-family: Roboto, sans-serif;
  padding-bottom: 20px;
}
a {
  color: $teal;
  text-decoration: none;
  &:hover,
  &:active,
  &:focus {
    color: lighten($teal, 7);
  }
}
.profile .el-card {
  width: 340px;
  display: flex;
  justify-content: center;
}
</style>