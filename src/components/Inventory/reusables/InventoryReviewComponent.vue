<template>
  <div
    class="modal fade reviewsModal"
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header bg-dark">
          <h5 class="text-white modal-title">DRUG REVIEWS</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="closeDrugReviewsModal()"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p
            class="
              fw-bold
              d-flex
              justify-content-center
              fs-5
              text-decoration-underline
            "
            id="staticBackdropLabel"
          >
            {{ drugName
            }}{{ drugBrandName === undefined ? "" : ` - ${drugBrandName}` }}
          </p>
          <div
            v-for="(review, index) in reviews"
            :key="index"
            class="row d-flex justify-content-center mt-2 "
          >
            <div
              class="col-md-11 justify-content-start border rounded border-2 mb-2"
            >
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
                      {{ review["name"] }}
                    </p>
                  </div>
                  <p
                    v-if="review['editDate'] === ''"
                    class="d-inline d-flex align-items-center text-secondary"
                  >
                    {{ review["creationDate"] }}
                  </p>
                  <p
                    v-else
                    class="
                      d-inline d-flex
                      align-items-center
                      text-secondary
                      mt-2
                    "
                  >
                    {{ review["creationDate"] }} <br />
                    Edited {{ review["editDate"] }}
                  </p>
                </div>
              </div>
              <div class="row ps-1">
                <div class="col">
                  <p
                    class="text-uppercase fw-bold d-inline mb-0"
                    style="font-family: 'Times New Roman', serif"
                  >
                    <span>{{ review["drugName"] }} </span>
                    <span
                      class="fw-light"
                      v-if="review['drugBrandName'] !== null"
                      >&nbsp; {{ review["drugBrandName"] }}</span
                    >
                  </p>

                  <div class="ms-3 d-inline">
                    <i
                      v-for="(rating, ind) in Math.round(review['rating'])"
                      :key="ind"
                      class="bi bi-star-fill text-warning d-inline"
                    ></i>
                    <i
                      v-for="(rating, ind) in 5 - Math.round(review['rating'])"
                      :key="ind"
                      class="bi bi-star text-secondary d-inline"
                    ></i>
                  </div>
                </div>
              </div>
              <div class="row ps-2">
                <div class="col">
                  <p
                    class=""
                    style="font-family: 'WildWest', Helvetica, sans-serif"
                  >
                    {{ review["description"] }}
                  </p>
                </div>
              </div>

              <div v-if="review['pharmacyReply'] !== ''">
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
                      {{ review["pharmacyReply"] }}
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
                  >
                    <i class="bi bi-reply-all-fill"></i>
                    {{
                      review["pharmacyReply"] === "" ? "Reply" : "Edit Reply"
                    }}
                  </button>
                  <div v-else-if="reviews[index].showReplyBox">
                    <button
                      type="button"
                      @click="
                        reviews[index].showReplyBox =
                          !reviews[index].showReplyBox
                      "
                      class="btn btn-outline-secondary shadow-none"
                      style="border: none"
                    >
                      <i class="bi bi-x-circle"></i>
                      Cancel
                    </button>
                    <button
                      type="button"
                      @click="replyToReview(index)"
                      class="btn btn-outline-secondary shadow-none"
                      style="border: none"
                    >
                      <i class="bi bi-arrow-right-circle"></i>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="row mt-2"
              v-if="review['showReplyBox'] && !review['processing']"
            >
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
                {{ review["replyError"] }}
              </p>
            </div>
            <div
              v-if="review['processing']"
              class="row d-flex justify-content-center mt-2"
            >
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
          <div class="row d-flex justify-content-center mt-3">
            <div v-if="fetchingReviews" class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <button
            @click="this.$emit('getReviewsForDrugEvent',index)"
              v-else
              type="button"
              :disabled="disableNextPage"
              class="col-3 rounded-pill btn btn-outline-secondary shadow-none"
            >
              <i class="bi bi-chevron-double-down d-inline me-2"></i>
              <p class="d-inline">Show More</p>
            </button>
            <div v-if="fetchingReviewsError!==''">
              <strong>{{fetchingReviewsError}}</strong>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-dark"
            @click="closeDrugReviewsModal()"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { replyToDrugReview } from "../../../repository/reviewRepository";
export default {
  name: "InventoryReviewComponent",
  props: {
    reviews: Array,
    index: Number,
    drugName: String,
    drugBrandName: String,
    disableNextPage: Boolean,
    fetchingReviews: Boolean,
    fetchingReviewsError: String,
  },
  data: () => {
    return { drugReviewsModal: null, loadingReviews: false };
  },
  emits: ["getReviewsForDrugEvent", "clearDataEvent"],
  methods: {
    showDrugReviewModal() {
      this.drugReviewsModal = new Modal(
        document.getElementsByClassName("reviewsModal")[0],
        { keyboard: false }
      );
      this.drugReviewsModal.show();
    },
    closeDrugReviewsModal() {
      this.$emit("clearDataEvent");
      this.drugReviewsModal.hide();
    },
    replyToReview(index) {
      const reviewId = this.reviews[index]["_id"];
      const reply = this.reviews[index]["replyModel"];
      if (!reply.length >= 0 || !reply.length <= 500)
        this.reviews[index]["replyError"] =
          "Reply Must Be Less Than 500 Characters";
      var deleteReply = reply.trim().length === 0;

      if (reply !== this.reviews[index].pharmacyReply) {
        this.reviews[index]["replyError"] = "";
        this.reviews[index]["processing"] = true;
        replyToDrugReview(reviewId, reply, deleteReply)
          .then((response) => {
            this.reviews[index]["pharmacyReply"] = reply;
            this.reviews[index]["processing"] = false;
            this.reviews[index]["showReplyBox"] = false;
          })
          .catch((error) => {
            this.reviews[index]["processing"] = false;
            if (error.status) {
              if (error.status === "Invalid Data")
                this.reviews[index]["replyError"] = "Invalid Format";
              if (error.status === "Incorrect Reply")
                this.reviews[index]["replyError"] = "Incorrect Reply";
              if (error.status === "Unable To Find Review")
                this.reviews[index]["replyError"] =
                  "The Reply May Have Been Deleted";
              if (
                error.status === "IDs Don't Match" ||
                error.status === "Fail D" ||
                error.status === "Fail"
              )
                this.reviews[index]["replyError"] = "Please Report This Error";
            }
          });
      } else {
        this.reviews[index]["replyError"] = "Reply Has Not Changed";
        setTimeout(() => {
          this.reviews[index]["replyError"] = "";
        }, 5000);
      }
    },
  },
};
</script>

<style>
</style>