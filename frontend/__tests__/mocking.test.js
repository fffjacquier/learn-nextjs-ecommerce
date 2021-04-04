function Dog(name, food) {
  this.name = name
  this.food = food
}
Dog.prototype.fetchFood = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(this.food), 2000)
  })
}

describe('mocking 101', () => {
  it('mocks a reg function', () => {
    const fetchDogs = jest.fn()
    fetchDogs('snic')
    expect(fetchDogs).toHaveBeenCalled()
    expect(fetchDogs).toHaveBeenCalledWith('snic')

    fetchDogs('wes')
    expect(fetchDogs).toHaveBeenCalledTimes(2)
  })

  it('can create a dog', () => {
    const d = new Dog('snick', 'pizza')
    expect(d.name).toBe('snick')
  })

  it('can fetch food', async () => {
    const d = new Dog('snick', ['pizza', 'chips'])
    // mock favFoods
    d.fetchFood = jest.fn().mockResolvedValue(['sushi', 'pizza'])
    const favFood = await d.fetchFood()
    expect(favFood).toContain('pizza')
  })
})
