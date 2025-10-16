import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth"); // Redirect to login page
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    // 👇 Optional real-time listener (handles logout instantly)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) navigate("/auth");
      }
    );

    return () => subscription?.subscription?.unsubscribe();
  }, [navigate]);

  if (loading) return null; // or a spinner

  return children;
}
