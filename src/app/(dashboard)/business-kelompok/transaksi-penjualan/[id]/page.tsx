export default function TransaksiPenjualanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">
        Detail Transaksi - {params.id}
      </h1>
    </div>
  );
}
