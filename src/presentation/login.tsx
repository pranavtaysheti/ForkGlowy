import { useId } from "react";
import { capitalizeFirstLetter } from "../common";
import { type AppDispatch, type RootState } from "../state";
import { LoginType } from "../state/login_user";
import { useSelector } from "react-redux";
import { setEmail, setPassword } from "../state/login_data";
import { type Action } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { manageUser } from "../thunk/manage_user";
import { Redirect } from "wouter";

enum FieldType {
  Username = "USERNAME",
  Password = "PASSWORD",
}

type FieldTypeMap = {
  field: FieldType;
  type: string;
  dispatch: (arg0: string) => Action;
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

function FormField({ fieldType }: FormFieldArgs) {
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

type SubmitButtonArgs = {
  buttonType: LoginType,
};


function SubmitButton({ buttonType }:SubmitButtonArgs) {
  const dispatch = useDispatch<AppDispatch>();

  const className = "btn " + (() => {
    switch (buttonType) {
      case LoginType.Login:
        return "btn-primary";
      case LoginType.Register:
        return "btn-warning";
    }
  })()

  return (
    <button
      name={buttonType}
      className={className}
      onClick={(_e) => dispatch(manageUser(buttonType))}
      type="button"
    >
      {capitalizeFirstLetter(buttonType)}
    </button>
  );

} 
export default function Login() {
  const user = useSelector((state: RootState) => state.loginUser.user)
  if (user) {
    return (
      <Redirect to="/app" />
    )
  }
  return (
    <div className={"card text-bg-dark border-dark p-2"}>
      <div className={"card-header"}>
        <h3 className={"card-title"}> Login </h3>
      </div>
      <div className={"card-body"}>
        <FormField fieldType={FieldType.Username} />
        <FormField fieldType={FieldType.Password} />
      </div>
      <div className={"btn-group mb-2 p-2"}>
        <SubmitButton buttonType={LoginType.Login}/>
        <SubmitButton buttonType={LoginType.Register}/>
      </div>
    </div>
  );

}
