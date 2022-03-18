import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
interface PipelineStackProps extends cdk.StackProps {
    pipelineSourceBranch: string;
    ecsImageTag: string;
}
export declare class CdkPipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: PipelineStackProps);
}
export {};
