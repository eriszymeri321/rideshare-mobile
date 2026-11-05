import Link from "next/link";
import { PikaNisjes } from "@/components/PikaNisjes";

export default function TestJava08() {
  return (
    <main>
      <Link href="/">← Kthehu te lista</Link>
      <h1>Java 8 · Prova e vendtakimit</h1>
      <p>Udhëtimi demonstrues 2 · Ferizaj → AAB · 08:15. Të dhënat janë lokale dhe nuk kërkohet hyrje ose databazë.</p>
      <PikaNisjes demo />
    </main>
  );
}
