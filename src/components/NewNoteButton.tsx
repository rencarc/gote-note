"use client";

import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createNoteAction } from "@/actions/notes";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseBrowser";
import type { User } from "@supabase/supabase-js";  // ✅ 正确引入类型

function NewNoteButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null); // ✅ 明确指定 user 类型

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Failed to fetch user:", error.message);
        return;
      }

      setUser(data.user);
    };

    fetchUser();
  }, []);

  const handleClickNewNoteButton = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    toast("Creating a new note...");

    try {
      const uuid = uuidv4();
      await createNoteAction(uuid);
      toast.success("Note created successfully!");
      router.push(`/?noteId=${uuid}&toastType=newNote`);
    } catch (err) {
      toast.error("Failed to create note.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClickNewNoteButton}
      variant="secondary"
      className="w-24"
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Note"}
    </Button>
  );
}

export default NewNoteButton;
