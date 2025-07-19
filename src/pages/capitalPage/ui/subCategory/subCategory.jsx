import {CategoryHeader} from "entities/capital";
import {CreateCapitalModal} from "features/createCapitalModal";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {API_URL, headers, useHttp} from "../../../../shared/api/base";

export const SubCategory = () => {
    const [activeModal, setActiveModal] = useState(false)
    const {register, setValue, handleSubmit} = useForm()
    const {request} = useHttp()

    const onClick = (data) => {

        request(`${API_URL}Capital/capital_category/`, "POST", JSON.stringify(data), headers())
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <div>
            <CategoryHeader activeModal={activeModal} setActiveModal={setActiveModal}/>
            <CreateCapitalModal activeModal={activeModal} setActiveModal={setActiveModal} register={register}
                                handleSubmit={handleSubmit} onClick={onClick}/>
        </div>
    );
};

