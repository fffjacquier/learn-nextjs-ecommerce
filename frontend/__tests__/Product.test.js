import ProductComponent from '../components/Product'
import { shallow, mount } from 'enzyme'
import toJSON from 'enzyme-to-json'

const fakeItem = {
  id: 'ABCD1234',
  name: 'An item',
  price: 5000,
  description: 'An item description',
  photo: {
    image: {
      publicUrlTransformed: 'learn-next-backend-home.jpg',
    },
  },
  largerImage: 'learn-next-backend-home.jpg',
}

describe('<ProductComponent />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ProductComponent product={fakeItem} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
  /*it('renders and displays properly', () => {
    const wrapper = shallow(<ProductComponent product={fakeItem} />)
    console.log(wrapper.debug())
    const PriceTag = wrapper.find('PriceTag')
    expect(PriceTag.text()).toEqual('€50')
    // expect(PriceTag.dive().text()).toEqual('€50')
    // expect(PriceTag.children().text()).toBe('€50')
    // console.log(wrapper.find('Title Link').debug())
    expect(wrapper.find('Title Link').dive().text()).toBe(fakeItem.name)
  })

  it('renders the image properly', () => {
    const wrapper = shallow(<ProductComponent product={fakeItem} />)
    const img = wrapper.find('img')
    expect(img.props().src).toBe(fakeItem.photo.image.publicUrlTransformed)
    expect(img.props().alt).toBe(fakeItem.name)
  })

  it('renders out the buttons properly', () => {
    const wrapper = shallow(<ProductComponent product={fakeItem} />)
    const buttonList = wrapper.find('.buttonList')
    expect(buttonList.children()).toHaveLength(3)

    expect(buttonList.find('Link')).toHaveLength(1)
    expect(buttonList.find('AddToCart')).toBeTruthy()
    expect(buttonList.find('DeleteProduct').exists()).toBe(true)
  })
  */
})
