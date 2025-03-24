import type { QueryResult } from "@/store";

/* @check if query has result */
export const queryHasResults = (result: Record<string, object[]>): boolean => {
  return !!(
    (result.transaction && result.transaction.length > 0) ||
    (result.log && result.log.length > 0) ||
    (result.account && result.account.length > 0) ||
    (result.block && result.block.length > 0)
  );
};

/**
 * Converts API results into a structured query result.
 * - Merges all result arrays (transaction, log, account, block) into a single dataset.
 * - Extracts column names from the first object.
 * - Determines column types based on the first object's values.
 * - Formats the data as an array of objects.
 * - Returns the columns, column types, data, and row count.
 */
export const formatApiResultToQueryResult = (
  result: Record<string, object[]>
): QueryResult => {
  console.log(result);

  const allData: Array<Record<string, unknown>> = [];
  Object.keys(result).forEach(key => {
    if (Array.isArray(result[key]) && result[key].length > 0) {
      allData.push(...(result[key] as Record<string, unknown>[]));
    }
  });

  if (allData.length === 0) {
    return {
      columns: [],
      columnTypes: [],
      data: [],
      rowCount: 0,
    };
  }
  const columns = Object.keys(allData[0]);

  const columnTypes = columns.map(col => {
    const value = allData[0][col];
    let columnType: string;

    if (
      Array.isArray(value) &&
      value.length === 1 &&
      typeof value[0] === "number"
    ) {
      columnType = "number";
    } else if (typeof value === "number") {
      columnType = "number";
    } else {
      columnType = "string";
    }

    return columnType;
  });

  const data = allData.map((item: Record<string, unknown>) => {
    const row: Record<string, unknown> = {};
    columns.forEach(col => {
      row[col] =
        Array.isArray(item[col]) && item[col].length === 1
          ? item[col][0]
          : (item[col] ?? null);
    });
    return row;
  });

  console.log("data rows", data);

  return {
    columns,
    columnTypes,
    data,
    rowCount: data.length,
  };
};
