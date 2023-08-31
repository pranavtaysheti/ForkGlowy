import { capitalizeFirstLetter } from "../common";
import { type AppDispatch, type RootState } from "../state";
import { LoginType } from "../state/login_user";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { manageUser } from "../thunk/manage_user";
import { Redirect } from "wouter";
import { FormField, FieldType } from "../components/form_field/form_field"


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
      onClick={() => dispatch(manageUser(buttonType))}
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
