import { redirect } from "next/navigation";

// / → /chat 으로 redirect
export default function RootPage() {
  redirect("/chat");
}
