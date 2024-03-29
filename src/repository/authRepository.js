const axios = require("axios");
import { errorMiddleWare } from "./errorMiddlewareRepository";

const login = async (email, password, MachineId) => {
  var id;
  var token;
  var emailError;
  var passwordError;
  var hasProfile;

  const promise = new Promise((resolve, reject) => {
    axios
      .post(
        process.env.VUE_APP_HOSTADDRESS + "user/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Machine-Id": MachineId,
          },
        }
      )
      .then(function(response) {
        id = response.data.id;
        token = response.data["X-Access-Token"];
        hasProfile = response.data.hasProfile;
        const responseData = {
          id: id,
          token: token,
          hasProfile: hasProfile,
        };
        resolve(responseData);
      })
      .catch((error) => {
        if (errorMiddleWare(error)) {
          resolve();
          return;
        }
        if (error.response.data.status == "Invalid Password") {
          passwordError = error.response.data.status;
        } else if (error.response.data.status) {
          emailError = error.response.data.status;
        } else {
          emailError = error.message;
        }
        const errorData = {
          emailError: emailError,
          passwordError: passwordError,
        };
        reject(errorData);
      });
  });
  return promise;
};

export { login };
