import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";

export default async function NotFound() {
  // getTranslations works without locale in not-found since it reads from next-intl context
  const t = await getTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center px-4">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">{t("title")}</h2>
      <p className="text-gray-500">{t("description")}</p>
      <Link
        href="/"
        className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:opacity-80 transition"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
