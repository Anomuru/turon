
//capital tashqarishi
export {CapitalOutside} from "./ui/capitalOutside/capitalOutside"
export {CapitalOutsideHeader} from "./ui/capitalOutside/capitalOutsideHeader"
//



// capital ichkarisi
export {CapitalInsideHeader} from './ui/capitalInside/capitalInsideHeader/capitalInsideHeader'
export {CapitalInsideSecond} from './ui/capitalInside/capitalInsideSecond/CapitalInsideSecond'
export {CapitalInsideProduct} from './ui/capitalInside/capitalInsideProduct/capitalInsideProduct'

export {CategoryHeader} from "./ui/subCategory/categoryHeader/categoryHeader"
//







export {getCapitalDataThunk , createInsideCategory , getInsideCategory , changeCapitalInfoThunk , getCapitalInfo , createCapitalCategory} from "./model/thunk/capitalThunk"

export {default as capital} from "./model/slice/capitalSlice"
export {getCapitalData , getCapitalInsideInfo, getCapitalPermission, getLoading, getCapitalInside , getCapitalTypes} from "./model/selector/capitalSelector"

