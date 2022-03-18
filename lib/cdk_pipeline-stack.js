"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkPipelineStack = void 0;
const cdk = require("aws-cdk-lib");
const iam = require("aws-cdk-lib/aws-iam");
const ecr = require("aws-cdk-lib/aws-ecr");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const pipelines = require("aws-cdk-lib/pipelines");
class CdkPipelineStack extends cdk.Stack {
    constructor(scope, id, props) {
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
        });
        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
            selfMutation: true,
            synth: synthStep,
        });
        pipeline.addStage(new MyApplication(this, 'Deploy', {
            env: props.env,
            ecsImageTag: props.ecsImageTag
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
        const myStack = new MyServiceStack(this, 'MyService', { ecsImageTag: props.ecsImageTag });
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
        console.log(`ecsImageTag ${props.ecsImageTag}`);
        taskDefinition.addContainer("myapp", {
            image: ecs.ContainerImage.fromEcrRepository(ecrRepo, props.ecsImageTag),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG1DQUFrQztBQUNsQywyQ0FBMEM7QUFFMUMsMkNBQTBDO0FBQzFDLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsbURBQWtEO0FBa0JsRCxNQUFhLGdCQUFpQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzdDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFHeEIsZUFBZTtRQUdmLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxDQUFDLG9CQUFvQixFQUFFO1lBQ2xILG1DQUFtQztZQUNuQyxhQUFhLEVBQUUsd0dBQXdHO1NBQ3hILENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFDakQsS0FBSyxFQUFFLFdBQVc7WUFDbEIsUUFBUSxFQUFFO2dCQUNSLE9BQU87Z0JBQ1AsUUFBUTtnQkFDUixlQUFlO2dCQUNmLGVBQWU7YUFDaEI7U0FDRixDQUFDLENBQUE7UUFHRixNQUFNLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM1RCxZQUFZLEVBQUUsSUFBSTtZQUNsQixLQUFLLEVBQUUsU0FBUztTQUNqQixDQUFDLENBQUM7UUFHSCxRQUFRLENBQUMsUUFBUSxDQUNmLElBQUksYUFBYSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDaEMsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQy9CLENBQUMsRUFDRjtRQUNFLFFB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QUFXLEVBQUUsY0FBYztZQUMzQixPQUFPLEVBQUUsY0FBYztZQUN2QixjQUFjLEVBQUUsY0FBYztZQUM5QixVQUFVLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDakQsWUFBWSxFQUFFLENBQUM7WUFDZixjQUFjLEVBQUUsSUFBSTtTQUNyQixDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFDbEIsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQ2xCLGdCQUFnQixDQUNqQixDQUFDO0lBRUosQ0FBQztDQUdGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYidcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJ1xuXG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcidcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnXG5cblxuaW50ZXJmYWNlIFBpcGVsaW5lU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgcGlwZWxpbmVTb3VyY2VCcmFuY2g6IHN0cmluZztcbiAgZWNzSW1hZ2VUYWc6IHN0cmluZ1xufVxuXG5pbnRlcmZhY2UgTXlBcHBsaWNhdGlvblByb3BzIGV4dGVuZHMgY2RrLlN0YWdlUHJvcHMge1xuICBlY3NJbWFnZVRhZzogc3RyaW5nXG59XG5cbmludGVyZmFjZSBNeVNlcnZpY2VQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgZWNzSW1hZ2VUYWc6IHN0cmluZ1xufVxuXG5cblxuZXhwb3J0IGNsYXNzIENka1BpcGVsaW5lU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUGlwZWxpbmVTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cblxuICAgIC8vIENESyBwaXBlbGluZVxuXG5cbiAgICBjb25zdCBnaXRodWJJbnB1dCA9IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmVTb3VyY2UuY29ubmVjdGlvbignYWRhbS1nbGlnb3IvY2RrX3BpcGVsaW5lJywgcHJvcHMucGlwZWxpbmVTb3VyY2VCcmFuY2gsIHtcbiAgICAgIC8vIGNyZWF0ZSB0aGUgY29ubmVjdGlvbiBtYW51YWxseSAhXG4gICAgICBjb25uZWN0aW9uQXJuOiAnYXJuOmF3czpjb2Rlc3Rhci1jb25uZWN0aW9uczpldS1jZW50cmFsLTE6MDA3NDAxNTM3MTkzOmNvbm5lY3Rpb24vN2NiNWY1NGUtODhhZC00NmIyLTk5MmYtMzE2YjFhYmE5OWMxJywgXG4gICAgfSk7XG5cbiAgICBjb25zdCBzeW50aFN0ZXAgPSBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XG4gICAgICBpbnB1dDogZ2l0aHViSW5wdXQsXG4gICAgICBjb21tYW5kczogW1xuICAgICAgICAvLydscycsXG4gICAgICAgICducG0gY2knLFxuICAgICAgICAnbnBtIHJ1biBidWlsZCcsXG4gICAgICAgICducHggY2RrIHN5bnRoJyxcbiAgICAgIF0sXG4gICAgfSlcblxuXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICBzZWxmTXV0YXRpb246IHRydWUsXG4gICAgICBzeW50aDogc3ludGhTdGVwLFxuICAgIH0pOyAgICBcblxuXG4gICAgcGlwZWxpbmUuYWRkU3RhZ2UoXG4gICAgICBuZXcgTXlBcHBsaWNhdGlvbih0aGlzLCAnRGVwbG95Jywge1xuICAgICAgICBlbnY6IHByb3BzLmVudixcbiAgICAgICAgZWNzSW1hZ2VUYWc6IHByb3BzLmVjc0ltYWdlVGFnXG4gICAgICB9KSxcbiAgICAgIHtcbiAgICAgICAgLy8gcHJlOltcbiAgICAgICAgLy8gICBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnVmVyc2lvbicsIHtcbiAgICAgICAgLy8gICAgIGlucHV0OiBzeW50aFN0ZXAuYWRkT3V0cHV0RGlyZWN0b3J5KCd2ZXJzaW9uJyksXG4gICAgICAgIC8vICAgICBjb21tYW5kczogWydjYXQgVkVSU0lPTiddLFxuICAgICAgICAvLyAgIH0pLFxuICAgICAgICAvLyBdXG4gICAgICB9XG4gICAgKTtcblxuICB9XG59XG5cblxuY2xhc3MgTXlBcHBsaWNhdGlvbiBleHRlbmRzIGNkay5TdGFnZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBNeUFwcGxpY2F0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IG15U3RhY2sgPSBuZXcgTXlTZXJ2aWNlU3RhY2sodGhpcywgJ015U2VydmljZScsIHtlY3NJbWFnZVRhZzogcHJvcHMuZWNzSW1hZ2VUYWd9KTtcbiAgfVxufVxuXG5cbmNsYXNzIE15U2VydmljZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTXlTZXJ2aWNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuXG4gICAgLy8gVlBDIFxuXG5cbiAgICBjb25zdCB2cGMgPSBlYzIuVnBjLmZyb21Mb29rdXAodGhpcywgXCJWUENcIiwge2lzRGVmYXVsdDogdHJ1ZX0pXG5cblxuICAgIC8vIEVDUiBcblxuXG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgaWFtLkdyb3VwKHRoaXMsICdBZG1pbmlzdHJhdG9ycycsIHtcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW1xuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FkbWluaXN0cmF0b3JBY2Nlc3MnKVxuICAgICAgXVxuICAgIH0pXG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcih0aGlzLCAnQWRtaW5pc3RyYXRvcicsIHtcbiAgICAgIHVzZXJOYW1lOiAnQWRtaW5pc3RyYXRvcicsXG4gICAgICBncm91cHM6IFtncm91cF1cbiAgICB9KVxuICAgIGVjci5BdXRob3JpemF0aW9uVG9rZW4uZ3JhbnRSZWFkKHVzZXIpXG5cbiAgICBjb25zdCBlY3JSZXBvID0gbmV3IGVjci5SZXBvc2l0b3J5KFxuICAgICAgdGhpcyxcbiAgICAgICdSZXBvc2l0b3J5TXlBcHAnLFxuICAgICAge1xuICAgICAgICByZXBvc2l0b3J5TmFtZTogJ215YXBwJyxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWVxuICAgICAgfVxuICAgIClcbiAgICBlY3JSZXBvLmFkZExpZmVjeWNsZVJ1bGUoeyBtYXhJbWFnZUFnZTogY2RrLkR1cmF0aW9uLmRheXMoMzApIH0pXG5cblxuICAgIC8vIEVDUyBcblxuXG4gICAgY29uc3QgZmFyZ2F0ZUNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgXCJNeUZhcmdhdGVDbHVzdGVyXCIsIHtcbiAgICAgIHZwYzogdnBjLFxuICAgICAgY2x1c3Rlck5hbWU6IFwiTXlGYXJnYXRlQ2x1c3RlclwiLFxuICAgIH0pO1xuICAgIGZhcmdhdGVDbHVzdGVyLmVuYWJsZUZhcmdhdGVDYXBhY2l0eVByb3ZpZGVycygpO1xuXG5cbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHRoaXMsICdNeUFwcFRhc2snLCB7XG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgY3B1OiAyNTZcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKGBlY3NJbWFnZVRhZyAke3Byb3BzLmVjc0ltYWdlVGFnfWApXG5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoXCJteWFwcFwiLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21FY3JSZXBvc2l0b3J5KGVjclJlcG8scHJvcHMuZWNzSW1hZ2VUYWcpLFxuICAgICAgcG9ydE1hcHBpbmdzOiBbeyBjb250YWluZXJQb3J0OiA4MDAwIH1dXG4gICAgfSk7XG5cbiAgICAvLyB4c2VlOiBodHRwczovL2F3cy5hbWF6b24uY29tL3ByZW1pdW1zdXBwb3J0L2tub3dsZWRnZS1jZW50ZXIvZWNzLXVuYWJsZS10by1wdWxsLXNlY3JldHMvXG4gICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2UodGhpcywgJ015QXBwU2VydmljZScsIHtcbiAgICAgIHNlcnZpY2VOYW1lOiBcIk15QXBwU2VydmljZVwiLFxuICAgICAgY2x1c3RlcjogZmFyZ2F0ZUNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbjogdGFza0RlZmluaXRpb24sXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LFxuICAgICAgZGVzaXJlZENvdW50OiAwLFxuICAgICAgYXNzaWduUHVibGljSXA6IHRydWVcbiAgICB9KTtcblxuICAgIHNlcnZpY2UuY29ubmVjdGlvbnMuYWxsb3dGcm9tKFxuICAgICAgZWMyLlBlZXIuYW55SXB2NCgpLFxuICAgICAgZWMyLlBvcnQudGNwKDgwMDApLFxuICAgICAgXCJwdWJsaWMgYWNjZXNzc1wiLFxuICAgICk7XG5cbiAgfVxuXG5cbn0iXX0=