import Image from "next/image";

export default function FinaroLogo({
  height = 10,
}: {
  height?: number;
}) {
  return (
    <Image
      src="/flat.svg"
      alt="Finaro"
      width={height}
      height={height}
      className="w-8 h-8"
      priority
    />
  );
}
