"use client";

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner"; 
import { useRouter } from "next/navigation"; 
import { supabase } from "@/lib/supabaseBrowser";

const { data: { user } } = await supabase.auth.getUser();

function LogOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);

    const { errorMessage } = await logOutAction();

    if (!errorMessage) {
      router.push("/?toastType=logOut");
    } else {
      toast.error(errorMessage); 
    }

    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogOut}
      disabled={loading}
      className="w-24"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Log Out"}
    </Button>
  );
}

export default LogOutButton;
function logOutAction(): { errorMessage: any; } | PromiseLike<{ errorMessage: any; }> {
  throw new Error("Function not implemented.");
}

