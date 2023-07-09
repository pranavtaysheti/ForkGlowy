import { useId, useState } from "react";
import { capitalizeFirstLetter } from "../common";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { LoginType } from "../login";
import { Redirect } from "wouter";
import { setUsername, setPassword } from "../login";
import { loginUser } from "../loginManager";

enum FieldType {
  Username = "USERNAME",
  Password = "PASSWORD",
}

type FieldTypeMap = {
  field: FieldType;
  type: string;
  dispatch: Function;
};

const fieldTypeMap: Array<FieldTypeMap> = [
  {
    field: FieldType.Username,
    type: "text",
    dispatch: setUsername,
  },
  {
    field: FieldType.Password,
    type: "password",
    dispatch: setPassword,
  },
];

type FormFieldArgs = {
  fieldType: FieldType;
};
function FormField({ fieldType }: FormFieldArgs) {
  const [inputText, setInputText] = useState("");
  const dispatch = useDispatch();
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
          setInputText(e.target.value);
          dispatch(fieldItem?.dispatch(e.target.value));
        }}
        id={id}
        value={inputText}
      />
    </div>
  );
}

type SubmitButtonArgs = {
  buttonType: LoginType;
};

function SubmitButton({ buttonType }: SubmitButtonArgs) {
  const buttonStyle = (() => {
    switch (buttonType) {
      case LoginType.Login:
        return "btn btn-primary";
      case LoginType.Register:
        return "btn btn-warning";
    }
  })();

  return (
    <button
      name={buttonType}
      className={buttonStyle}
      onClick={(_e) => loginUser(buttonType)}
    >
      {capitalizeFirstLetter(buttonType)}
    </button>
  );
}

function LoginButtons() {
  return (
    <div className={"btn-group mb-2 p-2"}>
      <SubmitButton buttonType={LoginType.Login} />
      <SubmitButton buttonType={LoginType.Register} />
    </div>
  );
}

export default function LoginForm() {
  /*
  const loginSlice = useSelector((state: RootState) => state.login);

  if (loginSlice.user) {
    return <Redirect to="/" />;
  }
  */
  return (
    <form className={"card w-50 text-bg-dark border-dark p-2"}>
      <div className={"card-header"}>
        <h3 className={"card-title"}> Login </h3>
      </div>
      <div className={"card-body"}>
        <FormField fieldType={FieldType.Username} />
        <FormField fieldType={FieldType.Password} />
      </div>
      <LoginButtons />
    </form>
  );
}
