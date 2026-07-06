import type { CSSProperties, ReactNode } from "react";
import type { HomePageData } from "@/lib/home/defaults";
import { HomeHeader } from "@/components/home/home-header";
import { HomeFooter } from "@/components/home/home-footer";

type Props = {
  data: HomePageData;
  children: ReactNode;
};

export async function PublicSiteShell({ data, children }: Props) {
  return (
    <div
      style={
        {
          "--brand-primary": data.theme.primary,
          "--brand-dark": data.theme.dark,
          "--brand-muted": data.theme.muted,
        } as CSSProperties
      }
    >
      <HomeHeader
        logoUrl={data.logoUrl}
        brandName={data.brandName}
        phone={data.phone}
      />
      <main className="flex-1">{children}</main>
      <HomeFooter
        brandName={data.brandName}
        logoUrl={data.footer.logoUrl}
        tagline={data.footer.tagline}
        phone={data.phone}
        email={data.email}
        address={data.address}
        linkGroups={data.footer.linkGroups}
        legal={data.footer.legal}
        textureUrl={data.footer.textureUrl}
      />
    </div>
  );
}
