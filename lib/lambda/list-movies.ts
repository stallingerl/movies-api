import {
  DynamoDBDocumentClient,
  paginateScan,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Logger from "@dazn/lambda-powertools-logger";

const ddbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    apiVersion: "2012-08-10",
  })
);

interface MovieItem {
  MovieName: string;
  ContactId: string;
}

const CUSTOMER_TABLE = process.env.CUSTOMER_TABLE ?? "";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  Logger.debug("incoming event", { event });
  if (
    event.httpMethod === "OPTIONS" &&
    (event.headers.Origin || event.headers.origin)
  ) {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Expose-Headers": "*",
      },
      body: "",
    };
  } else if (
    event.httpMethod !== "GET" ||
    (event.headers.Origin === undefined && event.headers.origin === undefined)
  ) {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const movies = await listMovies();
  return {
    statusCode: 200,
    body: JSON.stringify(movies),
    headers: {
      "Access-Control-Allow-Origin": "*",
      // event.headers.Origin ?? event.headers.origin ?? "",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Expose-Headers": "*",
    },
  };
}

async function listMovies(): Promise<MovieItem[]> {
  const movies: MovieItem[] = [];
  const params: ScanCommandInput = {
    TableName: CUSTOMER_TABLE,
  };
  for await (const scanResult of paginateScan({ client: ddbClient }, params)) {
    movies.push(...((scanResult.Items as MovieItem[]) ?? []));
  }
  return movies;
}
