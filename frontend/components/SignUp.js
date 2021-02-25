import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import FormStyles from "./styles/Form";
import useForm from '../lib/useForm';
import ErrorMessage from '../components/ErrorMessage';
import { CURRENT_USER_QUERY } from "./User";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    createUser(data: {
      email: $email,
      name: $name,
      password: $password
    }) {
      id
      email
      name
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    name: ''
  });

  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await signup().catch(console.error);
    resetForm();
  }

  return (
    <FormStyles method="POST" onSubmit={handleSubmit}>
      <h2>Sign up for an account</h2>
      <ErrorMessage error={error} />
      <fieldset>
        {data?.createUser && <p>Signed up with {data.createUser.email} - You can sign in now!</p>}
        <label htmlFor="name">
          Name
          <input
            type="name"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
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
        <button type="submit">Sign up</button>
      </fieldset>
    </FormStyles>
  )
}
