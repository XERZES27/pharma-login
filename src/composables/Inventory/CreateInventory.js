import readXlsxFile from "read-excel-file";
import { DrugModels } from "../../models/drug";
// import convertToJson from "read-excel-file/schema"

const createInventory = () => {
  const onFilePicked = (event) => {
    readXlsxFile(event.target.files[0]).then((rows) => {
        console.log(DrugModels(rows))
      
    });
  };

  return { onFilePicked };
};

export { createInventory };
