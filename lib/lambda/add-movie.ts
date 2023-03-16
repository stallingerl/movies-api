import {
  DynamoDBDocumentClient,
  PutCommandInput,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Logger from "@dazn/lambda-powertools-logger";

const ddbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    apiVersion: "2012-08-10",
  })
);

interface MovieItem {
  name: string;
  year: string;
  directorFirstName: string;
  directorLastName: string;
  synopsis: string;
}

const MOVIE_TABLE = process.env.MOVIE_TABLE ?? "";

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
        // event.headers.Origin ?? event.headers.origin ?? "",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Expose-Headers": "*",
      },
      body: JSON.stringify({ message: "" }),
    };
  } else if (
    event.httpMethod !== "POST" ||
    (event.headers.Origin === undefined && event.headers.origin === undefined)
  ) {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        // event.headers.Origin ?? event.headers.origin ?? "",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Expose-Headers": "*",
      },
    };
  }
  const inputMovieItem: MovieItem = JSON.parse(event.body ?? "{}") as MovieItem;
  const movieName = inputMovieItem.name;
  const movieYear = inputMovieItem.year ?? "";
  const directorFirstName = inputMovieItem.directorFirstName ?? "";
  const directorLastName = inputMovieItem.directorLastName ?? "";
  const synopsis = inputMovieItem.synopsis ?? "";
  if (movieName) {
    const movie = await putMovie(
      movieName,
      movieYear,
      directorFirstName,
      directorLastName,
      synopsis
    );
    if (!movie) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not found" }),
        headers: {
          "Access-Control-Allow-Origin": "*",
          // event.headers.Origin ?? event.headers.origin ?? "",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST",
          "Access-Control-Expose-Headers": "*",
        },
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OK" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        // event.headers.Origin ?? event.headers.origin ?? "",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Expose-Headers": "*",
      },
    };
  }
  return {
    statusCode: 405,
    body: JSON.stringify({ message: "Method Not Allowed" }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST",
      "Access-Control-Expose-Headers": "*",
    },
  };
}

async function putMovie(
  movieName: string,
  movieYear: string,
  directorFirstName: string,
  directorLastName: string,
  synopsis: string
) {

  let caseRecord: string = movieName;
  try {
    const result = await ddbClient.send(new PutItemCommand({
      TableName: MOVIE_TABLE,
      Item: {
        name: { S: movieName },
        year: { N: movieYear.toString() },
        director: {
          M: {
            "firstName": {
              S: directorFirstName,
            },
            "lastName": {
              S: directorLastName,
            }
          },
        },
        synopsis: { "S": synopsis },
      }  
    }));
  } catch (err) {
    Logger.error(
      "Failed to update info: ",
      { pk: movieName },
      err as Error
    );
  }
  return caseRecord;
}
