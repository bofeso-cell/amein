-- AMEIN Premium: códigos liberados para quem apoia o projeto.
-- Como usar: Supabase > SQL Editor > New query > cole tudo > Run. Pode rodar mais de uma vez sem problema.
-- Usa a função eh_admin() que você já tem (é ela que diz se o login é o administrador).

create table if not exists public.premium (
  codigo      text primary key,                 -- ex.: AMEN-7K3P-Q9XD
  nome        text not null,                    -- nome de quem apoiou
  contato     text,                             -- WhatsApp ou e-mail
  valor       numeric(10,2),                    -- valor do apoio (opcional)
  valido_ate  date,                             -- vazio = sem validade
  ativo       boolean not null default true,    -- você pode desativar um código
  criado_em   timestamptz not null default now(),
  usado_em    timestamptz                       -- primeira vez que o código foi ativado
);

-- Ninguém de fora consegue ler a lista de códigos: só o administrador.
alter table public.premium enable row level security;

drop policy if exists "premium: admin gerencia" on public.premium;
create policy "premium: admin gerencia" on public.premium
  for all to authenticated
  using (public.eh_admin())
  with check (public.eh_admin());

-- O site confere um código por vez, sem conseguir ver os outros.
create or replace function public.premium_valida(c text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.premium;
begin
  if c is null or length(c) > 40 then
    return json_build_object('ok', false);
  end if;
  select * into r from public.premium where codigo = upper(trim(c));
  if not found or not r.ativo or (r.valido_ate is not null and r.valido_ate < current_date) then
    return json_build_object('ok', false);
  end if;
  update public.premium set usado_em = now() where codigo = r.codigo and usado_em is null;
  return json_build_object('ok', true, 'nome', split_part(r.nome, ' ', 1), 'ate', r.valido_ate);
end;
$$;

revoke all on function public.premium_valida(text) from public;
grant execute on function public.premium_valida(text) to anon, authenticated;
