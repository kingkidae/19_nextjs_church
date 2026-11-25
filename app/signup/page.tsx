import { noIndex } from "../_lib/seo";
import AuthScreen from "../_components/auth-screen";

export const metadata = noIndex("회원가입");

export default function Page({ searchParams }: PageProps<"/signup">) {
  return <AuthScreen mode="signup" searchParams={searchParams} />;
}
