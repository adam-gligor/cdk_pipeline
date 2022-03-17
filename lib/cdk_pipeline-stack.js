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
                //'mkdir version && echo 1.0.0 > version/VERSION',
                //'ls',
                "GIT_TAG=$(git tag --points-at $CODEBUILD_RESOLVED_SOURCE_VERSION)",
                `if [ -n "$GIT_TAG" ]; then export VERSION=$GIT_TAG; else export VERSION="latest"; fi`,
                'npm ci',
                'npm run build',
                'npx cdk synth',
            ],
        });
        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
            selfMutation: true,
            synth: synthStep,
        });
        pipeline.addStage(new MyApplication(this, 'Deploy', {
            env: props.env,
        }), {
        // pre:[
        //   new pipelines.ShellStep('Version', {
        //     input: synthStep.addOutputDirectory('version'),
        //     commands: ['cat VERSION'],
        //   }),
        // ]
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
        console.log(`VERSION ${process.env.VERSION}`);
        taskDefinition.addContainer("myapp", {
            image: ecs.ContainerImage.fromEcrRepository(ecrRepo, process.env.VERSION),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzRUFBc0U7QUFDdEUsdUZBQXVGOzs7QUFHdkYsMkNBQTJDO0FBQzNDLHdFQUF3RTtBQUN4RSw2Q0FBNkM7QUFFN0MsbUNBQWtDO0FBQ2xDLDJDQUEwQztBQUUxQywyQ0FBMEM7QUFDMUMsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxtREFBa0Q7QUFHbEQsZ0ZBQWdGO0FBRWhGLE1BQWEsZ0JBQWlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4QixnQkFBZ0I7UUFFaEIsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQywwQkFBMEIsRUFBRSxRQUFRLEVBQUU7WUFDaEcsbUNBQW1DO1lBQ25DLGFBQWEsRUFBRSx3R0FBd0c7U0FDeEgsQ0FBQyxDQUFDO1FBR0gsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUNqRCxLQUFLLEVBQUUsV0FBVztZQUNsQixRQUFRLEVBQUU7Z0JBQ1Isa0RBQWtEO2dCQUNsRCxPQUFPO2dCQUNQLG1FQUFtRTtnQkFDbkUsc0ZBQXNGO2dCQUN0RixRQUFRO2dCQUNSLGVBQWU7Z0JBQ2YsZUFBZTthQUNoQjtTQUNGLENBQUMsQ0FBQTtRQUdGLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzVELFlBQVksRUFBRSxJQUFJO1lBQ2xCLEtBQUssRUFBRSxTQUFTO1NBQ2pCLENBQUMsQ0FBQztRQUdILFFBQVEsQ0FBQyxRQUFRLENBQ2YsSUFBSSxhQUFh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TyxHQUFHLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzNELFdBQVcsRUFBRSxjQUFjO1lBQzNCLE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLGNBQWMsRUFBRSxjQUFjO1lBQzlCLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNqRCxZQUFZLEVBQUUsQ0FBQztZQUNmLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUMzQixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUNsQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFDbEIsZ0JBQWdCLENBQ2pCLENBQUM7SUFFSixDQUFDO0NBR0YiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcywgU3RhZ2UsIFN0YWdlUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG4vLyBpbXBvcnQgeyBDb2RlUGlwZWxpbmUsIFNoZWxsU3RlcCwgQ29kZVBpcGVsaW5lU291cmNlIH0gZnJvbSBcImF3cy1jZGstbGliL3BpcGVsaW5lc1wiO1xuXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbi8vIC8vIGltcG9ydCAqIGFzIGNkayBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuLy8gaW1wb3J0IHsgQ2x1c3RlciwgRmFyZ2F0ZVRhc2tEZWZpbml0aW9uIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lY3NcIjtcbi8vIGltcG9ydCB7IFZwYyB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWMyXCI7XG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYidcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJ1xuXG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcidcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnXG5cblxuLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5waXBlbGluZXMtcmVhZG1lLmh0bWxcblxuZXhwb3J0IGNsYXNzIENka1BpcGVsaW5lU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuXG4gICAgLy8gQ0RLIHBpcGVsaW5lIFxuXG4gICAgY29uc3QgZ2l0aHViSW5wdXQgPSBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLmNvbm5lY3Rpb24oJ2FkYW0tZ2xpZ29yL2Nka19waXBlbGluZScsICdtYXN0ZXInLCB7XG4gICAgICAvLyBjcmVhdGUgdGhlIGNvbm5lY3Rpb24gbWFudWFsbHkgIVxuICAgICAgY29ubmVjdGlvbkFybjogJ2Fybjphd3M6Y29kZXN0YXItY29ubmVjdGlvbnM6ZXUtY2VudHJhbC0xOjAwNzQwMTUzNzE5Mzpjb25uZWN0aW9uLzdjYjVmNTRlLTg4YWQtNDZiMi05OTJmLTMxNmIxYWJhOTljMScsIFxuICAgIH0pO1xuXG5cbiAgICBjb25zdCBzeW50aFN0ZXAgPSBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XG4gICAgICBpbnB1dDogZ2l0aHViSW5wdXQsXG4gICAgICBjb21tYW5kczogW1xuICAgICAgICAvLydta2RpciB2ZXJzaW9uICYmIGVjaG8gMS4wLjAgPiB2ZXJzaW9uL1ZFUlNJT04nLFxuICAgICAgICAvLydscycsXG4gICAgICAgIFwiR0lUX1RBRz0kKGdpdCB0YWcgLS1wb2ludHMtYXQgJENPREVCVUlMRF9SRVNPTFZFRF9TT1VSQ0VfVkVSU0lPTilcIixcbiAgICAgICAgYGlmIFsgLW4gXCIkR0lUX1RBR1wiIF07IHRoZW4gZXhwb3J0IFZFUlNJT049JEdJVF9UQUc7IGVsc2UgZXhwb3J0IFZFUlNJT049XCJsYXRlc3RcIjsgZmlgLFxuICAgICAgICAnbnBtIGNpJyxcbiAgICAgICAgJ25wbSBydW4gYnVpbGQnLFxuICAgICAgICAnbnB4IGNkayBzeW50aCcsXG4gICAgICBdLFxuICAgIH0pXG5cblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmUodGhpcywgJ1BpcGVsaW5lJywge1xuICAgICAgc2VsZk11dGF0aW9uOiB0cnVlLFxuICAgICAgc3ludGg6IHN5bnRoU3RlcCxcbiAgICB9KTsgICAgXG5cblxuICAgIHBpcGVsaW5lLmFkZFN0YWdlKFxuICAgICAgbmV3IE15QXBwbGljYXRpb24odGhpcywgJ0RlcGxveScsIHtcbiAgICAgICAgZW52OiBwcm9wcy5lbnYsXG4gICAgICB9KSxcbiAgICAgIHtcbiAgICAgICAgLy8gcHJlOltcbiAgICAgICAgLy8gICBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnVmVyc2lvbicsIHtcbiAgICAgICAgLy8gICAgIGlucHV0OiBzeW50aFN0ZXAuYWRkT3V0cHV0RGlyZWN0b3J5KCd2ZXJzaW9uJyksXG4gICAgICAgIC8vICAgICBjb21tYW5kczogWydjYXQgVkVSU0lPTiddLFxuICAgICAgICAvLyAgIH0pLFxuICAgICAgICAvLyBdXG4gICAgICB9XG4gICAgKTtcblxuICB9XG59XG5cblxuY2xhc3MgTXlBcHBsaWNhdGlvbiBleHRlbmRzIGNkay5TdGFnZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWdlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IG15U3RhY2sgPSBuZXcgTXlTZXJ2aWNlU3RhY2sodGhpcywgJ015U2VydmljZScpO1xuICB9XG59XG5cblxuY2xhc3MgTXlTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuXG4gICAgLy8gVlBDIFxuXG5cbiAgICBjb25zdCB2cGMgPSBlYzIuVnBjLmZyb21Mb29rdXAodGhpcywgXCJWUENcIiwge2lzRGVmYXVsdDogdHJ1ZX0pXG5cblxuICAgIC8vIEVDUiBcblxuXG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgaWFtLkdyb3VwKHRoaXMsICdBZG1pbmlzdHJhdG9ycycsIHtcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW1xuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FkbWluaXN0cmF0b3JBY2Nlc3MnKVxuICAgICAgXVxuICAgIH0pXG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcih0aGlzLCAnQWRtaW5pc3RyYXRvcicsIHtcbiAgICAgIHVzZXJOYW1lOiAnQWRtaW5pc3RyYXRvcicsXG4gICAgICBncm91cHM6IFtncm91cF1cbiAgICB9KVxuICAgIGVjci5BdXRob3JpemF0aW9uVG9rZW4uZ3JhbnRSZWFkKHVzZXIpXG5cbiAgICBjb25zdCBlY3JSZXBvID0gbmV3IGVjci5SZXBvc2l0b3J5KFxuICAgICAgdGhpcyxcbiAgICAgICdSZXBvc2l0b3J5TXlBcHAnLFxuICAgICAge1xuICAgICAgICByZXBvc2l0b3J5TmFtZTogJ215YXBwJyxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWVxuICAgICAgfVxuICAgIClcbiAgICBlY3JSZXBvLmFkZExpZmVjeWNsZVJ1bGUoeyBtYXhJbWFnZUFnZTogY2RrLkR1cmF0aW9uLmRheXMoMzApIH0pXG5cblxuICAgIC8vIEVDUyBcblxuXG4gICAgY29uc3QgZmFyZ2F0ZUNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgXCJNeUZhcmdhdGVDbHVzdGVyXCIsIHtcbiAgICAgIHZwYzogdnBjLFxuICAgICAgY2x1c3Rlck5hbWU6IFwiTXlGYXJnYXRlQ2x1c3RlclwiLFxuICAgIH0pO1xuICAgIGZhcmdhdGVDbHVzdGVyLmVuYWJsZUZhcmdhdGVDYXBhY2l0eVByb3ZpZGVycygpO1xuXG5cbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHRoaXMsICdNeUFwcFRhc2snLCB7XG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgY3B1OiAyNTZcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKGBWRVJTSU9OICR7cHJvY2Vzcy5lbnYuVkVSU0lPTn1gKVxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcihcIm15YXBwXCIsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbUVjclJlcG9zaXRvcnkoZWNyUmVwbyxwcm9jZXNzLmVudi5WRVJTSU9OKSxcbiAgICAgIHBvcnRNYXBwaW5nczogW3sgY29udGFpbmVyUG9ydDogODAwMCB9XVxuICAgIH0pO1xuXG4gICAgLy8geHNlZTogaHR0cHM6Ly9hd3MuYW1hem9uLmNvbS9wcmVtaXVtc3VwcG9ydC9rbm93bGVkZ2UtY2VudGVyL2Vjcy11bmFibGUtdG8tcHVsbC1zZWNyZXRzL1xuICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHRoaXMsICdNeUFwcFNlcnZpY2UnLCB7XG4gICAgICBzZXJ2aWNlTmFtZTogXCJNeUFwcFNlcnZpY2VcIixcbiAgICAgIGNsdXN0ZXI6IGZhcmdhdGVDbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb246IHRhc2tEZWZpbml0aW9uLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfSxcbiAgICAgIGRlc2lyZWRDb3VudDogMCxcbiAgICAgIGFzc2lnblB1YmxpY0lwOiB0cnVlXG4gICAgfSk7XG5cbiAgICBzZXJ2aWNlLmNvbm5lY3Rpb25zLmFsbG93RnJvbShcbiAgICAgIGVjMi5QZWVyLmFueUlwdjQoKSxcbiAgICAgIGVjMi5Qb3J0LnRjcCg4MDAwKSxcbiAgICAgIFwicHVibGljIGFjY2Vzc3NcIixcbiAgICApO1xuXG4gIH1cblxuXG59Il19