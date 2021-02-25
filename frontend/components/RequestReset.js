import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import FormStyles from "./styles/Form";
import useForm from '../lib/useForm';
import ErrorMessage from '../components/ErrorMessage';
import { CURRENT_USER_QUERY } from "./User";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: ''
  });

  const [signup, { data, loading, error }] = useMutation(REQUEST_RESET_MUTATION, {
    variables: inputs
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await signup().catch(console.error);
    resetForm();
  }

  return (
    <FormStyles method="POST" onSubmit={handleSubmit}>
      <h2>Request a password reset</h2>
      <ErrorMessage error={error} />
      <fieldset>
        {data?.sendUserPasswordResetLink === null && (
          <p>Success! Check your email for a link</p>
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
        <button type="submit">Request Reset</button>
      </fieldset>
    </FormStyles>
  )
}
