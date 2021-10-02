<template>
  <div class="whole">
    <form @submit.prevent="submitForm" novalidate id="loginForm">
      <label>Email: </label>
      <input id="loginEmailInput" type="email" required v-model="email" />
      <div v-if="emailError.length != 0" class="error">{{ emailError }}</div>
      <label>Password: </label>
      <div class="passwordeye">
        <input
          id="loginPasswordInput"
          type="password"
          ref="refshowpassword"
          required
          v-model="password"
        />
        <span class="showpassword" @click="togglePassword">show password</span>
      </div>

      <div v-if="passwordError.length != 0" class="error passwordError">
        {{ passwordError }}
      </div>
      <div class="term">
        <input
          type="checkbox"
          class="termsAndConditionsCheckBox"
          name=""
          id=""
          required
          v-model="termsAndConditions"
        />
        <label>Accept terms and condition</label>
        <div v-if="termsAndConditionsError.length != 0" class="error">
          {{ termsAndConditionsError }}
        </div>
      </div>

      <div class="submit">
        <button class="submitButton">
          <span>Login</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { onBeforeMount, onMounted } from "vue";
import { formValidation } from "../../composables/Authentication/Auth.js";
export default {
  beforeCreate() {
    document.querySelector("body").setAttribute("style", "background:#a3a1a1");
  },
  beforeUnmount() {
    document.querySelector("body").setAttribute("style", "background:#FBFEFF");
  },

  setup(props) {
    const {
      email,
      password,
      emailError,
      passwordError,
      termsAndConditions,
      termsAndConditionsError,
      submitForm,
    } = formValidation();

    return {
      email,
      password,
      emailError,
      passwordError,
      termsAndConditions,
      termsAndConditionsError,
      submitForm,
    };
  },
  data() {
    return {
      isPasswordVisible: false,
    };
  },
  methods: {
    togglePassword() {
      this.$refs.refshowpassword.type =
        this.$refs.refshowpassword.type == "text" ? "password" : "text";
    },
  },
};
</script>

<style scoped>
.passwordeye span {
  margin-top: 20px;
  font-style: italic;
  text-decoration: underline;
  cursor: pointer;
}

form {
  max-width: 420px;
  margin: 20vh auto;
  background: rgb(243, 243, 243);
  text-align: left;
  padding: 40px;
  border-radius: 10px;
  border: 1px solid rgb(247, 246, 246);
  box-shadow: 5px 10px #888888;
}

label {
  color: #aaa;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

input {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-radius: 2px;
  color: #555;
}

input:focus {
  outline: none;
  box-shadow: 2px 2px 5px #b9b8b8;

  /* border-bottom: 2px solid rgb(185, 181, 181); */
}

input[type="checkbox"] {
  display: inline-block;
  width: 16px;
  margin: 0 10px 0 0;
  position: relative;
  top: 2px;
}
.submit {
  margin-top: 20px;
  text-align: center;
}
.error {
  color: #ff0062;
  margin-top: 10px;
  font-size: 0.8em;
  font-weight: normal;
}

.submitButton {
  display: inline;
  font-size: 0.9em;
  padding: 20px 0px 20px 0px;
  margin: 20px auto;
  width: 100%;
  background: dodgerblue;
  border-radius: 6px;
  box-sizing: border-box;
  border: none;
  color: white;
}
</style>
