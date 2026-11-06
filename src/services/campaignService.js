
import { supabase } from '../lib/supabaseClient';

// Convert Supabase campaign data into the format used by the existing UI.
function mapCampaign(campaign) {
  const participants = campaign.campaign_participants || [];

  return {
    id: campaign.id,
    reportId: campaign.report_id,
    report: campaign.reports || null,
    title: campaign.title,
    date: campaign.campaign_date,
    time: campaign.start_time?.slice(0, 5) || '',
    meetingPoint: campaign.meeting_point,
    location: campaign.location_address,
    area: campaign.reports?.waste_category || '',
    needed: campaign.volunteer_target,
    note: campaign.description || '',
    volunteers: participants
      .filter((p) => p.participation_status === 'joined' ||
                     p.participation_status === 'attended')
      .map((p) => p.volunteer_id),
    done: participants
      .filter((p) => p.participation_status === 'attended')
      .map((p) => p.volunteer_id),
    status: campaign.status === 'recruiting' ? 'open' : campaign.status,
    createdAt: campaign.created_at,
  };
}

export async function listCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
  *,
  campaign_participants (
    volunteer_id,
    participation_status
  ),
  reports (
    id,
    title,
    description,
    waste_category,
    location_address,
    district,
    status,
    created_at
  )
`)
    .order('campaign_date', { ascending: true });

  if (error) return { data: null, error };

  return {
    data: (data || []).map(mapCampaign),
    error: null,
  };
}

export async function createCampaign(form) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error('You must be logged in to create a campaign.');

    // Get the report and make sure it is confirmed.
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('id, location_address, latitude, longitude, status')
      .eq('id', form.reportId)
      .single();

    if (reportError) throw reportError;

    if (report.status !== 'confirmed') {
      throw new Error('Only confirmed reports can be turned into campaigns.');
    }

    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        report_id: form.reportId,
        created_by: user.id,
        title: form.title.trim(),
        description: form.note?.trim() || null,
        campaign_date: form.date,
        start_time: form.time,
        location_address: report.location_address,
        meeting_point: form.meetingPoint.trim(),
        latitude: report.latitude,
        longitude: report.longitude,
        volunteer_target: Number(form.needed),
        status: 'recruiting',
        proof_status: 'pending',
      })
      .select()
      .single();

    if (campaignError) throw campaignError;

    // Mark the report as being handled by a campaign.
    const { error: updateError } = await supabase
      .from('reports')
      .update({ status: 'in_progress' })
      .eq('id', form.reportId);

    if (updateError) {
      // Avoid leaving an unlinked campaign behind.
      await supabase.from('campaigns').delete().eq('id', campaign.id);
      throw updateError;
    }

    return { data: mapCampaign(campaign), error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function joinCampaign(id, workerId) {
  try {
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('volunteer_target, status')
      .eq('id', id)
      .single();

    if (campaignError) throw campaignError;
    if (campaign.status !== 'recruiting') {
      throw new Error('This campaign is not accepting volunteers.');
    }

    const { count, error: countError } = await supabase
      .from('campaign_participants')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', id)
      .in('participation_status', ['joined', 'attended']);

    if (countError) throw countError;

    if (count >= campaign.volunteer_target) {
      throw new Error('This campaign has reached its volunteer limit.');
    }

    const { data, error } = await supabase
      .from('campaign_participants')
      .insert({
        campaign_id: id,
        volunteer_id: workerId,
        participation_status: 'joined',
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function leaveCampaign(id, workerId) {
  const { error } = await supabase
    .from('campaign_participants')
    .delete()
    .eq('campaign_id', id)
    .eq('volunteer_id', workerId)
    .eq('participation_status', 'joined');

  return { data: !error, error };
}

export async function markDone(id, workerId) {
  const { data, error } = await supabase
    .from('campaign_participants')
    .update({ participation_status: 'attended' })
    .eq('campaign_id', id)
    .eq('volunteer_id', workerId)
    .eq('participation_status', 'joined')
    .select()
    .maybeSingle();

  if (error) return { data: null, error };

  if (!data) {
    return {
      data: null,
      error: new Error('You must join this campaign before marking attendance.'),
    };
  }

  return { data, error: null };
}

export async function completeCampaign(id) {
  try {
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('report_id')
      .single();

    if (campaignError) throw campaignError;

    const { error: reportError } = await supabase
      .from('reports')
      .update({ status: 'resolved' })
      .eq('id', campaign.report_id);

    if (reportError) throw reportError;

    return { data: true, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
