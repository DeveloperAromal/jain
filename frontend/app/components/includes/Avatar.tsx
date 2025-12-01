import Image from "next/image";

export default function Avatar() {
  return (
    <button className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[var(--bg-soft)] transition-colors group">
      <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[var(--border)] group-hover:ring-[var(--primary)] transition-all">
        <Image 
          src="/avatar.png"
          alt="avatar"
          height={36}
          width={36}
          className="object-cover"
        />
      </div>
    </button>
  );
}
