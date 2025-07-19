import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {CategoryProfileProfile} from "entities/capital/ui/categoryProfileProfile/categoryProfileProfile";
import {getCapitalCategoryInfo} from "../../../../entities/capital/model/selector/capitalSelector";
import {useEffect} from "react";
import {getCapitalCategory} from "../../../../entities/capital/model/thunk/capitalThunk";
import {getBranch} from "../../../../features/branchSwitcher";

export const CategoryProfile = () => {


    const dispatch = useDispatch()
    const categoryInfo  = useSelector(getCapitalCategoryInfo)
    // const {id} = useParams()
    const {id} = useSelector(getBranch)

    useEffect(() => {
        dispatch(getCapitalCategory(id))
    }, [])


    return (
        <div>
            <CategoryProfileProfile/>
        </div>
    );
};

