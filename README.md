# AWS POC: CloudFront Private Redirection

## Useful commands
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk synth`       emits the synthesized CloudFormation template

## Instructions
Install AWS CDK: `npm i -g aws-cdk` and install the pacakges used in this repository: `npm ci`. Configure the AWS CLI to target `us-east-1` and then perform a deployment using `cdk deploy`. It will output two CD urls, one which uses custom error response configuration and the other uses a lambda-based redirection.