/* eslint-disable import/no-extraneous-dependencies */
import "@/services/firebase";
import * as admin from "firebase-admin";
import { expect } from "@jest/globals";

import {
  EntitySupportType,
  SupportedChainService,
} from "@/services/firebase/db/SupportedEntitiesService";

jest.setTimeout(100000);

describe("SupportedChainService", () => {
  beforeAll(async () => {
    // Clean up the database before running tests
    await SupportedChainService.deleteAll();
  });

  afterAll(async () => {
    // Clean up Firebase instance after all tests
    await admin.app().delete();
  });

  it("should create a new supported chain", async () => {
    const result = await SupportedChainService.create("ethereum", "ETH");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.chain).toBe("ethereum");
    }
  });

  it("should find a supported chain by name", async () => {
    const result = await SupportedChainService.findByChain("ethereum");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.chain).toBe("ethereum");
    }
  });

  it("should not find a non-existent chain", async () => {
    const result = await SupportedChainService.findByChain("NonExistentChain");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe("Chain not found.");
      expect(result.code).toBe("NOT_FOUND");
    }
  });

  it("should delete a supported chain", async () => {
    const result = await SupportedChainService.delete("ethereum");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(true); // Confirm that deletion was successful
    }
  });

  it("should not delete a non-existent chain", async () => {
    const result = await SupportedChainService.delete("NonExistentChain");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe("Chain not found.");
      expect(result.code).toBe("NOT_FOUND");
    }
  });

  it("should retrieve all supported chains", async () => {
    await SupportedChainService.create("ethereum", "ETH");
    await SupportedChainService.create("bitcoin", "BTC");
    await SupportedChainService.create("litecoin", "LTC");

    const result = await SupportedChainService.getAll();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.map(chain => chain.chain)).toEqual(
        expect.arrayContaining(["ethereum", "bitcoin", "litecoin"])
      );
    }
  });

  // it("should add a new chain entity to an existing supported chain", async () => {
  //   const result = await SupportedChainService.addChainEntity(
  //     "ethereum",
  //     "transaction",
  //     "Raw Transaction Data",
  //     [EntitySupportType.Http, EntitySupportType.Rpc] // HTTP and RPC
  //   );

  //   expect(result.success).toBe(true);
  //   if (result.success) {
  //     expect(result.data.chainEntities.length).toBeGreaterThan(0);
  //     expect(result.data.chainEntities[0].table).toBe("transaction");
  //     expect(result.data.chainEntities[0].table_group_by).toBe(
  //       "Raw Transaction Data"
  //     );
  //     expect(result.data.chainEntities[0].support).toEqual([
  //       EntitySupportType.Http,
  //       EntitySupportType.Rpc,
  //     ]); // HTTP and RPC
  //   }
  // });

  it("should return error when adding chain entity to non-existent chain", async () => {
    const result = await SupportedChainService.addChainEntity(
      "NonExistentChain",
      "transaction",
      "Raw Transaction Data",
      [EntitySupportType.Rpc, EntitySupportType.GraphQL] // RPC AND GraphQL
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe("Chain not found.");
      expect(result.code).toBe("NOT_FOUND");
    }
  });

  it("should handle error when adding chain entity", async () => {
    // Simulating an error by sending an invalid table name or missing data in the request
    const result = await SupportedChainService.addChainEntity(
      "ethereum",
      "invalid_table", // Invalid table
      "Uploaded Data",
      [EntitySupportType.Http]
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe("Invalid table name.");
      expect(result.code).toBe("DB_UPDATE_ERROR");
    }
  });
});
