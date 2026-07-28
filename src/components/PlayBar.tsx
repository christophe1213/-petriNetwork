

// ─── Icons ───────────────────────────────────────────────────────────────────

const SkipBackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
  </svg>
);

const SkipForwardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8l-5.5 4zM16 6h2v12h-2z" />
  </svg>
);



export interface PlayerBarProps {
  /** Called when the user clicks the previous button */
  onPrevious?: () => void;
  /** Called when the user clicks the next button */
  onNext?: () => void;
  /** Called when the user toggles play/pause — receives the new playing state */
  onPlayPause?: (isPlaying: boolean) => void;
  /** Controlled playing state (optional — component manages internally if omitted) */
  isPlaying?: boolean;
  /** Current step number displayed in the badge */
  currentStep?: number;
  /** Total number of steps displayed in the badge */
  totalSteps?: number;
  /**
   * Timer value in seconds (controls auto-advance delay).
   * If provided together with setTimer, the speed control is fully controlled.
   * Defaults to 1.0 if omitted.
   */
  timer?: number;
  /**
   * Setter for the timer value.
   * Receives a value clamped between TIMER_MIN and TIMER_MAX.
   */
  setTimer?: (value: number) => void;
  onGeneratePdf?:()=>{}
  onNewOperation?:()=>void
}



// ─── Component ────────────────────────────────────────────────────────────────

export default function PlayerBar({
  onPrevious,
  onNext,



}: PlayerBarProps) {




  // Local edit state for the text input



  return (
    <div className=" flex items-center justify-center fixed bottom-0 left-0 w-full z-50 bg-white shadow-lg p-3">
      <div
        className="flex flex-wrap  items-center gap-4 px-5 py-3 rounded-2xl shadow-md md:min-w-screen md:min-w-x max-w-3xl"
        style={{ backgroundColor: "#eef1f8" }}
      >
        {/* Transport Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevious}
            aria-label="Étape précédente"
            className="p-2 rounded-lg text-white hover:text-slate-700 hover:bg-white/60 transition-all duration-150"
                       style={{ backgroundColor: "#3b5bdb" }}
         >
            <SkipBackIcon />
          </button>

      

          <button
            onClick={onNext}
            aria-label="Étape suivante"
            className="p-2 rounded-lg  text-white hover:text-slate-700 transition-all duration-150"
              style={{ backgroundColor: "#3b5bdb" }}
          >
            <SkipForwardIcon />
          </button>
        </div>

       
     
      </div>
    </div>
  );
}
