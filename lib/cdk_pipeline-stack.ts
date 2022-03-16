import { Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { CodePipeline, ShellStep, CodePipelineSource } from "aws-cdk-lib/pipelines";

import { Construct } from 'constructs';
// import * as cdk from "@aws-cdk/core";
import { Cluster } from "aws-cdk-lib/aws-ecs";
import { Vpc } from "aws-cdk-lib/aws-ec2";



// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html

export class CdkPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      selfMutation: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection('adam-gligor/cdk_pipeline', 'master', {
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
    
    pipeline.addStage(new MyApplication(this, 'Prod', {
      env: props.env,
    }));

  }
}


class MyApplication extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const dbStack = new MyServiceStack(this, 'MyService');
  }
}

class MyServiceStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = Vpc.fromLookup(this, "VPC", {isDefault: true})

    const fargateCluster = new Cluster(this, "MyFargateCluster", {
      vpc: vpc,
      clusterName: "MyFargateCluster",
    });

  }


}