exports.handler = async (): Promise<AWSLambda.CloudFrontResponse> => ({
    status: '302',
    statusDescription: 'Found',
    headers: {
        location: [{
            key: 'Location',
            value: 'https://www.google.com',
        }],
    },
});