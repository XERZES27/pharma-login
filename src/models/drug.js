const validateDrugName = (name) => {
  if (name) return true;
  else return false;
};

const validatePrice = (price) => {
  if (!price) return false;
  var truePrice = Number(price);
  if (Number.isNaN(truePrice)) return false;
  if (truePrice > 0 && truePrice < 100000) return true;
  else return false;
};

const validateInStockAmount = (InStockAmount) => {
  if (!InStockAmount) return false;
  var stockAmount = Number(InStockAmount);
  if (Number.isNaN(stockAmount)) return false;
  if (
    Number.isInteger(stockAmount) &&
    stockAmount >= 0 &&
    stockAmount < 10000000
  )
    return true;
  else return false;
};

const validatePrescriptionRequired = (prescriptionRequired) => {
  if (prescriptionRequired === true || prescriptionRequired == false)
    return true;
  else return false;
};

const validateDrugDescription = (drugDescription) => {
  if (!drugDescription) return false;
  if (500 > drugDescription.length && drugDescription.length > 10) return true;
  else return false;
};

const validateBrandName = (brandName) => {
  if (!brandName || brandName.length < 50) return true;
  else return false;
};

const validateCountryOfOrigin = (countryOfOrigin) => {
  if (!countryOfOrigin) return true;
  var re = RegExp("[a-zA-Zs]+$", "g");
  if (countryOfOrigin.length < 25 && re.test(countryOfOrigin)) return true;
  else return false;
};

const drugModel = (row) => {
  return {
    name: row[0],
    price: row[1],
    amountInStock: row[2],
    requiresPrescription: row[3],
    description: row[4],
    ...(row[5] !== null && { brandName: row[5] }),
    ...(row[6] !== null && { countryOfOrigin: row[6] }),
  };
};

const invalidRowCellError = (row) => {
  return [
    validateDrugName(row[0]),
    validatePrice(row[1]),
    validateInStockAmount(row[2]),
    validatePrescriptionRequired(row[3]),
    validateDrugDescription(row[4]),
    validateBrandName(row[5]),
    validateCountryOfOrigin(row[6]),
  ];
};

const validateRow = (row) => {
  //   console.log(row)
  //   console.log(validateDrugName(row[0]),validatePrice(row[1]),validateInStockAmount(row[2]),
  //   validatePrescriptionRequired(row[3]),validateDrugDescription(row[4]),validateBrandName(row[5]),
  //   validateCountryOfOrigin(row[6]))
  if (
    validateDrugName(row[0]) === true &&
    validatePrice(row[1]) === true &&
    validateInStockAmount(row[2]) === true &&
    validatePrescriptionRequired(row[3]) === true &&
    validateDrugDescription(row[4]) === true &&
    validateBrandName(row[5]) &&
    validateCountryOfOrigin(row[6]) === true
  )
    return true;
  else return false;
};

const allNull = (row) => {
  if (!row[0] && !row[1] && !row[2] && !row[3] && !row[4] && !row[5] && !row[6])
    return true;
  else return false;
};

const DrugModels = (rows) => {
  var rowsWithValidationErrors = [];
  var rowsWithRepetitionErrors = [];
  var drugModels = [];
  var gabInBetweenRows = 0;
  var uniqueRows = [];
  for (let index = 1; index < rows.length; index++) {
    const row = rows[index];
    if (allNull(row) === true) continue;
    if (gabInBetweenRows > 5) break;
    if (!row[0]) gabInBetweenRows += 1;
    if (validateRow(row) === true) {
      var queryName =
        row[5] === undefined || row[5] === null ? row[0] : row[0] + row[5];
      if (uniqueRows.includes(queryName) == false) {
        uniqueRows.push(queryName);
        drugModels.push(drugModel(row));
      } else {
        rowsWithRepetitionErrors.push({
          Error: "Repeated",
          row: row,
          index: index,
          cellColors: invalidRowCellError(row),
        });
      }
    } else {
      rowsWithValidationErrors.push({
        Error: "Validation",
        row: row,
        index: index,
        cellColors: invalidRowCellError(row),
      });
    }
  }

  return { drugModels, rowsWithValidationErrors, rowsWithRepetitionErrors };
};

const DrugModel = (row) => {
  if (validateRow(row) === true) {
    return drugModel(row);
  } else {
    return false;
  }
};

module.exports = {
  DrugModel,
  DrugModels,
  validateDrugName,
  validateDrugDescription,
  validateBrandName,
  validatePrice,
  validateInStockAmount,
  validatePrescriptionRequired,
  validateCountryOfOrigin,
};
