import { FORM_ERROR } from "final-form";
import { observer } from "mobx-react";
import React from "react";
import { Field, Form as FinalForm } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import { Button, Form, Header } from "semantic-ui-react";
import { useAuthRedirect } from "../../../../hooks/useAuthRedirect";
import { useUserStore } from "../../../../hooks/useUserStore";
import { IUserFormValues } from "../../../../models";
import { TextInput } from "../../shared";

import ErrorLabel from "../../shared/form/ErrorLabel/ErrorLabel";

const validate = combineValidators({
  email: isRequired("Email"),
  password: isRequired("Password"),
});

const LoginForm = () => {
  const { login } = useUserStore();

  return useAuthRedirect(
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch((e) => ({
          [FORM_ERROR]: e,
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as={"h2"}
            content={"Login"}
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
            name={"password"}
            component={TextInput}
            placeholder={"Password"}
            type={"password"}
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorLabel text={"Invalid email or password"} />
          )}
          <Button
            fluid
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            color={"teal"}
            loading={submitting}
            content={"Login"}
          />
        </Form>
      )}
    />
  );
};

export default observer(LoginForm);
