import { type AppDispatch, type RootState } from "../../state";
import { type ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { setPassword, setEmail } from "../../state/login_data";
import { useSelector, useDispatch } from "react-redux";
import { useId } from "react";
import { capitalizeFirstLetter } from "../../common";


export enum FieldType {
  Username = "USERNAME",
  Password = "PASSWORD",
}

type FieldTypeMap = {
  field: FieldType;
  type: string;
  dispatch: ActionCreatorWithPayload<string>;
  selector: (state: RootState) => string;
};

const fieldTypeMap: Array<FieldTypeMap> = [
  {
    field: FieldType.Username,
    type: "text",
    dispatch: setEmail,
    selector: (state: RootState) => state.loginData.username,

  },
  {
    field: FieldType.Password,
    type: "password",
    dispatch: setPassword,
    selector: (state: RootState) => state.loginData.password,
  },
];

type FormFieldArgs = {
  fieldType: FieldType;
};

export function FormField({ fieldType }: FormFieldArgs) {
  const id = useId();
  const fieldItem = fieldTypeMap.find((item) => item.field === fieldType);
  const dispatch = useDispatch<AppDispatch>();
  
  if (!fieldItem) {
    return (
      "Unrecognized fieldType"
    )
  }

  const fieldState = useSelector(fieldItem.selector)

  return (
    <div className={"mb-3"}>
      <label htmlFor={id} className={"form-label"}>
        {capitalizeFirstLetter(fieldItem?.field)}
      </label>
      <input
        className={"form-control"}
        name={fieldItem.field.toLowerCase()}
        type={fieldItem.type}
        onChange={(e) => {
          dispatch(fieldItem.dispatch(e.target.value));
        }}
        id={id}
        value={fieldState}
      />
    </div>
  );
}