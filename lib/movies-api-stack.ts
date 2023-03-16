import { Names, Stack, StackProps, Duration, RemovalPolicy } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Table, BillingMode, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MovieApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const moviesTable = new Table(this, `MoviesTable`, {
      partitionKey: {
        name: "name",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const addMovieLambda = this.createAddMovieLambda(moviesTable);
    const listMoviesLambda = this.createListMoviesLambda(moviesTable);

    const api = new RestApi(this, "ApiResource", {
      restApiName: Names.uniqueResourceName(new Construct(this, "Api"), {}),
    });

    const addMovie = api.root.addResource("add-movie", {});
    addMovie.addMethod("OPTIONS", new LambdaIntegration(addMovieLambda));
    addMovie.addMethod("POST", new LambdaIntegration(addMovieLambda));

    const listMovies = api.root.addResource("list-movies", {});
    listMovies.addMethod("OPTIONS", new LambdaIntegration(listMoviesLambda));
    listMovies.addMethod("GET", new LambdaIntegration(listMoviesLambda));
  }

  private createAddMovieLambda(moviesTable: Table) {
    const addMovieLambda = new NodejsFunction(this, "AddMovieLambda", {
      entry: path.join(__dirname, "lambda", "add-movie.ts"),
      bundling: {
        sourceMap: true,
      },
      environment: {
        NODE_OPTIONS: "--enable-source-maps",
        CUSTOMER_TABLE: moviesTable.tableName,
      },
      timeout: Duration.seconds(29),
    });
    moviesTable.grantWriteData(addMovieLambda);
    return addMovieLambda;
  }

  private createListMoviesLambda(moviesTable: Table) {
    const listMoviesLambda = new NodejsFunction(this, "ListMoviesLambda", {
      entry: path.join(__dirname, "lambda", "list-movies.ts"),
      bundling: {
        sourceMap: true,
      },
      environment: {
        NODE_OPTIONS: "--enable-source-maps",
        CUSTOMER_TABLE: moviesTable.tableName,
      },
      timeout: Duration.seconds(29),
    });
    moviesTable.grantReadData(listMoviesLambda);
    return listMoviesLambda;
  }
}
