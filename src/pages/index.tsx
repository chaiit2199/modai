import Image from "next/image";
import { useState, useEffect } from "react";
import { getProduct, getCategory } from "@/api/fetchData";
import { useDevice } from '@/context/DeviceContext';
import PageTitle from "@/components/PageTitle";
import Tabs from "@/components/Tabs";
import Loading from "@/components/Loading";

const tabMenu = [
  {
    id: "smartphones",
    label: "Smartphones",
  },
  {
    id: "mobile-accessories",
    label: "Mobile Accessories",
  },
  {
    id: "tablets",
    label: "tablets",
  },
  {
    id: "laptops",
    label: "Laptops",
  },
  {
    id: "mens-watches",
    label: "Mens Watches",
  },
  
];

export default function Home() {
  const {isMobile} = useDevice();
  const [products, setProduct] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tabMenu[0].id);
  const [categoryTab, setCategoryTab] = useState<any[]>([]);

  const fetchProduct = async () => {
    const { success, data: response } = await getProduct(10, 10);
    if (success && response) {
      setProduct(response.products); 
      setLoading(false);
    } else {
      setLoading(true);
    }
  }; 

  const fetchCategory = async () => {
    const { success, data: response } = await getCategory(activeTab);
    if (success && response) {
      setCategoryTab(response.products); 
      setLoading(false);
    } else {
      setLoading(true);
    }
  };  

  useEffect(() => {
    fetchCategory();
  }, [activeTab]);

  useEffect(() => {
    fetchProduct();
  }, []);

  if (isMobile == undefined) return; 

  return (
    <div>
      <PageTitle />
      <div className="container py-8 mt-8">
        <h2 className="text-3xl font-bold text-center mb-8">New Category</h2>
        <Tabs tabs={tabMenu} switchTab={(id) => setActiveTab(id)} menuStyle="justify-center mb-8" />

        <div className="mt-6">
          <div className="grid grid-cols-4 gap-6 md:grid-cols-2 sm:grid-cols-1">
            {loading && <Loading />}
            {categoryTab && !loading && (
              categoryTab.map((item) => (
                <div className="group flex flex-col h-full shadow-lg p-4 rounded-xl" key={`${item.id}_${item.category}`}>
                  <div className="relative mb-4 overflow-hidden rounded-lg bg-muted aspect-square">
                    <img
                      className="object-cover group-hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl"
                      alt="thumbnail" width="auto" height="auto" src={item.thumbnail}></img>
                    
                    <button className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-background transition-colors">
                      <Image
                        src="/icons/heart.svg"
                        alt="Next.js logo"  
                        width={24}
                        height={24} 
                      />
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Decor</p>
                    <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">Stone Planter</h3>
                    <p className="text-lg font-semibold mb-4 mt-auto">$125</p>
                  </div>
                  <button data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[&gt;svg]:px-3 w-full bg-transparent">Add to Cart</button>
                </div>
              )))}
          </div>    
        </div>
      </div>
      <section className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="cursor-pointer p-4 flex justify-center">
            View All 
           <img alt="Products" loading="lazy" width="20" height="20" className="ml-4" src="/icons/arrow-right.svg"></img>
          </p>
        </div>
        <div className="grid grid-cols-4 gap-6 md:grid-cols-2 sm:grid-cols-1">
          {loading && <Loading />}
          {products && !loading && (
            products.map((item) => (
              <div className="group flex flex-col h-full shadow-lg p-4 rounded-xl" key={`${item.id}_${item.category}`}>
                <div className="relative mb-4 overflow-hidden rounded-lg bg-muted aspect-square">
                  <img 
                    className="object-cover group-hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl"
                    alt="thumbnail product" width="auto" height="auto" src={item.thumbnail}></img>
                  
                  <button className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-background transition-colors">
                    <img alt="heart" width="24" height="24" src="/icons/heart.svg"></img>
                  </button>
                </div>
                <div className="flex-1 flex flex-col">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Decor</p>
                  <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">Stone Planter</h3>
                  <p className="text-lg font-semibold mb-4 mt-auto">$125</p>
                </div>
                <button data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[&gt;svg]:px-3 w-full bg-transparent">Add to Cart</button>
              </div>
            )))}
        </div>      
      </section>
    </div>
  );
}
