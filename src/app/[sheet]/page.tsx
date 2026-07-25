import { notFound } from "next/navigation";
import { sheetCatalog } from "@/lib/sheets/catalog";
import { SheetView } from "./SheetView";

export async function generateStaticParams() {
  return sheetCatalog.map((sheet) => ({
    sheet: sheet.slug,
  }));
}

export default async function SheetPage(props: { params: Promise<{ sheet: string }> }) {
  const params = await props.params;
  const sheetSlug = params.sheet;
  const sheetMeta = sheetCatalog.find((s) => s.slug === sheetSlug);

  if (!sheetMeta) {
    notFound();
  }

  return <SheetView sheetId={sheetMeta.id} />;
}

