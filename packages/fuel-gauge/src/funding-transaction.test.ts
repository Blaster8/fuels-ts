import { seedTestWallet } from '@fuel-ts/account/test-utils';
import type { Account, CoinTransactionRequestInput } from 'fuels';
import { FUEL_NETWORK_URL, Provider, ScriptTransactionRequest, Wallet, bn } from 'fuels';

/**
 * @group node
 */
describe(__filename, () => {
  let mainWallet: Account;
  let provider: Provider;
  let baseAssetId: string;
  beforeAll(async () => {
    provider = await Provider.create(FUEL_NETWORK_URL);
    baseAssetId = provider.getBaseAssetId();
    mainWallet = Wallet.generate({ provider });
    await seedTestWallet(mainWallet, [[500_000, baseAssetId]]);
  });

  const fundingTxWithMultipleUTXOs = async ({
    account,
    totalAmount,
    splitIn,
  }: {
    account: Account;
    totalAmount: number;
    splitIn: number;
  }) => {
    const request = new ScriptTransactionRequest({
      gasLimit: 1_000,
      gasPrice: bn(10),
    });

    for (let i = 0; i < splitIn; i++) {
      request.addCoinOutput(account.address, totalAmount / splitIn, baseAssetId);
    }

    const resources = await mainWallet.getResourcesToSpend([[totalAmount + 2_000, baseAssetId]]);
    request.addResources(resources);

    const tx = await mainWallet.sendTransaction(request);
    await tx.waitForResult();
  };

  it('should successfully fund a transaction request when it is not fully funded', async () => {
    const sender = Wallet.generate({ provider });
    const receiver = Wallet.generate({ provider });

    // 1500 splitted in 5 = 5 UTXOs of 300 each
    await fundingTxWithMultipleUTXOs({
      account: sender,
      totalAmount: 1500,
      splitIn: 5,
    });

    // this will return one UTXO of 300, not enought to pay for the TX fees
    const lowResources = await sender.getResourcesToSpend([[100, baseAssetId]]);

    // confirm we only fetched 1 UTXO from the expected amount
    expect(lowResources.length).toBe(1);
    expect(lowResources[0].amount.toNumber()).toBe(300);

    const request = new ScriptTransactionRequest({
      gasLimit: 1_000,
      gasPrice: bn(10),
    });

    const amountToTransfer = 300;
    request.addCoinOutput(receiver.address, amountToTransfer, baseAssetId);

    request.addResources(lowResources);

    const { maxFee, requiredQuantities } = await provider.getTransactionCost(request);

    // TX request already does NOT carries enough resources, it needs to be funded
    expect(request.inputs.length).toBe(1);
    expect(bn((<CoinTransactionRequestInput>request.inputs[0]).amount).toNumber()).toBe(300);
    expect(maxFee.gt(300)).toBeTruthy();

    const getResourcesToSpendSpy = vi.spyOn(sender, 'getResourcesToSpend');

    await sender.fund(request, requiredQuantities, maxFee);

    const tx = await sender.sendTransaction(request);

    await tx.waitForResult();

    // fund method should have been called to fetch the remaining UTXOs
    expect(getResourcesToSpendSpy).toHaveBeenCalledTimes(1);

    const receiverBalance = await receiver.getBalance(baseAssetId);

    expect(receiverBalance.toNumber()).toBe(amountToTransfer);
  });

  it('should not fund a transaction request when it is already funded', async () => {
    const sender = Wallet.generate({ provider });
    const receiver = Wallet.generate({ provider });

    // 2000 splitted in 2 = 2 UTXOs of 1000 each
    await fundingTxWithMultipleUTXOs({
      account: sender,
      totalAmount: 2000,
      splitIn: 2,
    });

    // sender has 2 UTXOs for 1000 each, so it has enough resources to spend 1000 of baseAssetId
    const enoughtResources = await sender.getResourcesToSpend([[100, baseAssetId]]);

    // confirm we only fetched 1 UTXO from the expected amount
    expect(enoughtResources.length).toBe(1);
    expect(enoughtResources[0].amount.toNumber()).toBe(1000);

    const request = new ScriptTransactionRequest({
      gasLimit: 1_000,
      gasPrice: bn(10),
    });

    const amountToTransfer = 100;

    request.addCoinOutput(receiver.address, amountToTransfer, baseAssetId);
    request.addResources(enoughtResources);

    const { maxFee, requiredQuantities } = await provider.getTransactionCost(request);

    // TX request already carries enough resources, it does not need to be funded
    expect(request.inputs.length).toBe(1);
    expect(bn((<CoinTransactionRequestInput>request.inputs[0]).amount).toNumber()).toBe(1000);
    expect(maxFee.lt(1000)).toBeTruthy();

    const getResourcesToSpendSpy = vi.spyOn(sender, 'getResourcesToSpend');

    await sender.fund(request, requiredQuantities, maxFee);

    const tx = await sender.sendTransaction(request);

    await tx.waitForResult();

    // fund should not have been called since the TX request was already funded
    expect(getResourcesToSpendSpy).toHaveBeenCalledTimes(0);

    const receiverBalance = await receiver.getBalance(baseAssetId);

    expect(receiverBalance.toNumber()).toBe(amountToTransfer);
  });

  it('should fully fund a transaction when it is has no funds yet', async () => {
    const sender = Wallet.generate({ provider });
    const receiver = Wallet.generate({ provider });

    // 5000 splitted in 10 = 10 UTXOs of 500 each
    await fundingTxWithMultipleUTXOs({
      account: sender,
      totalAmount: 5000,
      splitIn: 10,
    });

    const request = new ScriptTransactionRequest({
      gasLimit: 1_000,
      gasPrice: bn(10),
    });

    const amountToTransfer = 1000;
    request.addCoinOutput(receiver.address, amountToTransfer, baseAssetId);

    const { maxFee, requiredQuantities } = await provider.getTransactionCost(request);

    // TX request does NOT carry any resources, it needs to be funded
    expect(request.inputs.length).toBe(0);

    const getResourcesToSpendSpy = vi.spyOn(sender, 'getResourcesToSpend');

    await sender.fund(request, requiredQuantities, maxFee);

    const tx = await sender.sendTransaction(request);

    await tx.waitForResult();

    // fund method should have been called to fetch UTXOs
    expect(getResourcesToSpendSpy).toHaveBeenCalledTimes(1);

    const receiverBalance = await receiver.getBalance(baseAssetId);

    expect(receiverBalance.toNumber()).toBe(amountToTransfer);
  });
});
