import readXlsxFile from "read-excel-file";
import { DrugModels } from "../../models/drug";
import { ref, watch, onMounted } from "vue";
import { bulkUpload } from "../../repository/inventoryRepository";

const createInventory = () => {
  const drugModelsAndErrors = ref("");
  const rowsWithValidationErrors = ref([])
  const rowsWithRepetitionErrors = ref([])
  const rowsWithValidDrugModels = ref([])
  const unknownErrors = ref(false);
  const unknownErrorsBody = ref('');
  const stateOfResponse = ref('');
  const finalPhase = ref(false);
  const isActive = ref(false);
  const activeClass = ref("active");
  const headerText = ref("Drag & Drop to Upload File");
  const initialPhase = ref(true);
  const isProcessingOnClient = ref(false);
  const isProcessingOnServer = ref(false);
  const userValidationPhase = ref(false);

  const onFilePicked = async (file) => {
    try {
      await readXlsxFile(file).then(async (rows) => {
        initialPhase.value = false;
        isProcessingOnClient.value = true
        drugModelsAndErrors.value = DrugModels(rows);
        rowsWithValidationErrors.value = drugModelsAndErrors.value["rowsWithValidationErrors"]
        rowsWithRepetitionErrors.value = drugModelsAndErrors.value["rowsWithRepetitionErrors"]
        
        isProcessingOnClient.value = false
        userValidationPhase.value = true
    
      });
    } catch (error) {
      unknownErrors.value = true;
      unknownErrorsBody.value = error.message;
      console.log(error);
    }
  };

  const uploadToServer =  () => {
    userValidationPhase.value = false;
    isProcessingOnServer.value = true;
    rowsWithRepetitionErrors.value = []
    rowsWithValidationErrors.value = []
    bulkUpload(drugModelsAndErrors.value["drugModels"]).then((response)=>{
      console.log(response.data)
      var validationErrors = response.data["validationErrors"]
      var repetitionErrors = response.data["repetitionErrors"]
      // console.log("validationErrors",validationErrors,"repetitionErrors",repetitionErrors,"ValidDrugModels",response.data["drugModels"])
      
      if(response.status==="Invalid Data"){
        stateOfResponse.value = "Complete Fail"
        rowsWithValidationErrors.value = validationErrors
        rowsWithRepetitionErrors.value = repetitionErrors

      }
      if(response.status==="Pass"){
        if(validationErrors.length ==0 && repetitionErrors.length == 0){
          //TODO redirect to inventory page
          stateOfResponse.value = "Complete Pass";
          rowsWithValidDrugModels.value = response.data["drugModels"];

        }
        else{
          stateOfResponse.value = "Partial Fail"
          rowsWithValidDrugModels.value = response.data["drugModels"];
          rowsWithValidationErrors.value = validationErrors
          rowsWithRepetitionErrors.value = repetitionErrors

        }
        

      }
      isProcessingOnServer.value = false;
      finalPhase.value = true


    }).catch((error)=>{
      unknownErrors.value = true;
      unknownErrorsBody.value = error;
      console.log(error);
      

    })

  };

  return {
    onFilePicked,
    drugModelsAndErrors,
    rowsWithValidationErrors,
    rowsWithRepetitionErrors,
    rowsWithValidDrugModels,
    unknownErrors,
    unknownErrorsBody,
    isActive,
    activeClass,
    stateOfResponse,
    finalPhase,
    headerText,
    initialPhase,
    isProcessingOnClient,
    userValidationPhase,
    isProcessingOnServer,
    uploadToServer,
  };
};

export { createInventory };
