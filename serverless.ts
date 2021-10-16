import type { AWS } from '@serverless/typescript';
// @ts-ignore
import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'lambda-template',
  frameworkVersion: '2',
  variablesResolutionMode: '20210326',
  custom: {
    webpack: {
      includeModules: true,
      package: {
        individually: true
      }

    }
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin', 'serverless-offline'],
  provider: {
    name: 'aws',
    // @ts-ignore
    region: '${opt:region, \'us-west-2\'}',
    stage: '${opt:stage, \'staging\'}',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { hello },
};

module.exports = serverlessConfiguration;
