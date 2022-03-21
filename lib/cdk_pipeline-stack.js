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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUFrQztBQUNsQyxtREFBa0Q7QUFDbEQsd0RBQW9EO0FBZXBELE1BQWEsZ0JBQWlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd4QixlQUFlO1FBR2YsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQywwQkFBMEIsRUFBRSxLQUFLLENBQUMsb0JBQW9CLEVBQUU7WUFDbEgsbUNBQW1DO1lBQ25DLGFBQWEsRUFBRSx3R0FBd0c7U0FDeEgsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUNqRCxLQUFLLEVBQUUsV0FBVztZQUNsQixRQUFRLEVBQUU7Z0JBQ1IsT0FBTztnQkFDUCxRQUFRO2dCQUNSLGVBQWU7Z0JBQ2YsZUFBZTthQUNoQjtTQUNGLENBQUMsQ0FBQTtRQUdGLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzVELFlBQVksRUFBRSxJQUFJO1lBQ2xCLEtBQUssRUFBRSxTQUFTO1NBQ2pCLENBQUMsQ0FBQztRQUdILFFBQVEsQ0FBQyxRQUFRLENBQ2YsSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNoQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQy9CLENBQUMsRUFDRjtRQUNFLFFBQVE7UUFDUix5Q0FBeUM7UUFDekMsc0RBQXNEO1FBQ3RELGlDQUFpQztRQUNqQyxRQUFRO1FBQ1IsSUFBSTtTQUNMLENBQ0YsQ0FBQztJQUVKLENBQUM7Q0FDRjtBQS9DRCw0Q0ErQ0M7QUFHRCxNQUFNLGFBQWMsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNuQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ2xDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztTQUMvRCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYidcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnXG5pbXBvcnQgeyBTZXJ2aWNlU3RhY2sgfSBmcm9tICcuLi9saWIvc2VydmljZS1zdGFjayc7XG5cblxuaW50ZXJmYWNlIFBpcGVsaW5lU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgcGlwZWxpbmVTb3VyY2VCcmFuY2g6IHN0cmluZztcbiAgZWNzSW1hZ2VUYWc6IHN0cmluZ1xuICBlbnZpcm9ubWVudDogc3RyaW5nXG59XG5cbmludGVyZmFjZSBNeUFwcGxpY2F0aW9uUHJvcHMgZXh0ZW5kcyBjZGsuU3RhZ2VQcm9wcyB7XG4gIGVjc0ltYWdlVGFnOiBzdHJpbmdcbiAgZW52aXJvbm1lbnQ6IHN0cmluZ1xufVxuXG5cbmV4cG9ydCBjbGFzcyBDZGtQaXBlbGluZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFBpcGVsaW5lU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG5cbiAgICAvLyBDREsgcGlwZWxpbmVcblxuXG4gICAgY29uc3QgZ2l0aHViSW5wdXQgPSBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLmNvbm5lY3Rpb24oJ2FkYW0tZ2xpZ29yL2Nka19waXBlbGluZScsIHByb3BzLnBpcGVsaW5lU291cmNlQnJhbmNoLCB7XG4gICAgICAvLyBjcmVhdGUgdGhlIGNvbm5lY3Rpb24gbWFudWFsbHkgIVxuICAgICAgY29ubmVjdGlvbkFybjogJ2Fybjphd3M6Y29kZXN0YXItY29ubmVjdGlvbnM6ZXUtY2VudHJhbC0xOjAwNzQwMTUzNzE5Mzpjb25uZWN0aW9uLzdjYjVmNTRlLTg4YWQtNDZiMi05OTJmLTMxNmIxYWJhOTljMScsIFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3ludGhTdGVwID0gbmV3IHBpcGVsaW5lcy5TaGVsbFN0ZXAoJ1N5bnRoJywge1xuICAgICAgaW5wdXQ6IGdpdGh1YklucHV0LFxuICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgLy8nbHMnLFxuICAgICAgICAnbnBtIGNpJyxcbiAgICAgICAgJ25wbSBydW4gYnVpbGQnLFxuICAgICAgICAnbnB4IGNkayBzeW50aCcsXG4gICAgICBdLFxuICAgIH0pXG5cblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmUodGhpcywgJ1BpcGVsaW5lJywge1xuICAgICAgc2VsZk11dGF0aW9uOiB0cnVlLFxuICAgICAgc3ludGg6IHN5bnRoU3RlcCxcbiAgICB9KTsgICAgXG5cblxuICAgIHBpcGVsaW5lLmFkZFN0YWdlKFxuICAgICAgbmV3IE15QXBwbGljYXRpb24odGhpcywgJ0RlcGxveScsIHtcbiAgICAgICAgZW52OiBwcm9wcy5lbnYsXG4gICAgICAgIGVjc0ltYWdlVGFnOiBwcm9wcy5lY3NJbWFnZVRhZyxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHByb3BzLmVudmlyb25tZW50XG4gICAgICB9KSxcbiAgICAgIHtcbiAgICAgICAgLy8gcHJlOltcbiAgICAgICAgLy8gICBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnVmVyc2lvbicsIHtcbiAgICAgICAgLy8gICAgIGlucHV0OiBzeW50aFN0ZXAuYWRkT3V0cHV0RGlyZWN0b3J5KCd2ZXJzaW9uJyksXG4gICAgICAgIC8vICAgICBjb21tYW5kczogWydjYXQgVkVSU0lPTiddLFxuICAgICAgICAvLyAgIH0pLFxuICAgICAgICAvLyBdXG4gICAgICB9XG4gICAgKTtcblxuICB9XG59XG5cblxuY2xhc3MgTXlBcHBsaWNhdGlvbiBleHRlbmRzIGNkay5TdGFnZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBNeUFwcGxpY2F0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIG5ldyBTZXJ2aWNlU3RhY2sodGhpcywgJ015U2VydmljZScsIHtcbiAgICAgIGVjc0ltYWdlVGFnOiBwcm9wcy5lY3NJbWFnZVRhZywgZW52aXJvbm1lbnQ6IHByb3BzLmVudmlyb25tZW50XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==