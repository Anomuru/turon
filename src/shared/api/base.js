//
// export const API_URL_DOC = `http://192.168.1.61:8000/`
// export const API_URL_DOC = `http://26.253.30.50:8000/`
// export const API_URL_DOC = `http://26.12.122.72:7622/`

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
    const request = async (props) => {
        let {
            url = "",
            method = 'GET',
            body = undefined,
            headers = {'Content-Type': 'application/json'},
            typeUrl = "auto",
            isJson = true
        } = props;
        try {
            let newUrl = typeUrl === "auto" ? API_URL + url : url;
            const headersObject = new Headers(headers);

            if (body instanceof FormData) {
                headersObject.delete("Content-Type");
            }
            const response = await fetch(newUrl, {method, mode: 'cors', body, headers: headersObject});


            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            return isJson ? await response?.json() : response;

        } catch (e) {
            throw e;
        }
    }

    return {request}

}

export const ParamUrl = (params) => {
    const paramsList = Object.keys(params);
    let res = '';

    for (let i = 0; i < paramsList.length; i++) {
        const key = paramsList[i];
        const value = params[key];

        if (value !== undefined && value !== null) {
            res += `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}&`;
        }
    }

    return res.slice(0, -1);
};