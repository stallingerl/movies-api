import { Names, Stack, StackProps, Duration, RemovalPolicy } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
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

    const updateMovieLambda = this.createUpdateMovieLambda(moviesTable);
    const listMoviesLambda = this.createListMoviesLambda(moviesTable);
    const searchMovieLambda = this.searchMovieLambda(moviesTable);

    const api = new RestApi(this, "ApiResource", {
      restApiName: Names.uniqueResourceName(new Construct(this, "Api"), {}),
    });
  
    const updateMovie = api.root.addResource("update-movie", {});
    updateMovie.addMethod(
      "OPTIONS",
      new LambdaIntegration(updateMovieLambda)
    );
    updateMovie.addMethod(
      "POST",
      new LambdaIntegration(updateMovieLambda)
    );

    const listMovies = api.root.addResource("list-movies", {});
    listMovies.addMethod(
      "OPTIONS",
      new LambdaIntegration(listMoviesLambda)
    );
    listMovies.addMethod(
      "GET",
      new LambdaIntegration(listMoviesLambda)
    );

    const searchMovie = api.root.addResource("search-movie", {});
    searchMovie.addMethod(
      "OPTIONS",
      new LambdaIntegration(searchMovieLambda)
    );
    searchMovie.addMethod(
      "GET",
      new LambdaIntegration(searchMovieLambda)
    );

  }

  private createUpdateMovieLambda(moviesTable: Table) {
    const updateMovieLambda = new NodejsFunction(
      this,
      "UpdateMovieLambda",
      {
        entry: path.join(__dirname, "lambda", "update-movie.ts"),
        bundling: {
          sourceMap: true,
        },
        environment: {
          NODE_OPTIONS: "--enable-source-maps",
          CUSTOMER_TABLE: moviesTable.tableName,
        },
        timeout: Duration.seconds(29),
      }
    );
    moviesTable.grantWriteData(updateMovieLambda);
    return updateMovieLambda;
  }

  private createListMoviesLambda(moviesTable: Table) {
    const listMoviesLambda = new NodejsFunction(
      this,
      "ListMoviesLambda",
      {
        entry: path.join(__dirname, "lambda", "list-movies.ts"),
        bundling: {
          sourceMap: true,
        },
        environment: {
          NODE_OPTIONS: "--enable-source-maps",
          CUSTOMER_TABLE: moviesTable.tableName,
        },
        timeout: Duration.seconds(29),
      }
    );
    moviesTable.grantReadData(listMoviesLambda);
    return listMoviesLambda;
  }

  private searchMovieLambda(moviesTable: Table) {
    const searchMovieLambda = new NodejsFunction(
      this,
      "SearchMoviesLambda",
      {
        entry: path.join(__dirname, "lambda", "search-movie.ts"),
        bundling: {
          sourceMap: true,
        },
        environment: {
          NODE_OPTIONS: "--enable-source-maps",
          CUSTOMER_TABLE: moviesTable.tableName,
        },
        timeout: Duration.seconds(29),
      }
    );
    moviesTable.grantReadData(searchMovieLambda);
    return searchMovieLambda;
  }
}
