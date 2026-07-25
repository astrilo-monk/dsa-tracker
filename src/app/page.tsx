"use client";

import { useTrackerStore } from "@/store/useTrackerStore";
import { sheetCatalog, loadSheetDataset } from "@/lib/sheets/catalog";
import type { SheetDataset, SheetId } from "@/lib/sheets/types";
import { motion } from "framer-motion";
import { Target, Trophy, Flame, BrainCircuit, ArrowRight, Code2, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { problemStates } = useTrackerStore();
  const [mounted, setMounted] = useState(false);
  const [sheetsData, setSheetsData] = useState<SheetDataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    let active = true;
    Promise.all(sheetCatalog.map(s => loadSheetDataset(s.id)))
      .then(datasets => {
        if (active) {
          setSheetsData(datasets);
          setIsLoading(false);
        }
      })
      .catch(console.error);
      
    return () => { active = false; };
  }, []);

  if (!mounted) return null;

  const totalQuestions = sheetsData.reduce((acc, sheet) => {
    return acc + sheet.patterns.reduce((pAcc, pattern) => {
      return pAcc + pattern.groups.reduce((gAcc, group) => gAcc + group.questions.length, 0);
    }, 0);
  }, 0);
  
  const solvedCount = Object.values(problemStates).filter(s => s.status === 'solved').length;
  const revisingCount = Object.values(problemStates).filter(s => s.status === 'revising').length;
  const bookmarkedCount = Object.values(problemStates).filter(s => s.bookmarked).length;

  const progressPercentage = totalQuestions === 0 ? 0 : Math.round((solvedCount / totalQuestions) * 100);

  return (
    <div className="space-y-8 mt-12 lg:mt-0 pb-20 animate-in fade-in duration-500 max-w-6xl">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Welcome back! 👋</h1>
        <p className="text-muted-foreground">Keep up the momentum. You're doing great!</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Solved" 
          value={isLoading ? "-" : `${solvedCount}`} 
          icon={Target} 
          color="text-primary" 
          bg="bg-primary/10 border-primary/20" 
        />
        <StatCard 
          title="Overall Progress" 
          value={isLoading ? "-" : `${progressPercentage}%`} 
          icon={Trophy} 
          color="text-emerald-500" 
          bg="bg-emerald-500/10 border-emerald-500/20" 
        />
        <StatCard 
          title="Needs Revision" 
          value={revisingCount.toString()} 
          icon={BrainCircuit} 
          color="text-amber-500" 
          bg="bg-amber-500/10 border-amber-500/20" 
        />
        <StatCard 
          title="Bookmarked" 
          value={bookmarkedCount.toString()} 
          icon={Flame} 
          color="text-rose-500" 
          bg="bg-rose-500/10 border-rose-500/20" 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col"
        >
          <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            Your Sheets
          </h2>
          
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-12 text-muted-foreground">
               <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading sheets...
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {sheetsData.map(sheet => {
                const sheetTotal = sheet.patterns.reduce((pAcc, pattern) => {
                  return pAcc + pattern.groups.reduce((gAcc, group) => gAcc + group.questions.length, 0);
                }, 0);
                const sheetSolved = sheet.patterns.reduce((pAcc, pattern) => {
                  return pAcc + pattern.groups.reduce((gAcc, group) => {
                    return gAcc + group.questions.filter(q => problemStates[q.id]?.status === 'solved').length;
                  }, 0);
                }, 0);
                const percent = sheetTotal === 0 ? 0 : Math.round((sheetSolved / sheetTotal) * 100);
                const meta = sheetCatalog.find(s => s.id === sheet.id);
                
                return (
                  <Link href={meta?.href || "#"} key={sheet.id} className="block group">
                    <div className="p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-all duration-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{meta?.emoji}</span>
                          <span className="font-medium">{sheet.title}</span>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{sheetSolved}/{sheetTotal} Solved</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000 ease-out" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-5"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 border border-primary/20 rotate-3 group-hover:rotate-6 transition-transform">
            <Code2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Ready to code?</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            Jump back into your sheets and tackle the next problem. Consistency is key to mastering Data Structures and Algorithms.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {sheetCatalog.map(sheet => (
              <Link key={sheet.id} href={sheet.href} className="px-5 py-2.5 bg-background border border-border text-foreground rounded-md hover:bg-muted transition-colors font-medium text-sm flex items-center gap-2 shadow-sm">
                <span>{sheet.emoji}</span> {sheet.shortTitle}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: { title: string, value: string, icon: any, color: string, bg: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center space-x-4 transition-all hover:border-primary/20 hover:shadow-md"
    >
      <div className={`p-3 rounded-lg border ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}

