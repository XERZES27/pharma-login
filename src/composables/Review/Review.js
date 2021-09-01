import { ref, watch, onMounted } from "vue";
import {
  replyToDrugReview,
  replyToPhammacyReview,
  getDrugReviews,
  getPharmacyReviews,
} from "../../repository/reviewRepository";

const review = () => {
  const reviewType = ref("DRUGS");
  const filterBy = ref("Recent");
  const reviews = ref([]);
  var pageNumber = 0;
  var hasScrolledToBottom = false;
  const getReviews = (Options="reset") => {
    var getReviewsType =
      reviewType.value === "DRUGS" ? getDrugReviews : getPharmacyReviews;
    getReviewsType(filterBy.value, pageNumber)
      .then((response) => {
        if (Array.isArray(response.data)) {
          if (response.data.length === 0) {
            hasScrolledToBottom = true;
          } else {
            if (hasScrolledToBottom === true) hasScrolledToBottom = false;
            pageNumber += 1;

            if (reviews.value.length === 0 || Options==="reset") {
              reviews.value = response.data;
              preloadReview();
            } else {
              postLoadReview(response.data);
            }
          }
        } else {
          console.log("Please Report This Error ");
        }
      })
      .catch((error) => {
        if (hasScrolledToBottom === true) {
          setTimeout(() => {
            hasScrolledToBottom = false;
          }, 5000);
        }
        console.log(error);
      });
  };
  watch(reviewType, (newValue, oldValue) => {
    pageNumber=0;
    getReviews();
  });
  watch(filterBy, (newValue, oldValue) => {
    pageNumber=0;
    getReviews();
  });

  onMounted(() => {
    getDrugReviews(filterBy.value, pageNumber)
      .then((response) => {
        reviews.value = response.data;
        preloadReview();
        pageNumber += 1;
      })
      .catch((error) => console.log(error));
  });

  const preloadReview = () => {
    reviews.value.map((el) => {
      el["showReplyBox"] = false;
      el["replyError"] = "";
      el["replyModel"] = el.pharmacyReply === undefined ? "" : el.pharmacyReply;
      el["creationDate"] = new Date(el["creationDate"]).toLocaleString();
      el["productName"] =
        reviewType.value === "DRUGS" ? el.drugName : el.pharmacyName;
      el["editDate"] =
        el.editDate === undefined
          ? ""
          : new Date(el["editDate"]).toLocaleString();
      el.pharmacyReply = el.pharmacyReply === undefined ? "" : el.pharmacyReply;
      el["processing"] = false;
    });
  };

  const postLoadReview = (Reviews) => {
    Reviews.map((el) => {
      el["showReplyBox"] = false;
      el["replyError"] = "";
      el["replyModel"] = el.pharmacyReply === undefined ? "" : el.pharmacyReply;
      el["creationDate"] = new Date(el["creationDate"]).toLocaleString();
      el["productName"] =
        reviewType.value === "DRUGS" ? el.drugName : el.pharmacyName;
      el["editDate"] =
        el.editDate === undefined
          ? ""
          : new Date(el["editDate"]).toLocaleString();
      el.pharmacyReply = el.pharmacyReply === undefined ? "" : el.pharmacyReply;
      el["processing"] = false;
    });
    Reviews.map((el) => {
      reviews.value.push(el);
    });
  };
  const replyToReview = async (index) => {
    const reviewId = reviews.value[index]["_id"];
    const reply = reviews.value[index]["replyModel"];
    if (!reply.length >= 0 || !reply.length <= 500)
      reviews.value[index]["replyError"] =
        "Reply Must Be Less Than 500 Characters";
    var deleteReply = reply.trim().length === 0;

    var replyFunc =
      reviewType.value === "DRUGS" ? replyToDrugReview : replyToPhammacyReview;
    if (reply !== reviews.value[index].pharmacyReply) {
      reviews.value[index]["replyError"] = "";
      reviews.value[index]["processing"] = true;
      replyFunc(reviewId, reply, deleteReply)
        .then((response) => {
          reviews.value[index]["pharmacyReply"] = reply;
          reviews.value[index]["processing"] = false;
          reviews.value[index]["showReplyBox"] = false;
        })
        .catch((error) => {
          reviews.value[index]["processing"] = false;
          if (error.status) {
            if (error.status === "Invalid Data")
              reviews.value[index]["replyError"] = "Invalid Format";
            if (error.status === "Incorrect Reply")
              reviews.value[index]["replyError"] = "Incorrect Reply";
            if (error.status === "Unable To Find Review")
              reviews.value[index]["replyError"] =
                "The Reply May Have Been Deleted";
            if (
              error.status === "IDs Don't Match" ||
              error.status === "Fail D" ||
              error.status === "Fail"
            )
              reviews.value[index]["replyError"] = "Please Report This Error";
          }
        });
    } else {
      reviews.value[index]["replyError"] = "Reply Has Not Changed";
      setTimeout(() => {
        reviews.value[index]["replyError"] = "";
      }, 5000);
    }
  };

  const handleScroll = (el) => {
    if (hasScrolledToBottom === false) {
      if (
        el.target.scrollingElement.scrollTop + el.path[1].innerHeight + 30 >
        el.target.scrollingElement.scrollHeight
      ) {
        hasScrolledToBottom = true;
        getReviews("load");
      }
    }
  };

  return { reviewType, filterBy, reviews, replyToReview, handleScroll };
};

export { review };
