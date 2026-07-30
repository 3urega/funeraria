import { AdminListSearch } from "@/components/admin/list/admin-list-search";
import {
  activeFilterToParam,
  type PlaceListParams,
} from "@/lib/admin/list-params";

type Props = {
  basePath: string;
  params: PlaceListParams;
  searchPlaceholder?: string;
};

export function PlaceListFilters({
  basePath,
  params,
  searchPlaceholder = "Cercar per nom o ciutat…",
}: Props) {
  return (
    <AdminListSearch
      basePath={basePath}
      q={params.q}
      placeholder={searchPlaceholder}
      hiddenParams={{
        active: activeFilterToParam(params.active),
      }}
    />
  );
}
