export const savePageTypeToLocalStorage = (pageKey, value) => {
    localStorage.setItem(pageKey, value);
};

export const getPageTypeFromLocalStorage = (pageKey) => {
    return localStorage.getItem(pageKey);
};

export const removePageTypeFromLocalStorage = (pageKey) => {
    localStorage.removeItem(pageKey);
};