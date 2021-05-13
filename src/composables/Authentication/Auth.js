const axios = require('axios');
import {v4 as uuidv4} from 'uuid';
import {login} from '../../repository/authRepository'
import {useStore} from 'vuex';
import { ref, watch,onMounted } from "vue";
import {setCookie,getCookie} from '../../repository/cookieRepository'

function validateEmail(email) {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

function validatePassword(str) {
  var passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
  return passwordRegex.test(str);
}

function getEmailError(email) {
  let emailError = false;
  if (email.value.length != 0) {
    if (!validateEmail(email.value)) {
      emailError = "Invalid Email Format";
    }
  } else {
    emailError = "Field is Required";
  }
  return emailError;
}

function getPasswordError(password) {
  let passwordError = false;
  if (password.value.length != 0) {
    if (!validatePassword(password.value)) {
      passwordError =
        "Password must contain 8 characters with at least a symbol, upper and lower case letters and a number";
    } else {
      passwordError = "";
    }
  } else {
    passwordError = "Field is Required";
  }
  return passwordError;
}

const formValidation = () => {
    const store = useStore();
  const email = ref("");
  const password = ref("");
  const termsAndConditions = ref(false);
  const emailError = ref("");
  const passwordError = ref("");
  const termsAndConditionsError = ref("");
  var machineId;

  onMounted(() => {
    
    
    machineId = getCookie("machineId")
    console.log(machineId)
    // machineId = localStorage.getItem("machineId");
    if(!machineId){
      machineId = uuidv4();   
    }
    try {
      setCookie("machineId", machineId,{"samesite":"strict"})
      // localStorage.setItem("machineId", machineId);
      store.dispatch("setMachineId",machineId);
    } catch (error) {
      console.log(error)
      alert("Please enable local storage")
    }
    
    
  })

  watch(email, () => {
    emailError.value = "";
  });
  watch(password, () => {
    passwordError.value = "";
  });
  watch(termsAndConditions, () => {
    termsAndConditionsError.value = "";
  });
  const submitForm = () => {
    const emailHasError = getEmailError(email);
    const passwordHasError = getPasswordError(password);
    if (!emailHasError && !passwordHasError && termsAndConditions.value) {
      login(email.value,password.value,machineId)
      .then((idtoken)=> {
        if(idtoken['id']&&idtoken['token']){
          store.dispatch("setIdToken",idtoken['id'],idtoken['token'])
          // TODO forward to new page
          // TODO create setup profile page
          // TODO integrate google maps
          
        }
      })
      .catch( (errorData) =>{
         if(errorData['emailError']){
          emailError.value = errorData['emailError'];
        }
        else if(errorData['passwordError']){
          passwordError.value = errorData['passwordError'];
        }
        else{
          emailError.value =  "Unknown Error, Please Try Again";
        }
      }); 
      return
    } else {
      emailError.value = !emailHasError ? "" : emailHasError;
      passwordError.value = !passwordHasError ? "" : passwordHasError;
      termsAndConditionsError.value = termsAndConditions.value
        ? ""
        : "Field is Required";
    }
  };



  return {
    email,
    password,
    emailError,
    passwordError,
    termsAndConditions,
    termsAndConditionsError,
    submitForm,
  };
};

export { formValidation };
