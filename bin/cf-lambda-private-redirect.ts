#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CfLambdaPrivateRedirectStack } from '../lib/cf-lambda-private-redirect-stack';

const app = new cdk.App();
new CfLambdaPrivateRedirectStack(app, 'CfLambdaPrivateRedirectStack');
