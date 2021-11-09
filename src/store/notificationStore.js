const notificationStore = {
    state: {
      notificationsInSession: sessionStorage.getItem("notificationsInSession") || false,
      scrollDistanceInNotification: sessionStorage.getItem("scrollDistanceInNotification") || false,
      pageNumberInNotification:sessionStorage.getItem("pageNumberInNotification")||false,
      notificationTypeInNotification:sessionStorage.getItem("notificationTypeInNotification")||false,
      sortFieldNotification:sessionStorage.getItem("sortFieldNotification")||false,
      hasScrolledToBottomInNotification:sessionStorage.getItem("hasScrolledToBottomInNotification")||false
      
    },
    mutations: {
      persistOrClearNotificationState(
        state,
        { notificationsInSession, scrollDistanceInNotification,pageNumberInNotification,notificationTypeInNotification,sortFieldNotification,hasScrolledToBottomInNotification, clearNotificationSession = false }
      ) {
        if (clearNotificationSession === false) {
          sessionStorage.setItem("scrollDistanceInNotification", scrollDistanceInNotification);
          sessionStorage.setItem("notificationsInSession", notificationsInSession);
          sessionStorage.setItem("pageNumberInNotification",pageNumberInNotification);
          sessionStorage.setItem("notificationTypeInNotification",notificationTypeInNotification)
          sessionStorage.setItem("sortFieldNotification",sortFieldNotification);
          sessionStorage.setItem("hasScrolledToBottomInNotification",hasScrolledToBottomInNotification);
  
          state.notificationsInSession = notificationsInSession;
          state.scrollDistanceInNotification = scrollDistanceInNotification;
          state.pageNumberInNotification = pageNumberInNotification;
          state.notificationTypeInNotification = notificationTypeInNotification
          state.sortFieldNotification = sortFieldNotification;
          state.hasScrolledToBottomInNotification = hasScrolledToBottomInNotification;
        } else {
          sessionStorage.removeItem("scrollDistanceInNotification");
          sessionStorage.removeItem("notificationsInSession");
          sessionStorage.removeItem("pageNumberInNotification");
          sessionStorage.removeItem("notificationTypeInNotification");
          sessionStorage.removeItem("sortFieldNotification");
          sessionStorage.removeItem("hasScrolledToBottomInNotification")
          state.notificationsInSession = false;
          state.scrollDistanceInNotification = false;
          state.pageNumberInNotification = false;
          state.notificationTypeInNotification = false
          state.sortFieldNotification = false;
          state.hasScrolledToBottomInNotification = false;
        }
      },
    },
    actions: {
      setNotificationState(context, { notificationsInSession, scrollDistanceInNotification,pageNumberInNotification,notificationTypeInNotification,sortFieldNotification,hasScrolledToBottomInNotification }) {
        return new Promise((resolve, reject) => {
          context.commit("persistOrClearNotificationState", {
            notificationsInSession,
            scrollDistanceInNotification,
            pageNumberInNotification,
            sortFieldNotification,
            hasScrolledToBottomInNotification
          });
          resolve();
        });
      },
      clearNotificationState(context) {
        return new Promise((resolve, reject) => {
          context.commit("persistOrClearNotificationState", {
              notificationsInSession: "notificationsInSession",
            scrollDistanceInNotification: "scrollDistanceInNotification",
            pageNumberInNotification:"pageNumberInNotification",
            notificationTypeInNotification:"notificationTypeInNotification",
            sortFieldNotification:"sortFieldNotification",
            hasScrolledToBottomInNotification:"hasScrolledToBottomInNotification",
            clearNotificationSession: true,
          });
          resolve();
        });
      },
    },
    getters: {
      getNotificationState: (state) => {
        return [
          state.notificationsInSession,
          state.scrollDistanceInNotification,
          state.pageNumberInNotification,
          state.notificationTypeInNotification,
          state.sortFieldNotification,
          state.hasScrolledToBottomInNotification
        ]
      },
    },
  };
  
  export { notificationStore };
  