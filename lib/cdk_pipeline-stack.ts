import { Stack, StackProps } from 'aws-cdk-lib';
import { CodePipeline, ShellStep, CodePipelineSource } from "aws-cdk-lib/pipelines";

import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html

export class CdkPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const modernPipeline = new CodePipeline(this, 'Pipeline', {
      selfMutation: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection('my-org/my-app', 'main', {
          // create the connection manually !
          connectionArn: 'arn:aws:codestar-connections:eu-central-1:007401537193:connection/7cb5f54e-88ad-46b2-992f-316b1aba99c1', 
        }),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });
    
  }
}
