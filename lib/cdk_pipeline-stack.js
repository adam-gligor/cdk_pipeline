"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkPipelineStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const pipelines_1 = require("aws-cdk-lib/pipelines");
// import * as cdk from "@aws-cdk/core";
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html
class CdkPipelineStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const pipeline = new pipelines_1.CodePipeline(this, 'Pipeline', {
            selfMutation: true,
            synth: new pipelines_1.ShellStep('Synth', {
                input: pipelines_1.CodePipelineSource.connection('adam-gligor/cdk_pipeline', 'master', {
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
class MyApplication extends aws_cdk_lib_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        const dbStack = new MyServiceStack(this, 'MyService');
    }
}
class MyServiceStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = aws_ec2_1.Vpc.fromLookup(this, "VPC", { isDefault: true });
        const fargateCluster = new aws_ecs_1.Cluster(this, "MyFargateCluster", {
            vpc: vpc,
            clusterName: "MyFargateCluster",
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFtRTtBQUNuRSxxREFBb0Y7QUFHcEYsd0NBQXdDO0FBQ3hDLGlEQUE4QztBQUM5QyxpREFBMEM7QUFJMUMsZ0ZBQWdGO0FBRWhGLE1BQWEsZ0JBQWlCLFNBQVEsbUJBQUs7SUFDekMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFpQjtRQUN6RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFFBQVEsR0FBRyxJQUFJLHdCQUFZLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNsRCxZQUFZLEVBQUUsSUFBSTtZQUNsQixLQUFLLEVBQUUsSUFBSSxxQkFBUyxDQUFDLE9BQU8sRUFBRTtnQkFDNUIsS0FBSyxFQUFFLDhCQUFrQixDQUFDLFVBQVUsQ0FBQywwQkFBMEIsRUFBRSxRQUFRLEVBQUU7b0JBQ3pFLG1DQUFtQztvQkFDbkMsYUFBYSxFQUFFLHdHQUF3RztpQkFDeEgsQ0FBQztnQkFDRixRQUFRLEVBQUU7b0JBQ1IsUUFBUTtvQkFDUixlQUFlO29CQUNmLGVBQWU7aUJBQ2hCO2FBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNoRCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7U0FDZixDQUFDLENBQUMsQ0FBQztJQUVOLENBQUM7Q0FDRjtBQXhCRCw0Q0F3QkM7QUFHRCxNQUFNLGFBQWMsU0FBUSxtQkFBSztJQUMvQixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sT0FBTyxHQUFHLElBQUksY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLGNBQWUsU0FBUSxtQkFBSztJQUVoQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLGFBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO1FBRTFELE1BQU0sY0FBYyxHQUFHLElBQUksaUJBQU8sQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDM0QsR0FBRyxFQUFFLEdBQUc7WUFDUixXQUFXLEVBQUUsa0JBQWtCO1NBQ2hDLENBQUMsQ0FBQztJQUVMLENBQUM7Q0FHRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzLCBTdGFnZSwgU3RhZ2VQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvZGVQaXBlbGluZSwgU2hlbGxTdGVwLCBDb2RlUGlwZWxpbmVTb3VyY2UgfSBmcm9tIFwiYXdzLWNkay1saWIvcGlwZWxpbmVzXCI7XG5cbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuLy8gaW1wb3J0ICogYXMgY2RrIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgeyBDbHVzdGVyIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lY3NcIjtcbmltcG9ydCB7IFZwYyB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWMyXCI7XG5cblxuXG4vLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92Mi9kb2NzL2F3cy1jZGstbGliLnBpcGVsaW5lcy1yZWFkbWUuaHRtbFxuXG5leHBvcnQgY2xhc3MgQ2RrUGlwZWxpbmVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IENvZGVQaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICBzZWxmTXV0YXRpb246IHRydWUsXG4gICAgICBzeW50aDogbmV3IFNoZWxsU3RlcCgnU3ludGgnLCB7XG4gICAgICAgIGlucHV0OiBDb2RlUGlwZWxpbmVTb3VyY2UuY29ubmVjdGlvbignYWRhbS1nbGlnb3IvY2RrX3BpcGVsaW5lJywgJ21hc3RlcicsIHtcbiAgICAgICAgICAvLyBjcmVhdGUgdGhlIGNvbm5lY3Rpb24gbWFudWFsbHkgIVxuICAgICAgICAgIGNvbm5lY3Rpb25Bcm46ICdhcm46YXdzOmNvZGVzdGFyLWNvbm5lY3Rpb25zOmV1LWNlbnRyYWwtMTowMDc0MDE1MzcxOTM6Y29ubmVjdGlvbi83Y2I1ZjU0ZS04OGFkLTQ2YjItOTkyZi0zMTZiMWFiYTk5YzEnLCBcbiAgICAgICAgfSksXG4gICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgJ25wbSBjaScsXG4gICAgICAgICAgJ25wbSBydW4gYnVpbGQnLFxuICAgICAgICAgICducHggY2RrIHN5bnRoJyxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIFxuICAgIHBpcGVsaW5lLmFkZFN0YWdlKG5ldyBNeUFwcGxpY2F0aW9uKHRoaXMsICdQcm9kJywge1xuICAgICAgZW52OiBwcm9wcy5lbnYsXG4gICAgfSkpO1xuXG4gIH1cbn1cblxuXG5jbGFzcyBNeUFwcGxpY2F0aW9uIGV4dGVuZHMgU3RhZ2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWdlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGRiU3RhY2sgPSBuZXcgTXlTZXJ2aWNlU3RhY2sodGhpcywgJ015U2VydmljZScpO1xuICB9XG59XG5cbmNsYXNzIE15U2VydmljZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdnBjID0gVnBjLmZyb21Mb29rdXAodGhpcywgXCJWUENcIiwge2lzRGVmYXVsdDogdHJ1ZX0pXG5cbiAgICBjb25zdCBmYXJnYXRlQ2x1c3RlciA9IG5ldyBDbHVzdGVyKHRoaXMsIFwiTXlGYXJnYXRlQ2x1c3RlclwiLCB7XG4gICAgICB2cGM6IHZwYyxcbiAgICAgIGNsdXN0ZXJOYW1lOiBcIk15RmFyZ2F0ZUNsdXN0ZXJcIixcbiAgICB9KTtcblxuICB9XG5cblxufSJdfQ==