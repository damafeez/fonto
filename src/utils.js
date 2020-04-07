function randomFrom(array) {
  const random = Math.floor(Math.random() * array.length)
  return array[random]
}
const debounce = (func, interval = 200) => {
  // https://medium.com/walkme-engineering/debounce-and-throttle-in-real-life-scenarios-1cc7e2e38c68
  let timeout
  return function(...args) {
    const context = this
    const later = function() {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, interval)
  }
}
export { randomFrom, debounce }
