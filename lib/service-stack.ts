import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib'

import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';



interface ServiceStackProps extends cdk.StackProps {
  ecsImageTag: string
  environment: string
}


export class ServiceStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props);


    // import VPC 


    const vpc = ec2.Vpc.fromLookup(this, "VPC", {isDefault: true})


    // import ECR 


    const ecrRepo = ecr.Repository.fromRepositoryAttributes(this, "MyRepository", {
        repositoryArn: cdk.Fn.importValue("OutputECRRepositoryArn"),
        repositoryName: cdk.Fn.importValue("OutputECRRepositoryName"),
    });


    // import Fargate cluster


    const fargateCluster = ecs.Cluster.fromClusterAttributes(this, "MyFargateCluster", {
      clusterName: cdk.Fn.importValue("MyFargateCluster"),
      securityGroups: [],
      vpc: vpc,
    });
    

    // define ECS task


    const taskDefinition = new ecs.FargateTaskDefinition(this, `MyAppTask-${props.environment}`, {
      memoryLimitMiB: 512,
      cpu: 256
    });

    console.log(`ecsImageTag ${props.ecsImageTag}`)

    taskDefinition.addContainer("myapp", {
      image: ecs.ContainerImage.fromEcrRepository(ecrRepo,props.ecsImageTag),
      portMappings: [{ containerPort: 8000 }]
    });


    // define ECS service 


    // xsee: https://aws.amazon.com/premiumsupport/knowledge-center/ecs-unable-to-pull-secrets/
    const service = new ecs.FargateService(this, `MyAppService-${props.environment}`, {
      serviceName: `MyAppService-${props.environment}`,
      cluster: fargateCluster,
      taskDefinition: taskDefinition,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      desiredCount: 0,
      assignPublicIp: true
    });

    service.connections.allowFrom(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(8000),
      "web access",
    );
  }

}