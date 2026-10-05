import { useContext } from 'react'
import { ContentContext } from './content-context-core'

export function usePortfolioContent() {
  const value = useContext(ContentContext)
  if (!value) throw new Error('usePortfolioContent must be used inside PortfolioContentProvider')
  return value
}
