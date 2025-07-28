import cls from "./classColorAddFilter.module.sass"
import classNames from "classnames";
import {useState} from "react";


export const ClassColorAddFilter = ({color, setEdit, setChangeName, changeName , setValue}) => {

    // const color1rgb = hexToRgb(item?.teacher[0]?.color ? item?.teacher[0]?.color : "#ffffff");
    //
    //
    // const brightness = Math.round(((parseInt(color1rgb.r) * 299) +
    //     (parseInt(color1rgb.g) * 587) +
    //     (parseInt(color1rgb.b) * 114)) / 1000);
    //
    // const style = {
    //     backgroundColor: item?.teacher[0]?.color ? item?.teacher[0]?.color : "white",
    //     color: brightness > 125 ? "black" : "white"
    // }

    const renderTable = () => {


        return color.map((item, i) => {


            function hexToRgb(hex) {
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }


            const color1rgb = hexToRgb(item?.value ? item?.value : "#ffffff");


            const brightness = Math.round(((parseInt(color1rgb?.r) * 299) +
                (parseInt(color1rgb?.g) * 587) +
                (parseInt(color1rgb?.b) * 114)) / 1000);


            const style = {
                backgroundColor: item?.value ? item?.value : "white",
                color: brightness > 125 ? "black" : "white"
            }

            return <li
                style={style}
                className={classNames(cls.classFilter_li)}
                key={i}
                onClick={() => {
                    setEdit(item)
                    setValue("name" , item.name)
                    setChangeName(!changeName)

                }}
            >{item.name}
                <span>{item.class}</span>
            </li>
        })
    }

    const render = renderTable()
    return (
        <div className={cls.filter}>
            <div className={cls.filter__wrapper}>
                <ul>
                    {render}

                </ul>
            </div>
        </div>
    );
};
