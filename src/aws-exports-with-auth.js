import awsmobile from './aws-exports';

const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://indigo-api-dev.diffuze.ai';

const awsoverrides = {
  ...awsmobile,
  API: {
    endpoints: [
      {
        name: 'be1',
        endpoint: url,
      },
    ],
  },
};

export default awsoverrides;
