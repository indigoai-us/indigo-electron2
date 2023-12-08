const handleGoBack = async ({navigate}: any) => {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate('/');
  }
}

export default handleGoBack;
