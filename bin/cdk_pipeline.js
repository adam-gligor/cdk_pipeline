#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const cdk_pipeline_stack_1 = require("../lib/cdk_pipeline-stack");
const app = new cdk.App();
new cdk_pipeline_stack_1.CdkPipelineStack(app, 'CdkPipelineStack', {
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
    ecsImageTag: "develop"
    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
new cdk_pipeline_stack_1.CdkPipelineStack(app, 'CdkPipelineStackProd', {
    env: { account: '007401537193', region: 'eu-central-1' },
    pipelineSourceBranch: "master",
    ecsImageTag: "1.0.0"
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrX3BpcGVsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrX3BpcGVsaW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFxQztBQUNyQyxtQ0FBbUM7QUFDbkMsa0VBQTZEO0FBRTdELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUkscUNBQWdCLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFO0lBQzVDOztxRUFFaUU7SUFFakU7dUVBQ21FO0lBQ25FLDZGQUE2RjtJQUU3RjtzQ0FDa0M7SUFDbEMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFO0lBQ3hELG9CQUFvQixFQUFFLFNBQVM7SUFDL0IsV0FBVyxFQUFFLFNBQVM7SUFDdEIsOEZBQThGO0NBQy9GLENBQUMsQ0FBQztBQUVILElBQUkscUNBQWdCLENBQUMsR0FBRyxFQUFFLHNCQUFzQixFQUFFO0lBQ2hELEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRTtJQUN4RCxvQkFBb0IsRUFBRSxRQUFRO0lBQzlCLFdBQVcsRUFBRSxPQUFPO0NBQ3JCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDZGtQaXBlbGluZVN0YWNrIH0gZnJvbSAnLi4vbGliL2Nka19waXBlbGluZS1zdGFjayc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgQ2RrUGlwZWxpbmVTdGFjayhhcHAsICdDZGtQaXBlbGluZVN0YWNrJywge1xuICAvKiBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSAnZW52JywgdGhpcyBzdGFjayB3aWxsIGJlIGVudmlyb25tZW50LWFnbm9zdGljLlxuICAgKiBBY2NvdW50L1JlZ2lvbi1kZXBlbmRlbnQgZmVhdHVyZXMgYW5kIGNvbnRleHQgbG9va3VwcyB3aWxsIG5vdCB3b3JrLFxuICAgKiBidXQgYSBzaW5nbGUgc3ludGhlc2l6ZWQgdGVtcGxhdGUgY2FuIGJlIGRlcGxveWVkIGFueXdoZXJlLiAqL1xuXG4gIC8qIFVuY29tbWVudCB0aGUgbmV4dCBsaW5lIHRvIHNwZWNpYWxpemUgdGhpcyBzdGFjayBmb3IgdGhlIEFXUyBBY2NvdW50XG4gICAqIGFuZCBSZWdpb24gdGhhdCBhcmUgaW1wbGllZCBieSB0aGUgY3VycmVudCBDTEkgY29uZmlndXJhdGlvbi4gKi9cbiAgLy8gZW52OiB7IGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OIH0sXG5cbiAgLyogVW5jb21tZW50IHRoZSBuZXh0IGxpbmUgaWYgeW91IGtub3cgZXhhY3RseSB3aGF0IEFjY291bnQgYW5kIFJlZ2lvbiB5b3VcbiAgICogd2FudCB0byBkZXBsb3kgdGhlIHN0YWNrIHRvLiAqL1xuICBlbnY6IHsgYWNjb3VudDogJzAwNzQwMTUzNzE5MycsIHJlZ2lvbjogJ2V1LWNlbnRyYWwtMScgfSxcbiAgcGlwZWxpbmVTb3VyY2VCcmFuY2g6IFwiZGV2ZWxvcFwiLFxuICBlY3NJbWFnZVRhZzogXCJkZXZlbG9wXCJcbiAgLyogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2xhdGVzdC9ndWlkZS9lbnZpcm9ubWVudHMuaHRtbCAqL1xufSk7XG5cbm5ldyBDZGtQaXBlbGluZVN0YWNrKGFwcCwgJ0Nka1BpcGVsaW5lU3RhY2tQcm9kJywge1xuICBlbnY6IHsgYWNjb3VudDogJzAwNzQwMTUzNzE5MycsIHJlZ2lvbjogJ2V1LWNlbnRyYWwtMScgfSxcbiAgcGlwZWxpbmVTb3VyY2VCcmFuY2g6IFwibWFzdGVyXCIsXG4gIGVjc0ltYWdlVGFnOiBcIjEuMC4wXCJcbn0pOyJdfQ==