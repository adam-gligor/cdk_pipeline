"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceStack = void 0;
const cdk = require("aws-cdk-lib");
const ecr = require("aws-cdk-lib/aws-ecr");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
class ServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // import VPC 
        const vpc = ec2.Vpc.fromLookup(this, "VPC", { isDefault: true });
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
        console.log(`ecsImageTag ${props.ecsImageTag}`);
        taskDefinition.addContainer("myapp", {
            image: ecs.ContainerImage.fromEcrRepository(ecrRepo, props.ecsImageTag),
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
        service.connections.allowFrom(ec2.Peer.anyIpv4(), ec2.Port.tcp(8000), "web access");
    }
}
exports.ServiceStack = ServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZpY2Utc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsbUNBQWtDO0FBRWxDLDJDQUEwQztBQUMxQywyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBVTNDLE1BQWEsWUFBYSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBRXpDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFHeEIsY0FBYztRQUdkLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtRQUc5RCxjQUFjO1FBR2QsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzFFLGFBQWEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQztZQUMzRCxjQUFjLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMseUJBQXlCLENBQUM7U0FDaEUsQ0FBQyxDQUFDO1FBR0gseUJBQXlCO1FBR3pCLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ2pGLFdBQVcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQztZQUNuRCxjQUFjLEVBQUUsRUFBRTtZQUNsQixHQUFHLEVBQUUsR0FBRztTQUNULENBQUMsQ0FBQztRQUdILGtCQUFrQjtRQUdsQixNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsYUFBYSxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDM0YsY0FBYyxFQUFFLEdBQUc7WUFDbkIsR0FBRyxFQUFFLEdBQUc7U0FDVCxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUE7UUFFL0MsY0FBYyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUU7WUFDbkMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7WUFDdEUsWUFBWSxFQUFFLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUM7U0FDeEMsQ0FBQyxDQUFDO1FBR0gsc0JBQXNCO1FBR3RCLDJGQUEyRjtRQUMzRixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDaEYsV0FBVyxFQUFFLGdCQUFnQixLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ2hELE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLGNBQWMsRUFBRSxjQUFjO1lBQzlCLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNqRCxZQUFZLEVBQUUsQ0FBQztZQUNmLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUMzQixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUNsQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFDbEIsWUFBWSxDQUNiLENBQUM7SUFDSixDQUFDO0NBRUY7QUFuRUQsb0NBbUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYidcblxuaW1wb3J0ICogYXMgZWNyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3InXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5cblxuXG5pbnRlcmZhY2UgU2VydmljZVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIGVjc0ltYWdlVGFnOiBzdHJpbmdcbiAgZW52aXJvbm1lbnQ6IHN0cmluZ1xufVxuXG5cbmV4cG9ydCBjbGFzcyBTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTZXJ2aWNlU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG5cbiAgICAvLyBpbXBvcnQgVlBDIFxuXG5cbiAgICBjb25zdCB2cGMgPSBlYzIuVnBjLmZyb21Mb29rdXAodGhpcywgXCJWUENcIiwge2lzRGVmYXVsdDogdHJ1ZX0pXG5cblxuICAgIC8vIGltcG9ydCBFQ1IgXG5cblxuICAgIGNvbnN0IGVjclJlcG8gPSBlY3IuUmVwb3NpdG9yeS5mcm9tUmVwb3NpdG9yeUF0dHJpYnV0ZXModGhpcywgXCJNeVJlcG9zaXRvcnlcIiwge1xuICAgICAgICByZXBvc2l0b3J5QXJuOiBjZGsuRm4uaW1wb3J0VmFsdWUoXCJPdXRwdXRFQ1JSZXBvc2l0b3J5QXJuXCIpLFxuICAgICAgICByZXBvc2l0b3J5TmFtZTogY2RrLkZuLmltcG9ydFZhbHVlKFwiT3V0cHV0RUNSUmVwb3NpdG9yeU5hbWVcIiksXG4gICAgfSk7XG5cblxuICAgIC8vIGltcG9ydCBGYXJnYXRlIGNsdXN0ZXJcblxuXG4gICAgY29uc3QgZmFyZ2F0ZUNsdXN0ZXIgPSBlY3MuQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXModGhpcywgXCJNeUZhcmdhdGVDbHVzdGVyXCIsIHtcbiAgICAgIGNsdXN0ZXJOYW1lOiBjZGsuRm4uaW1wb3J0VmFsdWUoXCJNeUZhcmdhdGVDbHVzdGVyXCIpLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtdLFxuICAgICAgdnBjOiB2cGMsXG4gICAgfSk7XG4gICAgXG5cbiAgICAvLyBkZWZpbmUgRUNTIHRhc2tcblxuXG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbih0aGlzLCBgTXlBcHBUYXNrLSR7cHJvcHMuZW52aXJvbm1lbnR9YCwge1xuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIGNwdTogMjU2XG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZyhgZWNzSW1hZ2VUYWcgJHtwcm9wcy5lY3NJbWFnZVRhZ31gKVxuXG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKFwibXlhcHBcIiwge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tRWNyUmVwb3NpdG9yeShlY3JSZXBvLHByb3BzLmVjc0ltYWdlVGFnKSxcbiAgICAgIHBvcnRNYXBwaW5nczogW3sgY29udGFpbmVyUG9ydDogODAwMCB9XVxuICAgIH0pO1xuXG5cbiAgICAvLyBkZWZpbmUgRUNTIHNlcnZpY2UgXG5cblxuICAgIC8vIHhzZWU6IGh0dHBzOi8vYXdzLmFtYXpvbi5jb20vcHJlbWl1bXN1cHBvcnQva25vd2xlZGdlLWNlbnRlci9lY3MtdW5hYmxlLXRvLXB1bGwtc2VjcmV0cy9cbiAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5GYXJnYXRlU2VydmljZSh0aGlzLCBgTXlBcHBTZXJ2aWNlLSR7cHJvcHMuZW52aXJvbm1lbnR9YCwge1xuICAgICAgc2VydmljZU5hbWU6IGBNeUFwcFNlcnZpY2UtJHtwcm9wcy5lbnZpcm9ubWVudH1gLFxuICAgICAgY2x1c3RlcjogZmFyZ2F0ZUNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbjogdGFza0RlZmluaXRpb24sXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LFxuICAgICAgZGVzaXJlZENvdW50OiAwLFxuICAgICAgYXNzaWduUHVibGljSXA6IHRydWVcbiAgICB9KTtcblxuICAgIHNlcnZpY2UuY29ubmVjdGlvbnMuYWxsb3dGcm9tKFxuICAgICAgZWMyLlBlZXIuYW55SXB2NCgpLFxuICAgICAgZWMyLlBvcnQudGNwKDgwMDApLFxuICAgICAgXCJ3ZWIgYWNjZXNzXCIsXG4gICAgKTtcbiAgfVxuXG59Il19