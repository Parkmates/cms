import { Image } from "@nextui-org/react";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-between">
      <div className="flex w-full max-w-7xl">
        <div className="w-2/3 h-screen hidden md:block">
          <Image
            width="100%"
            height="100%"
            className="object-cover rounded-none"
            alt="NextUI hero Image"
            src="/1.jpg"
            style={{ height: "100vh" }}
          />
        </div>
        <div className="p-10 w-full md:p-0 md:w-1/2 flex items-center justify-center">
          <main className="w-full max-w-md">{children}</main>
        </div>
      </div>
    </div>
  );
}
