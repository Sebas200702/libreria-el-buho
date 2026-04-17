import { defineMiddleware } from 'astro:middleware';
import { getServerSupabase } from './lib/supabase/server';

const PROTECTED_PREFIX = '/admin';
const PUBLIC_ADMIN_ROUTES = new Set(['/admin/login']);

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = getServerSupabase({
    request: context.request,
    cookies: context.cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  context.locals.supabase = supabase;
  context.locals.user = user;
  context.locals.session = user
    ? (await supabase.auth.getSession()).data.session
    : null;

  const path = new URL(context.request.url).pathname;
  const isProtected =
    path.startsWith(PROTECTED_PREFIX) && !PUBLIC_ADMIN_ROUTES.has(path);

  if (isProtected && !user) {
    return context.redirect(`/admin/login?next=${encodeURIComponent(path)}`);
  }

  if (path === '/admin/login' && user) {
    return context.redirect('/admin');
  }

  return next();
});
