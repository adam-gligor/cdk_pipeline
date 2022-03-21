#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkPipelineStack  } from '../lib/cdk_pipeline-stack';
import { EcsStack  } from '../lib/ecs-stack';

const app = new cdk.App();

new EcsStack(app, 'EcsStack', {
  env: { account: '007401537193', region: 'eu-central-1' },
});


new CdkPipelineStack(app, 'StagingPipeline', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { account: '007401537193', region: 'eu-central-1' },
  pipelineSourceBranch: "develop",
  ecsImageTag: "develop",
  environment: "staging"
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});


new CdkPipelineStack(app, 'ProductionPipeline', {
  env: { account: '007401537193', region: 'eu-central-1' },
  pipelineSourceBranch: "master",
  ecsImageTag: "1.0.0",
  environment: "production"
});