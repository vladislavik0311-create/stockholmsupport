import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const allowedPermissions = new Set(['manage_tasks','manage_attestations','manage_tables','manage_events','manage_meetings','manage_documents','manage_branches','manage_achievements','manage_bunny','manage_admins','view_audit']);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const url = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'Требуется авторизация.' }, 401);

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user) return json({ error: 'Недействительная сессия.' }, 401);
  const { data: actor, error: actorError } = await admin.from('profiles').select('role,permissions').eq('id', authData.user.id).single();
  if (actorError || !actor || !(actor.role === 'owner' || (actor.role === 'admin' && actor.permissions?.manage_admins === true))) {
    return json({ error: 'Недостаточно прав для управления администраторами.' }, 403);
  }

  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'Некорректный JSON.' }, 400); }
  if (body.action === 'create_admin') {
    const username = String(body.username || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const title = String(body.title || 'Администратор').trim().slice(0, 60);
    const permissions = Object.fromEntries(Object.entries(body.permissions || {}).filter(([k,v]) => allowedPermissions.has(k) && v === true));
    if (actor.role !== 'owner') delete permissions.manage_admins;
    if (username.length < 3 || username.length > 32 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) return json({ error: 'Проверь логин, почту и пароль (минимум 6 символов).' }, 400);
    const { data: created, error: createError } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { username } });
    if (createError) return json({ error: createError.message }, 400);
    const { error: profileError } = await admin.from('profiles').update({ username, email, role: 'admin', admin_title: title, permissions }).eq('id', created.user.id);
    if (profileError) {
      await admin.auth.admin.deleteUser(created.user.id);
      return json({ error: `Не удалось сохранить роль: ${profileError.message}` }, 500);
    }
    return json({ ok: true, message: `Администратор ${username} создан.` });
  }

  if (body.action === 'update_admin') {
    const userId = String(body.user_id || '');
    const title = String(body.title || 'Администратор').trim().slice(0, 60);
    const permissions = Object.fromEntries(Object.entries(body.permissions || {}).filter(([k,v]) => allowedPermissions.has(k) && v === true));
    if (actor.role !== 'owner') delete permissions.manage_admins;
    if (!userId) return json({ error: 'Не указан пользователь.' }, 400);
    const { data: target, error: targetError } = await admin.from('profiles').select('role').eq('id', userId).single();
    if (targetError || !target || target.role === 'owner') return json({ error: 'Главного администратора нельзя изменять.' }, 403);
    const { error } = await admin.from('profiles').update({ role: 'admin', admin_title: title, permissions }).eq('id', userId);
    if (error) return json({ error: error.message }, 400);
    if (body.password) {
      const password = String(body.password);
      if (password.length < 6) return json({ error: 'Пароль должен быть не короче 6 символов.' }, 400);
      const { error: passError } = await admin.auth.admin.updateUserById(userId, { password });
      if (passError) return json({ error: passError.message }, 400);
    }
    return json({ ok: true, message: 'Права администратора обновлены.' });
  }
  return json({ error: 'Неизвестное действие.' }, 400);
});
