

import Layout from "./_layout";
import { ReactFlowProvider } from '@xyflow/react';
import BuildPetriGraph from "@/components/BuildPetriGraph";
import type { PetriExport } from "@/hooks/type";
import {  useEffect, useState } from "react";
import PlayerBar from "@/components/PlayBar";
import { usePetriNetwork } from "@/hooks/usePetriNetwork";
const STORAGE_KEY = 'petri-net-graph';
 
function loadGraphFromLocalStorage(): PetriExport | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PetriExport;
  } catch {
    // localStorage corrompu ou format inattendu : on repart d'un graphe vide
    return null;
  }
}
 
export default function Build() {
const initialGraph=loadGraphFromLocalStorage()
const graphHistory=usePetriNetwork(initialGraph)
console.log(graphHistory?.length)
const [graph,setGraph] = useState<PetriExport | null>(initialGraph);
 const [index,setIndex]=useState<number>(0)
  const handleNext=()=>{
    if(graphHistory){
      if(index<graphHistory.length)setIndex(prev=>prev+1)
    }
  }
  const handlePrevious=()=>{
    if(graphHistory){
      if(index>0)setIndex(prev=>prev-1)
    }

  }

  useEffect(()=>{
    
    if(graphHistory){
      setGraph(graphHistory[index])
      console.log("useEffect")
      console.log(graph?.places[0])
    }
  },[index])
  return (
    <Layout>


          <div>
            
           <ReactFlowProvider>
                <BuildPetriGraph initialGraph={graph} />
                <PlayerBar 
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                />
            </ReactFlowProvider>
    
          </div>

      </Layout>
  
  );
}



