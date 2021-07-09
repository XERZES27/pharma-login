<template>
  <router-view />
</template>
<script>
import { setCookie, getCookie } from "./repository/cookieRepository";
import { useStore } from "vuex";
import { v4 as uuidv4 } from "uuid";

export default {
  mounted() {
    const store = useStore();
    var machineId = getCookie("machineId");
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
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
