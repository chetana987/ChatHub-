-- Update users table to work without Supabase auth
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Update RLS policies to work with session-based auth instead of auth.uid()
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their sent messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;

-- Create new RLS policies for session-based authentication
CREATE POLICY "Anyone can view users" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update user status" 
ON public.users 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can view messages" 
ON public.messages 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can send messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update messages" 
ON public.messages 
FOR UPDATE 
USING (true);