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

install nvm 

install cdk  `npm install -g aws-cdk` it's just a cli, ok to install globally

initial proj setup `cdk init --language typescript`

create code start connection manually in console

bootstrap

```
cdk bootstrap --trust=007401537193 --cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess aws://007401537193/eu-central-1 --verbose --debug
```
the default `cdk bootstrap aws://007401537193/eu-central-1` is not enough !


## build & deploy 

A. deploy the ECS stack separately 

```
npm run cdk synth EcsStack
npm run cdk deploy EcsStack
```

B. deploy / bootstrap the pipelines 

```
npm run cdk synth StagingPipeline, ProductionPipeline
npm run cdk deploy StagingPipeline, ProductionPipeline
```


## other

aws sts get-caller-identity


## workflow 

*staging service deploy automatically from develop*

build push image to ecr (:develop)

aws ecs update-service --cluster MyFargateCluster --service MyAppService-staging --force-new-deployment


*feature branch deploy manually*


in infra project change image name for staging pipeline


*production deploy manually*

in infra project change image name for production pipeline

## links 

https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html

https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html

https://cdkworkshop.com/20-typescript/20-create-project.html (old)

https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ecs/update-service.html