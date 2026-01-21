// Polyfill for AbortSignal.any which is not available in React Native
if (typeof AbortSignal !== 'undefined' && !AbortSignal.any) {
  AbortSignal.any = function (signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController()
    
    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort()
        return controller.signal
      }
      
      signal.addEventListener('abort', () => {
        controller.abort()
      }, { once: true })
    }
    
    return controller.signal
  }
}

export {}
