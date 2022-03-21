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
new cdk_pipeline_stack_1.CdkPipelineStack(app, 'ProductionPipeline', {
    env: { account: '007401537193', region: 'eu-central-1' },
    pipelineSourceBranch: "master",
    ecsImageTag: "1.0.0",
    environment: "production"
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFxQztBQUNyQyxtQ0FBbUM7QUFDbkMsa0VBQThEO0FBQzlELGdEQUE2QztBQUU3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLG9CQUFRLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRTtJQUM1QixHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUU7Q0FDekQsQ0FBQyxDQUFDO0FBR0gsSUFBSSxxQ0FBZ0IsQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7SUFDM0M7O3FFQUVpRTtJQUVqRTt1RUFDbUU7SUFDbkUsNkZBQTZGO0lBRTdGO3NDQUNrQztJQUNsQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUU7SUFDeEQsb0JBQW9CLEVBQUUsU0FBUztJQUMvQixXQUFXLEVBQUUsU0FBUztJQUN0QixXQUFXLEVBQUUsU0FBUztJQUN0Qiw4RkFBOEY7Q0FDL0YsQ0FBQyxDQUFDO0FBR0gsSUFBSSxxQ0FBZ0IsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLEVBQUU7SUFDOUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFO0lBQ3hELG9CQUFvQixFQUFFLFFBQVE7SUFDOUIsV0FBVyxFQUFFLE9BQU87SUFDcEIsV0FBVyxFQUFFLFlBQVk7Q0FDMUIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENka1BpcGVsaW5lU3RhY2sgIH0gZnJvbSAnLi4vbGliL2Nka19waXBlbGluZS1zdGFjayc7XG5pbXBvcnQgeyBFY3NTdGFjayAgfSBmcm9tICcuLi9saWIvZWNzLXN0YWNrJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IEVjc1N0YWNrKGFwcCwgJ0Vjc1N0YWNrJywge1xuICBlbnY6IHsgYWNjb3VudDogJzAwNzQwMTUzNzE5MycsIHJlZ2lvbjogJ2V1LWNlbnRyYWwtMScgfSxcbn0pO1xuXG5cbm5ldyBDZGtQaXBlbGluZVN0YWNrKGFwcCwgJ1N0YWdpbmdQaXBlbGluZScsIHtcbiAgLyogSWYgeW91IGRvbid0IHNwZWNpZnkgJ2VudicsIHRoaXMgc3RhY2sgd2lsbCBiZSBlbnZpcm9ubWVudC1hZ25vc3RpYy5cbiAgICogQWNjb3VudC9SZWdpb24tZGVwZW5kZW50IGZlYXR1cmVzIGFuZCBjb250ZXh0IGxvb2t1cHMgd2lsbCBub3Qgd29yayxcbiAgICogYnV0IGEgc2luZ2xlIHN5bnRoZXNpemVkIHRlbXBsYXRlIGNhbiBiZSBkZXBsb3llZCBhbnl3aGVyZS4gKi9cblxuICAvKiBVbmNvbW1lbnQgdGhlIG5leHQgbGluZSB0byBzcGVjaWFsaXplIHRoaXMgc3RhY2sgZm9yIHRoZSBBV1MgQWNjb3VudFxuICAgKiBhbmQgUmVnaW9uIHRoYXQgYXJlIGltcGxpZWQgYnkgdGhlIGN1cnJlbnQgQ0xJIGNvbmZpZ3VyYXRpb24uICovXG4gIC8vIGVudjogeyBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5ULCByZWdpb246IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTiB9LFxuXG4gIC8qIFVuY29tbWVudCB0aGUgbmV4dCBsaW5lIGlmIHlvdSBrbm93IGV4YWN0bHkgd2hhdCBBY2NvdW50IGFuZCBSZWdpb24geW91XG4gICAqIHdhbnQgdG8gZGVwbG95IHRoZSBzdGFjayB0by4gKi9cbiAgZW52OiB7IGFjY291bnQ6ICcwMDc0MDE1MzcxOTMnLCByZWdpb246ICdldS1jZW50cmFsLTEnIH0sXG4gIHBpcGVsaW5lU291cmNlQnJhbmNoOiBcImRldmVsb3BcIixcbiAgZWNzSW1hZ2VUYWc6IFwiZGV2ZWxvcFwiLFxuICBlbnZpcm9ubWVudDogXCJzdGFnaW5nXCJcbiAgLyogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2xhdGVzdC9ndWlkZS9lbnZpcm9ubWVudHMuaHRtbCAqL1xufSk7XG5cblxubmV3IENka1BpcGVsaW5lU3RhY2soYXBwLCAnUHJvZHVjdGlvblBpcGVsaW5lJywge1xuICBlbnY6IHsgYWNjb3VudDogJzAwNzQwMTUzNzE5MycsIHJlZ2lvbjogJ2V1LWNlbnRyYWwtMScgfSxcbiAgcGlwZWxpbmVTb3VyY2VCcmFuY2g6IFwibWFzdGVyXCIsXG4gIGVjc0ltYWdlVGFnOiBcIjEuMC4wXCIsXG4gIGVudmlyb25tZW50OiBcInByb2R1Y3Rpb25cIlxufSk7Il19