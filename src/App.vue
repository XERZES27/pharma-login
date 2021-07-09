<template>
  <router-view />
</template>
<script>
import { setCookie, getCookie } from "./repository/cookieRepository";
import { useStore } from "vuex";
import { onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";

export default {
  onMounted() {
    const store = useStore();
    console.log("here you are");
    var machineId = getCookie("machineId");
    console.log(machineId);
    // machineId = localStorage.getItem("machineId");
    if (!machineId) {
      machineId = uuidv4();
    }
    try {
      var maxAge = 3 * 30 * 24 * 60 * 60;
      setCookie("machineId", machineId, {
        samesite: "strict",
        "Max-Age": `${maxAge}`,
      });
      // localStorage.setItem("machineId", machineId);
      store.dispatch("setMachineId", machineId);
    } catch (error) {
      console.log(error);
      alert("Please enable local storage");
    }
  },
  setup() {},
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
