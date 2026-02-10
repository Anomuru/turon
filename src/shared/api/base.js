// export const API_URL_DOC = `http://192.168.0.100:8000/`
// export const API_URL_DOC = `http://26.196.249.247:8000/`
// export const API_URL_DOC = `http://100.94.144.113:8000/`//
// export const API_URL_DOC = `http://192.168.1.17:8000/`//
// export const API_URL_DOC = `http://26.107.238.217:8000/`
//
export const API_URL_DOC = `https://school.gennis.uz/`
export const API_URL = `${API_URL_DOC}api/`

// export const CLASSROOM_API_URL = `https://classroom.gennis.uz/`
// export const CLASSROOM_API_URL_DOC = `https://classroom.gennis.uz/`


export const headers = () => {
    const token = sessionStorage.getItem("token")
    return {
        "Authorization": "JWT " + token,
        'Content-Type': 'application/json'
    }
}


export const header = () => {
    return {
        'Content-Type': 'application/json'
    }
}

export const headerImg = () => {
    return {
        "Authorization": ""
    }
}


export const headersImg = () => {
    const token = sessionStorage.getItem("token")
    return {
        "Authorization": "JWT " + token
    }
}


export const branchQuery = () => {
    const branch = localStorage.getItem("selectedBranch")
    return `branch=${branch}`

}

export const branchQueryId = () => {
    return localStorage.getItem("selectedBranch")

}


export const useHttp = () => {
    const request = async (url, method = 'GET', body = null, headers = { 'Content-Type': 'application/json' }) => {
        try {
            const response = await fetch(url, { method, mode: 'cors', body, headers });

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            return await response.json();

        } catch (e) {
            throw e;
        }
    }

    return { request }
}

export const ParamUrl = (params = {}) => {
    return Object.entries(params)
        .filter(([_, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "all" &&
            value !== ""
        )
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                // массив → без кодирования запятых
                return `${encodeURIComponent(key)}=${value.join(",")}`;
            }

            return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
        })
        .join("&");
};


