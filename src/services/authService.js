
import { supabase } from '../lib/supabaseClient';

// Convert Supabase profile roles to the roles used by the React app.
const mapUser = (authUser, profile) => ({
  id: authUser.id,
  name: profile?.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
  email: authUser.email || '',
  phone: profile?.phone || '',
  role: profile?.role === 'volunteer' ? 'worker' : profile?.role || 'citizen',
});

async function getAppUser(authUser) {
  if (!authUser) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, role')
    .eq('id', authUser.id)
    .single();

  if (error) throw error;

  return mapUser(authUser, profile);
}

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    return { data: await getAppUser(session?.user), error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function login({ email, password }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw error;

    return { data: await getAppUser(data.user), error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function loginWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
}

export async function register({ name, email, phone, password, role }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name.trim(),
          phone: phone.trim(),
          role: role === 'worker' ? 'volunteer' : 'citizen',
        },
      },
    });

    if (error) throw error;

    if (!data.session) {
      return {
        data: null,
        error: { message: 'Check your email to confirm your registration before logging in.' },
      };
    }

    return { data: await getAppUser(data.user), error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function loginAsDemo() {
  return {
    data: null,
    error: { message: 'Demo login is temporarily unavailable.' },
  };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  return { data: !error, error };
}
