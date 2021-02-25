import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import useForm from "../lib/useForm";
import ErrorMessage from "./ErrorMessage";
import FormStyles from "./styles/Form";

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      description
      price
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id,
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      name
      description
      price
    }
  }
`;

const UpdateProduct = ({ id }) => {
  // get existing product
  const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY,  {
    variables: { id },
  });

  // get mutation to update the product
  const [
    updateProduct,
    {
      data: updateData,
      error: updateError,
      loading: updateLoading
    }
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  const { inputs, handleChange, clearForm, resetForm } = useForm(
    data?.Product || {
      name: '',
      description: '',
      price: '',
    }
  );
  console.log("inputs", inputs);

  if (loading) return <p>Loading...</p>;

  return (

    <FormStyles
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await updateProduct({
          variables: {
            id,
            name: inputs.name,
            description: inputs.description,
            price: inputs.price
          }
        }).catch(console.error);
        console.log("update", res);
      }}
    >
      <ErrorMessage error={error || updateError} />
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            name="price"
            id="price"
            placeholder="Price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            name="description"
            id="description"
            placeholder="description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Update Product</button>
      </fieldset>
    </FormStyles>
  );
};

export default UpdateProduct;
