
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { DIVISIONS } from '../components/data/Bdmapdata';

/* Normalize names to match map IDs */
const slug = (s = '') =>
  String(s)
    .toLowerCase()
    .replace(/[’']/g, '')
    .trim()
    .replace(/\s+/g, '-');

const DIVISION_ALIASES = {
  chittagong: 'chattogram',
  barisal: 'barishal',
};

const DISTRICT_ALIASES = {
  cumilla: 'comilla',
  jashore: 'jessore',
  barishal: 'barisal',
  bogra: 'bogura',
  chittagong: 'chattogram',
  maulvibazar: 'moulvibazar',
  'chapai-nawabganj': 'chapainawabganj',
};

export const divisionId = (name) => {
  const s = slug(name);
  return DIVISION_ALIASES[s] || s;
};

export const districtId = (name) => {
  const s = slug(name);
  return DISTRICT_ALIASES[s] || s;
};

/* Build district -> division lookup from map data */
const DISTRICT_TO_DIVISION = {};

DIVISIONS.forEach((dv) => {
  dv.districts.forEach((district) => {
    DISTRICT_TO_DIVISION[district.id] = dv.id;
  });
});

export function useCampaignStats() {
  const [state, setState] = useState({
    status: 'loading',
    data: {},
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchCampaignStats() {
      try {
        const { data, error } = await supabase
          .from('campaign_map_data')
          .select('id, title, district, campaign_date, status')
          .order('campaign_date', { ascending: false });

        if (error) throw error;

        const grouped = {};

        (data || []).forEach((campaign) => {
          const district = campaign.district;

          if (!district) return;

          const normalizedDistrict = districtId(district);
          const division =
            DISTRICT_TO_DIVISION[normalizedDistrict];

          if (!division) {
            console.warn(
              'District not found in map:',
              district,
              normalizedDistrict
            );
            return;
          }

          if (!grouped[division]) {
            grouped[division] = {
              count: 0,
              items: [],
            };
          }

          grouped[division].count += 1;

          grouped[division].items.push({
            id: campaign.id,
            title: campaign.title,
            district,
            date: campaign.campaign_date,
            status: campaign.status,
          });
        });

        console.log('Campaign map data:', data);
        console.log('Grouped campaign stats:', grouped);

        if (!cancelled) {
          setState({
            status: 'ready',
            data: grouped,
          });
        }
      } catch (error) {
        console.error('Campaign stats error:', error);

        if (!cancelled) {
          setState({
            status: 'error',
            data: {},
          });
        }
      }
    }

    fetchCampaignStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
