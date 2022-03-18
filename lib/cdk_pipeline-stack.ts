import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'

import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as pipelines from 'aws-cdk-lib/pipelines'


interface PipelineStackProps extends cdk.StackProps {
  pipelineSourceBranch: string;
  ecsImageTag: string
}

interface MyApplicationProps extends cdk.StageProps {
  ecsImageTag: string
}

interface MyServiceProps extends cdk.StackProps {
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

    const myStack = new MyServiceStack(this, 'MyService', {ecsImageTag: props.ecsImageTag});
  }
}


class MyServiceStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: MyServiceProps) {
    super(scope, id, props);


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

    console.log(`ecsImageTag ${props.ecsImageTag}`)

    taskDefinition.addContainer("myapp", {
      image: ecs.ContainerImage.fromEcrRepository(ecrRepo,props.ecsImageTag),
      portMappings: [{ containerPort: 8000 }]
    });

    // xsee: https://aws.amazon.com/premiumsupport/knowledge-center/ecs-unable-to-pull-secrets/
    const service = new ecs.FargateService(this, 'MyAppService', {
      serviceName: "MyAppService",
      cluster: fargateCluster,
      taskDefinition: taskDefinition,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      desiredCount: 0,
      assignPublicIp: true
    });

    service.connections.allowFrom(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(8000),
      "public accesss",
    );

  }


}