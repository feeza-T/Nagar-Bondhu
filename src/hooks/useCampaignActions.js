import { joinCampaign, leaveCampaign, markDone } from '../services/campaignService';

// Wraps the worker actions so pages stay small. `reload` refreshes the list afterwards.
export default function useCampaignActions(workerId, reload) {
  const wrap = (fn) => async (id) => { await fn(id, workerId); reload(); };
  return { onJoin: wrap(joinCampaign), onLeave: wrap(leaveCampaign), onDone: wrap(markDone) };
}
