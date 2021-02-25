import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import FormStyles from "./styles/Form";
import useForm from '../lib/useForm';
import ErrorMessage from '../components/ErrorMessage';
import { CURRENT_USER_QUERY } from "./User";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess  {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: ''
  })

  const [signin, { data, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log(inputs);
    await signin();
    resetForm();
  }

  const error = data?.authenticateUserWithPassword.__typename === "UserAuthenticationWithPasswordFailure"
    ? data?.authenticateUserWithPassword
    : undefined;

  return (
    <FormStyles method="POST" onSubmit={handleSubmit}>
      <h2>Sign into your account</h2>
      <ErrorMessage error={error} />
      <fieldset>
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
        <button type="submit">Sign in</button>
      </fieldset>
    </FormStyles>
  )
}
