
import { supabase } from '../lib/supabaseClient';

export async function listWorkers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, role')
    .eq('role', 'volunteer')
    .order('full_name');

  if (error) {
    return { data: null, error };
  }

  const workers = (data || []).map((worker) => ({
    id: worker.id,
    name: worker.full_name,
    email: '',
    phone: worker.phone || '',
    role: 'worker',
    joined: 0,
    completed: 0,
  }));

  return { data: workers, error: null };
}

export async function updateUser(id, patch) {
  const updates = {};

  if (patch.name !== undefined) updates.full_name = patch.name;
  if (patch.phone !== undefined) updates.phone = patch.phone;

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select('id, full_name, phone, role')
    .single();

  if (error) {
    return { data: null, error };
  }

  return {
    data: {
      id: data.id,
      name: data.full_name,
      phone: data.phone || '',
      role: data.role === 'volunteer' ? 'worker' : data.role,
    },
    error: null,
  };
}
