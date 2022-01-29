<template>
  <section id="Review">
    <div class="container-md" v-scroll="handleScrollForReviews">
      <div
        class="
          row
          align-items-center
          text-start
          mb-5
          d-flex
          justify-content-end
        "
        id="Heading"
      >
        <div
          class="
            col-md-12
            py-4
            ps-5
            display-4
            d-flex
            justify-content-between
            align-items-end
          "
        >
          <span>Reviews</span>
          <div class="d-inline me-4">
            <div class="d-inline me-2">
              <input
                type="radio"
                class="btn-check"
                name="options-outlined"
                id="primary-outlined"
                value="DRUGS"
                autocomplete="off"
                v-model="reviewType"
                checked
              />
              <label class="btn btn-outline-dark" for="primary-outlined"
                >DRUGS</label
              >
            </div>

            <div class="d-inline">
              <input
                type="radio"
                class="btn-check ps-3"
                name="options-outlined"
                id="danger-outlined"
                value="PHARMACY"
                v-model="reviewType"
                autocomplete="off"
              />
              <label class="btn btn-outline-dark" for="danger-outlined"
                >PHARMACY</label
              >
            </div>
          </div>
        </div>
      </div>
      <div class="row d-flex justify-content-center border-bottom border-3">
        <div class="col-md-11 d-flex justify-content-center pb-3">
          <div class="d-inline me-2">
            <input
              type="radio"
              class="btn-check"
              name="filterby-outlined"
              id="Recent-outlined"
              value="Recent"
              autocomplete="off"
              v-model="filterBy"
              checked
            />
            <label class="btn btn-outline-dark" for="Recent-outlined"
              >RECENT</label
            >
          </div>
          <div class="d-inline me-2">
            <input
              type="radio"
              class="btn-check"
              name="filterby-outlined"
              id="Most-Helpful-outlined"
              value="Most-Helpful"
              autocomplete="off"
              v-model="filterBy"
            />
            <label class="btn btn-outline-dark" for="Most-Helpful-outlined"
              >MOST-HELPFUL</label
            >
          </div>

          <div class="d-inline">
            <input
              type="radio"
              class="btn-check ps-3"
              name="filterby-outlined"
              id="Least-Helpful-outlined"
              value="Least-Helpful"
              v-model="filterBy"
              autocomplete="off"
            />
            <label class="btn btn-outline-dark" for="Least-Helpful-outlined"
              >LEAST-HELPFUL</label
            >
          </div>
        </div>
      </div>
      <div class="mb-3">
        <div v-for="(review, index) in reviews" :key="index" class="row d-flex justify-content-center mt-5">
        <div class="col-md-12 justify-content-start border rounded border-2">
          <div class="row w-100 mb-1">
            <div class="col d-flex justify-content-between">
              <div class="d-inline">
                <img
                  class="avatar d-inline me-3"
                  src="https://storage.googleapis.com/pharmacist-data/avatars/avatar.jpg"
                />
                <p
                
                  class="text-uppercase d-inline"
                  style="font-family: 'Times New Roman', serif"
                >
                  {{review["name"]}}
                </p>
              </div>
              <p v-if="review['editDate']===''"
                class="d-inline d-flex  align-items-center  text-secondary">
               {{review["creationDate"]}}
              </p>
              <p v-else  class="d-inline d-flex  align-items-center  text-secondary mt-2">
               {{review["creationDate"]}} <br> Edited {{review["editDate"]}}
              </p>
            </div>
          </div>
          <div class="row ps-1">
            <div class="col">
              <p
              v-if="reviewType==='DRUGS'"

                class="text-uppercase fw-bold d-inline mb-0 "
                style="font-family: 'Times New Roman', serif"
                type='button'
                @click="routeToInventory(review['drugId'])"
              >
                <span>{{review["productName"]}} </span>
                <span class="fw-light" v-if="review['drugBrandName']!==null">&nbsp; {{review['drugBrandName']}}</span>
              </p>
              <p
              v-if="reviewType==='PHARMACY'"

                class="text-uppercase fw-bold d-inline mb-0 "
                style="font-family: 'Times New Roman', serif"
                type='button'
              >
                {{review["productName"]}}
              </p>
              <div class="ms-3 d-inline">
                <i v-for="(rating, ind) in Math.round(review['rating'])" :key="ind" class="bi bi-star-fill text-warning d-inline"></i>
                <i v-for="(rating, ind) in (5-Math.round(review['rating']))" :key="ind" class="bi bi-star text-secondary d-inline"></i>

              </div>
            </div>
          </div>
          <div class="row ps-2">
            <div class="col">
              <p
                class=""
                style="font-family: 'WildWest', Helvetica, sans-serif"
              >
                {{review["description"]}}
              </p>
            </div>
          </div>
          
          <div v-if="review['pharmacyReply']!==''">
            <div class="row ps-1">
            <div class="col">
              <p
                class="text-uppercase fw-bold d-inline"
                style="font-family: 'Times New Roman', serif"
              >
                Your Reply
              </p>
            </div>
          </div>
            <div class="row ps-2">
            <div class="col">
              <p
                class=""
                style="font-family: 'WildWest', Helvetica, sans-serif"
              >
                {{review["pharmacyReply"]}}
              </p>
            </div>
          </div>
          
          </div>
          <div class="row w-100">
            <div class="col d-flex justify-content-end">
              <button
                v-if="!reviews[index].showReplyBox"
                type="button"
                @click="reviews[index].showReplyBox = true"
                class="btn btn-outline-secondary px-5 shadow-none"
                style="border: none"
                :id="[review['pharmacyReply']===''? 'Reply-Btn': 'Edit-Reply-Btn']"
              >
                <i class="bi bi-reply-all-fill"></i>
                {{review["pharmacyReply"]===''?'Reply':'Edit Reply'}}
              </button>
              <div v-else-if="reviews[index].showReplyBox">
              <button
                type="button"
                @click="reviews[index].showReplyBox = !reviews[index].showReplyBox"
                class="btn btn-outline-secondary  shadow-none"
                style="border: none"
              >
                <i class="bi bi-x-circle"></i>
                Cancel
              </button>
              <button
                type="button"
                @click="replyToReview(index)"
                class="btn btn-outline-secondary  shadow-none"
                style="border: none"
                id="Send-Btn"
              >
                <i class="bi bi-arrow-right-circle"></i>
                Send
              </button>
              </div>
              
              
            </div>
          </div>
        </div>
        <div class="row mt-2" v-if="review['showReplyBox'] && !review['processing']">
          <input
            maxlength="500"
            v-model="review['replyModel']"
            type="text "
            class="
              shadow-none
              form-control
              border-2 border-top-0 border-end-0 border-start-0 border-dark
              text-dark
            "
            placeholder="Reply"
          />
          <p
            v-if="review['replyError'] !== ''"
            class="d-flex justify-content-start pt-1 text-danger"
          >
            {{ review['replyError'] }}
          </p>
        </div>
        <div  v-if="review['processing']" class="spinner-border mt-2" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script>
import { review } from "../../composables/Review/Review";
export default {
  methods:{
     routeToInventory(id){
            this.$router.push({name:"InventoryHome",params: { 'loadType':'getDrug','drugId':id }})
        },

  },
  setup(props, context) {
    const { reviewType, filterBy,reviews,replyToReview,handleScrollForReviews } = review();
    return { reviewType, filterBy,reviews,replyToReview,handleScrollForReviews };
  },
};
</script>

<style>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 40px; /* половина ширины и высоты */
  margin: 10px;
}
</style>