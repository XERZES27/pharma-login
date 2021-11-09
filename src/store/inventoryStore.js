const inventoryStore = {
  state: {
    drugsInSession: sessionStorage.getItem("drugsInSession") || false,
    scrollDistanceInInventory: sessionStorage.getItem("scrollDistanceInInventory") || false,
    pageNumberInInventory:sessionStorage.getItem("pageNumberInInventory")||false,
    sortFieldInventory:sessionStorage.getItem("sortFieldInventory")||false,
    hasScrolledToBottomInInventory:sessionStorage.getItem("hasScrolledToBottomInInventory")||false
    
  },
  mutations: {
    persistOrClearInventoryState(
      state,
      { drugsInSession, scrollDistanceInInventory,pageNumberInInventory,sortFieldInventory,hasScrolledToBottomInInventory, clearInventorySession = false }
    ) {
      if (clearInventorySession === false) {
        sessionStorage.setItem("scrollDistanceInInventory", scrollDistanceInInventory);
        sessionStorage.setItem("drugsInSession", drugsInSession);
        sessionStorage.setItem("pageNumberInInventory",pageNumberInInventory);
        sessionStorage.setItem("sortFieldInventory",sortFieldInventory);
        sessionStorage.setItem("hasScrolledToBottomInInventory",hasScrolledToBottomInInventory);

        state.drugsInSession = drugsInSession;
        state.scrollDistanceInInventory = scrollDistanceInInventory;
        state.pageNumberInInventory = pageNumberInInventory;
        state.sortFieldInventory = sortFieldInventory;
        state.hasScrolledToBottomInInventory = hasScrolledToBottomInInventory;
      } else {
        sessionStorage.removeItem("scrollDistanceInInventory");
        sessionStorage.removeItem("drugsInSession");
        sessionStorage.removeItem("pageNumberInInventory");
        sessionStorage.removeItem("sortFieldInventory");
        sessionStorage.removeItem("hasScrolledToBottomInInventory")
        state.drugsInSession = false;
        state.scrollDistanceInInventory = false;
        state.pageNumberInInventory = false;
        state.sortFieldInventory = false;
        state.hasScrolledToBottomInInventory = false;
      }
    },
  },
  actions: {
    setInventoryState(context, { drugsInSession, scrollDistanceInInventory,pageNumberInInventory,sortFieldInventory,hasScrolledToBottomInInventory }) {
      return new Promise((resolve, reject) => {
        context.commit("persistOrClearInventoryState", {
          drugsInSession,
          scrollDistanceInInventory,
          pageNumberInInventory,
          sortFieldInventory,
          hasScrolledToBottomInInventory
        });
        resolve();
      });
    },
    clearInventoryState(context) {
      return new Promise((resolve, reject) => {
        context.commit("persistOrClearInventoryState", {
            drugsInSession: "drugsInSession",
          scrollDistanceInInventory: "scrollDistanceInInventory",
          pageNumberInInventory:"pageNumberInInventory",
          sortFieldInventory:"sortFieldInventory",
          hasScrolledToBottomInInventory:"hasScrolledToBottomInInventory",
          clearInventorySession: true,
        });
        resolve();
      });
    },
  },
  getters: {
    getInventoryState: (state) => {
      return [
        state.drugsInSession,
        state.scrollDistanceInInventory,
        state.pageNumberInInventory,
        state.sortFieldInventory,
        state.hasScrolledToBottomInInventory
      ]
    },
  },
};

export { inventoryStore };
