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
        // VPC 
        const vpc = ec2.Vpc.fromLookup(this, "VPC", { isDefault: true });
        // ECR 
        const ecrRepo = ecr.Repository.fromRepositoryAttributes(this, "MyRepository", {
            repositoryArn: cdk.Fn.importValue("OutputECRRepositoryArn"),
            repositoryName: cdk.Fn.importValue("OutputECRRepositoryName"),
        });
        // Fargate cluster
        const fargateCluster = ecs.Cluster.fromClusterAttributes(this, "MyFargateCluster", {
            clusterName: cdk.Fn.importValue("MyFargateCluster"),
            securityGroups: [],
            vpc: vpc,
        });
        // ECS task
        const taskDefinition = new ecs.FargateTaskDefinition(this, `MyAppTask-${props.environment}`, {
            memoryLimitMiB: 512,
            cpu: 256
        });
        console.log(`ecsImageTag ${props.ecsImageTag}`);
        taskDefinition.addContainer("myapp", {
            image: ecs.ContainerImage.fromEcrRepository(ecrRepo, props.ecsImageTag),
            portMappings: [{ containerPort: 8000 }]
        });
        // ECS service 
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZpY2Utc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsbUNBQWtDO0FBRWxDLDJDQUEwQztBQUMxQywyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBVTNDLE1BQWEsWUFBYSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBRXpDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFHeEIsT0FBTztRQUdQLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtRQUc5RCxPQUFPO1FBR1AsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzFFLGFBQWEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQztZQUMzRCxjQUFjLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMseUJBQXlCLENBQUM7U0FDaEUsQ0FBQyxDQUFDO1FBR0gsa0JBQWtCO1FBR2xCLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ2pGLFdBQVcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQztZQUNuRCxjQUFjLEVBQUUsRUFBRTtZQUNsQixHQUFHLEVBQUUsR0FBRztTQUNULENBQUMsQ0FBQztRQUdILFdBQVc7UUFHWCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsYUFBYSxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDM0YsY0FBYyxFQUFFLEdBQUc7WUFDbkIsR0FBRyxFQUFFLEdBQUc7U0FDVCxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUE7UUFFL0MsY0FBYyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUU7WUFDbkMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7WUFDdEUsWUFBWSxFQUFFLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUM7U0FDeEMsQ0FBQyxDQUFDO1FBR0gsZUFBZTtRQUdmLDJGQUEyRjtRQUMzRixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDaEYsV0FBVyxFQUFFLGdCQUFnQixLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ2hELE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLGNBQWMsRUFBRSxjQUFjO1lBQzlCLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNqRCxZQUFZLEVBQUUsQ0FBQztZQUNmLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUMzQixHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUNsQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFDbEIsWUFBWSxDQUNiLENBQUM7SUFDSixDQUFDO0NBRUY7QUFuRUQsb0NBbUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYidcblxuaW1wb3J0ICogYXMgZWNyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3InXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5cblxuXG5pbnRlcmZhY2UgU2VydmljZVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIGVjc0ltYWdlVGFnOiBzdHJpbmdcbiAgZW52aXJvbm1lbnQ6IHN0cmluZ1xufVxuXG5cbmV4cG9ydCBjbGFzcyBTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTZXJ2aWNlU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG5cbiAgICAvLyBWUEMgXG5cblxuICAgIGNvbnN0IHZwYyA9IGVjMi5WcGMuZnJvbUxvb2t1cCh0aGlzLCBcIlZQQ1wiLCB7aXNEZWZhdWx0OiB0cnVlfSlcblxuXG4gICAgLy8gRUNSIFxuXG5cbiAgICBjb25zdCBlY3JSZXBvID0gZWNyLlJlcG9zaXRvcnkuZnJvbVJlcG9zaXRvcnlBdHRyaWJ1dGVzKHRoaXMsIFwiTXlSZXBvc2l0b3J5XCIsIHtcbiAgICAgICAgcmVwb3NpdG9yeUFybjogY2RrLkZuLmltcG9ydFZhbHVlKFwiT3V0cHV0RUNSUmVwb3NpdG9yeUFyblwiKSxcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6IGNkay5Gbi5pbXBvcnRWYWx1ZShcIk91dHB1dEVDUlJlcG9zaXRvcnlOYW1lXCIpLFxuICAgIH0pO1xuXG5cbiAgICAvLyBGYXJnYXRlIGNsdXN0ZXJcblxuXG4gICAgY29uc3QgZmFyZ2F0ZUNsdXN0ZXIgPSBlY3MuQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXModGhpcywgXCJNeUZhcmdhdGVDbHVzdGVyXCIsIHtcbiAgICAgIGNsdXN0ZXJOYW1lOiBjZGsuRm4uaW1wb3J0VmFsdWUoXCJNeUZhcmdhdGVDbHVzdGVyXCIpLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtdLFxuICAgICAgdnBjOiB2cGMsXG4gICAgfSk7XG4gICAgXG5cbiAgICAvLyBFQ1MgdGFza1xuXG5cbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHRoaXMsIGBNeUFwcFRhc2stJHtwcm9wcy5lbnZpcm9ubWVudH1gLCB7XG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgY3B1OiAyNTZcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKGBlY3NJbWFnZVRhZyAke3Byb3BzLmVjc0ltYWdlVGFnfWApXG5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoXCJteWFwcFwiLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21FY3JSZXBvc2l0b3J5KGVjclJlcG8scHJvcHMuZWNzSW1hZ2VUYWcpLFxuICAgICAgcG9ydE1hcHBpbmdzOiBbeyBjb250YWluZXJQb3J0OiA4MDAwIH1dXG4gICAgfSk7XG5cblxuICAgIC8vIEVDUyBzZXJ2aWNlIFxuXG5cbiAgICAvLyB4c2VlOiBodHRwczovL2F3cy5hbWF6b24uY29tL3ByZW1pdW1zdXBwb3J0L2tub3dsZWRnZS1jZW50ZXIvZWNzLXVuYWJsZS10by1wdWxsLXNlY3JldHMvXG4gICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRmFyZ2F0ZVNlcnZpY2UodGhpcywgYE15QXBwU2VydmljZS0ke3Byb3BzLmVudmlyb25tZW50fWAsIHtcbiAgICAgIHNlcnZpY2VOYW1lOiBgTXlBcHBTZXJ2aWNlLSR7cHJvcHMuZW52aXJvbm1lbnR9YCxcbiAgICAgIGNsdXN0ZXI6IGZhcmdhdGVDbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb246IHRhc2tEZWZpbml0aW9uLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfSxcbiAgICAgIGRlc2lyZWRDb3VudDogMCxcbiAgICAgIGFzc2lnblB1YmxpY0lwOiB0cnVlXG4gICAgfSk7XG5cbiAgICBzZXJ2aWNlLmNvbm5lY3Rpb25zLmFsbG93RnJvbShcbiAgICAgIGVjMi5QZWVyLmFueUlwdjQoKSxcbiAgICAgIGVjMi5Qb3J0LnRjcCg4MDAwKSxcbiAgICAgIFwid2ViIGFjY2Vzc1wiLFxuICAgICk7XG4gIH1cblxufSJdfQ==