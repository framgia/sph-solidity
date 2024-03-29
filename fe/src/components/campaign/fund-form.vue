<template>
  <div class="flex flex-col gap-6 sm:w-full lg:w-[396px] xl:min-w-[396px]">
    <form
      class="bg-primary-100 p-4 flex flex-col gap-2 rounded-md"
      @submit.prevent="onSubmit"
    >
      <p
        v-if="!isCampaignDone"
        class="w-full font-bold text-dark text-md text-center"
      >
        Fund the campaign
      </p>
      <BaseInput
        v-if="!isCampaignDone"
        id="amount"
        type="number"
        step="any"
        name="amount"
        placeholder="0.123 ETH"
        :error="errors.amount"
        :model-value="amount"
        @change="handleChange"
      />
      <div class="flex flex-col gap-4 p-4 mb-4 rounded-md bg-primary-50">
        <p v-if="!isCampaignDone" class="font-bold text-dark text-sm">
          Back it because you believe in it.
        </p>
        <p v-else class="font-bold text-dark text-sm">
          The campaign's fundraising is over.
        </p>
        <p v-if="!isCampaignDone" class="text-sm text-primary-10">
          Supporting a project for no reward, just because it speaks to you.
        </p>
      </div>
      <BaseButton
        v-if="isCampaignDone && !isGoalAchieved && isDonator"
        :class="
          isLoading || isFundsReturned
            ? 'bg-disabled h-9 px-4 rounded-[6px] text-white cursor-not-allowed'
            : 'btn-gradient-hr'
        "
        :disabled="isLoading || isFundsReturned"
        @click="getRefund(campaignId, address)"
      >
        <span v-if="!isFundsReturned">Claim Refund</span>
        <span v-else>Refunded</span>
      </BaseButton>
      <BaseButton
        v-else
        type="submit"
        :class="
          isLoading ||
          (isCampaignDone && isGoalAchieved) ||
          (isCampaignDone && !isDonator)
            ? 'bg-disabled h-9 px-4 rounded-[6px] text-white cursor-not-allowed'
            : 'btn-gradient-hr'
        "
        :disabled="
          isLoading ||
          (isCampaignDone && isGoalAchieved) ||
          (isCampaignDone && !isDonator)
        "
      >
        Fund Campaign
      </BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import {
  FundCampaignRequest,
  FundCampaignRequestSchema,
} from "~/schemas/fund-campaign";
import { useWalletStore } from "~/store/wallet";
import CampaignFundFormProps from "~/types/CampaignFundFormProps";

const campaignFundFormProps = defineProps<CampaignFundFormProps>();
const emit = defineEmits(["fund-campaign"]);

const { isLoading, isConnected, isCampaignDone, isGoalAchieved } = toRefs(
  campaignFundFormProps,
);
const { notConnectedWarning, getRefund } = useUtils();

const validationSchema = toTypedSchema(FundCampaignRequestSchema);

const {
  handleSubmit,
  resetForm,
  values,
  errors,
  setFieldValue,
  validateField,
} = useForm({
  validationSchema,
});

const useWallet = useWalletStore();
const { address } = storeToRefs(useWallet);

const handleChange = (e: InputEvent) => {
  const { name, value } = e.target as HTMLInputElement;
  setFieldValue(name, parseFloat(value));
  validateField(name);
};

const { value: amount } = useField<FundCampaignRequest["amount"]>("amount");

const onSubmit = handleSubmit(() => {
  if (isConnected.value) {
    emit("fund-campaign", values.amount);
    resetForm();
  } else {
    notConnectedWarning();
  }
});
</script>

<style lang="postcss" scoped>
.label {
  @apply font-bold text-dark uppercase;
}
</style>
