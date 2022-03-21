#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const cdk_pipeline_stack_1 = require("../lib/cdk_pipeline-stack");
const ecs_stack_1 = require("../lib/ecs-stack");
const app = new cdk.App();
new ecs_stack_1.EcsStack(app, 'EcsStack', {
    env: { account: '007401537193', region: 'eu-central-1' },
});
new cdk_pipeline_stack_1.CdkPipelineStack(app, 'StagingPipeline', {
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */
    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    env: { account: '007401537193', region: 'eu-central-1' },
    pipelineSourceBranch: "develop",
    ecsImageTag: "develop",
    environment: "staging"
    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
// new CdkPipelineStack(app, 'CdkPipelineStackProd', {
//   env: { account: '007401537193', region: 'eu-central-1' },
//   pipelineSourceBranch: "master",
//   ecsImageTag: "1.0.0"
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFxQztBQUNyQyxtQ0FBbUM7QUFDbkMsa0VBQThEO0FBQzlELGdEQUE2QztBQUU3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLG9CQUFRLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRTtJQUM1QixHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUU7Q0FDekQsQ0FBQyxDQUFDO0FBR0gsSUFBSSxxQ0FBZ0IsQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7SUFDM0M7O3FFQUVpRTtJQUVqRTt1RUFDbUU7SUFDbkUsNkZBQTZGO0lBRTdGO3NDQUNrQztJQUNsQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUU7SUFDeEQsb0JBQW9CLEVBQUUsU0FBUztJQUMvQixXQUFXLEVBQUUsU0FBUztJQUN0QixXQUFXLEVBQUUsU0FBUztJQUN0Qiw4RkFBOEY7Q0FDL0YsQ0FBQyxDQUFDO0FBR0gsc0RBQXNEO0FBQ3RELDhEQUE4RDtBQUM5RCxvQ0FBb0M7QUFDcEMseUJBQXlCO0FBQ3pCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3Rlcic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ2RrUGlwZWxpbmVTdGFjayAgfSBmcm9tICcuLi9saWIvY2RrX3BpcGVsaW5lLXN0YWNrJztcbmltcG9ydCB7IEVjc1N0YWNrICB9IGZyb20gJy4uL2xpYi9lY3Mtc3RhY2snO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgRWNzU3RhY2soYXBwLCAnRWNzU3RhY2snLCB7XG4gIGVudjogeyBhY2NvdW50OiAnMDA3NDAxNTM3MTkzJywgcmVnaW9uOiAnZXUtY2VudHJhbC0xJyB9LFxufSk7XG5cblxubmV3IENka1BpcGVsaW5lU3RhY2soYXBwLCAnU3RhZ2luZ1BpcGVsaW5lJywge1xuICAvKiBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSAnZW52JywgdGhpcyBzdGFjayB3aWxsIGJlIGVudmlyb25tZW50LWFnbm9zdGljLlxuICAgKiBBY2NvdW50L1JlZ2lvbi1kZXBlbmRlbnQgZmVhdHVyZXMgYW5kIGNvbnRleHQgbG9va3VwcyB3aWxsIG5vdCB3b3JrLFxuICAgKiBidXQgYSBzaW5nbGUgc3ludGhlc2l6ZWQgdGVtcGxhdGUgY2FuIGJlIGRlcGxveWVkIGFueXdoZXJlLiAqL1xuXG4gIC8qIFVuY29tbWVudCB0aGUgbmV4dCBsaW5lIHRvIHNwZWNpYWxpemUgdGhpcyBzdGFjayBmb3IgdGhlIEFXUyBBY2NvdW50XG4gICAqIGFuZCBSZWdpb24gdGhhdCBhcmUgaW1wbGllZCBieSB0aGUgY3VycmVudCBDTEkgY29uZmlndXJhdGlvbi4gKi9cbiAgLy8gZW52OiB7IGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OIH0sXG5cbiAgLyogVW5jb21tZW50IHRoZSBuZXh0IGxpbmUgaWYgeW91IGtub3cgZXhhY3RseSB3aGF0IEFjY291bnQgYW5kIFJlZ2lvbiB5b3VcbiAgICogd2FudCB0byBkZXBsb3kgdGhlIHN0YWNrIHRvLiAqL1xuICBlbnY6IHsgYWNjb3VudDogJzAwNzQwMTUzNzE5MycsIHJlZ2lvbjogJ2V1LWNlbnRyYWwtMScgfSxcbiAgcGlwZWxpbmVTb3VyY2VCcmFuY2g6IFwiZGV2ZWxvcFwiLFxuICBlY3NJbWFnZVRhZzogXCJkZXZlbG9wXCIsXG4gIGVudmlyb25tZW50OiBcInN0YWdpbmdcIlxuICAvKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvbGF0ZXN0L2d1aWRlL2Vudmlyb25tZW50cy5odG1sICovXG59KTtcblxuXG4vLyBuZXcgQ2RrUGlwZWxpbmVTdGFjayhhcHAsICdDZGtQaXBlbGluZVN0YWNrUHJvZCcsIHtcbi8vICAgZW52OiB7IGFjY291bnQ6ICcwMDc0MDE1MzcxOTMnLCByZWdpb246ICdldS1jZW50cmFsLTEnIH0sXG4vLyAgIHBpcGVsaW5lU291cmNlQnJhbmNoOiBcIm1hc3RlclwiLFxuLy8gICBlY3NJbWFnZVRhZzogXCIxLjAuMFwiXG4vLyB9KTsiXX0=