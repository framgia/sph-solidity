import { ethers } from "ethers";
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";
import contract from "../assets/contract/CrowdFunding.json";
import { useWalletStore } from "~/store/wallet";

export default defineNuxtPlugin(async () => {
  const { isConnected } = storeToRefs(useWalletStore());
  const CONTRACT_ADDRESS = "0xBF37dE900fC42946B753b902D0c4a69e27ae780e";

  const ethereum = window.ethereum;
  const provider = new ethers.BrowserProvider(ethereum);
  const contractInterface = new ethers.BrowserProvider(ethereum);
  let smartContract: ethers.Contract | null = null;
  let signer = null;

  const getSmartContract = async () => {
    if (ethereum?.selectedAddress !== null) {
      try {
        signer = await provider.getSigner();
        smartContract = new ethers.Contract(
          CONTRACT_ADDRESS as string,
          contract.abi,
          signer,
        );

        return smartContract;
      } catch (error) {
        toast.error("Something went wrong!");
        return null;
      }
    } else {
      isConnected.value = false;
      return null;
    }
  };

  if (ethereum?.selectedAddress !== null) {
    try {
      signer = await provider.getSigner();
      smartContract = new ethers.Contract(
        CONTRACT_ADDRESS as string,
        contract.abi,
        signer,
      );
    } catch (error) {}
  }

  smartContract?.on("CampaignCreated", (sender, title) => {
    if (sender.toLowerCase() === ethereum.selectedAddress?.toLowerCase()) {
      toast.success(`Campaign ${title} was successfully created!`);
    }
  });

  smartContract?.on("DonationSent", (sender) => {
    if (sender.toLowerCase() === ethereum.selectedAddress.toLowerCase()) {
      toast.success(`Fund successfully send!`);
    }
  });

  return {
    provide: {
      provider,
      signer,
      contractInterface,
      getSmartContract,
    },
  };
});
