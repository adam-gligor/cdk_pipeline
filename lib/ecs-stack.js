"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsStack = void 0;
const cdk = require("aws-cdk-lib");
const iam = require("aws-cdk-lib/aws-iam");
const ecr = require("aws-cdk-lib/aws-ecr");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
class EcsStack extends cdk.Stack {
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
        const ecrRepo = new ecr.Repository(this, 'MyRepository', {
            repositoryName: 'myrepo',
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        ecrRepo.addLifecycleRule({ maxImageAge: cdk.Duration.days(30) });
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
        new cdk.CfnOutput(this, "OutputECRRepositoryArn", {
            description: "My ECR Repo Arn",
            exportName: "OutputECRRepositoryArn",
            value: ecrRepo.repositoryArn,
        });
        new cdk.CfnOutput(this, "OutputECRRepositoryName", {
            description: "My ECR Repo Name",
            exportName: "OutputECRRepositoryName",
            value: ecrRepo.repositoryName,
        });
    }
}
exports.EcsStack = EcsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNzLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG1DQUFrQztBQUNsQywyQ0FBMEM7QUFFMUMsMkNBQTBDO0FBQzFDLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFHM0MsTUFBYSxRQUFTLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDckMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4QixPQUFPO1FBR1AsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO1FBRzlELE9BQU87UUFHUCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ2xELGVBQWUsRUFBRTtnQkFDZixHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLHFCQUFxQixDQUFDO2FBQ2xFO1NBQ0YsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDL0MsUUFBUSxFQUFFLGVBQWU7WUFDekIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQ2hCLENBQUMsQ0FBQTtRQUNGLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFdEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUNoQyxJQUFJLEVBQ0osY0FBYyxFQUNkO1lBQ0UsY0FBYyxFQUFFLFFBQVE7WUFDeEIsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUN6QyxDQUNGLENBQUE7UUFDRCxPQUFPLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxXQUFXLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBR2hFLGNBQWM7UUFHZCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQy9ELEdBQUcsRUFBRSxHQUFHO1lBQ1IsV0FBVyxFQUFFLGtCQUFrQjtTQUNoQyxDQUFDLENBQUM7UUFDSCxjQUFjLENBQUMsOEJBQThCLEVBQUUsQ0FBQztRQUdoRCxVQUFVO1FBR1YsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRTtZQUM5QyxXQUFXLEVBQUUsb0JBQW9CO1lBQ2pDLFVBQVUsRUFBRSx3QkFBd0I7WUFDcEMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQztRQUdILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDOUMsV0FBVyxFQUFFLGlCQUFpQjtZQUM5QixVQUFVLEVBQUUsd0JBQXdCO1lBQ3BDLEtBQUssRUFBRSxPQUFPLENBQUMsYUFBYTtTQUMvQixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLHlCQUF5QixFQUFFO1lBQy9DLFdBQVcsRUFBRSxrQkFBa0I7WUFDL0IsVUFBVSxFQUFFLHlCQUF5QjtZQUNyQyxLQUFLLEVBQUUsT0FBTyxDQUFDLGNBQWM7U0FDaEMsQ0FBQyxDQUFDO0lBR0wsQ0FBQztDQUNGO0FBdEVELDRCQXNFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSdcblxuaW1wb3J0ICogYXMgZWNyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3InXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5cblxuZXhwb3J0IGNsYXNzIEVjc1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBcbiAgICAvLyBWUEMgXG5cblxuICAgIGNvbnN0IHZwYyA9IGVjMi5WcGMuZnJvbUxvb2t1cCh0aGlzLCBcIlZQQ1wiLCB7aXNEZWZhdWx0OiB0cnVlfSlcblxuXG4gICAgLy8gRUNSIFxuXG5cbiAgICBjb25zdCBncm91cCA9IG5ldyBpYW0uR3JvdXAodGhpcywgJ0FkbWluaXN0cmF0b3JzJywge1xuICAgICAgbWFuYWdlZFBvbGljaWVzOiBbXG4gICAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQWRtaW5pc3RyYXRvckFjY2VzcycpXG4gICAgICBdXG4gICAgfSlcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHRoaXMsICdBZG1pbmlzdHJhdG9yJywge1xuICAgICAgdXNlck5hbWU6ICdBZG1pbmlzdHJhdG9yJyxcbiAgICAgIGdyb3VwczogW2dyb3VwXVxuICAgIH0pXG4gICAgZWNyLkF1dGhvcml6YXRpb25Ub2tlbi5ncmFudFJlYWQodXNlcilcblxuICAgIGNvbnN0IGVjclJlcG8gPSBuZXcgZWNyLlJlcG9zaXRvcnkoXG4gICAgICB0aGlzLFxuICAgICAgJ015UmVwb3NpdG9yeScsXG4gICAgICB7XG4gICAgICAgIHJlcG9zaXRvcnlOYW1lOiAnbXlyZXBvJyxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWVxuICAgICAgfVxuICAgIClcbiAgICBlY3JSZXBvLmFkZExpZmVjeWNsZVJ1bGUoeyBtYXhJbWFnZUFnZTogY2RrLkR1cmF0aW9uLmRheXMoMzApIH0pXG5cblxuICAgIC8vIEVDUyBDbHVzdGVyXG5cblxuICAgIGNvbnN0IGZhcmdhdGVDbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHRoaXMsIFwiTXlGYXJnYXRlQ2x1c3RlclwiLCB7XG4gICAgICB2cGM6IHZwYyxcbiAgICAgIGNsdXN0ZXJOYW1lOiBcIk15RmFyZ2F0ZUNsdXN0ZXJcIixcbiAgICB9KTtcbiAgICBmYXJnYXRlQ2x1c3Rlci5lbmFibGVGYXJnYXRlQ2FwYWNpdHlQcm92aWRlcnMoKTtcblxuXG4gICAgLy8gT3V0cHV0c1xuXG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIk91dHB1dE15RmFyZ2F0ZUNsdXN0ZXJcIiwge1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJNeSBGYXJnYXRlIENsdXN0ZXJcIixcbiAgICAgICAgZXhwb3J0TmFtZTogXCJPdXRwdXRNeUZhcmdhdGVDbHVzdGVyXCIsXG4gICAgICAgIHZhbHVlOiBmYXJnYXRlQ2x1c3Rlci5jbHVzdGVyTmFtZSxcbiAgICB9KTtcbiAgXG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIk91dHB1dEVDUlJlcG9zaXRvcnlBcm5cIiwge1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJNeSBFQ1IgUmVwbyBBcm5cIixcbiAgICAgICAgZXhwb3J0TmFtZTogXCJPdXRwdXRFQ1JSZXBvc2l0b3J5QXJuXCIsXG4gICAgICAgIHZhbHVlOiBlY3JSZXBvLnJlcG9zaXRvcnlBcm4sXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIk91dHB1dEVDUlJlcG9zaXRvcnlOYW1lXCIsIHtcbiAgICAgICAgZGVzY3JpcHRpb246IFwiTXkgRUNSIFJlcG8gTmFtZVwiLFxuICAgICAgICBleHBvcnROYW1lOiBcIk91dHB1dEVDUlJlcG9zaXRvcnlOYW1lXCIsXG4gICAgICAgIHZhbHVlOiBlY3JSZXBvLnJlcG9zaXRvcnlOYW1lLFxuICAgIH0pO1xuXG5cbiAgfVxufVxuIl19