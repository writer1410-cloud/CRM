"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";

export interface LoginState {
  error?: string;
}

/** Server action: sign in with the Credentials provider. */
export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "メールアドレスまたはパスワードが正しくありません。" };
    }
    // Re-throw the redirect thrown by a successful signIn.
    throw error;
  }
}

/** Server action: sign out and return to the login page. */
export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
