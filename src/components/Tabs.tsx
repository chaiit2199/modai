"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type TabItem = {
  id: string;
  label: string;
};

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  menuStyle?: string;
  switchTab?: (activeId: string) => void; //callback 
}

export default function Tabs({ tabs, defaultTab, menuStyle, switchTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  // callback switchTab change activeTab
  useEffect(() => {
    switchTab?.(activeTab);
  }, [activeTab, switchTab]);

  return (
    <div className="tabs"> 
        <div className={`menu-tabs ${menuStyle}`}>
            {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`menu-tabs--item  ${activeTab === tab.id ? "active" : ""}`}>
                    {tab.label}
                    {activeTab === tab.id && (
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
