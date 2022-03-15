# Welcome to your CDK TypeScript project

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## setup 

npm install -g aws-cdk

.. just a cli, ok to install globally

cdk init --language typescript

create code start connection 

bootstraaping: 

not ok ... cdk bootstrap aws://007401537193/eu-central-1


cdk bootstrap --trust=007401537193 --cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess aws://007401537193/eu-central-1 --verbose --debug


## links 

https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html

https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html

https://cdkworkshop.com/20-typescript/20-create-project.html (old)
