import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { supabase } from '@/lib/supabase';

export function useAuth(requireAuth = true) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
      } else if (requireAuth) {
        router.push('/auth/login');
      }
      setLoading(false);
    };

    fetchUser();

    // Listen for changes on auth state (log in, log out, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          if (requireAuth) router.push('/auth/login');
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [requireAuth, router]);

  return { user, loading };
}
