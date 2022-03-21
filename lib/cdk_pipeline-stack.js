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
        new service_stack_1.ServiceStack(this, 'MyService', {
            ecsImageTag: props.ecsImageTag, environment: props.environment
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUFrQztBQUNsQyxtREFBa0Q7QUFDbEQsd0RBQW9EO0FBZXBELE1BQWEsZ0JBQWlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4QixlQUFlO1FBR2YsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQywwQkFBMEIsRUFBRSxLQUFLLENBQUMsb0JBQW9CLEVBQUU7WUFDbEgsbUNBQW1DO1lBQ25DLGFBQWEsRUFBRSx3R0FBd0c7U0FDeEgsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUNqRCxLQUFLLEVBQUUsV0FBVztZQUNsQixRQUFRLEVBQUU7Z0JBQ1IsT0FBTztnQkFDUCxRQUFRO2dCQUNSLGVBQWU7Z0JBQ2YsZUFBZTthQUNoQjtTQUNGLENBQUMsQ0FBQTtRQUdGLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsWUFBWSxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDakYsWUFBWSxFQUFFLElBQUk7WUFDbEIsS0FBSyxFQUFFLFNBQVM7U0FDakIsQ0FBQyxDQUFDO1FBR0gsUUFBUSxDQUFDLFFBQVEsQ0FDZixJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ2hDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7U0FDL0IsQ0FBQyxFQUNGO1FBQ0UsUUFBUTtRQUNSLHlDQUF5QztRQUN6QyxzREFBc0Q7UUFDdEQsaUNBQWlDO1FBQ2pDLFFBQVE7UUFDUixJQUFJO1NBQ0wsQ0FDRixDQUFDO0lBRUosQ0FBQztDQUNGO0FBL0NELDRDQStDQztBQUdELE1BQU0sYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSw0QkFBWSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDbEMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQy9ELENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJ1xuaW1wb3J0ICogYXMgcGlwZWxpbmVzIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcydcbmltcG9ydCB7IFNlcnZpY2VTdGFjayB9IGZyb20gJy4uL2xpYi9zZXJ2aWNlLXN0YWNrJztcblxuXG5pbnRlcmZhY2UgUGlwZWxpbmVTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICBwaXBlbGluZVNvdXJjZUJyYW5jaDogc3RyaW5nO1xuICBlY3NJbWFnZVRhZzogc3RyaW5nXG4gIGVudmlyb25tZW50OiBzdHJpbmdcbn1cblxuaW50ZXJmYWNlIE15QXBwbGljYXRpb25Qcm9wcyBleHRlbmRzIGNkay5TdGFnZVByb3BzIHtcbiAgZWNzSW1hZ2VUYWc6IHN0cmluZ1xuICBlbnZpcm9ubWVudDogc3RyaW5nXG59XG5cblxuZXhwb3J0IGNsYXNzIENka1BpcGVsaW5lU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUGlwZWxpbmVTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cblxuICAgIC8vIENESyBwaXBlbGluZVxuXG5cbiAgICBjb25zdCBnaXRodWJJbnB1dCA9IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmVTb3VyY2UuY29ubmVjdGlvbignYWRhbS1nbGlnb3IvY2RrX3BpcGVsaW5lJywgcHJvcHMucGlwZWxpbmVTb3VyY2VCcmFuY2gsIHtcbiAgICAgIC8vIGNyZWF0ZSB0aGUgY29ubmVjdGlvbiBtYW51YWxseSAhXG4gICAgICBjb25uZWN0aW9uQXJuOiAnYXJuOmF3czpjb2Rlc3Rhci1jb25uZWN0aW9uczpldS1jZW50cmFsLTE6MDA3NDAxNTM3MTkzOmNvbm5lY3Rpb24vN2NiNWY1NGUtODhhZC00NmIyLTk5MmYtMzE2YjFhYmE5OWMxJywgXG4gICAgfSk7XG5cbiAgICBjb25zdCBzeW50aFN0ZXAgPSBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XG4gICAgICBpbnB1dDogZ2l0aHViSW5wdXQsXG4gICAgICBjb21tYW5kczogW1xuICAgICAgICAvLydscycsXG4gICAgICAgICducG0gY2knLFxuICAgICAgICAnbnBtIHJ1biBidWlsZCcsXG4gICAgICAgICducHggY2RrIHN5bnRoJyxcbiAgICAgIF0sXG4gICAgfSlcblxuXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCBgUGlwZWxpbmUtJHtwcm9wcy5lbnZpcm9ubWVudH1gLCB7XG4gICAgICBzZWxmTXV0YXRpb246IHRydWUsXG4gICAgICBzeW50aDogc3ludGhTdGVwLFxuICAgIH0pOyAgICBcblxuXG4gICAgcGlwZWxpbmUuYWRkU3RhZ2UoXG4gICAgICBuZXcgTXlBcHBsaWNhdGlvbih0aGlzLCAnRGVwbG95Jywge1xuICAgICAgICBlbnY6IHByb3BzLmVudixcbiAgICAgICAgZWNzSW1hZ2VUYWc6IHByb3BzLmVjc0ltYWdlVGFnLFxuICAgICAgICBlbnZpcm9ubWVudDogcHJvcHMuZW52aXJvbm1lbnRcbiAgICAgIH0pLFxuICAgICAge1xuICAgICAgICAvLyBwcmU6W1xuICAgICAgICAvLyAgIG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdWZXJzaW9uJywge1xuICAgICAgICAvLyAgICAgaW5wdXQ6IHN5bnRoU3RlcC5hZGRPdXRwdXREaXJlY3RvcnkoJ3ZlcnNpb24nKSxcbiAgICAgICAgLy8gICAgIGNvbW1hbmRzOiBbJ2NhdCBWRVJTSU9OJ10sXG4gICAgICAgIC8vICAgfSksXG4gICAgICAgIC8vIF1cbiAgICAgIH1cbiAgICApO1xuXG4gIH1cbn1cblxuXG5jbGFzcyBNeUFwcGxpY2F0aW9uIGV4dGVuZHMgY2RrLlN0YWdlIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE15QXBwbGljYXRpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgbmV3IFNlcnZpY2VTdGFjayh0aGlzLCAnTXlTZXJ2aWNlJywge1xuICAgICAgZWNzSW1hZ2VUYWc6IHByb3BzLmVjc0ltYWdlVGFnLCBlbnZpcm9ubWVudDogcHJvcHMuZW52aXJvbm1lbnRcbiAgICB9KTtcbiAgfVxufVxuIl19