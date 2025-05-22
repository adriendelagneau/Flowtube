import Image from "next/image";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="bg-background absolute top-0 left-0 z-50 flex h-16 w-full items-center px-2 pr-5">
        <div className="flex w-full items-center gap-2 md:gap-4">
          {/** Menu & Logo */}
          <div className="flex flex-shrink-0 items-center">
            <Link href={"/"}>
              <div className="flex items-center gap-1 p-4">
                <Image src="/logo.svg" alt="logo" width={32} height={32} />
                <p className="hidden text-xl font-semibold tracking-tight md:block">
                  FLOWTUBE
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
