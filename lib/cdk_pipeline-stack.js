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
        const githubInput = pipelines.CodePipelineSource.connection('adam-gligor/cdk_pipeline', 'master', {
            // create the connection manually !
            connectionArn: 'arn:aws:codestar-connections:eu-central-1:007401537193:connection/7cb5f54e-88ad-46b2-992f-316b1aba99c1',
        });
        const synthStep = new pipelines.ShellStep('Synth', {
            input: githubInput,
            commands: [
                'mkdir version && echo 1.0.0 > version/VERSION',
                'npm ci',
                'npm run build',
                'npx cdk synth',
            ],
        });
        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
            selfMutation: true,
            synth: synthStep,
        });
        pipeline.addStage(new MyApplication(this, 'Prod', {
            env: props.env,
        }), {
            pre: [
                new pipelines.ShellStep('Approve', {
                    input: synthStep.addOutputDirectory('version'),
                    commands: ['echo VERSION', 'cat version/VERSION'],
                }),
            ]
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzRUFBc0U7QUFDdEUsdUZBQXVGOzs7QUFHdkYsMkNBQTJDO0FBQzNDLHdFQUF3RTtBQUN4RSw2Q0FBNkM7QUFFN0MsbUNBQWtDO0FBQ2xDLDJDQUEwQztBQUUxQywyQ0FBMEM7QUFDMUMsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxtREFBa0Q7QUFHbEQsZ0ZBQWdGO0FBRWhGLE1BQWEsZ0JBQWlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4QixnQkFBZ0I7UUFFaEIsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQywwQkFBMEIsRUFBRSxRQUFRLEVBQUU7WUFDaEcsbUNBQW1DO1lBQ25DLGFBQWEsRUFBRSx3R0FBd0c7U0FDeEgsQ0FBQyxDQUFDO1FBR0gsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUNqRCxLQUFLLEVBQUUsV0FBVztZQUNsQixRQUFRLEVBQUU7Z0JBQ1IsK0NBQStDO2dCQUMvQyxRQUFRO2dCQUNSLGVBQWU7Z0JBQ2YsZUFBZTthQUNoQjtTQUNGLENBQUMsQ0FBQTtRQUdGLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzVELFlBQVksRUFBRSxJQUFJO1lBQ2xCLEtBQUssRUFBRSxTQUFTO1NBQ2pCLENBQUMsQ0FBQztRQUdILFFBQVEsQ0FBQyxRQUFRLENBQ2YsSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUM5QixHQUFHLEVB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QUFJLEVBQUUsY0FBYyxFQUFFO1lBQzNELFdBQVcsRUFBRSxjQUFjO1lBQzNCLE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLGNBQWMsRUFBRSxjQUFjO1lBQzlCLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNqRCxZQUFZLEVBQUUsQ0FBQztZQUNmLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUMzQixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUNsQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFDbEIsZ0JBQWdCLENBQ2pCLENBQUM7SUFFSixDQUFDO0NBR0YiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcywgU3RhZ2UsIFN0YWdlUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG4vLyBpbXBvcnQgeyBDb2RlUGlwZWxpbmUsIFNoZWxsU3RlcCwgQ29kZVBpcGVsaW5lU291cmNlIH0gZnJvbSBcImF3cy1jZGstbGliL3BpcGVsaW5lc1wiO1xuXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbi8vIC8vIGltcG9ydCAqIGFzIGNkayBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuLy8gaW1wb3J0IHsgQ2x1c3RlciwgRmFyZ2F0ZVRhc2tEZWZpbml0aW9uIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lY3NcIjtcbi8vIGltcG9ydCB7IFZwYyB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWMyXCI7XG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYidcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJ1xuXG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcidcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnXG5cblxuLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5waXBlbGluZXMtcmVhZG1lLmh0bWxcblxuZXhwb3J0IGNsYXNzIENka1BpcGVsaW5lU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuXG4gICAgLy8gQ0RLIHBpcGVsaW5lIFxuXG4gICAgY29uc3QgZ2l0aHViSW5wdXQgPSBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLmNvbm5lY3Rpb24oJ2FkYW0tZ2xpZ29yL2Nka19waXBlbGluZScsICdtYXN0ZXInLCB7XG4gICAgICAvLyBjcmVhdGUgdGhlIGNvbm5lY3Rpb24gbWFudWFsbHkgIVxuICAgICAgY29ubmVjdGlvbkFybjogJ2Fybjphd3M6Y29kZXN0YXItY29ubmVjdGlvbnM6ZXUtY2VudHJhbC0xOjAwNzQwMTUzNzE5Mzpjb25uZWN0aW9uLzdjYjVmNTRlLTg4YWQtNDZiMi05OTJmLTMxNmIxYWJhOTljMScsIFxuICAgIH0pO1xuXG5cbiAgICBjb25zdCBzeW50aFN0ZXAgPSBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XG4gICAgICBpbnB1dDogZ2l0aHViSW5wdXQsXG4gICAgICBjb21tYW5kczogW1xuICAgICAgICAnbWtkaXIgdmVyc2lvbiAmJiBlY2hvIDEuMC4wID4gdmVyc2lvbi9WRVJTSU9OJyxcbiAgICAgICAgJ25wbSBjaScsXG4gICAgICAgICducG0gcnVuIGJ1aWxkJyxcbiAgICAgICAgJ25weCBjZGsgc3ludGgnLFxuICAgICAgXSxcbiAgICB9KVxuXG5cbiAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsICdQaXBlbGluZScsIHtcbiAgICAgIHNlbGZNdXRhdGlvbjogdHJ1ZSxcbiAgICAgIHN5bnRoOiBzeW50aFN0ZXAsXG4gICAgfSk7ICAgIFxuXG5cbiAgICBwaXBlbGluZS5hZGRTdGFnZShcbiAgICAgIG5ldyBNeUFwcGxpY2F0aW9uKHRoaXMsICdQcm9kJywge1xuICAgICAgICBlbnY6IHByb3BzLmVudixcbiAgICAgIH0pLFxuICAgICAge1xuICAgICAgICBwcmU6W1xuICAgICAgICAgIG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdBcHByb3ZlJywge1xuICAgICAgICAgICAgaW5wdXQ6IHN5bnRoU3RlcC5hZGRPdXRwdXREaXJlY3RvcnkoJ3ZlcnNpb24nKSxcbiAgICAgICAgICAgIGNvbW1hbmRzOiBbJ2VjaG8gVkVSU0lPTicsJ2NhdCB2ZXJzaW9uL1ZFUlNJT04nXSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXVxuICAgICAgfVxuICAgICk7XG5cbiAgfVxufVxuXG5cbmNsYXNzIE15QXBwbGljYXRpb24gZXh0ZW5kcyBjZGsuU3RhZ2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFnZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBteVN0YWNrID0gbmV3IE15U2VydmljZVN0YWNrKHRoaXMsICdNeVNlcnZpY2UnKTtcbiAgfVxufVxuXG5cbmNsYXNzIE15U2VydmljZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cblxuICAgIC8vIFZQQyBcblxuXG4gICAgY29uc3QgdnBjID0gZWMyLlZwYy5mcm9tTG9va3VwKHRoaXMsIFwiVlBDXCIsIHtpc0RlZmF1bHQ6IHRydWV9KVxuXG5cbiAgICAvLyBFQ1IgXG5cblxuICAgIGNvbnN0IGdyb3VwID0gbmV3IGlhbS5Hcm91cCh0aGlzLCAnQWRtaW5pc3RyYXRvcnMnLCB7XG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBZG1pbmlzdHJhdG9yQWNjZXNzJylcbiAgICAgIF1cbiAgICB9KVxuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIodGhpcywgJ0FkbWluaXN0cmF0b3InLCB7XG4gICAgICB1c2VyTmFtZTogJ0FkbWluaXN0cmF0b3InLFxuICAgICAgZ3JvdXBzOiBbZ3JvdXBdXG4gICAgfSlcbiAgICBlY3IuQXV0aG9yaXphdGlvblRva2VuLmdyYW50UmVhZCh1c2VyKVxuXG4gICAgY29uc3QgZWNyUmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShcbiAgICAgIHRoaXMsXG4gICAgICAnUmVwb3NpdG9yeU15QXBwJyxcbiAgICAgIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdteWFwcCcsXG4gICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1lcbiAgICAgIH1cbiAgICApXG4gICAgZWNyUmVwby5hZGRMaWZlY3ljbGVSdWxlKHsgbWF4SW1hZ2VBZ2U6IGNkay5EdXJhdGlvbi5kYXlzKDMwKSB9KVxuXG5cbiAgICAvLyBFQ1MgXG5cblxuICAgIGNvbnN0IGZhcmdhdGVDbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHRoaXMsIFwiTXlGYXJnYXRlQ2x1c3RlclwiLCB7XG4gICAgICB2cGM6IHZwYyxcbiAgICAgIGNsdXN0ZXJOYW1lOiBcIk15RmFyZ2F0ZUNsdXN0ZXJcIixcbiAgICB9KTtcbiAgICBmYXJnYXRlQ2x1c3Rlci5lbmFibGVGYXJnYXRlQ2FwYWNpdHlQcm92aWRlcnMoKTtcblxuXG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbih0aGlzLCAnTXlBcHBUYXNrJywge1xuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIGNwdTogMjU2XG4gICAgfSk7XG5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoXCJteWFwcFwiLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21FY3JSZXBvc2l0b3J5KGVjclJlcG8sJzEuMC4wJyksXG4gICAgICBwb3J0TWFwcGluZ3M6IFt7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfV1cbiAgICB9KTtcblxuICAgIC8vIHhzZWU6IGh0dHBzOi8vYXdzLmFtYXpvbi5jb20vcHJlbWl1bXN1cHBvcnQva25vd2xlZGdlLWNlbnRlci9lY3MtdW5hYmxlLXRvLXB1bGwtc2VjcmV0cy9cbiAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5GYXJnYXRlU2VydmljZSh0aGlzLCAnTXlBcHBTZXJ2aWNlJywge1xuICAgICAgc2VydmljZU5hbWU6IFwiTXlBcHBTZXJ2aWNlXCIsXG4gICAgICBjbHVzdGVyOiBmYXJnYXRlQ2x1c3RlcixcbiAgICAgIHRhc2tEZWZpbml0aW9uOiB0YXNrRGVmaW5pdGlvbixcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDIH0sXG4gICAgICBkZXNpcmVkQ291bnQ6IDAsXG4gICAgICBhc3NpZ25QdWJsaWNJcDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgc2VydmljZS5jb25uZWN0aW9ucy5hbGxvd0Zyb20oXG4gICAgICBlYzIuUGVlci5hbnlJcHY0KCksXG4gICAgICBlYzIuUG9ydC50Y3AoODAwMCksXG4gICAgICBcInB1YmxpYyBhY2Nlc3NzXCIsXG4gICAgKTtcblxuICB9XG5cblxufSJdfQ==