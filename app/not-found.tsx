import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { BiError } from "react-icons/bi";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <BiError size={90} color="primary" />
      <h2 className={title()}>Not Found</h2>
      <p>Could not find requested resource</p>
      <Button variant="flat" color="primary">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
