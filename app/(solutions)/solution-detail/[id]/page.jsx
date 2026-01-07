import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import SolutionDetails from "@/components/solutions/SolutionDetails";
import SolutionHead from "@/components/solutions/SolutionHead";
import Nav from "@/components/headers/Nav";
// Metadata
export const metadata = {
  title: "Solution Details || TKC FarmSuk - Ecommerce",
  description: "TKC FarmSuk - Ecommerce",
};

export default function Page({ params }) {
  const id = params.id;

  return (
    <>
      <Header7 />
      <Nav />
      <SolutionHead id={id} />
      <div style={{ height: "2rem" }} />
      <SolutionDetails id={id} />
      <Footer1 />
    </>
  );
}

