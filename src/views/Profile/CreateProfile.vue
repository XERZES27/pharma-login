<template>
  <ProfilComponent></ProfilComponent>
</template>

<script>
import {readExcel} from '../../composables/Profile/CreateProfile' 


import ProfilComponent from '../../components/profile/ProfileForm.vue'
export default {
  name: 'CreateProfile',
  components: {
    ProfilComponent
  }
}
</script>

<style>

</style>