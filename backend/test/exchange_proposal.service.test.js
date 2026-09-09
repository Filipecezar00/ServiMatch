import { pool } from "../src/config/database.js";
import { mudar_status } from "../src/modules/exchange_proposals/exchange_proposal_service.js";
import * as exchangesRepository from "../src/modules/exchanges/exchanges.repository.js";

jest.mock("../src/config/database.js");

const mockConnection = {
  beginTransaction: jest.fn().mockResolvedValue(),
  commit: jest.fn().mockResolvedValue(),
  rollback: jest.fn().mockResolvedValue(),
  release: jest.fn().mockResolvedValue(),
  query: jest.fn().mockResolvedValue([{ affectedRows: 1 }]),
};

pool.getConnection.mockResolvedValue(mockConnection);
