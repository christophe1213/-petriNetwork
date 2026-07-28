

import Layout from "./_layout";
import { ReactFlowProvider } from '@xyflow/react';
import PetriNetEditor from "@/components/PetriNodeEditor";
import type { PetriExport } from "@/hooks/type";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
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
 
export default function Home() {
 const [initialGraph] = useState<PetriExport | null>(() => loadGraphFromLocalStorage());
 
  const handleChange = useCallback((graph: PetriExport) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
  }, []);
  const navigate=useNavigate()
  const handleBuild=()=>{
    navigate("/build")
  }

  return (
    <Layout>


          <div>
            
           <ReactFlowProvider>
            <PetriNetEditor onBuild={handleBuild} initialGraph={initialGraph} onChange={handleChange} />
          </ReactFlowProvider>
  
          </div>

      </Layout>
  
  );
}



