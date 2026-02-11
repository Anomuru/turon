import {SchoolLeadershipTeam} from "../../../../entities/schoolHome";
import {useDispatch, useSelector} from "react-redux";
import {getSchoolLeaderShip} from "../../../../entities/schoolHome/model/selector/schoolLeaderShipSelector";
import {useEffect} from "react";
import {getLeaderShip} from "../../../../entities/schoolHome/model/thunk/leaderShipThunk";

export const SchoolLeadershipTeamModal = () => {

    const data = useSelector(getSchoolLeaderShip)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getLeaderShip())
    }, [])

    return (
        <div>

            <SchoolLeadershipTeam data={data}/>
        </div>
    );
};

