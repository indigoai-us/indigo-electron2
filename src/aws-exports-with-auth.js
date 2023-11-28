import awsmobile from './aws-exports';

const isDev = process.env.NODE_ENV === 'development';

const url = isDev ? 'http://localhost:8080' : 'https://indigo-api-dev.diffuze.ai';            

const [localRedirectSignIn, productionRedirectSignIn] =
  awsmobile.oauth.redirectSignIn.split(',');

const [localRedirectSignOut, productionRedirectSignOut] =
  awsmobile.oauth.redirectSignOut.split(',');

const awsoverrides = {
	...awsmobile,
	API: {
    endpoints: [
      {
        name: "be1",
        endpoint: url
      }
    ]
  },
  oauth: {
    ...awsmobile.oauth,
    redirectSignIn: isDev
      ? localRedirectSignIn
      : productionRedirectSignIn,
    redirectSignOut: isDev
      ? localRedirectSignOut
      : productionRedirectSignOut,
    urlOpener: (url) => {
      const left = (window.screen.width - 600 ) / 2;
      const top = (window.screen.height - 549 ) / 2;
      const windowProxy = window.open( url, "center window",
        `resizable = yes, width=600,height=549,top=${top},left=${left}`);
      return Promise.resolve(windowProxy)
    }
  }
}

export default awsoverrides;
