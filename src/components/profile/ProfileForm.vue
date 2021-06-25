<template>
  <div>
    <input type="file" id="file-selector" single accept=".xlsx" @change="onFilePicked">
  </div>
</template>

<script>
import {createInventory} from '../../composables/Inventory/CreateInventory'
export default {

  setup(props){
    const {onFilePicked} = createInventory();
    return {onFilePicked}

  },
  
  methods:{
  }

 
  
};
</script>

<style>
</style>
