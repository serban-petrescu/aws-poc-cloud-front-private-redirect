import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CfLambdaPrivateRedirect from '../lib/cf-lambda-private-redirect-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CfLambdaPrivateRedirect.CfLambdaPrivateRedirectStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
