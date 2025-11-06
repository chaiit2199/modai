"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type TabItem = {
  id: string;
  label: string;
  icons?: string;
};

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  menuStyle?: string;
  switchTab?: (activeId: string) => void; //callback 
}

export default function Tabs({ tabs, defaultTab, menuStyle, switchTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);
  menuStyle = menuStyle === undefined ? "style-1" : menuStyle;

  // callback switchTab change activeTab
  useEffect(() => {
    switchTab?.(activeTab);
  }, [activeTab, switchTab]);

  return (
    <div className="tabs"> 
        <div className={`menu-tabs menu-tabs--${menuStyle}`}>
            {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`menu-tabs--item flex items-center  ${activeTab === tab.id ? "active" : ""}`}>
                    {tab.icons && (
                      <img 
                        src={tab.icons} 
                        alt={`${tab.label} icon`} 
                        // Thêm class để dễ dàng tùy chỉnh style cho icon (ví dụ: kích thước, margin)
                        className="tab-icon mr-2 h-5 w-5" 
                      />
                    )}
                    {tab.label} 
                    {(activeTab === tab.id && menuStyle == "style-2") && (
                      <motion.div
                          layoutId="underline"
                          className="absolute left-0 right-0 bottom-0 h-[2px] bg-black rounded-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                </button>
                
            ))}
        </div>
    </div>
  );
}
