export default function RabDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Detail RAB - {params.id}</h1>
    </div>
  );
}
