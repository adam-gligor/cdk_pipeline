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
        const taskDefinition = new ecs.FargateTaskDefinition(this, 'MyAppTask', {
            memoryLimitMiB: 512,
            cpu: 256
        });
        taskDefinition.addContainer("myapp", {
            image: ecs.ContainerImage.fromEcrRepository(ecrRepo, '1.0.0'),
            portMappings: [{ containerPort: 8000 }]
        });
        const service = new ecs.FargateService(this, 'MyAppService', {
            serviceName: "MyAppService",
            cluster: fargateCluster,
            taskDefinition: taskDefinition,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            desiredCount: 1
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzRUFBc0U7QUFDdEUsdUZBQXVGOzs7QUFHdkYsMkNBQTJDO0FBQzNDLHdFQUF3RTtBQUN4RSw2Q0FBNkM7QUFFN0MsbUNBQWtDO0FBQ2xDLDJDQUEwQztBQUUxQywyQ0FBMEM7QUFDMUMsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxtREFBa0Q7QUFJbEQsZ0ZBQWdGO0FBRWhGLE1BQWEsZ0JBQWlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4QixnQkFBZ0I7UUFHaEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDNUQsWUFBWSxFQUFFLElBQUk7WUFDbEIsS0FBSyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3RDLEtBQUssRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLDBCQUEwQixFQUFFLFFBQVEsRUFBRTtvQkFDbkYsbUNBQW1DO29CQUNuQyxhQUFhLEVBQUUsd0dBQXdHO2lCQUN4SCxDQUFDO2dCQUNGLFFBQVEsRUFBRTtvQkFDUixRQUFRO29CQUNSLGVBQWU7b0JBQ2YsZUFBZTtpQkFDaEI7YUFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ2hELEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztTQUNmLENBQUMsQ0FBQyxDQUFDO0lBRU4sQ0FBQztDQUNGO0FBM0JELDRDQTJCQztBQUdELE1BQU0sYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3hELENBQUM7Q0FDRjtBQUVELE1BQU0sY0FBZSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBRXBDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFHeEIsT0FBTztRQUdQLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtRQUc5RCxPQUFPO1FBR1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUNsRCxlQUFlLEVBQUU7Z0JBQ2YsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxxQkFBcUIsQ0FBQzthQUNsRTtTQUNGLENBQUMsQ0FBQTtRQUNGLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQy9DLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQztTQUNoQixDQUFDLENBQUE7UUFDRixHQUFHLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRXRDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FDaEMsSUFBSSxFQUNKLGlCQUFpQixFQUNqQjtZQUNFLGNBQWMsRUFBRSxPQUFPO1lBQ3ZCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87U0FDekMsQ0FDRixDQUFBO1FBQ0QsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsV0FBVyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUdoRSxPQUFPO1FBR1AsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUMvRCxHQUFHLEVBQUUsR0FBRztZQUNSLFdBQVcsRUFBRSxrQkFBa0I7U0FDaEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUN0RSxjQUFjLEVBQUUsR0FBRztZQUNuQixHQUFHLEVBQUUsR0FBRztTQUNULENBQUMsQ0FBQztRQUVILGNBQWMsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFO1lBQ25DLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBQyxPQUFPLENBQUM7WUFDNUQsWUFBWSxFQUFFLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUM7U0FDeEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDM0QsV0FBVyxFQUFFLGNBQWM7WUFDM0IsT0FBTyxFQUFFLGNBQWM7WUFDdkIsY0FBYyxFQUFFLGNBQWM7WUFDOUIsVUFBVSxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO1lBQ2pELFlBQVksRUFBRSxDQUFDO1NBQ2hCLENBQUMsQ0FBQztJQUVMLENBQUM7Q0FHRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzLCBTdGFnZSwgU3RhZ2VQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbi8vIGltcG9ydCB7IENvZGVQaXBlbGluZSwgU2hlbGxTdGVwLCBDb2RlUGlwZWxpbmVTb3VyY2UgfSBmcm9tIFwiYXdzLWNkay1saWIvcGlwZWxpbmVzXCI7XG5cbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuLy8gLy8gaW1wb3J0ICogYXMgY2RrIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG4vLyBpbXBvcnQgeyBDbHVzdGVyLCBGYXJnYXRlVGFza0RlZmluaXRpb24gfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjc1wiO1xuLy8gaW1wb3J0IHsgVnBjIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lYzJcIjtcblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJ1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nXG5cbmltcG9ydCAqIGFzIGVjciBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNyJ1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuaW1wb3J0ICogYXMgcGlwZWxpbmVzIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcydcblxuXG5cbi8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YyL2RvY3MvYXdzLWNkay1saWIucGlwZWxpbmVzLXJlYWRtZS5odG1sXG5cbmV4cG9ydCBjbGFzcyBDZGtQaXBlbGluZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cblxuICAgIC8vIENESyBwaXBlbGluZSBcblxuXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICBzZWxmTXV0YXRpb246IHRydWUsXG4gICAgICBzeW50aDogbmV3IHBpcGVsaW5lcy5TaGVsbFN0ZXAoJ1N5bnRoJywge1xuICAgICAgICBpbnB1dDogcGlwZWxpbmVzLkNvZGVQaXBlbGluZVNvdXJjZS5jb25uZWN0aW9uKCdhZGFtLWdsaWdvci9jZGtfcGlwZWxpbmUnLCAnbWFzdGVyJywge1xuICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgY29ubmVjdGlvbiBtYW51YWxseSAhXG4gICAgICAgICAgY29ubmVjdGlvbkFybjogJ2Fybjphd3M6Y29kZXN0YXItY29ubmVjdGlvbnM6ZXUtY2VudHJhbC0xOjAwNzQwMTUzNzE5Mzpjb25uZWN0aW9uLzdjYjVmNTRlLTg4YWQtNDZiMi05OTJmLTMxNmIxYWJhOTljMScsIFxuICAgICAgICB9KSxcbiAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAnbnBtIGNpJyxcbiAgICAgICAgICAnbnBtIHJ1biBidWlsZCcsXG4gICAgICAgICAgJ25weCBjZGsgc3ludGgnLFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgfSk7ICAgIFxuICAgIHBpcGVsaW5lLmFkZFN0YWdlKG5ldyBNeUFwcGxpY2F0aW9uKHRoaXMsICdQcm9kJywge1xuICAgICAgZW52OiBwcm9wcy5lbnYsXG4gICAgfSkpO1xuXG4gIH1cbn1cblxuXG5jbGFzcyBNeUFwcGxpY2F0aW9uIGV4dGVuZHMgY2RrLlN0YWdlIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhZ2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgZGJTdGFjayA9IG5ldyBNeVNlcnZpY2VTdGFjayh0aGlzLCAnTXlTZXJ2aWNlJyk7XG4gIH1cbn1cblxuY2xhc3MgTXlTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuXG4gICAgLy8gVlBDIFxuXG5cbiAgICBjb25zdCB2cGMgPSBlYzIuVnBjLmZyb21Mb29rdXAodGhpcywgXCJWUENcIiwge2lzRGVmYXVsdDogdHJ1ZX0pXG5cblxuICAgIC8vIEVDUiBcblxuXG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgaWFtLkdyb3VwKHRoaXMsICdBZG1pbmlzdHJhdG9ycycsIHtcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW1xuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FkbWluaXN0cmF0b3JBY2Nlc3MnKVxuICAgICAgXVxuICAgIH0pXG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcih0aGlzLCAnQWRtaW5pc3RyYXRvcicsIHtcbiAgICAgIHVzZXJOYW1lOiAnQWRtaW5pc3RyYXRvcicsXG4gICAgICBncm91cHM6IFtncm91cF1cbiAgICB9KVxuICAgIGVjci5BdXRob3JpemF0aW9uVG9rZW4uZ3JhbnRSZWFkKHVzZXIpXG5cbiAgICBjb25zdCBlY3JSZXBvID0gbmV3IGVjci5SZXBvc2l0b3J5KFxuICAgICAgdGhpcyxcbiAgICAgICdSZXBvc2l0b3J5TXlBcHAnLFxuICAgICAge1xuICAgICAgICByZXBvc2l0b3J5TmFtZTogJ215YXBwJyxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWVxuICAgICAgfVxuICAgIClcbiAgICBlY3JSZXBvLmFkZExpZmVjeWNsZVJ1bGUoeyBtYXhJbWFnZUFnZTogY2RrLkR1cmF0aW9uLmRheXMoMzApIH0pXG5cblxuICAgIC8vIEVDUyBcblxuXG4gICAgY29uc3QgZmFyZ2F0ZUNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgXCJNeUZhcmdhdGVDbHVzdGVyXCIsIHtcbiAgICAgIHZwYzogdnBjLFxuICAgICAgY2x1c3Rlck5hbWU6IFwiTXlGYXJnYXRlQ2x1c3RlclwiLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbih0aGlzLCAnTXlBcHBUYXNrJywge1xuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIGNwdTogMjU2XG4gICAgfSk7XG5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoXCJteWFwcFwiLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21FY3JSZXBvc2l0b3J5KGVjclJlcG8sJzEuMC4wJyksXG4gICAgICBwb3J0TWFwcGluZ3M6IFt7IGNvbnRhaW5lclBvcnQ6IDgwMDAgfV1cbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHRoaXMsICdNeUFwcFNlcnZpY2UnLCB7XG4gICAgICBzZXJ2aWNlTmFtZTogXCJNeUFwcFNlcnZpY2VcIixcbiAgICAgIGNsdXN0ZXI6IGZhcmdhdGVDbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb246IHRhc2tEZWZpbml0aW9uLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfSxcbiAgICAgIGRlc2lyZWRDb3VudDogMVxuICAgIH0pO1xuXG4gIH1cblxuXG59Il19