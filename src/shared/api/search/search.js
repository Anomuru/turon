import {API_URL, useHttp} from "../base";


const BASE_URL = 'search'

// Buni test uchun yozdim
// hali oylab ko'rish kere
// qando hedirdagi Search ishlidi

export const useResultsSearch = (searchStr) => {
    const {request} = useHttp()
    return request(`${API_URL}${BASE_URL}/${searchStr}`)
}
