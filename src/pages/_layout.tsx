import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }){
    return(
        <div className="flex flex-col h-full">
            
            {children}
        </div>
    )
}