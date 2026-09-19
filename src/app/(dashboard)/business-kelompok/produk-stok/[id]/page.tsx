export default function ProdukStokDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Detail Produk - {params.id}</h1>
    </div>
  );
}
