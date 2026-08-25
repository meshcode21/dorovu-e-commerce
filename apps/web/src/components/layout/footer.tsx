import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-sand border-t border-foreground-30/20 pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="inline-block mb-4">
            <Image 
              src="/dorovu_logo.png" 
              alt="Dorovu Logo" 
              width={140} 
              height={40} 
              className="object-contain"
            />
          </Link>
          <p className="text-muted-foreground text-sm mb-6">
            Nepal's premier marketplace for authentic handmade crafts, connecting artisans directly with buyers.
          </p>
        </div>
        
        <div>
          <h3 className="font-display font-semibold text-foreground mb-4">Shop</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/category/crochet" className="hover:text-forest transition-colors">Crochet</Link></li>
            <li><Link href="/category/pottery" className="hover:text-forest transition-colors">Pottery</Link></li>
            <li><Link href="/category/jewelry" className="hover:text-forest transition-colors">Jewelry</Link></li>
            <li><Link href="/category/woodwork" className="hover:text-forest transition-colors">Woodwork</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-semibold text-foreground mb-4">Sell</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/apply" className="hover:text-forest transition-colors">Become a Crafter</Link></li>
            <li><Link href="/seller-policies" className="hover:text-forest transition-colors">Seller Policies</Link></li>
            <li><Link href="/fees" className="hover:text-forest transition-colors">Fees & Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-semibold text-foreground mb-4">Help</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/faq" className="hover:text-forest transition-colors">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-forest transition-colors">Contact Us</Link></li>
            <li><Link href="/returns" className="hover:text-forest transition-colors">Returns & Refunds</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 pt-8 border-t border-foreground-30/20 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Dorovu. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-forest transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-forest transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
