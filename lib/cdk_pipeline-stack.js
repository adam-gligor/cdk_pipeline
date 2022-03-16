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
        pipeline.addStage(new MyApplication(this, 'Prod', {
            env: props.env,
        }));
    }
}
exports.CdkPipelineStack = CdkPipelineStack;
class MyApplication extends cdk.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        const dbStack = new MyServiceStack(this, 'MyService');
    }
}
class MyServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        return;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzRUFBc0U7QUFDdEUsdUZBQXVGOzs7QUFHdkYsMkNBQTJDO0FBQzNDLHdFQUF3RTtBQUN4RSw2Q0FBNkM7QUFFN0MsbUNBQWtDO0FBQ2xDLDJDQUEwQztBQUUxQywyQ0FBMEM7QUFDMUMsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxtREFBa0Q7QUFHbEQsZ0ZBQWdGO0FBRWhGLE1BQWEsZ0JBQWlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4QixnQkFBZ0I7UUFHaEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDNUQsWUFBWSxFQUFFLElBQUk7WUFDbEIsS0FBSyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3RDLEtBQUssRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLDBCQUEwQixFQUFFLFFBQVEsRUFBRTtvQkFDbkYsbUNBQW1DO29CQUNuQyxhQUFhLEVBQUUsd0dBQXdHO2lCQUN4SCxDQUFDO2dCQUNGLFFBQVEsRUFBRTtvQkFDUixRQUFRO29CQUNSLGVBQWU7b0JBQ2YsZUFBZTtpQkFDaEI7YUFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ2hELEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztTQUNmLENBQUMsQ0FBQyxDQUFDO0lBRU4sQ0FBQztDQUNGO0FBM0JELDRDQTJCQztBQUdE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QjtRQUN4QixRQUFRO1FBQ1IsS0FBSztJQUVQLENBQUM7Q0FHRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzLCBTdGFnZSwgU3RhZ2VQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbi8vIGltcG9ydCB7IENvZGVQaXBlbGluZSwgU2hlbGxTdGVwLCBDb2RlUGlwZWxpbmVTb3VyY2UgfSBmcm9tIFwiYXdzLWNkay1saWIvcGlwZWxpbmVzXCI7XG5cbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuLy8gLy8gaW1wb3J0ICogYXMgY2RrIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG4vLyBpbXBvcnQgeyBDbHVzdGVyLCBGYXJnYXRlVGFza0RlZmluaXRpb24gfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjc1wiO1xuLy8gaW1wb3J0IHsgVnBjIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lYzJcIjtcblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJ1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nXG5cbmltcG9ydCAqIGFzIGVjciBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNyJ1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgcGlwZWxpbmVzIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcydcblxuXG4vLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92Mi9kb2NzL2F3cy1jZGstbGliLnBpcGVsaW5lcy1yZWFkbWUuaHRtbFxuXG5leHBvcnQgY2xhc3MgQ2RrUGlwZWxpbmVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG5cbiAgICAvLyBDREsgcGlwZWxpbmUgXG5cblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmUodGhpcywgJ1BpcGVsaW5lJywge1xuICAgICAgc2VsZk11dGF0aW9uOiB0cnVlLFxuICAgICAgc3ludGg6IG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdTeW50aCcsIHtcbiAgICAgICAgaW5wdXQ6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmVTb3VyY2UuY29ubmVjdGlvbignYWRhbS1nbGlnb3IvY2RrX3BpcGVsaW5lJywgJ21hc3RlcicsIHtcbiAgICAgICAgICAvLyBjcmVhdGUgdGhlIGNvbm5lY3Rpb24gbWFudWFsbHkgIVxuICAgICAgICAgIGNvbm5lY3Rpb25Bcm46ICdhcm46YXdzOmNvZGVzdGFyLWNvbm5lY3Rpb25zOmV1LWNlbnRyYWwtMTowMDc0MDE1MzcxOTM6Y29ubmVjdGlvbi83Y2I1ZjU0ZS04OGFkLTQ2YjItOTkyZi0zMTZiMWFiYTk5YzEnLCBcbiAgICAgICAgfSksXG4gICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgJ25wbSBjaScsXG4gICAgICAgICAgJ25wbSBydW4gYnVpbGQnLFxuICAgICAgICAgICducHggY2RrIHN5bnRoJyxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIH0pOyAgICBcbiAgICBwaXBlbGluZS5hZGRTdGFnZShuZXcgTXlBcHBsaWNhdGlvbih0aGlzLCAnUHJvZCcsIHtcbiAgICAgIGVudjogcHJvcHMuZW52LFxuICAgIH0pKTtcblxuICB9XG59XG5cblxuY2xhc3MgTXlBcHBsaWNhdGlvbiBleHRlbmRzIGNkay5TdGFnZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWdlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGRiU3RhY2sgPSBuZXcgTXlTZXJ2aWNlU3RhY2sodGhpcywgJ015U2VydmljZScpO1xuICB9XG59XG5cblxuY2xhc3MgTXlTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIHJldHVyblxuICAgIC8vIFZQQyBcblxuXG4gICAgY29uc3QgdnBjID0gZWMyLlZwYy5mcm9tTG9va3VwKHRoaXMsIFwiVlBDXCIsIHtpc0RlZmF1bHQ6IHRydWV9KVxuXG5cbiAgICAvLyBFQ1IgXG5cblxuICAgIGNvbnN0IGdyb3VwID0gbmV3IGlhbS5Hcm91cCh0aGlzLCAnQWRtaW5pc3RyYXRvcnMnLCB7XG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBZG1pbmlzdHJhdG9yQWNjZXNzJylcbiAgICAgIF1cbiAgICB9KVxuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIodGhpcywgJ0FkbWluaXN0cmF0b3InLCB7XG4gICAgICB1c2VyTmFtZTogJ0FkbWluaXN0cmF0b3InLFxuICAgICAgZ3JvdXBzOiBbZ3JvdXBdXG4gICAgfSlcbiAgICBlY3IuQXV0aG9yaXphdGlvblRva2VuLmdyYW50UmVhZCh1c2VyKVxuXG4gICAgY29uc3QgZWNyUmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShcbiAgICAgIHRoaXMsXG4gICAgICAnUmVwb3NpdG9yeU15QXBwJyxcbiAgICAgIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdteWFwcCcsXG4gICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1lcbiAgICAgIH1cbiAgICApXG4gICAgZWNyUmVwby5hZGRMaWZlY3ljbGVSdWxlKHsgbWF4SW1hZ2VBZ2U6IGNkay5EdXJhdGlvbi5kYXlzKDMwKSB9KVxuXG5cbiAgICAvLyBFQ1MgXG5cblxuICAgIGNvbnN0IGZhcmdhdGVDbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHRoaXMsIFwiTXlGYXJnYXRlQ2x1c3RlclwiLCB7XG4gICAgICB2cGM6IHZwYyxcbiAgICAgIGNsdXN0ZXJOYW1lOiBcIk15RmFyZ2F0ZUNsdXN0ZXJcIixcbiAgICB9KTtcbiAgICBmYXJnYXRlQ2x1c3Rlci5lbmFibGVGYXJnYXRlQ2FwYWNpdHlQcm92aWRlcnMoKTtcblxuXG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbih0aGlzLCAnTXlBcHBUYXNrJywge1xuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIGNwdTogMjU2XG4gICAgfSk7XG5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoXCJteWFwcFwiLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21FY3JSZXBvc2l0b3J5KGVjclJlcG8sJzEuMC4wJyksXG4gICAgICBwb3J0TWFwcGluZ3M6IFt7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfV1cbiAgICB9KTtcblxuICAgIC8vIHNlZTogaHR0cHM6Ly9hd3MuYW1hem9uLmNvbS9wcmVtaXVtc3VwcG9ydC9rbm93bGVkZ2UtY2VudGVyL2Vjcy11bmFibGUtdG8tcHVsbC1zZWNyZXRzL1xuICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHRoaXMsICdNeUFwcFNlcnZpY2UnLCB7XG4gICAgICBzZXJ2aWNlTmFtZTogXCJNeUFwcFNlcnZpY2VcIixcbiAgICAgIGNsdXN0ZXI6IGZhcmdhdGVDbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb246IHRhc2tEZWZpbml0aW9uLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfSxcbiAgICAgIGRlc2lyZWRDb3VudDogMCxcbiAgICAgIGFzc2lnblB1YmxpY0lwOiB0cnVlXG4gICAgfSk7XG5cbiAgICAvLyBzZXJ2aWNlLmNvbm5lY3Rpb25zLmFsbG93RnJvbShcbiAgICAvLyAgIGVjMi5QZWVyLmFueUlwdjQoKSxcbiAgICAvLyAgIGVjMi5Qb3J0LnRjcCg4MDAwKSxcbiAgICAvLyAgIFwiXCIsXG4gICAgLy8gKTtcblxuICB9XG5cblxufSJdfQ==