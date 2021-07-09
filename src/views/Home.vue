<template>
  <div>
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script>
import header from "./header.vue";
export default {
  name: "Home",
  components: {
    Header: header,
  },
};
</script>
<style>
</style>