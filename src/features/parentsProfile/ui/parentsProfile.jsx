import {ParentsProfileChildInfo, ParentsProfileInfo} from "entities/parents/index.js";

export const ParentsProfile = () => {
    return (
        <div style={{padding: "2rem"}}>
            <ParentsProfileInfo/>
            <ParentsProfileChildInfo/>
        </div>
    );
};

