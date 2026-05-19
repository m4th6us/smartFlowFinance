import type { Metadata } from "next";
import { ChatPage } from "@/features/pages/chat-page";

export const metadata: Metadata = {
  title: "Chat",
};

export default function ChatRoute() {
  return <ChatPage />;
}
