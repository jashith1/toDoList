module.exports = function(){
  return new Date().toLocaleDateString("en-us", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
  })
}
