import readXlsxFile from "read-excel-file";
import { DrugModels } from "../../models/drug";
// import convertToJson from "read-excel-file/schema"

const createInventory = () => {
  const onFilePicked = (event) => {
    console.log(event.target.files);
    // readXlsxFile(event.target.files[0],{ schema }).then(({ rows, errors })=> {
    //     console.log(rows,errors)

    //   })
    readXlsxFile(event.target.files[0]).then((rows) => {
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        if (index != 0 && element[0]) {
          console.log(element);
        }
      }
    });
  };

  return { onFilePicked };
};

export { createInventory };
