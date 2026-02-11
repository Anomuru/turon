
export const FILTERS_KEY = "savedFilters";

export function saveFilter(key, filter) {
    const filters = getSavedFilters();
    filters[key] = filter;
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}

export function getSavedFilters() {
    try {
        const data = localStorage.getItem(FILTERS_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

export function removeFilter(key) {
    const filters = getSavedFilters();
    delete filters[key];
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}
