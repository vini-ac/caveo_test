jest.mock('aws-sdk', () => ({
    CognitoIdentityServiceProvider: jest.fn().mockImplementation(() => ({
        initiateAuth: jest.fn().mockReturnValue({
            promise: () => Promise.resolve({
                AuthenticationResult: {
                    AccessToken: 'mock-token'
                }
            })
        })
    }))
}));
