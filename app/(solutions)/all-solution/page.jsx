import SolutionHead from "@/components/solutions/SolutionHead";
import AllSolutions from "@/components/solutions/AllSolutions";
import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Nav from "@/components/headers/Nav";

// Metadata
export const metadata = {
  title: "Solution Details || TKC FarmSuk - Ecommerce",
  description: "TKC FarmSuk - Ecommerce",
};

export default async function Page({ params }) {

  return (
    <>
      <Header7 />
      <Nav />
      <SolutionHead/>
      <AllSolutions/>
      <Footer1 />
    </>
  );
}
