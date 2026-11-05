import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import useCampaignActions from '../../hooks/useCampaignActions';
import { listCampaigns } from '../../services/campaignService';
import Spinner from '../../components/common/Spinner';
import CampaignCard from './components/CampaignCard';

// STEP 4 of the demo flow: worker joins a campaign, then marks their part done on the day
export default function WorkerCampaigns() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tab, setTab] = useState('open');
  const { data, loading, reload } = useFetch(listCampaigns);
  const actions = useCampaignActions(user.id, reload);
  if (loading) return <Spinner />;

  const list = data.filter((c) => (tab === 'mine' ? c.volunteers.includes(user.id) : tab === 'open' ? c.status === 'open' : c.status === 'completed'));
  return (
    <div className="space-y-6">
      <div><h1 className="font-display text-4xl uppercase text-olive">{t('worker.campaignsTitle')}</h1><p className="text-ink/65">{t('worker.campaignsSub')}</p></div>
      <div className="flex flex-wrap gap-2">
        {['open', 'mine', 'completed'].map((k) => <button key={k} onClick={() => setTab(k)} aria-pressed={tab === k} className={`btn btn-sm ${tab === k ? 'btn-dark' : 'btn-outline'}`}>{t(`worker.tab.${k}`)}</button>)}
      </div>
      {!list.length ? <p className="panel text-center text-ink/60">{t('worker.noCampaigns')}</p> : (
        <div className="grid gap-5 lg:grid-cols-2">{list.map((c) => <CampaignCard key={c.id} c={c} workerId={user.id} {...actions} />)}</div>
      )}
    </div>
  );
}
