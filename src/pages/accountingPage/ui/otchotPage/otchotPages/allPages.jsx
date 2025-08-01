import {getUserBranchId} from "entities/profile/userProfile/index.js";
import {useEffect, useState} from "react";
import {AllTable} from "entities/accounting/ui/accountingOtchot/allTable";
import {useDispatch, useSelector} from "react-redux";
import {getAll} from "entities/accounting/model/thunk/otchotAccountingThunk";
import {getBranch} from "features/branchSwitcher";
import {getAllSelector} from "entities/accounting/model/selector/otchotAccountingSelector";

export const AllPages = () => {

    const dispatch = useDispatch()
    const branchId = useSelector(getUserBranchId)
    const all = useSelector(getAllSelector)
    useEffect(() => {
        if (branchId)
            dispatch(getAll({branchId}))
    }, [branchId])

    const [month, setMonths] = useState(null)

    const [year, setYear] = useState(null)


    return (
        <>
            {/*<div className={cls.paymentType}>*/}
            {/*    <Select extraClass={cls.select} options={all?.dates?.map(item => item.year)}*/}
            {/*            onChangeOption={setYear}/>*/}
            {/*    {*/}
            {/*        year ?*/}
            {/*            <Select*/}
            {/*                extraClass={cls.select}*/}
            {/*                options={all.dates.filter(item => item.year === +year)[0].months}*/}
            {/*                onChangeOption={setMonths}/>*/}
            {/*            : null*/}
            {/*    }*/}
            {/*</div>*/}

            <AllTable allTable={all}/>
        </>
    );
};

