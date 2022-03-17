"use strict";
// import { Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
// import { CodePipeline, ShellStep, CodePipelineSource } from "aws-cdk-lib/pipelines";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkPipelineStack = void 0;
// // import * as cdk from "@aws-cdk/core";
// import { Cluster, FargateTaskDefinition } from "aws-cdk-lib/aws-ecs";
// import { Vpc } from "aws-cdk-lib/aws-ec2";
const cdk = require("aws-cdk-lib");
const iam = require("aws-cdk-lib/aws-iam");
const ecr = require("aws-cdk-lib/aws-ecr");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const pipelines = require("aws-cdk-lib/pipelines");
// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html
class CdkPipelineStack extends cdk.Stack {
    constructor(scope, id, props) {
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
        pipeline.addStage(new cdk.Stage(this, 'Version', {
            env: props.env,
        }), {
            post: [
                new pipelines.ShellStep('Version', {
                    commands: ['echo 1.0.0 > VERSION'],
                }),
            ],
        });
        pipeline.addStage(new MyApplication(this, 'Prod', {
            env: props.env,
        }));
    }
}
exports.CdkPipelineStack = CdkPipelineStack;
class MyApplication extends cdk.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        const myStack = new MyServiceStack(this, 'MyService');
    }
}
class MyServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // VPC 
        const vpc = ec2.Vpc.fromLookup(this, "VPC", { isDefault: true });
        // ECR 
        const group = new iam.Group(this, 'Administrators', {
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
            ]
        });
        const user = new iam.User(this, 'Administrator', {
            userName: 'Administrator',
            groups: [group]
        });
        ecr.AuthorizationToken.grantRead(user);
        const ecrRepo = new ecr.Repository(this, 'RepositoryMyApp', {
            repositoryName: 'myapp',
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        ecrRepo.addLifecycleRule({ maxImageAge: cdk.Duration.days(30) });
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
            image: ecs.ContainerImage.fromEcrRepository(ecrRepo, '1.0.0'),
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
        service.connections.allowFrom(ec2.Peer.anyIpv4(), ec2.Port.tcp(8000), "public accesss");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzRUFBc0U7QUFDdEUsdUZBQXVGOzs7QUFHdkYsMkNBQTJDO0FBQzNDLHdFQUF3RTtBQUN4RSw2Q0FBNkM7QUFFN0MsbUNBQWtDO0FBQ2xDLDJDQUEwQztBQUUxQywyQ0FBMEM7QUFDMUMsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxtREFBa0Q7QUFHbEQsZ0ZBQWdGO0FBRWhGLE1BQWEsZ0JBQWlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4QixnQkFBZ0I7UUFHaEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDNUQsWUFBWSxFQUFFLElBQUk7WUFDbEIsS0FBSyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3RDLEtBQUssRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLDBCQUEwQixFQUFFLFFBQVEsRUFBRTtvQkFDbkYsbUNBQW1DO29CQUNuQyxhQUFhLEVBQUUsd0dBQXdHO2lCQUN4SCxDQUFDO2dCQUNGLFFBQVEsRUFBRTtvQkFDUixRQUFRO29CQUNSLGVBQWU7b0JBQ2YsZUFBZTtpQkFDaEI7YUFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLFFBQVEsQ0FDZixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUM3QixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7U0FDZixDQUFDLEVBQ0Y7WUFDRSxJQUFJLEVBQUU7Z0JBQ0osSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtvQkFDakMsUUFBUSxFQUFFLENBQUMsc0JBQXNCLENBQUM7aUJBQ25DLENBQUM7YUFDSDtTQUNGLENBQ0YsQ0FBQztRQUVGLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNoRCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7U0FDZixDQUFDLENBQUMsQ0FBQztJQUVOLENBQUM7Q0FDRjtBQXhDRCw0Q0F3Q0M7QUFHRCxNQUFNLGFBQWMsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNuQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sT0FBTyxHQUFHLElBQUksY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBQ0Y7QUFHRCxNQUFNLGNBQWUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUVwQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBR3hCLE9BQU87UUFHUCxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7UUFHOUQsT0FBTztRQUdQLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDbEQsZUFBZSxFQUFFO2dCQUNmLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMscUJBQXFCLENBQUM7YUFDbEU7U0FDRixDQUFDLENBQUE7UUFDRixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUMvQyxRQUFRLEVBQUUsZUFBZTtZQUN6QixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUM7U0FDaEIsQ0FBQyxDQUFBO1FBQ0YsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUV0QyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQ2hDLElBQUksRUFDSixpQkFBaUIsRUFDakI7WUFDRSxjQUFjLEVBQUUsT0FBTztZQUN2QixhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1NBQ3pDLENBQ0YsQ0FBQTtRQUNELE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLFdBQVcsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7UUFHaEUsT0FBTztRQUdQLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDL0QsR0FBRyxFQUFFLEdBQUc7WUFDUixXQUFXLEVBQUUsa0JBQWtCO1NBQ2hDLENBQUMsQ0FBQztRQUNILGNBQWMsQ0FBQyw4QkFBOEIsRUFBRSxDQUFDO1FBR2hELE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDdEUsY0FBYyxFQUFFLEdBQUc7WUFDbkIsR0FBRyxFQUFFLEdBQUc7U0FDVCxDQUFDLENBQUM7UUFFSCxjQUFjLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUNuQyxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUMsT0FBTyxDQUFDO1lBQzVELFlBQVksRUFBRSxDQUFDLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3hDLENBQUMsQ0FBQztRQUVILDJGQUEyRjtRQUMzRixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUMzRCxXQUFXLEVBQUUsY0FBYztZQUMzQixPQUFPLEVBQUUsY0FBYztZQUN2QixjQUFjLEVBQUUsY0FBYztZQUM5QixVQUFVLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDakQsWUFBWSxFQUFFLENBQUM7WUFDZixjQUFjLEVBQUUsSUFBSTtTQUNyQixDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFDbEIsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQ2xCLGdCQUFnQixDQUNqQixDQUFDO0lBRUosQ0FBQztDQUdGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHsgU3RhY2ssIFN0YWNrUHJvcHMsIFN0YWdlLCBTdGFnZVByb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuLy8gaW1wb3J0IHsgQ29kZVBpcGVsaW5lLCBTaGVsbFN0ZXAsIENvZGVQaXBlbGluZVNvdXJjZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9waXBlbGluZXNcIjtcblxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG4vLyAvLyBpbXBvcnQgKiBhcyBjZGsgZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcbi8vIGltcG9ydCB7IENsdXN0ZXIsIEZhcmdhdGVUYXNrRGVmaW5pdGlvbiB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWNzXCI7XG4vLyBpbXBvcnQgeyBWcGMgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjMlwiO1xuXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSdcblxuaW1wb3J0ICogYXMgZWNyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3InXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgKiBhcyBwaXBlbGluZXMgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJ1xuXG5cbi8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YyL2RvY3MvYXdzLWNkay1saWIucGlwZWxpbmVzLXJlYWRtZS5odG1sXG5cbmV4cG9ydCBjbGFzcyBDZGtQaXBlbGluZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cblxuICAgIC8vIENESyBwaXBlbGluZSBcblxuXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICBzZWxmTXV0YXRpb246IHRydWUsXG4gICAgICBzeW50aDogbmV3IHBpcGVsaW5lcy5TaGVsbFN0ZXAoJ1N5bnRoJywge1xuICAgICAgICBpbnB1dDogcGlwZWxpbmVzLkNvZGVQaXBlbGluZVNvdXJjZS5jb25uZWN0aW9uKCdhZGFtLWdsaWdvci9jZGtfcGlwZWxpbmUnLCAnbWFzdGVyJywge1xuICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgY29ubmVjdGlvbiBtYW51YWxseSAhXG4gICAgICAgICAgY29ubmVjdGlvbkFybjogJ2Fybjphd3M6Y29kZXN0YXItY29ubmVjdGlvbnM6ZXUtY2VudHJhbC0xOjAwNzQwMTUzNzE5Mzpjb25uZWN0aW9uLzdjYjVmNTRlLTg4YWQtNDZiMi05OTJmLTMxNmIxYWJhOTljMScsIFxuICAgICAgICB9KSxcbiAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAnbnBtIGNpJyxcbiAgICAgICAgICAnbnBtIHJ1biBidWlsZCcsXG4gICAgICAgICAgJ25weCBjZGsgc3ludGgnLFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgfSk7ICAgIFxuICAgIHBpcGVsaW5lLmFkZFN0YWdlKFxuICAgICAgbmV3IGNkay5TdGFnZSh0aGlzLCAnVmVyc2lvbicsIHtcbiAgICAgICAgZW52OiBwcm9wcy5lbnYsXG4gICAgICB9KSxcbiAgICAgIHtcbiAgICAgICAgcG9zdDogW1xuICAgICAgICAgIG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdWZXJzaW9uJywge1xuICAgICAgICAgICAgY29tbWFuZHM6IFsnZWNobyAxLjAuMCA+IFZFUlNJT04nXSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgcGlwZWxpbmUuYWRkU3RhZ2UobmV3IE15QXBwbGljYXRpb24odGhpcywgJ1Byb2QnLCB7XG4gICAgICBlbnY6IHByb3BzLmVudixcbiAgICB9KSk7XG5cbiAgfVxufVxuXG5cbmNsYXNzIE15QXBwbGljYXRpb24gZXh0ZW5kcyBjZGsuU3RhZ2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFnZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBteVN0YWNrID0gbmV3IE15U2VydmljZVN0YWNrKHRoaXMsICdNeVNlcnZpY2UnKTtcbiAgfVxufVxuXG5cbmNsYXNzIE15U2VydmljZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cblxuICAgIC8vIFZQQyBcblxuXG4gICAgY29uc3QgdnBjID0gZWMyLlZwYy5mcm9tTG9va3VwKHRoaXMsIFwiVlBDXCIsIHtpc0RlZmF1bHQ6IHRydWV9KVxuXG5cbiAgICAvLyBFQ1IgXG5cblxuICAgIGNvbnN0IGdyb3VwID0gbmV3IGlhbS5Hcm91cCh0aGlzLCAnQWRtaW5pc3RyYXRvcnMnLCB7XG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBZG1pbmlzdHJhdG9yQWNjZXNzJylcbiAgICAgIF1cbiAgICB9KVxuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIodGhpcywgJ0FkbWluaXN0cmF0b3InLCB7XG4gICAgICB1c2VyTmFtZTogJ0FkbWluaXN0cmF0b3InLFxuICAgICAgZ3JvdXBzOiBbZ3JvdXBdXG4gICAgfSlcbiAgICBlY3IuQXV0aG9yaXphdGlvblRva2VuLmdyYW50UmVhZCh1c2VyKVxuXG4gICAgY29uc3QgZWNyUmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShcbiAgICAgIHRoaXMsXG4gICAgICAnUmVwb3NpdG9yeU15QXBwJyxcbiAgICAgIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdteWFwcCcsXG4gICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1lcbiAgICAgIH1cbiAgICApXG4gICAgZWNyUmVwby5hZGRMaWZlY3ljbGVSdWxlKHsgbWF4SW1hZ2VBZ2U6IGNkay5EdXJhdGlvbi5kYXlzKDMwKSB9KVxuXG5cbiAgICAvLyBFQ1MgXG5cblxuICAgIGNvbnN0IGZhcmdhdGVDbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHRoaXMsIFwiTXlGYXJnYXRlQ2x1c3RlclwiLCB7XG4gICAgICB2cGM6IHZwYyxcbiAgICAgIGNsdXN0ZXJOYW1lOiBcIk15RmFyZ2F0ZUNsdXN0ZXJcIixcbiAgICB9KTtcbiAgICBmYXJnYXRlQ2x1c3Rlci5lbmFibGVGYXJnYXRlQ2FwYWNpdHlQcm92aWRlcnMoKTtcblxuXG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbih0aGlzLCAnTXlBcHBUYXNrJywge1xuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIGNwdTogMjU2XG4gICAgfSk7XG5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoXCJteWFwcFwiLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21FY3JSZXBvc2l0b3J5KGVjclJlcG8sJzEuMC4wJyksXG4gICAgICBwb3J0TWFwcGluZ3M6IFt7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfV1cbiAgICB9KTtcblxuICAgIC8vIHhzZWU6IGh0dHBzOi8vYXdzLmFtYXpvbi5jb20vcHJlbWl1bXN1cHBvcnQva25vd2xlZGdlLWNlbnRlci9lY3MtdW5hYmxlLXRvLXB1bGwtc2VjcmV0cy9cbiAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5GYXJnYXRlU2VydmljZSh0aGlzLCAnTXlBcHBTZXJ2aWNlJywge1xuICAgICAgc2VydmljZU5hbWU6IFwiTXlBcHBTZXJ2aWNlXCIsXG4gICAgICBjbHVzdGVyOiBmYXJnYXRlQ2x1c3RlcixcbiAgICAgIHRhc2tEZWZpbml0aW9uOiB0YXNrRGVmaW5pdGlvbixcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDIH0sXG4gICAgICBkZXNpcmVkQ291bnQ6IDAsXG4gICAgICBhc3NpZ25QdWJsaWNJcDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgc2VydmljZS5jb25uZWN0aW9ucy5hbGxvd0Zyb20oXG4gICAgICBlYzIuUGVlci5hbnlJcHY0KCksXG4gICAgICBlYzIuUG9ydC50Y3AoODAwMCksXG4gICAgICBcInB1YmxpYyBhY2Nlc3NzXCIsXG4gICAgKTtcblxuICB9XG5cblxufSJdfQ==