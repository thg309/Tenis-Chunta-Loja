
CREATE TABLE public.pix_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  amount integer NOT NULL,
  customer_name text,
  customer_cpf text,
  customer_email text,
  customer_phone text,
  description text,
  pix_code text,
  paid boolean NOT NULL DEFAULT false,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Allow public access for webhook and edge functions (no auth needed for this store)
ALTER TABLE public.pix_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on pix_transactions"
ON public.pix_transactions
FOR ALL
USING (true)
WITH CHECK (true);

-- Enable realtime for status updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.pix_transactions;
