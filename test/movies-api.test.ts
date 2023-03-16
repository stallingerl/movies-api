import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as MovieApiStack from "../lib/movies-api-stack";
import { handler } from "../lib/lambda/list-movies";
import { APIGatewayProxyEvent } from "aws-lambda";

test("Movies Lambdas Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new MovieApiStack.MovieApiStack(app, "MyTestStack");
  // THEN
  const template = Template.fromStack(stack);

  // Assert it creates the function with the correct properties...
  template.hasResourceProperties("AWS::Lambda::Function", {
    Handler: "index.handler",
    Runtime: "nodejs14.x",
  });
});

// test list-movies Lambda with API event
it("should return status code 200", async function () {
  var event: APIGatewayProxyEvent = {
    resource: "/list-movies",
    path: "/list-movies",
    httpMethod: "GET",
    headers: {
      Accept: "*/*",
      "CloudFront-Forwarded-Proto": "https",
      "CloudFront-Is-Desktop-Viewer": "true",
      "CloudFront-Is-Mobile-Viewer": "false",
      "CloudFront-Is-SmartTV-Viewer": "false",
      "CloudFront-Is-Tablet-Viewer": "false",
      "CloudFront-Viewer-ASN": "14618",
      "CloudFront-Viewer-Country": "US",
      Host: "j37rcp3eo2.execute-api.eu-central-1.amazonaws.com",
      "User-Agent": "Mozilla/5.0 (compatible)",
      Via: "1.1 5148e372b4ab17878741ea92be548472.cloudfront.net (CloudFront)",
      "X-Amz-Cf-Id": "ZdFZwafaOdHqKcx6C-43dj8AoO_9sgAe8qJBY2__gbYZU0qxxS7NcA==",
      "X-Amzn-Trace-Id": "Root=1-64131db1-031f1ec26741ab9f270159f1",
      "X-Forwarded-For": "34.235.48.77, 130.176.179.40",
      "X-Forwarded-Port": "443",
      "X-Forwarded-Proto": "https",
      Origin: "",
    },
    multiValueHeaders: {
      Accept: ["*/*"],
      "CloudFront-Forwarded-Proto": ["https"],
      "CloudFront-Is-Desktop-Viewer": ["true"],
      "CloudFront-Is-Mobile-Viewer": ["false"],
      "CloudFront-Is-SmartTV-Viewer": ["false"],
      "CloudFront-Is-Tablet-Viewer": ["false"],
      "CloudFront-Viewer-ASN": ["14618"],
      "CloudFront-Viewer-Country": ["US"],
      Host: ["j37rcp3eo2.execute-api.eu-central-1.amazonaws.com"],
      "User-Agent": ["Mozilla/5.0 (compatible)"],
      Via: ["1.1 5148e372b4ab17878741ea92be548472.cloudfront.net (CloudFront)"],
      "X-Amz-Cf-Id": [
        "ZdFZwafaOdHqKcx6C-43dj8AoO_9sgAe8qJBY2__gbYZU0qxxS7NcA==",
      ],
      "X-Amzn-Trace-Id": ["Root=1-64131db1-031f1ec26741ab9f270159f1"],
      "X-Forwarded-For": ["34.235.48.77, 130.176.179.40"],
      "X-Forwarded-Port": ["443"],
      "X-Forwarded-Proto": ["https"],
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
      resourceId: "nblcjd",
      resourcePath: "/list-movies",
      httpMethod: "GET",
      extendedRequestId: "B4GTtH6NliAFfBQ=",
      requestTime: "16/Mar/2023:13:46:25 +0000",
      path: "/prod/list-movies",
      accountId: "285794439465",
      protocol: "HTTP/1.1",
      stage: "prod",
      domainPrefix: "j37rcp3eo2",
      requestTimeEpoch: 1678974385068,
      requestId: "d5b18a70-081f-4046-bd99-dcb95f1bb276",
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        sourceIp: "34.235.48.77",
        principalOrgId: null,
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: "Mozilla/5.0 (compatible)",
        user: null,
        apiKey: null,
        apiKeyId: null,
        clientCert: null,
      },
      domainName: "j37rcp3eo2.execute-api.eu-central-1.amazonaws.com",
      apiId: "j37rcp3eo2",
      authorizer: undefined,
    },
    body: null,
    isBase64Encoded: false,
  };
  const result = await handler(event);

  expect(result.statusCode).toEqual(200);
});

