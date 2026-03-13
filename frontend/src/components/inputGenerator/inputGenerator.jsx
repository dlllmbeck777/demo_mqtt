import React from "react";
import {
  MyCheckBox,
  MyTextField,
  MyNumberTextField,
  Select,
  ColorTextfield,
} from "../";

const InputGenerator = (props) => {
  const { type, changefunction, defaultValue } = props;

  const typeToInput = {
    text: (
      <MyTextField
        {...props}
        defaultValue={defaultValue}
        handleChangeFunc={changefunction}
      />
    ),
    checkbox: (
      <MyCheckBox
        {...props}
        defaultValue={defaultValue}
        handleChangeFunc={changefunction}
      />
    ),
    number: (
      <MyNumberTextField
        {...props}
        defaultValue={defaultValue}
        handleChangeFunc={changefunction}
      />
    ),
    select: (
      <Select
        {...props}
        defaultValue={defaultValue}
        handleChangeFunc={changefunction}
      />
    ),
    color: (
      <ColorTextfield
        {...props}
        defaultValue={defaultValue}
        handleChangeFunc={changefunction}
      />
    ),
  };
  const Element = typeToInput[type];

  return Element;
};

export default InputGenerator;
