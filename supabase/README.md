# NutriFlow — Setup Supabase

Passos para migrar do localStorage para Supabase.

## 1. Criar projeto Supabase

1. Entre em https://supabase.com → **New project**
2. Região: **South America (São Paulo)** — mais rápido para BR
3. Anote:
   - Project URL: `https://xxx.supabase.co`
   - `anon` public key (Settings → API)

## 2. Rodar o schema

1. No dashboard → **SQL Editor** → **New query**
2. Cole o conteúdo de `supabase/schema.sql`
3. Clique em **Run** (`Ctrl+Enter`)
4. Confira em **Table Editor** que as 15 tabelas foram criadas

## 3. Variáveis de ambiente

### Local (desenvolvimento)
Crie `.env.local` na raiz do projeto:

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Produção (Vercel)
Dashboard Vercel → Project → **Settings** → **Environment Variables**:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto |
| `VITE_SUPABASE_ANON_KEY` | anon key |

Ambiente: **Production, Preview, Development**

Faça um **Redeploy** após adicionar as variáveis.

## 4. Como o app detecta

O arquivo `src/api/db.js` verifica as variáveis automaticamente:

- Se as duas estão definidas → usa **Supabase** (dados na nuvem)
- Se faltar alguma → cai em **localStorage** (modo offline)

O rodapé/Settings pode exibir o modo ativo via `getBackendLabel()`.

## 5. Migrar dados existentes

Se já tem dados em `localStorage` e quer migrar para Supabase:

```js
// Rode no console do navegador (com Supabase configurado):
import { db as local } from "@/api/localDB";
import { db as cloud } from "@/api/supabaseDB";

const entidades = ['Patient','Consultation','Anthropometry','LabExam','MealPlan',
  'Prontuario','Atestado','Recibo','PedidoExame','MensagemTemplate','DataBloqueada'];

for (const ent of entidades) {
  const items = await local.entities[ent].list();
  if (items.length) {
    await cloud.entities[ent].bulkCreate(items);
    console.log(`✅ ${ent}: ${items.length} migrados`);
  }
}
```

## 6. RLS (segurança) quando for multi-usuário

O schema já tem a coluna `owner_id`. Para ativar:

1. Descomente o bloco no final de `schema.sql`
2. Execute no SQL Editor
3. Ajuste `supabaseDB.js` para setar `owner_id: (await supabase.auth.getUser()).data.user.id` em cada `create()`

## 7. Gatilhos de upgrade

| Métrica | Gratuito | Upgrade |
|---|---|---|
| Armazenamento | 500 MB | $25/mês (Pro, 8 GB) |
| Transferência | 5 GB/mês | Pro |
| Auth users | ilimitado | — |

Para consultório solo com ~200 pacientes: **gratuito resolve por muito tempo**.
