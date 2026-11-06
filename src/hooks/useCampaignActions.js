
import { joinCampaign, leaveCampaign, markDone } from '../services/campaignService';

export default function useCampaignActions(workerId, reload) {
  const wrap = (fn) => async (id) => {
    try {
      const result = await fn(id, workerId);

      if (result?.error) {
        console.error('Campaign action failed:', result.error);
        window.alert(result.error.message || 'Something went wrong.');
        return;
      }

      await reload();
    } catch (error) {
      console.error('Campaign action failed:', error);
      window.alert(error.message || 'Something went wrong.');
    }
  };

  return {
    onJoin: wrap(joinCampaign),
    onLeave: wrap(leaveCampaign),
    onDone: wrap(markDone),
  };
}
