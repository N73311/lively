import { FORM_ERROR } from "final-form";
import React from "react";
import { Field, Form as FinalForm } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import { Button, Form, Header } from "semantic-ui-react";
import { IUserFormValues } from "../../../../models";
import { useAuthRedirect } from "../../../../hooks/useAuthRedirect";
import { useUserStore } from "../../../../hooks/useUserStore";
import { TextInput } from "../../shared";
import ErrorLabel from "../../shared/form/ErrorLabel/ErrorLabel";

const validate = combineValidators({
  email: isRequired("Email"),
  password: isRequired("Password"),
  userName: isRequired("Username"),
  displayName: isRequired("Display name"),
});

const RegisterForm = () => {
  const { register } = useUserStore();
  return useAuthRedirect(
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        register(values).catch((e) => ({
          [FORM_ERROR]: e,
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        form,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as={"h2"}
            content={"Register"}
            color={"teal"}
            textAlign={"center"}
          />
          <Field
            name={"email"}
            component={TextInput}
            placeholder={"Email"}
            type={"email"}
          />
          <Field
            name={"userName"}
            component={TextInput}
            placeholder={"Username"}
            type={"text"}
          />
          <Field
            name={"displayName"}
            component={TextInput}
            placeholder={"Display Name"}
            type={"text"}
          />
          <Field
            name={"password"}
            component={TextInput}
            placeholder={"Password"}
            type={"password"}
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorLabel error={submitError} />
          )}
          <Button
            fluid
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            color={"teal"}
            loading={submitting}
            content={"Register"}
          />
        </Form>
      )}
    />
  );
};

export default RegisterForm;
