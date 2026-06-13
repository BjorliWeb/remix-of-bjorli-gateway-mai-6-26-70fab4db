revoke execute on function public.has_role(_user_id uuid, _role app_role) from public;
revoke execute on function public.has_role(_user_id uuid, _role app_role) from anon;
revoke execute on function public.has_role(_user_id uuid, _role app_role) from authenticated;
grant execute on function public.has_role(_user_id uuid, _role app_role) to service_role;