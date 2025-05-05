
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initial check based on window width if available
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    return false // Default to desktop on SSR
  })

  React.useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Call handler right away to establish initial state
    handleResize()
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, []) // Empty array ensures this runs only on mount and unmount

  return isMobile
}

// This hook can be used to apply specific styles for mobile/tablet devices
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop'>(() => {
    // Initial check
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 'mobile'
      if (window.innerWidth < 1024) return 'tablet'
      return 'desktop'
    }
    return 'desktop' // Default
  })

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setBreakpoint('mobile')
      else if (width < 1024) setBreakpoint('tablet')
      else setBreakpoint('desktop')
    }
    
    window.addEventListener("resize", handleResize)
    handleResize() // Set initial state
    
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return breakpoint
}
