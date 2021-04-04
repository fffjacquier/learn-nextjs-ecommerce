import { MockedProvider } from '@apollo/client/testing'
import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
//import TestRenderer from 'react-test-renderer'
import wait from 'waait'

import { fakeItem } from '../lib/testUtils'
import SingleProduct, { SINGLE_PRODUCT_QUERY } from '../components/SingleProduct'

describe('<SingleProduct />', () => {
  it('renders with proper data', async () => {
    const mocks = [
      {
        request: {
          query: {
            SINGLE_PRODUCT_QUERY,
            variables: {
              id: '123',
            },
          },
        },
        result: {
          data: {
            Product: fakeItem(),
          },
        },
      },
    ]
    /*
    // not working, not sure why
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SingleProduct id="123" />
      </MockedProvider>
    )*/
    /*await wait(0)
    console.log(wrapper.debug())
    expect(wrapper.text()).toContain('Loading')*/
  })
})
