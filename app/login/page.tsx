import { noIndex } from "../_lib/seo";
import AuthScreen from "../_components/auth-screen";

export const metadata = noIndex("로그인");

export default function Page({ searchParams }: PageProps<"/login">) {
  return <AuthScreen mode="login" searchParams={searchParams} />;
}
