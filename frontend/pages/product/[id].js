import SingleProduct from "../../components/SingleProduct";

const SingleProductPage = ({ query }) => {
  return <SingleProduct id={query.id}></SingleProduct>
};

export default SingleProductPage;
