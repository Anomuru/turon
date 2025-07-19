import {SchoolHomeContactUs} from "../../../../entities/schoolHome";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getHomePageType} from "../../../../entities/schoolHome/model/selector/getHomePageSelector";
import {getContactInfo} from "../../../../entities/schoolHome/model/selector/SchoolHomeContactUsSelector";
import {fetchContactData} from "../../../../entities/schoolHome/model/thunk/homeContactThunk";
import {Modal} from "../../../../shared/ui/modal";
import {Form} from "../../../../shared/ui/form";
import {API_URL, header, useHttp} from "../../../../shared/api/base";
import {useForm} from "react-hook-form";
import {Input} from "../../../../shared/ui/input";
import {Button} from "../../../../shared/ui/button";
import {onChangeContact} from "../../../../entities/schoolHome/model/slice/SchoolHomeContactUsSlice";
import {Textarea} from "../../../../shared/ui/textArea";

export const SchoolHomeContactUsModal = () => {
    const dispatch = useDispatch()
    const [active, setActive] = useState("")
    const [activeEditItem, setActiveEditItem] = useState(null)
    const job = localStorage.getItem("job")

    const {register, handleSubmit, setValue} = useForm()

    const types = useSelector(getHomePageType)

    const data = useSelector(getContactInfo)


    useEffect(() => {

        dispatch(fetchContactData({id: 11}))

    }, [])



    return (
        <div>

            <SchoolHomeContactUs setValue={setValue} data={data} job={job} setActive={setActive}
                                 setActiveEditItem={setActiveEditItem}/>

            <EditText setActive={setActive} active={active} activeItem={activeEditItem} handleSubmit={handleSubmit}
                      register={register} setValue={setValue}/>

        </div>
    );
};


export const EditText = ({setActive, active, activeItem, handleSubmit, setValue, register}) => {

    const {request} = useHttp()


    const dispatch = useDispatch()
    const onClick = (data) => {

        const res = {
            ...data,
            type: 11
        }


        request(`${API_URL}Ui/fronted-pages/${activeItem.id}/`, "PATCH", JSON.stringify(res), header())
            .then(res => {
                console.log(res)


                setActive(false)
                dispatch(onChangeContact({id: activeItem.id, data: res}))
            })
            .catch(err => console.log(err))


    }

    return (
        <Modal typeIcon setActive={setActive} active={active}>


            <Form onSubmit={handleSubmit(onClick)}>
                <Textarea register={register} name={"description"}/>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <Button>
                        Edit
                    </Button>
                    <Button onClick={() => setActive(false)} type={"danger"}>
                        Cancel
                    </Button>
                </div>
            </Form>


        </Modal>

    )
}
