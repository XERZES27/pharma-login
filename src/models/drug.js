const validateDrugName = (name)=>{
    if(name) return true
    else return false

}
const validatePrice = (price)=>{
    if(!price) return false
    var truePrice = Number(price)
    if(Number.isNaN(truePrice)) return false
    if(Number.isInteger(truePrice)&& truePrice>0 && truePrice<10000000)return true
    else return false
    
}

const validateInStockAmount = (inStockAmount) =>{
    if(!inStockAmount) return false
    var stockAmount = Number(inStockAmount)
    if(Number.isNaN(stockAmount)) return false
    if(Number.isInteger(stockAmount) && stockAmount>0 && stockAmount<100000)return true
    else return false

}

const validatePrescriptionRequired = (prescriptionRequired)=>{
    if(prescriptionRequired===true || prescriptionRequired == false) return true
    else return false

}

const validateDrugDescription = (drugDescription)=>{
    if(!drugDescription) return false
    if(150>drugDescription.length>10) return true
    else return false

}

const validateBrandName = (brandName)=>{
    if(!brandName || brandName.length<50)return true
    else return false
}

const validateCountryOfOrigin = (countryOfOrigin)=>{

    if(!countryOfOrigin) return false
    var re = RegExp('[a-zA-Z\s]+$','g')
    if(countryOfOrigin.length <25 && re.test(countryOfOrigin)) return true
    else return false
    
}


const drugModel=(row)=>{
    return $.extend({},{
        'name':row[0],
        'price':row[1],
        'amountInStock':row[2],
        'requiresPrescription':row[3],
        'description':row[4],
        'brandName':row[5]??undefined,
        'countryOfOrigin':row[6]??undefined
    })
}


const validateRow = (row) => {
    if(
        validateDrugName(row[0]) === true &&
        validatePrice(row[1]) === true &&
        validateInStockAmount(row[2]) === true &&
        validatePrescriptionRequired(row[3]) === true &&
        validateDrugDescription(row[4]) === true &&
        validateBrandName(row[5]) && true &&
        validateCountryOfOrigin([row[6]]) === true
    ) return true
    else return false

}

const DrugModels=(rows) => {
    var rowsWithErros = []
    var drugModels = []
    const gabInBetweenRows = 0
    for (let index = 1; index < rows.length; index++) {
        const row = rows[index];
        if(gabInBetweenRows >5)break
        if(!row[0]) gabInBetweenRows+=1
        if(validateRow(row)===true){
            drugModels.push(drugModel(row))
        }
        else{
            rowsWithErros.push(index)
        }   
    }
    return {drugModels,rowsWithErros}
}

module.exports = {DrugModels}