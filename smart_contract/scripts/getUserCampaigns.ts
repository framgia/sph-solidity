import type { BigNumber } from "ethers";
import { crowdFundingContract } from "./createContract";
import { CrowdFunding } from "../typechain-types/CrowdFunding";

type UserCampaignsResult = [
  CrowdFunding.CampaignStructOutput[],
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
];

async function main() {
  if (
    process.argv[2] !== undefined && // page size
    process.argv[3] !== undefined // page number
  ) {
    await getUserCampaigns(process.argv[2], process.argv[3]);
  }
}

export default async function getUserCampaigns(
  pageSize: string,
  pageNumber: string,
) {
  console.log("FETCHING...");
  await crowdFundingContract
    .getUserCampaigns(pageSize, pageNumber)
    .then((result: UserCampaignsResult) => {
      console.log(result[0]);
      console.log("User total campaigns: ", result[1].toNumber());
      console.log("Total Pages: ", result[2].toNumber());
      console.log("Next Page: ", result[3].toNumber());
      console.log("Previous Page: ", result[4].toNumber());
    })
    .catch((error: Error) => {
      console.log("ERROR!", error);
    });
}

main();
