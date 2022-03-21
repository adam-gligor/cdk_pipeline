import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'

import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as pipelines from 'aws-cdk-lib/pipelines'

import { ServiceStack } from '../lib/service-stack';


interface PipelineStackProps extends cdk.StackProps {
  pipelineSourceBranch: string;
  ecsImageTag: string
}

interface MyApplicationProps extends cdk.StageProps {
  ecsImageTag: string
}


export class CdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);


    // CDK pipeline


    const githubInput = pipelines.CodePipelineSource.connection('adam-gligor/cdk_pipeline', props.pipelineSourceBranch, {
      // create the connection manually !
      connectionArn: 'arn:aws:codestar-connections:eu-central-1:007401537193:connection/7cb5f54e-88ad-46b2-992f-316b1aba99c1', 
    });

    const synthStep = new pipelines.ShellStep('Synth', {
      input: githubInput,
      commands: [
        //'ls',
        'npm ci',
        'npm run build',
        'npx cdk synth',
      ],
    })


    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      selfMutation: true,
      synth: synthStep,
    });    


    pipeline.addStage(
      new MyApplication(this, 'Deploy', {
        env: props.env,
        ecsImageTag: props.ecsImageTag
      }),
      {
        // pre:[
        //   new pipelines.ShellStep('Version', {
        //     input: synthStep.addOutputDirectory('version'),
        //     commands: ['cat VERSION'],
        //   }),
        // ]
      }
    );

  }
}


class MyApplication extends cdk.Stage {
  constructor(scope: Construct, id: string, props: MyApplicationProps) {
    super(scope, id, props);

    new ServiceStack(this, 'MyService', {ecsImageTag: props.ecsImageTag});
  }
}
