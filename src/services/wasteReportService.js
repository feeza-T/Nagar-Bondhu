
import { supabase } from '../lib/supabaseClient';

const PHOTO_BUCKET = 'report-photos';

// Convert database statuses into the existing application statuses.
function toAppStatus(status) {
  const statuses = {
    in_progress: 'campaign',
    resolved: 'cleaned',
  };

  return statuses[status] || status;
}

function toDbStatus(status) {
  const statuses = {
    campaign: 'in_progress',
    cleaned: 'resolved',
  };

  return statuses[status] || status;
}

// Convert a database report into the format used by the UI.
function mapReport(report) {
  const photoUrl = report.photo_path
    ? report.photo_path.startsWith('http')
      ? report.photo_path
      : supabase.storage.from(PHOTO_BUCKET)
          .getPublicUrl(report.photo_path).data.publicUrl
    : null;

  return {
    id: report.id,
    title: report.title,
    description: report.description,
    category: report.waste_category,
    area: report.district || '',
    location: report.location_address,
    image: photoUrl,
    photoUrl,
    userId: report.citizen_id,
    userName: '',
    status: toAppStatus(report.status),
    createdAt: report.created_at,
    campaignId: null,
    adminNote: report.admin_note || '',
    latitude: report.latitude,
    longitude: report.longitude,
    citizenFeedback: report.citizen_feedback,
  };
}

// Upload a compressed image and return its storage path.
async function uploadReportPhoto(image, userId) {
  if (!image) return { path: null, error: null };

  try {
    let file;

    if (image instanceof Blob) {
      file = image;
    } else if (typeof image === 'string' && image.startsWith('data:')) {
      file = await fetch(image).then((response) => response.blob());
    } else {
      throw new Error('Unsupported image format.');
    }

    const extension = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    }[file.type];

    if (!extension) {
      throw new Error('Only JPG, PNG and WebP images are supported.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be smaller than 5 MB.');
    }

    const path = `${userId}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    return { path, error: null };
  } catch (error) {
    return { path: null, error };
  }
}

// List reports with optional status and citizen filters.
export async function listReports(filters = {}) {
  let query = supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', toDbStatus(filters.status));
  }

  if (filters.userId) {
    query = query.eq('citizen_id', filters.userId);
  }

  const { data, error } = await query;

  if (error) return { data: null, error };

  return {
    data: (data || []).map(mapReport),
    error: null,
  };
}

// Create a report and optionally upload its photo.
export async function createReport(payload, user) {
  try {
    if (!user?.id) {
      throw new Error('Please log in before submitting a report.');
    }

    const { path, error: uploadError } = await uploadReportPhoto(
      payload.image,
      user.id
    );

    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from('reports')
      .insert({
        citizen_id: user.id,
        title: payload.title.trim(),
        description: payload.description.trim(),
        waste_category: payload.category,
        district: payload.area,
        location_address: payload.location.trim(),
        photo_path: path,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      if (path) {
        await supabase.storage.from(PHOTO_BUCKET).remove([path]);
      }
      throw error;
    }

    return { data: mapReport(data), error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Update a report's status.
export async function updateReportStatus(id, status) {
  const { data, error } = await supabase
    .from('reports')
    .update({ status: toDbStatus(status) })
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error };

  return { data: mapReport(data), error: null };
}

// Fetch real dashboard statistics.
export async function getReportStats() {
  try {
    const [
      totalResult,
      pendingResult,
      confirmedResult,
      campaignResult,
      cleanedResult,
      activeCampaignResult,
    ] = await Promise.all([
      supabase.from('reports').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
      supabase.from('campaigns').select('*', { count: 'exact', head: true }).in('status', [
        'recruiting',
        'ongoing',
        'pending_verification',
      ]),
    ]);

    const results = [
      totalResult,
      pendingResult,
      confirmedResult,
      campaignResult,
      cleanedResult,
      activeCampaignResult,
    ];

    const failed = results.find((result) => result.error);
    if (failed) throw failed.error;

    return {
      data: {
        total: totalResult.count || 0,
        pending: pendingResult.count || 0,
        confirmed: confirmedResult.count || 0,
        campaign: campaignResult.count || 0,
        cleaned: cleanedResult.count || 0,
        activeCampaigns: activeCampaignResult.count || 0,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}
