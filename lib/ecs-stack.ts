import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'

import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';


export class EcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
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
      'MyRepository',
      {
        repositoryName: 'myrepo',
        removalPolicy: cdk.RemovalPolicy.DESTROY
      }
    )
    ecrRepo.addLifecycleRule({ maxImageAge: cdk.Duration.days(30) })


    // ECS Cluster


    const fargateCluster = new ecs.Cluster(this, "MyFargateCluster", {
      vpc: vpc,
      clusterName: "MyFargateCluster",
    });
    fargateCluster.enableFargateCapacityProviders();


    // Outputs


    new cdk.CfnOutput(this, "OutputMyFargateCluster", {
        description: "My Fargate Cluster",
        exportName: "OutputMyFargateCluster",
        value: fargateCluster.clusterName,
    });
  

    new cdk.CfnOutput(this, "OutputMyFargateCluster", {
        description: "My Fargate Cluster",
        exportName: "OutputMyFargateCluster",
        value: fargateCluster.clusterName,
    });

    new cdk.CfnOutput(this, "OutputECRRepository", {
        description: "My ECR Repo",
        exportName: "OutputECRRepository",
        value: ecrRepo.repositoryUri,
    });

  }
}
