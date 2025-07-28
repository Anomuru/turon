import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export const AnimatedMulti = React.memo(({ options, onChange, value, extraClass, fontSize }) => {
    const handleChange = (selectedOptions) => {
        if (onChange) {
            onChange(selectedOptions);
        }
    };

    return (
        <Select
            className={extraClass}
            styles={{
                control: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: fontSize ? `${fontSize}px` : '16px',
                }),
                option: (provided) => ({
                    ...provided,
                    fontSize: fontSize ? `${fontSize}px` : '16px',
                    display: 'block',
                    whiteSpace: 'normal',
                }),
                singleValue: (provided) => ({
                    ...provided,
                    fontSize: fontSize ? `${fontSize}px` : '16px',
                }),
            }}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}
            onChange={handleChange}
            value={value}
        />
    );
});
