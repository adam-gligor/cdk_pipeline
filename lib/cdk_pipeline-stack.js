"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkPipelineStack = void 0;
const cdk = require("aws-cdk-lib");
const pipelines = require("aws-cdk-lib/pipelines");
const service_stack_1 = require("../lib/service-stack");
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
        new service_stack_1.ServiceStack(this, 'MyService', { ecsImageTag: props.ecsImageTag });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG1DQUFrQztBQU1sQyxtREFBa0Q7QUFFbEQsd0RBQW9EO0FBYXBELE1BQWEsZ0JBQWlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4QixlQUFlO1FBR2YsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQywwQkFBMEIsRUFBRSxLQUFLLENBQUMsb0JBQW9CLEVBQUU7WUFDbEgsbUNBQW1DO1lBQ25DLGFBQWEsRUFBRSx3R0FBd0c7U0FDeEgsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUNqRCxLQUFLLEVBQUUsV0FBVztZQUNsQixRQUFRLEVBQUU7Z0JBQ1IsT0FBTztnQkFDUCxRQUFRO2dCQUNSLGVBQWU7Z0JBQ2YsZUFBZTthQUNoQjtTQUNGLENBQUMsQ0FBQTtRQUdGLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzVELFlBQVksRUFBRSxJQUFJO1lBQ2xCLEtBQUssRUFBRSxTQUFTO1NBQ2pCLENBQUMsQ0FBQztRQUdILFFBQVEsQ0FBQyxRQUFRLENBQ2YsSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNoQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7U0FDL0IsQ0FBQyxFQUNGO1FBQ0UsUUFBUTtRQUNSLHlDQUF5QztRQUN6QyxzREFBc0Q7UUFDdEQsaUNBQWlDO1FBQ2pDLFFBQVE7UUFDUixJQUFJO1NBQ0wsQ0FDRixDQUFDO0lBRUosQ0FBQztDQUNGO0FBOUNELDRDQThDQztBQUdELE1BQU0sYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSw0QkFBWSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYidcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJ1xuXG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcidcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnXG5cbmltcG9ydCB7IFNlcnZpY2VTdGFjayB9IGZyb20gJy4uL2xpYi9zZXJ2aWNlLXN0YWNrJztcblxuXG5pbnRlcmZhY2UgUGlwZWxpbmVTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICBwaXBlbGluZVNvdXJjZUJyYW5jaDogc3RyaW5nO1xuICBlY3NJbWFnZVRhZzogc3RyaW5nXG59XG5cbmludGVyZmFjZSBNeUFwcGxpY2F0aW9uUHJvcHMgZXh0ZW5kcyBjZGsuU3RhZ2VQcm9wcyB7XG4gIGVjc0ltYWdlVGFnOiBzdHJpbmdcbn1cblxuXG5leHBvcnQgY2xhc3MgQ2RrUGlwZWxpbmVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQaXBlbGluZVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuXG4gICAgLy8gQ0RLIHBpcGVsaW5lXG5cblxuICAgIGNvbnN0IGdpdGh1YklucHV0ID0gcGlwZWxpbmVzLkNvZGVQaXBlbGluZVNvdXJjZS5jb25uZWN0aW9uKCdhZGFtLWdsaWdvci9jZGtfcGlwZWxpbmUnLCBwcm9wcy5waXBlbGluZVNvdXJjZUJyYW5jaCwge1xuICAgICAgLy8gY3JlYXRlIHRoZSBjb25uZWN0aW9uIG1hbnVhbGx5ICFcbiAgICAgIGNvbm5lY3Rpb25Bcm46ICdhcm46YXdzOmNvZGVzdGFyLWNvbm5lY3Rpb25zOmV1LWNlbnRyYWwtMTowMDc0MDE1MzcxOTM6Y29ubmVjdGlvbi83Y2I1ZjU0ZS04OGFkLTQ2YjItOTkyZi0zMTZiMWFiYTk5YzEnLCBcbiAgICB9KTtcblxuICAgIGNvbnN0IHN5bnRoU3RlcCA9IG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdTeW50aCcsIHtcbiAgICAgIGlucHV0OiBnaXRodWJJbnB1dCxcbiAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgIC8vJ2xzJyxcbiAgICAgICAgJ25wbSBjaScsXG4gICAgICAgICducG0gcnVuIGJ1aWxkJyxcbiAgICAgICAgJ25weCBjZGsgc3ludGgnLFxuICAgICAgXSxcbiAgICB9KVxuXG5cbiAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsICdQaXBlbGluZScsIHtcbiAgICAgIHNlbGZNdXRhdGlvbjogdHJ1ZSxcbiAgICAgIHN5bnRoOiBzeW50aFN0ZXAsXG4gICAgfSk7ICAgIFxuXG5cbiAgICBwaXBlbGluZS5hZGRTdGFnZShcbiAgICAgIG5ldyBNeUFwcGxpY2F0aW9uKHRoaXMsICdEZXBsb3knLCB7XG4gICAgICAgIGVudjogcHJvcHMuZW52LFxuICAgICAgICBlY3NJbWFnZVRhZzogcHJvcHMuZWNzSW1hZ2VUYWdcbiAgICAgIH0pLFxuICAgICAge1xuICAgICAgICAvLyBwcmU6W1xuICAgICAgICAvLyAgIG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdWZXJzaW9uJywge1xuICAgICAgICAvLyAgICAgaW5wdXQ6IHN5bnRoU3RlcC5hZGRPdXRwdXREaXJlY3RvcnkoJ3ZlcnNpb24nKSxcbiAgICAgICAgLy8gICAgIGNvbW1hbmRzOiBbJ2NhdCBWRVJTSU9OJ10sXG4gICAgICAgIC8vICAgfSksXG4gICAgICAgIC8vIF1cbiAgICAgIH1cbiAgICApO1xuXG4gIH1cbn1cblxuXG5jbGFzcyBNeUFwcGxpY2F0aW9uIGV4dGVuZHMgY2RrLlN0YWdlIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE15QXBwbGljYXRpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgbmV3IFNlcnZpY2VTdGFjayh0aGlzLCAnTXlTZXJ2aWNlJywge2Vjc0ltYWdlVGFnOiBwcm9wcy5lY3NJbWFnZVRhZ30pO1xuICB9XG59XG4iXX0=