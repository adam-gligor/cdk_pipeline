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
        const pipeline = new pipelines.CodePipeline(this, `Pipeline-${props.environment}`, {
            selfMutation: true,
            synth: synthStep,
        });
        pipeline.addStage(new MyApplication(this, 'Deploy', {
            env: props.env,
            ecsImageTag: props.ecsImageTag,
            environment: props.environment
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
        new service_stack_1.ServiceStack(this, `MyService-${props.environment}`, {
            ecsImageTag: props.ecsImageTag, environment: props.environment
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUFrQztBQUNsQyxtREFBa0Q7QUFDbEQsd0RBQW9EO0FBZXBELE1BQWEsZ0JBQWlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4QixlQUFlO1FBR2YsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQywwQkFBMEIsRUFBRSxLQUFLLENBQUMsb0JBQW9CLEVBQUU7WUFDbEgsbUNBQW1DO1lBQ25DLGFBQWEsRUFBRSx3R0FBd0c7U0FDeEgsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUNqRCxLQUFLLEVBQUUsV0FBVztZQUNsQixRQUFRLEVBQUU7Z0JBQ1IsT0FBTztnQkFDUCxRQUFRO2dCQUNSLGVBQWU7Z0JBQ2YsZUFBZTthQUNoQjtTQUNGLENBQUMsQ0FBQTtRQUdGLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsWUFBWSxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDakYsWUFBWSxFQUFFLElBQUk7WUFDbEIsS0FBSyxFQUFFLFNBQVM7U0FDakIsQ0FBQyxDQUFDO1FBR0gsUUFBUSxDQUFDLFFBQVEsQ0FDZixJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ2hDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7U0FDL0IsQ0FBQyxFQUNGO1FBQ0UsUUFBUTtRQUNSLHlDQUF5QztRQUN6QyxzREFBc0Q7UUFDdEQsaUNBQWlDO1FBQ2pDLFFBQVE7UUFDUixJQUFJO1NBQ0wsQ0FDRixDQUFDO0lBRUosQ0FBQztDQUNGO0FBL0NELDRDQStDQztBQUdELE1BQU0sYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSw0QkFBWSxDQUFDLElBQUksRUFBRSxhQUFhLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUN2RCxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7U0FDL0QsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInXG5pbXBvcnQgKiBhcyBwaXBlbGluZXMgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJ1xuaW1wb3J0IHsgU2VydmljZVN0YWNrIH0gZnJvbSAnLi4vbGliL3NlcnZpY2Utc3RhY2snO1xuXG5cbmludGVyZmFjZSBQaXBlbGluZVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHBpcGVsaW5lU291cmNlQnJhbmNoOiBzdHJpbmc7XG4gIGVjc0ltYWdlVGFnOiBzdHJpbmdcbiAgZW52aXJvbm1lbnQ6IHN0cmluZ1xufVxuXG5pbnRlcmZhY2UgTXlBcHBsaWNhdGlvblByb3BzIGV4dGVuZHMgY2RrLlN0YWdlUHJvcHMge1xuICBlY3NJbWFnZVRhZzogc3RyaW5nXG4gIGVudmlyb25tZW50OiBzdHJpbmdcbn1cblxuXG5leHBvcnQgY2xhc3MgQ2RrUGlwZWxpbmVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQaXBlbGluZVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuXG4gICAgLy8gQ0RLIHBpcGVsaW5lXG5cblxuICAgIGNvbnN0IGdpdGh1YklucHV0ID0gcGlwZWxpbmVzLkNvZGVQaXBlbGluZVNvdXJjZS5jb25uZWN0aW9uKCdhZGFtLWdsaWdvci9jZGtfcGlwZWxpbmUnLCBwcm9wcy5waXBlbGluZVNvdXJjZUJyYW5jaCwge1xuICAgICAgLy8gY3JlYXRlIHRoZSBjb25uZWN0aW9uIG1hbnVhbGx5ICFcbiAgICAgIGNvbm5lY3Rpb25Bcm46ICdhcm46YXdzOmNvZGVzdGFyLWNvbm5lY3Rpb25zOmV1LWNlbnRyYWwtMTowMDc0MDE1MzcxOTM6Y29ubmVjdGlvbi83Y2I1ZjU0ZS04OGFkLTQ2YjItOTkyZi0zMTZiMWFiYTk5YzEnLCBcbiAgICB9KTtcblxuICAgIGNvbnN0IHN5bnRoU3RlcCA9IG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdTeW50aCcsIHtcbiAgICAgIGlucHV0OiBnaXRodWJJbnB1dCxcbiAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgIC8vJ2xzJyxcbiAgICAgICAgJ25wbSBjaScsXG4gICAgICAgICducG0gcnVuIGJ1aWxkJyxcbiAgICAgICAgJ25weCBjZGsgc3ludGgnLFxuICAgICAgXSxcbiAgICB9KVxuXG5cbiAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsIGBQaXBlbGluZS0ke3Byb3BzLmVudmlyb25tZW50fWAsIHtcbiAgICAgIHNlbGZNdXRhdGlvbjogdHJ1ZSxcbiAgICAgIHN5bnRoOiBzeW50aFN0ZXAsXG4gICAgfSk7ICAgIFxuXG5cbiAgICBwaXBlbGluZS5hZGRTdGFnZShcbiAgICAgIG5ldyBNeUFwcGxpY2F0aW9uKHRoaXMsICdEZXBsb3knLCB7XG4gICAgICAgIGVudjogcHJvcHMuZW52LFxuICAgICAgICBlY3NJbWFnZVRhZzogcHJvcHMuZWNzSW1hZ2VUYWcsXG4gICAgICAgIGVudmlyb25tZW50OiBwcm9wcy5lbnZpcm9ubWVudFxuICAgICAgfSksXG4gICAgICB7XG4gICAgICAgIC8vIHByZTpbXG4gICAgICAgIC8vICAgbmV3IHBpcGVsaW5lcy5TaGVsbFN0ZXAoJ1ZlcnNpb24nLCB7XG4gICAgICAgIC8vICAgICBpbnB1dDogc3ludGhTdGVwLmFkZE91dHB1dERpcmVjdG9yeSgndmVyc2lvbicpLFxuICAgICAgICAvLyAgICAgY29tbWFuZHM6IFsnY2F0IFZFUlNJT04nXSxcbiAgICAgICAgLy8gICB9KSxcbiAgICAgICAgLy8gXVxuICAgICAgfVxuICAgICk7XG5cbiAgfVxufVxuXG5cbmNsYXNzIE15QXBwbGljYXRpb24gZXh0ZW5kcyBjZGsuU3RhZ2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTXlBcHBsaWNhdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBuZXcgU2VydmljZVN0YWNrKHRoaXMsIGBNeVNlcnZpY2UtJHtwcm9wcy5lbnZpcm9ubWVudH1gLCB7XG4gICAgICBlY3NJbWFnZVRhZzogcHJvcHMuZWNzSW1hZ2VUYWcsIGVudmlyb25tZW50OiBwcm9wcy5lbnZpcm9ubWVudFxuICAgIH0pO1xuICB9XG59XG4iXX0=