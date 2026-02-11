import {Button} from "shared/ui/button";


export const CapitalOutsideHeader = ({caunt , active , setActiveModal, isCanAdd}) => {
    return (
        <div>
            <div style={{display: "flex" , justifyContent: "flex-end"}}>
                {/*<RequirePermission permission={isCanAdd}>*/}
                    <Button
                        onClick={() => setActiveModal(!active) }
                        children={<i className={"fa fa-plus"}/>} type={"editPlus"}
                    />
                {/*</RequirePermission>*/}
            </div>

            <div style={{padding: "2rem 0" , display: "flex" , flexDirection: "column" , gap: "1rem"}}>
                <h1 style={{fontWeight: "bolder"}}>Capital</h1>
                <span style={{fontSize: "1.8rem" ,display: "flex" , gap: "4rem"}}>Jami (Down cost): {caunt}</span>
            </div>

        </div>
    );
};

