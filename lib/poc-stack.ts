import * as cdk from '@aws-cdk/core';
import * as S3 from '@aws-cdk/aws-s3';
import * as CF from '@aws-cdk/aws-cloudfront';
import * as IAM from '@aws-cdk/aws-iam';
import * as Lambda from '@aws-cdk/aws-lambda';
import * as S3Upload from '@aws-cdk/aws-s3-deployment';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';

interface PocStackProps extends cdk.StackProps { }

export class PocStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: PocStackProps) {
    super(scope, id, props);

    const oai = new CF.OriginAccessIdentity(this, 'OAI', { comment: 'OAI' });
    const bucket = new S3.Bucket(this, 'bucket', { removalPolicy: cdk.RemovalPolicy.DESTROY });
    bucket.addToResourcePolicy(new IAM.PolicyStatement({
      actions: ['s3:GetBucket*', 's3:GetObject*', 's3:List*'],
      resources: [bucket.bucketArn, bucket.arnForObjects('/*')],
      principals: [new IAM.CanonicalUserPrincipal(oai.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }));
    new S3Upload.BucketDeployment(this, 'upload', {
      destinationBucket: bucket,
      sources: [S3Upload.Source.asset('./static')],
      retainOnDelete: false
    });

    const lambda = new NodejsFunction(this, 'lambda');
    const lambdaVersion = new Lambda.Version(this, 'lambda-version', { lambda });

    const distWithLambda = new CF.CloudFrontWebDistribution(this, 'with-lambda', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity: oai
        },
        behaviors: [{
          allowedMethods: CF.CloudFrontAllowedMethods.GET_HEAD,
          trustedSigners: [this.account],
          isDefaultBehavior: true,
          lambdaFunctionAssociations: [{
            eventType: CF.LambdaEdgeEventType.VIEWER_REQUEST,
            lambdaFunction: lambdaVersion
          }]
        }]
      }]
    });

    const distWithError = new CF.CloudFrontWebDistribution(this, 'with-error', {
      errorConfigurations: [{
        errorCode: 403,
        responseCode: 200,
        responsePagePath: '/error-403.html'
      }],
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity: oai
        },
        behaviors: [{
          allowedMethods: CF.CloudFrontAllowedMethods.GET_HEAD,
          trustedSigners: [this.account],
          isDefaultBehavior: true,
        }],
      }]
    });

    new cdk.CfnOutput(this, 'WithErrorUrl', {
      exportName: 'WithErrorUrl',
      value: `https://${distWithError.distributionDomainName}/index.html`
    });

    new cdk.CfnOutput(this, 'WithLambdaUrl', {
      exportName: 'WithLambdaUrl',
      value: `https://${distWithLambda.distributionDomainName}/index.html`
    });
  }
}
