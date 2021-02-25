import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import FormStyles from "./styles/Form";
import useForm from '../lib/useForm';
import ErrorMessage from '../components/ErrorMessage';
import { CURRENT_USER_QUERY } from "./User";

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($email: String!, $token: String!, $password: String!) {
    redeemUserPasswordResetToken(email: $email, token: $token, password: $password) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token
  });

  const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
    variables: inputs
  });

  const errorFromKeystone = data?.redeemUserPasswordResetToken?.code ? data?.redeemUserPasswordResetToken : undefined;
  //console.log(error)

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await reset().catch(console.error);
    //console.log({ data, loading, error })
    resetForm();
  }

  return (
    <FormStyles method="POST" onSubmit={handleSubmit}>
      <h2>Reset your password</h2>
      <ErrorMessage error={error || errorFromKeystone} />
      <fieldset>
        {data?.redeemUserPasswordResetToken === null && (
          <p>Success! You can sign in now</p>
        )}
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Email address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Reset</button>
      </fieldset>
    </FormStyles>
  )
}
