import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
interface ServiceStackProps extends cdk.StackProps {
    ecsImageTag: string;
}
export declare class ServiceStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ServiceStackProps);
}
export {};
