import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'produtos';

let _supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Configurações do Supabase ausentes no .env. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY para realizar operações no Supabase Storage.'
    );
  }

  if (!_supabaseClient) {
    _supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return _supabaseClient;
}

// Proxy transparente para permitir `supabase.storage...` sem quebrar a inicialização do app caso as variáveis ainda não estejam preenchidas
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
