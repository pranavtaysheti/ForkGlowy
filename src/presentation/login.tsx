import { Dispatch, SetStateAction, useId, useState } from "react";
import { capitalizeFirstLetter } from "../common";
import { useDispatch } from "react-redux";
import { AppDispatch, type RootState } from "../store";
import { LoginType, login } from "../login";
import { Redirect } from "wouter";
import { useSelector } from "react-redux";

enum FieldType {
  Username = "USERNAME",
  Password = "PASSWORD",
}

type FieldTypeMap = {
  field: FieldType;
  type: string;
};

const fieldTypeMap: Array<FieldTypeMap> = [
  {
    field: FieldType.Username,
    type: "text",
  },
  {
    field: FieldType.Password,
    type: "password",
  },
];

type FormFieldArgs = {
  fieldType: FieldType;
  stateArr: [string, Dispatch<SetStateAction<string>>]
};

function FormField({ fieldType, stateArr }: FormFieldArgs) {
  const [state, setState] = stateArr
  const id = useId();
  const fieldItem = fieldTypeMap.find((item) => item.field === fieldType);

  return (
    <div className={"mb-3"}>
      <label htmlFor={id} className={"form-label"}>
        {capitalizeFirstLetter(fieldItem?.field)}
      </label>
      <input
        className={"form-control"}
        name={fieldItem?.field.toLowerCase()}
        type={fieldItem?.type}
        onChange={(e) => {
          setState(e.target.value);
        }}
        id={id}
        value={state}
      />
    </div>
  );
}

type SubmitButtonArgs = {
  buttonType: LoginType,
  className: string
};



export default function LoginForm() {
  const usernameState = useState("")
  const passwordState = useState("")
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.login.user)

  const loginSubmit = (loginType: LoginType) => {
    const [username, _setUsername] = usernameState;
    const [password, _setPassword] = passwordState;

    dispatch(login({email: username, password, loginType}));
  };

  const SubmitButton = ({ buttonType, className }: SubmitButtonArgs) => {
    return (
      <button
        name={buttonType}
        className={className}
        onClick={(_e) => loginSubmit(buttonType)}
        type="button"
      >
        {capitalizeFirstLetter(buttonType)}
      </button>
    );
  }

  if (user) {
    return (
      <Redirect to="/" />
    )
  }

  return (
    <div className={"card text-bg-dark border-dark p-2"}>
      <div className={"card-header"}>
        <h3 className={"card-title"}> Login </h3>
      </div>
      <div className={"card-body"}>
        <FormField fieldType={FieldType.Username} stateArr={usernameState}/>
        <FormField fieldType={FieldType.Password} stateArr={passwordState}/>
      </div>
      <div className={"btn-group mb-2 p-2"}>
        <SubmitButton buttonType={LoginType.Login} className="btn btn-primary"/>
        <SubmitButton buttonType={LoginType.Register} className="btn btn-warning"/>
      </div>
    </div>
  );

}
