import Image from "next/image";

export function Avatar({ src, name, size = 40 }: { src: string; name: string; size?: number }) {
  return (
    <Image
      src={src}
      alt={`${name} profile`}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
      unoptimized
    />
  );
}
