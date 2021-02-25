import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import useForm from '../lib/useForm';
import ErrorMessage from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';
import FormStyles from './styles/Form';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    # which variables passing in?
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

const CreateProduct = () => {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    name: 'shoes',
    image: '',
    description: 'Best shoes I saw',
    price: 5900,
  });

  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: inputs,
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
    }
  );

  return (
    <FormStyles
      onSubmit={async (e) => {
        e.preventDefault();
        // console.log(inputs);
        const res = await createProduct();
        clearForm();
        Router.push({
          pathname: `/product/${res.data.createProduct.id}`,
        });
      }}
    >
      <ErrorMessage error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image
          <input type="file" name="image" id="image" onChange={handleChange} />
        </label>
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
        <button type="submit">+ Add Product</button>
      </fieldset>
      {/* <button type="button" onClick={clearForm}>
        Clear form
      </button>
      <button type="button" onClick={resetForm}>
        Reset form
      </button> */}
    </FormStyles>
  );
};

export default CreateProduct;
