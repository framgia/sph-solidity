export default interface RecentCampaignData {
  id: number;
  creator: string;
  fullname: string;
  title: string;
  story: string;
  imageUrl: string;
  goalAmount: number;
  currentAmount: number;
  deadline: number;
  totalDonations: number;
}
