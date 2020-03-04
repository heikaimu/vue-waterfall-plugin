function debounce(func, wait) {
  let timeout = null;

  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, arguments);
    }, wait);
  };
}

export default debounce;
