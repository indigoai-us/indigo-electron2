const getClip = () => {
  return navigator.clipboard.readText()
    .then(text => {
      return text;
    })
    .catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    });
}

export default getClip;
