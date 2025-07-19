import React, {useState} from "react";
import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import {set, useForm} from "react-hook-form";

import {Button} from "shared/ui/button";
import {Input} from "shared/ui/input";
import {MiniLoader} from "shared/ui/miniLoader";
import cls from "./login.module.sass"
import gennisImg from "shared/assets/images/logo.svg"
import loginAside from "shared/assets/images/login-page-4468581-3783954 1.svg"
import {API_URL, CLASSROOM_API_URL, useHttp} from "shared/api/base";
import {getUserData} from "../model/loginSlice";
import {DefaultLoader} from "shared/ui/defaultLoader";


export const Login = () => {

    // const {username , password} = useSelector(state => state.loginSlice)/

    const {request} = useHttp()


    const {register, handleSubmit , setValue} = useForm()
    const [inputChange, setInputChange] = useState([])
    const [loading, setLoading] = useState(true)


    const [error, setError] = useState(false)
    const dispatch = useDispatch()

    const navigate = useNavigate()


    const onClick = (e) => {

        // dispatch()

        const res = {
            username: e.username,
            password: e.password

        }

        // dispatch(fetchLoginUser(res))
        // .then((action =>{
        //     const isNav = localStorage.getItem("navigate")

        //     if (action.error) {
        //         console.error('Registration error:', action.error);
        //         showAlert('error', 'Login failed. Please try again.');
        //         navigate(`/login`)
        //         localStorage.removeItem("navigate")
        //     } else {
        //         sessionStorage.setItem("token", action.payload.access)
        //         showAlert('success', 'Login successful!');
        //         setLoading(false)
        //         navigate("/platform")
        //     }
        // }))
        // .catch(() =>{
        //     showAlert("error" ,"error login")
        // })
        setLoading(!loading)


        request(`${API_URL}token/`, "POST", JSON.stringify(res))
            .then(res => {
                dispatch(getUserData(res))
                navigate("/platform")
                setLoading(false)
              /*  if (res.class) {
                    window.location.replace(`${CLASSROOM_API_URL}get_user_turon/${res.username}/${res.access}/${res.refresh}`)
                    return {success: false}
                } else {
                    dispatch(getUserData(res))
                    navigate("/platform")
                    setLoading(false)
                }*/

            })
            .catch(err => {

                setLoading(true)
                setError(true)
                setValue("username" , "")
                setValue("password" , "")

            })


    }
    return (
        <div className={cls.container}>


            <div className={cls.login__logo}>
                <img src={gennisImg} alt=""/>
            </div>

            <div className={cls.login}>

                <div className={cls.login__boxes}>

                    <div className={cls.login__box}>

                        <div className={cls.box__header_img}>
                            <img src={gennisImg} alt=""/>
                        </div>
                        <h1 className={cls.box__header_title}>
                            login
                        </h1>
                        {error && error ?
                            <div className={cls.login__error}>Username yoki Parol noto'g'ri !</div> : null}
                        <div className={cls.box__form}>
                            <form onSubmit={handleSubmit(onClick)}>
                                {loading ?
                                    <>
                                        <Input
                                            onChange={(e) => setInputChange(e.target.value)}
                                            title={"username"}
                                            register={register}
                                            name={"username"}
                                            type="text"
                                            required/>


                                        <Input
                                            title={"password"}
                                            register={register}
                                            name={"password"}
                                            type="password"
                                            required/>
                                    </>
                                    :
                                    <>
                                        <Input

                                            disabled
                                            onChange={(e) => setInputChange(e.target.value)}
                                            title={"username"}
                                            register={register}
                                            name={"username"}
                                            type="text"
                                            required/>
                                        <Input
                                            title={"password"}
                                            register={register}
                                            name={"password"}
                                            type="password"
                                            required
                                            disabled/>
                                    </>
                                }
                                {/*<Input extraClassName={cls.checkbox} type="checkbox" onChange={() => setInputChange}*/}
                                {/*       checkboxTitle={"Remember me"}/>*/}
                                {/*<Button extraClass={cls.login__btn}>Login</Button>*/}
                                {loading ?
                                    <Button extraClass={cls.login__btn}>Login</Button> :
                                    <MiniLoader/>}
                                {/*{loading ? null : <DefaultLoader/>}*/}
                            </form>
                        </div>
                    </div>
                    <div className={cls.login__aside}>
                        <img src={loginAside} alt=""/>
                    </div>
                </div>
            </div>
        </div>

    )
}