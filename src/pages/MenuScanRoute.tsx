import { useSearchParams } from "react-router-dom";
import MenuPage from "@/components/site/MenuPage";
export default function MenuScanRoute() {
  const [params] = useSearchParams();
  const table = params.get("table");
  return <MenuPage scanMode initialTable={table ? parseInt(table) : undefined} />;
}
