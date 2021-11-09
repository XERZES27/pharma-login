<template>
  <div id="floating-search" class="mb-5 mt-5">
    <div class="row d-flex align-items-center justify-content-end">
      <div class="col-md-11">
        <div
          class="input-group input-group-lg"
          id="search-bar"
          style="box-shadow: 10px 5px 12px #e2e2e2"
        >
          <input
            type="text"
            class="
              form-control
              border border-dark border-top-0 border-bottom-0
              searchInputBox
            "
            placeholder="Search Drugs"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            v-model="searchQuery"
            @keyup="this.$emit('update:searchQuery', $event.target.value)"
          />
          <button
            :disabled="searchQuery.trim() === ''"
            class="input-group-text border border-dark text-white bg-dark px-6"
            @click="this.$emit('queryDrugByNameOrBrandNameEvent', searchQuery)"
            id="basic-addon2"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-if="drugRecomendations.length != 0" class="drugRecommendations">
      <div v-for="(recommendation, index) in drugRecomendations" :key="index">
        <div class="row d-flex justify-content-end pt-1">
          <div class="col-md-11">
            <div
              :class="recommendation['name'] + recommendation['brandName']"
              class="card border border-top-0 border-end-0"
              type="button"
              @click="this.$emit(`queryDrugByIdEvent`, recommendation['_id'])"
            >
              <div class="row">
                <div class="col">
                  <div class="card-body text-start">
                    <h5 class="card-title">{{ recommendation["name"] }}</h5>
                    <h6 class="card-subtitle text-muted">
                      {{ recommendation["brandName"] }}
                    </h6>
                  </div>
                </div>
                <div class="col d-flex justify-content-end align-items-center">
                  <i class="bi bi-search pe-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="resultCameEmpty !== ''" class="">
      <div class="row d-flex justify-content-center pt-3">
        <div class="col-md-10">
          <p class="text-md-center fs-3">{{ resultCameEmpty }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "inventorySearchBar",
  props: {
    resultCameEmpty: String,
    drugRecomendations: Array,
    searchQuery: String,
  },
  emits: [
    "update:searchQuery",
    "queryDrugByNameOrBrandNameEvent",
    "queryDrugByIdEvent",
  ],
  // data(){
  //   return {searchQuery:''}
  // },
  watch: {},
  methods: {},
};
</script>

<style>
</style>