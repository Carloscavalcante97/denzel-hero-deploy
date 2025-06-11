import Image from "next/image";

export default function Footer() {
    return(
        <Image src={"/footer.svg"} alt="Footer" width={360} height={47} className="w-full" />
    )
}