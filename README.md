# AWS POC: CloudFront Private Redirection

## Useful commands
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk synth`       emits the synthesized CloudFormation template

## Instructions

1. Install AWS CDK: `npm i -g aws-cdk`.
2. Install the pacakges used in this repository: `npm ci`. 
3. Configure the AWS CLI to target `us-east-1`: `export AWS_REGION=us-east-1`.
4. Run `cdk bootstrap`.
5. Perform a deployment using `cdk deploy`. 
6. It will output two URLs, one which uses custom error response configuration and the other uses a lambda-based redirection.
7. Access each URL output previously. 
8. The custom error response one should show a custom HTML page, whereas the other one should show an XML-based CF-generated error page.
