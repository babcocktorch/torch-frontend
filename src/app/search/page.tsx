import { Input } from "@/components/ui/input";

const Search = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 my-8 w-full min-h-screen">
      <Input placeholder="Search" className="h-auto p-4 rounded-none mb-12" />

      <p className="font-miller text-2xl md:text-3xl lg:text-4xl font-medium w-full text-center">
        Enter a search term to get started
      </p>
    </main>
  );
};

export default Search;
