import crypto from 'crypto';
import { cookies } from 'next/headers';
import { supabase } from './supabase';

const SALT = 'my_profile_static_salt_2026';
const COOKIE_NAME = 'auth_session';

export function hashPassword(password) {
  return crypto.pbkdf2Sync(password, SALT, 1000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return false;
  const hash = hashPassword(password);
  const hashBuf = Buffer.from(hash);
  const storedBuf = Buffer.from(storedHash);
  if (hashBuf.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(hashBuf, storedBuf);
}

export async function createSession(userId) {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await supabase
    .from('sessions')
    .insert([{ id: sessionId, user_id: userId, expires_at: expiresAt }]);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return sessionId;
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(COOKIE_NAME)?.value;

    if (!sessionId) return null;

    const { data: session, error: sessErr } = await supabase
      .from('sessions')
      .select('id, expires_at, user_id, users(id, email, phone, full_name, mssv, class_name, dob, avatar, role, created_at)')
      .eq('id', sessionId)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (sessErr || !session || !session.users) return null;

    return {
      session_id: session.id,
      expires_at: session.expires_at,
      ...session.users,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function destroySession() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(COOKIE_NAME)?.value;

    if (sessionId) {
      await supabase.from('sessions').delete().eq('id', sessionId);
    }

    cookieStore.set(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  } catch (error) {
    console.error('Error destroying session:', error);
  }
}
