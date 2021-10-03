const { deployTerm } = require('../src');
const rc = require('rchain-toolkit');

const waitForUnforgeable = require('../cli/waitForUnforgeable').main;
const { validAfterBlockNumber, prepareDeploy } = require('../cli/utils');

module.exports.main = async (
  privateKey1,
  publicKey1,
  masterRegistryUri,
  boxId,
  fungible,
  contractId,
  fee,
  expires
) => {
  const term = deployTerm({
    masterRegistryUri: masterRegistryUri,
    fungible: fungible,
    boxId: boxId,
    contractId: contractId,
    fee: fee ? fee : null,
    expires: expires || null,
  });
  console.log('  03 deploy is ' + Buffer.from(term).length / 1000000 + 'mb');
  const timestamp = new Date().getTime();
  const vab = await validAfterBlockNumber(process.env.READ_ONLY_HOST);
  const pd = await prepareDeploy(
    process.env.READ_ONLY_HOST,
    publicKey1,
    timestamp
  );

  const deployOptions = await rc.utils.getDeployOptions(
    'secp256k1',
    timestamp,
    term,
    privateKey1,
    publicKey1,
    1,
    1000000,
    vab || -1
  );

  try {
    const deployResponse = await rc.http.deploy(
      process.env.VALIDATOR_HOST,
      deployOptions
    );
    if (!deployResponse.startsWith('"Success!')) {
      console.log(deployResponse);
      throw new Error('01_deploy 01');
    }
  } catch (err) {
    console.log(err);
    throw new Error('01_deploy 02');
  }

  let dataAtNameResponse;
  try {
    dataAtNameResponse = await waitForUnforgeable(JSON.parse(pd).names[0]);
  } catch (err) {
    console.log(err);
    throw new Error('01_deploy 05');
  }
  const data = rc.utils.rhoValToJs(
    JSON.parse(dataAtNameResponse).exprs[0].expr
  );

  if (data.status !== 'completed') {
    console.log(data);
    throw new Error('01_deploy 06');
  }

  return data;
};
