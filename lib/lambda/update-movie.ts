import {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
  QueryCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Logger from "@dazn/lambda-powertools-logger";

const ddbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    apiVersion: "2012-08-10",
  })
);

interface CustomerItem {
  CustomerName: string;
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
        // event.headers.Origin ?? event.headers.origin ?? "",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Expose-Headers": "*",
      },
      body: JSON.stringify({"message": ""}),
    };
  } else if (
    event.httpMethod !== "POST" ||
    (event.headers.Origin === undefined && event.headers.origin === undefined)
  ) {
    return {
      statusCode: 405,
      body: JSON.stringify({"message":"Method Not Allowed"}),
      headers: {
        "Access-Control-Allow-Origin": "*",
        // event.headers.Origin ?? event.headers.origin ?? "",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Expose-Headers": "*",
      },
    };
  }
  const inputCustomerItem: CustomerItem = JSON.parse(
    event.body ?? "{}"
  ) as CustomerItem;
  const customerName = inputCustomerItem.CustomerName;
  const contactId = inputCustomerItem.ContactId ?? "";
  if (customerName && contactId) {
    const customer = await updateCustomer(customerName, contactId);
    if (!customer) {
      return {
        statusCode: 404,
        body: JSON.stringify({"message":"Not found"}),
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
      body: JSON.stringify({"message": "OK"}),
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
    body: JSON.stringify({"message":"Method Not Allowed"}),
    headers: {
      "Access-Control-Allow-Origin": "*",
      // event.headers.Origin ?? event.headers.origin ?? "",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST",
      "Access-Control-Expose-Headers": "*",
    },
  };
}

async function updateCustomer(customerName: string, contactId: string) {
  const updateParams: UpdateCommandInput = {
    TableName: CUSTOMER_TABLE,
    Key: {
      CustomerName: customerName,
    },
    UpdateExpression: "set ContactId = :contactId",
    ExpressionAttributeValues: {
      ":contactId": contactId,
    },
    ReturnValues: "ALL_NEW",
  };

  let caseRecord: CustomerItem | undefined;
  try {
    const result = await ddbClient.send(new UpdateCommand(updateParams));
    caseRecord = result?.Attributes as CustomerItem;
  } catch (err) {
    Logger.error(
      "Failed to update info: ",
      { pk: caseRecord?.CustomerName },
      err as Error
    );
  }
  return caseRecord;
}
