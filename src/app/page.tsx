import Article from "@/components/article";
import Footer from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, IMAGES } from "@/lib/constants";
import Image from "next/image";

const Home = () => {
  return (
    <main className="w-full max-w-7xl flex flex-col items-center justify-start py-20 gap-16 px-6">
      {/* <Header />; */}
      <Image
        src={IMAGES.logos.big_moore_white.src}
        alt="The Babcock Torch"
        width={IMAGES.logos.big_moore_white.width}
        height={IMAGES.logos.big_moore_white.height}
        className="w-96 h-auto"
      />

      <div className="border-b border-white w-full px-4 py-2 flex items-center justify-start overflow-x-auto">
        {CATEGORIES.map((c, i) => (
          <div
            key={i}
            className="text-white text-sm font-medium bg-transparent rounded-full px-4 py-2 hover:bg-muted cursor-pointer"
          >
            {c}
          </div>
        ))}
      </div>

      <section className="w-full flex flex-col lg:flex-row items-center justify-center gap-4">
        <div className="w-full lg:w-3/4 flex flex-col gap-6 lg:border-r lg:pr-6">
          <Article />
          <Separator />
          <Article />
          <Separator />
          <Article />
          <Separator />
          <Article />
          <Separator />
        </div>

        <Separator orientation="vertical" className="h-full hidden lg:block" />

        <div className="border-r-2 border-white w-full lg:w-1/4"></div>
      </section>

      <Footer />
    </main>
  );
};

export default Home;