it("expects method not allowed due to wrong method: POST instead of GET", async () => {
  var event: APIGatewayProxyEvent = {
    resource: "/list-movies",
    path: "/list-movies",
    httpMethod: "POST",
    headers: {
      Accept: "*/*",
      "CloudFront-Forwarded-Proto": "https",
      "CloudFront-Is-Desktop-Viewer": "true",
      "CloudFront-Is-Mobile-Viewer": "false",
      "CloudFront-Is-SmartTV-Viewer": "false",
      "CloudFront-Is-Tablet-Viewer": "false",
      "CloudFront-Viewer-ASN": "14618",
      "CloudFront-Viewer-Country": "US",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Expose-Headers": "*",
      Host: "j37rcp3eo2.execute-api.eu-central-1.amazonaws.com",
      "User-Agent": "Mozilla/5.0 (compatible)",
      Via: "1.1 5148e372b4ab17878741ea92be548472.cloudfront.net (CloudFront)",
      "X-Amz-Cf-Id": "ZdFZwafaOdHqKcx6C-43dj8AoO_9sgAe8qJBY2__gbYZU0qxxS7NcA==",
      "X-Amzn-Trace-Id": "Root=1-64131db1-031f1ec26741ab9f270159f1",
      "X-Forwarded-For": "34.235.48.77, 130.176.179.40",
      "X-Forwarded-Port": "443",
      "X-Forwarded-Proto": "https",
      Origin: "",
    },
    multiValueHeaders: {
      Accept: ["*/*"],
      "CloudFront-Forwarded-Proto": ["https"],
      "CloudFront-Is-Desktop-Viewer": ["true"],
      "CloudFront-Is-Mobile-Viewer": ["false"],
      "CloudFront-Is-SmartTV-Viewer": ["false"],
      "CloudFront-Is-Tablet-Viewer": ["false"],
      "CloudFront-Viewer-ASN": ["14618"],
      "CloudFront-Viewer-Country": ["US"],
      Host: ["j37rcp3eo2.execute-api.eu-central-1.amazonaws.com"],
      "User-Agent": ["Mozilla/5.0 (compatible)"],
      Via: ["1.1 5148e372b4ab17878741ea92be548472.cloudfront.net (CloudFront)"],
      "X-Amz-Cf-Id": [
        "ZdFZwafaOdHqKcx6C-43dj8AoO_9sgAe8qJBY2__gbYZU0qxxS7NcA==",
      ],
      "X-Amzn-Trace-Id": ["Root=1-64131db1-031f1ec26741ab9f270159f1"],
      "X-Forwarded-For": ["34.235.48.77, 130.176.179.40"],
      "X-Forwarded-Port": ["443"],
      "X-Forwarded-Proto": ["https"],
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
      resourceId: "nblcjd",
      resourcePath: "/list-movies",
      httpMethod: "POST",
      extendedRequestId: "B4GTtH6NliAFfBQ=",
      requestTime: "16/Mar/2023:13:46:25 +0000",
      path: "/prod/list-movies",
      accountId: "285794439465",
      protocol: "HTTP/1.1",
      stage: "prod",
      domainPrefix: "j37rcp3eo2",
      requestTimeEpoch: 1678974385068,
      requestId: "d5b18a70-081f-4046-bd99-dcb95f1bb276",
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        sourceIp: "34.235.48.77",
        principalOrgId: null,
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: "Mozilla/5.0 (compatible)",
        user: null,
        apiKey: null,
        apiKeyId: null,
        clientCert: null,
      },
      domainName: "j37rcp3eo2.execute-api.eu-central-1.amazonaws.com",
      apiId: "j37rcp3eo2",
      authorizer: undefined,
    },
    body: null,
    isBase64Encoded: false,
  };

  const result = await handler(event);

  expect(result.statusCode).toEqual(405);
  expect(result.body).toEqual("Method Not Allowed");
});
