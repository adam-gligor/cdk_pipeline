"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkPipelineStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const pipelines_1 = require("aws-cdk-lib/pipelines");
// import * as sqs from 'aws-cdk-lib/aws-sqs';
// https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html
class CdkPipelineStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const modernPipeline = new pipelines_1.CodePipeline(this, 'Pipeline', {
            selfMutation: true,
            synth: new pipelines_1.ShellStep('Synth', {
                input: pipelines_1.CodePipelineSource.connection('my-org/my-app', 'master', {
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
    }
}
exports.CdkPipelineStack = CdkPipelineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFnRDtBQUNoRCxxREFBb0Y7QUFHcEYsOENBQThDO0FBRTlDLGdGQUFnRjtBQUVoRixNQUFhLGdCQUFpQixTQUFRLG1CQUFLO0lBQ3pDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxjQUFjLEdBQUcsSUFBSSx3QkFBWSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDeEQsWUFBWSxFQUFFLElBQUk7WUFDbEIsS0FBSyxFQUFFLElBQUkscUJBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQzVCLEtBQUssRUFBRSw4QkFBa0IsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRTtvQkFDOUQsbUNBQW1DO29CQUNuQyxhQUFhLEVBQUUsd0dBQXdHO2lCQUN4SCxDQUFDO2dCQUNGLFFBQVEsRUFBRTtvQkFDUixRQUFRO29CQUNSLGVBQWU7b0JBQ2YsZUFBZTtpQkFDaEI7YUFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0lBRUwsQ0FBQztDQUNGO0FBcEJELDRDQW9CQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29kZVBpcGVsaW5lLCBTaGVsbFN0ZXAsIENvZGVQaXBlbGluZVNvdXJjZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9waXBlbGluZXNcIjtcblxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG4vLyBpbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5cbi8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YyL2RvY3MvYXdzLWNkay1saWIucGlwZWxpbmVzLXJlYWRtZS5odG1sXG5cbmV4cG9ydCBjbGFzcyBDZGtQaXBlbGluZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IG1vZGVyblBpcGVsaW5lID0gbmV3IENvZGVQaXBlbGluZSh0aGlzLCAnUGlwZWxpbmUnLCB7XG4gICAgICBzZWxmTXV0YXRpb246IHRydWUsXG4gICAgICBzeW50aDogbmV3IFNoZWxsU3RlcCgnU3ludGgnLCB7XG4gICAgICAgIGlucHV0OiBDb2RlUGlwZWxpbmVTb3VyY2UuY29ubmVjdGlvbignbXktb3JnL215LWFwcCcsICdtYXN0ZXInLCB7XG4gICAgICAgICAgLy8gY3JlYXRlIHRoZSBjb25uZWN0aW9uIG1hbnVhbGx5ICFcbiAgICAgICAgICBjb25uZWN0aW9uQXJuOiAnYXJuOmF3czpjb2Rlc3Rhci1jb25uZWN0aW9uczpldS1jZW50cmFsLTE6MDA3NDAxNTM3MTkzOmNvbm5lY3Rpb24vN2NiNWY1NGUtODhhZC00NmIyLTk5MmYtMzE2YjFhYmE5OWMxJywgXG4gICAgICAgIH0pLFxuICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICducG0gY2knLFxuICAgICAgICAgICducG0gcnVuIGJ1aWxkJyxcbiAgICAgICAgICAnbnB4IGNkayBzeW50aCcsXG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICBcbiAgfVxufVxuIl19