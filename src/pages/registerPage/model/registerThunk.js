
import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL, headers, headersImg, useHttp} from "shared/api/base";

const getAuthToken = () => {
    const userData = sessionStorage.getItem('token');
    return userData ? userData : null;
};

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (userData, thunkAPI) => {
        const token = getAuthToken();

        if (!token) {
            return thunkAPI.rejectWithValue('No authorization token found');
        }

        try {
            const response = await fetch(
                `${API_URL}Students/students_create/`,
                {
                    method: 'POST',
                    headers: {
                        ...headers,
                        Authorization: `JWT ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to register user');
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const registerTeacher = createAsyncThunk(
    'user/registerTeacher',
    async ({res, file}, thunkAPI) => {
        const token = getAuthToken();
        // const formData = new FormData()
        // const imageObject = {
        //     data: base64Image,
        //     mimeType: 'image/jpeg', // Укажите тип изображения в зависимости от вашего изображения
        // };
        //
        // // Логирование или отправка imageObject в ваш API
        // formData.append("file", res?.user?.resume[0])
        delete res?.user?.resume
        // formData.append("data", JSON.stringify(res))
        // const postData = teacherData?.class_type ? formData : JSON.stringify(teacherData)

        if (!token) {
            return thunkAPI.rejectWithValue('No authorization token found');
        }

        try {
            const response = await fetch(
                `${API_URL}Teachers/teachers/create/`,
                {
                    method: 'POST',
                    headers: {
                        ...headers()
                    },
                    body: JSON.stringify(res)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to register teacher');
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);

        }
    }
);

export const registerTeacherImage = createAsyncThunk(
    "user/registerTeacherImage",
    ({id, file}) => {
        const {request} = useHttp()
        const formData = new FormData()
        formData.append("file", file)
        return request(`${API_URL}Teachers/upload-file/?username=${id}`, "POST", formData, headersImg())
    }
)

export const registerEmployer = createAsyncThunk(
    'user/registerEmployer',
    async (employerData, thunkAPI) => {
        const token = getAuthToken();

        if (!token) {
            return thunkAPI.rejectWithValue('No authorization token found');
        }

        try {
            const response = await fetch(
                `${API_URL}Users/users/create/`,
                {
                    method: 'POST',
                    headers: {
                        ...headers,
                        Authorization: `JWT ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(employerData)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to register employer');
            }

            const data = await response.json();

            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchCategories = createAsyncThunk(
    "user/fetchCategories",
    (id) => {
        const {request} = useHttp()

        return request(`${API_URL}Teachers/salary-types/?branch=${id}`, "GET", null, headers())
    }
)
