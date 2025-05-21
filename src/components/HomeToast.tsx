"use client";

import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type ToastVariant = "success" | "error" | "default";

type ToastConfig = {
  title: string;
  description: string;
  type: ToastVariant; // 替换原来的 variant
};

const TOAST_CONFIG: Record<string, ToastConfig> = {
  login: {
    title: "Logged in",
    description: "You have been successfully logged in",
    type: "success",
  },
  signUp: {
    title: "Signed up",
    description: "Check your email for a confirmation link",
    type: "success",
  },
  newNote: {
    title: "New Note",
    description: "You have successfully created a new note",
    type: "success",
  },
  logOut: {
    title: "Logged out",
    description: "You have been successfully logged out",
    type: "success",
  },
};

type ToastType = keyof typeof TOAST_CONFIG;

function isToastType(value: string | null): value is ToastType {
  return value !== null && value in TOAST_CONFIG;
}

function HomeToast() {
  const toastType = useSearchParams().get("toastType");

  const removeUrlParam = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("toastType");
    const newUrl = `${window.location.pathname}${
      searchParams.toString() ? `?${searchParams}` : ""
    }`;
    window.history.replaceState({}, "", newUrl);
  };

  useEffect(() => {
    if (isToastType(toastType)) {
      const { title, description, type } = TOAST_CONFIG[toastType];

      // 调用正确的 toast 类型
      toast[type](title, {
        description,
      });

      removeUrlParam();
    }
  }, [toastType]);

  return null;
}

export default HomeToast;
