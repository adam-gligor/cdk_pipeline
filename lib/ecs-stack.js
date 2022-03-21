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
        const ecrRepo = new ecr.Repository(this, 'RepositoryMyApp', {
            repositoryName: 'myapp',
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        ecrRepo.addLifecycleRule({ maxImageAge: cdk.Duration.days(30) });
        // ECS Cluster
        const fargateCluster = new ecs.Cluster(this, "MyFargateCluster", {
            vpc: vpc,
            clusterName: "MyFargateCluster",
        });
        fargateCluster.enableFargateCapacityProviders();
        // Output
        new cdk.CfnOutput(this, "OutputMyFargateCluster", {
            description: "My Fargate Cluster",
            exportName: "OutputMyFargateCluster",
            value: fargateCluster.clusterName,
        });
    }
}
exports.EcsStack = EcsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNzLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG1DQUFrQztBQUNsQywyQ0FBMEM7QUFFMUMsMkNBQTBDO0FBQzFDLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFHM0MsTUFBYSxRQUFTLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDckMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4QixPQUFPO1FBR1AsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO1FBRzlELE9BQU87UUFHUCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ2xELGVBQWUsRUFBRTtnQkFDZixHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLHFCQUFxQixDQUFDO2FBQ2xFO1NBQ0YsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDL0MsUUFBUSxFQUFFLGVBQWU7WUFDekIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQ2hCLENBQUMsQ0FBQTtRQUNGLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFdEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUNoQyxJQUFJLEVBQ0osaUJBQWlCLEVBQ2pCO1lBQ0UsY0FBYyxFQUFFLE9BQU87WUFDdkIsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUN6QyxDQUNGLENBQUE7UUFDRCxPQUFPLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxXQUFXLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBR2hFLGNBQWM7UUFHZCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQy9ELEdBQUcsRUFBRSxHQUFHO1lBQ1IsV0FBVyxFQUFFLGtCQUFrQjtTQUNoQyxDQUFDLENBQUM7UUFDSCxjQUFjLENBQUMsOEJBQThCLEVBQUUsQ0FBQztRQUdoRCxTQUFTO1FBR1QsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRTtZQUM5QyxXQUFXLEVBQUUsb0JBQW9CO1lBQ2pDLFVBQVUsRUFBRSx3QkFBd0I7WUFDcEMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQztJQUdMLENBQUM7Q0FDRjtBQXpERCw0QkF5REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJ1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nXG5cbmltcG9ydCAqIGFzIGVjciBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNyJ1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuXG5cbmV4cG9ydCBjbGFzcyBFY3NTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgXG4gICAgLy8gVlBDIFxuXG5cbiAgICBjb25zdCB2cGMgPSBlYzIuVnBjLmZyb21Mb29rdXAodGhpcywgXCJWUENcIiwge2lzRGVmYXVsdDogdHJ1ZX0pXG5cblxuICAgIC8vIEVDUiBcblxuXG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgaWFtLkdyb3VwKHRoaXMsICdBZG1pbmlzdHJhdG9ycycsIHtcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW1xuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FkbWluaXN0cmF0b3JBY2Nlc3MnKVxuICAgICAgXVxuICAgIH0pXG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcih0aGlzLCAnQWRtaW5pc3RyYXRvcicsIHtcbiAgICAgIHVzZXJOYW1lOiAnQWRtaW5pc3RyYXRvcicsXG4gICAgICBncm91cHM6IFtncm91cF1cbiAgICB9KVxuICAgIGVjci5BdXRob3JpemF0aW9uVG9rZW4uZ3JhbnRSZWFkKHVzZXIpXG5cbiAgICBjb25zdCBlY3JSZXBvID0gbmV3IGVjci5SZXBvc2l0b3J5KFxuICAgICAgdGhpcyxcbiAgICAgICdSZXBvc2l0b3J5TXlBcHAnLFxuICAgICAge1xuICAgICAgICByZXBvc2l0b3J5TmFtZTogJ215YXBwJyxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWVxuICAgICAgfVxuICAgIClcbiAgICBlY3JSZXBvLmFkZExpZmVjeWNsZVJ1bGUoeyBtYXhJbWFnZUFnZTogY2RrLkR1cmF0aW9uLmRheXMoMzApIH0pXG5cblxuICAgIC8vIEVDUyBDbHVzdGVyXG5cblxuICAgIGNvbnN0IGZhcmdhdGVDbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHRoaXMsIFwiTXlGYXJnYXRlQ2x1c3RlclwiLCB7XG4gICAgICB2cGM6IHZwYyxcbiAgICAgIGNsdXN0ZXJOYW1lOiBcIk15RmFyZ2F0ZUNsdXN0ZXJcIixcbiAgICB9KTtcbiAgICBmYXJnYXRlQ2x1c3Rlci5lbmFibGVGYXJnYXRlQ2FwYWNpdHlQcm92aWRlcnMoKTtcblxuXG4gICAgLy8gT3V0cHV0XG5cbiAgICBcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIk91dHB1dE15RmFyZ2F0ZUNsdXN0ZXJcIiwge1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJNeSBGYXJnYXRlIENsdXN0ZXJcIixcbiAgICAgICAgZXhwb3J0TmFtZTogXCJPdXRwdXRNeUZhcmdhdGVDbHVzdGVyXCIsXG4gICAgICAgIHZhbHVlOiBmYXJnYXRlQ2x1c3Rlci5jbHVzdGVyTmFtZSxcbiAgICB9KTtcbiAgXG5cbiAgfVxufVxuIl19