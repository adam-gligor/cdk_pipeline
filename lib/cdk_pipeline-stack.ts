// import { Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
// import { CodePipeline, ShellStep, CodePipelineSource } from "aws-cdk-lib/pipelines";

import { Construct } from 'constructs';
// // import * as cdk from "@aws-cdk/core";
// import { Cluster, FargateTaskDefinition } from "aws-cdk-lib/aws-ecs";
// import { Vpc } from "aws-cdk-lib/aws-ec2";

import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'

import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as pipelines from 'aws-cdk-lib/pipelines'


// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html

export class CdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);


    // CDK pipeline 


    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      selfMutation: true,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection('adam-gligor/cdk_pipeline', 'master', {
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


class MyApplication extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const dbStack = new MyServiceStack(this, 'MyService');
  }
}


class MyServiceStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    return
    // VPC 


    const vpc = ec2.Vpc.fromLookup(this, "VPC", {isDefault: true})


    // ECR 


    const group = new iam.Group(this, 'Administrators', {
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
      ]
    })
    const user = new iam.User(this, 'Administrator', {
      userName: 'Administrator',
      groups: [group]
    })
    ecr.AuthorizationToken.grantRead(user)

    const ecrRepo = new ecr.Repository(
      this,
      'RepositoryMyApp',
      {
        repositoryName: 'myapp',
        removalPolicy: cdk.RemovalPolicy.DESTROY
      }
    )
    ecrRepo.addLifecycleRule({ maxImageAge: cdk.Duration.days(30) })


    // ECS 


    const fargateCluster = new ecs.Cluster(this, "MyFargateCluster", {
      vpc: vpc,
      clusterName: "MyFargateCluster",
    });
    fargateCluster.enableFargateCapacityProviders();


    const taskDefinition = new ecs.FargateTaskDefinition(this, 'MyAppTask', {
      memoryLimitMiB: 512,
      cpu: 256
    });

    taskDefinition.addContainer("myapp", {
      image: ecs.ContainerImage.fromEcrRepository(ecrRepo,'1.0.0'),
      portMappings: [{ containerPort: 8000 }]
    });

    // see: https://aws.amazon.com/premiumsupport/knowledge-center/ecs-unable-to-pull-secrets/
    const service = new ecs.FargateService(this, 'MyAppService', {
      serviceName: "MyAppService",
      cluster: fargateCluster,
      taskDefinition: taskDefinition,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      desiredCount: 0,
      assignPublicIp: true
    });

    // service.connections.allowFrom(
    //   ec2.Peer.anyIpv4(),
    //   ec2.Port.tcp(8000),
    //   "",
    // );

  }


}