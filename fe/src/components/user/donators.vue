<template>
  <div class="mt-6">
    <table class="table-auto w-full">
      <thead class="border-b border-primary-10">
        <tr class="h-10 items-center">
          <th class="text-center px-4 text-primary-500 w-1/12">#</th>
          <th class="text-left px-4 w-3/12">Donator</th>
          <th class="text-left px-4 flex-6/12">Campaign Title</th>
          <th class="text-left px-4 w-2/12">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(
            { id, donator, campaignTitle, donationAmount }, index
          ) in donatorsData.donatorsList"
          :key="index"
          class="items-center min-h-[56px] border-b border-disabled"
        >
          <td class="w-[56px] text-center px-4 bg-primary-200">
            {{ index + 1 }}
          </td>
          <td class="px-4 py-2 cursor-pointer" @click="redirectToCampaign(id)">
            <div class="flex items-center space-x-2">
              <UserAvatar
                :img-src="getAvatarUrl(donator)"
                :height="40"
                :width="40"
              />
              <span>
                {{ middleTruncate(donator, 6, 4) }}
              </span>
            </div>
          </td>
          <td class="px-4 py-2 cursor-pointer" @click="redirectToCampaign(id)">
            {{ campaignTitle }}
          </td>
          <td class="px-4 w-40">{{ formatEther(donationAmount) }} ETH</td>
        </tr>
      </tbody>
    </table>
    <div v-if="lastPage > 1" class="mt-8 h-14 flex items-center justify-center">
      <BasePaginator
        :current-page="currentPage"
        :last-page="lastPage"
        :items-per-page="itemsPerPage"
        :on-page-change="setPage"
      />
    </div>
    <div
      v-if="donatorsData.donatorsList.length < 1"
      class="flex justify-center mt-6"
    >
      <p>No donators to show.</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { formatEther } from "ethers";
import { storeToRefs } from "pinia";
import { useUtils } from "~/composables/useUtils";
import { useWalletStore } from "~/store/wallet";

import DonatorsData from "~/types/DonatorsData";

const props = defineProps<{
  donatorsData: DonatorsData;
  callNewData: (currentPage: number) => void;
  totalDonatorsPages: number;
}>();

const { donatorsData, totalDonatorsPages } = toRefs(props);
const useWallet = useWalletStore();
const { refresher } = storeToRefs(useWallet);

const { middleTruncate, getAvatarUrl, redirectToCampaign } = useUtils();
const currentPage = ref(1);
const itemsPerPage = ref(6);
const lastPage = ref(totalDonatorsPages);

const setPage = (_itemsPerPage: number, pageNumber: number): void => {
  currentPage.value = pageNumber;
  props.callNewData(currentPage.value);
};

watch(
  refresher,
  () => {
    props.callNewData(currentPage.value);
  },
  { immediate: true },
);
</script>
