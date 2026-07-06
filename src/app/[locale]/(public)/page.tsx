import { getVisibleObituaries } from "@/lib/db/queries";
import { HomePageLayout } from "@/components/home/home-page-layout";
import { loadPublicSiteContext } from "@/lib/site/load-public-site-context";

export default async function HomePage() {
  const [data, obituaries] = await Promise.all([
    loadPublicSiteContext(),
    getVisibleObituaries(),
  ]);

  return <HomePageLayout data={data} obituaries={obituaries} />;
}
