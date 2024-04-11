import { type BN } from '@fuel-ts/math';
import { type Transaction } from '@fuel-ts/transactions';
import { DateTime, hexlify } from '@fuel-ts/utils';

import type { GqlGasCosts } from '../__generated__/operations.js';
import type { TransactionResultReceipt } from '../transaction-response/index.js';
import { getGasUsedFromReceipts } from '../utils/index.js';

import { calculateTransactionFee } from './calculate-transaction-fee.js';
import {
  getOperations,
  getTransactionTypeName,
  isTypeMint,
  isTypeCreate,
  isTypeScript,
} from './operations.js';
import { extractBurnedAssetsFromReceipts, extractMintedAssetsFromReceipts } from './receipt.js';
import { processGraphqlStatus } from './status.js';
import type { AbiMap, GraphqlTransactionStatus, TransactionSummary } from './types.js';

export interface AssembleTransactionSummaryParams {
  gasPerByte: BN;
  gasPriceFactor: BN;
  transaction: Transaction;
  id?: string;
  transactionBytes: Uint8Array;
  gqlTransactionStatus?: GraphqlTransactionStatus;
  receipts: TransactionResultReceipt[];
  abiMap?: AbiMap;
  maxInputs: BN;
  gasCosts: GqlGasCosts;
}

/** @hidden */
export function assembleTransactionSummary<TTransactionType = void>(
  params: AssembleTransactionSummaryParams
) {
  const {
    id,
    receipts,
    gasPerByte,
    gasPriceFactor,
    transaction,
    transactionBytes,
    gqlTransactionStatus,
    abiMap = {},
    maxInputs,
    gasCosts,
  } = params;

  const gasUsed = getGasUsedFromReceipts(receipts);

  const rawPayload = hexlify(transactionBytes);

  const operations = getOperations({
    transactionType: transaction.type,
    inputs: transaction.inputs || [],
    outputs: transaction.outputs || [],
    receipts,
    rawPayload,
    abiMap,
    maxInputs,
  });

  const typeName = getTransactionTypeName(transaction.type);

  const { fee } = calculateTransactionFee({
    gasUsed,
    rawPayload,
    consensusParameters: {
      gasCosts,
      feeParams: {
        gasPerByte,
        gasPriceFactor,
      },
    },
  });

  const { isStatusFailure, isStatusPending, isStatusSuccess, blockId, status, time } =
    processGraphqlStatus(gqlTransactionStatus);

  const mintedAssets = extractMintedAssetsFromReceipts(receipts);
  const burnedAssets = extractBurnedAssetsFromReceipts(receipts);

  let date: DateTime | undefined;

  if (time) {
    date = DateTime.fromTai64(time);
  }

  const transactionSummary: TransactionSummary<TTransactionType> = {
    id,
    fee,
    gasUsed,
    operations,
    type: typeName,
    blockId,
    time,
    status,
    receipts,
    mintedAssets,
    burnedAssets,
    isTypeMint: isTypeMint(transaction.type),
    isTypeCreate: isTypeCreate(transaction.type),
    isTypeScript: isTypeScript(transaction.type),
    isStatusFailure,
    isStatusSuccess,
    isStatusPending,
    date,
    transaction: transaction as Transaction<TTransactionType>,
  };

  return transactionSummary;
}
