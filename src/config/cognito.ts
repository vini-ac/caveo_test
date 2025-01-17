import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const userPoolId = process.env.COGNITO_USER_POOL_ID;
export const clientId = process.env.COGNITO_CLIENT_ID;
