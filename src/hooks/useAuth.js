// Re-export from context so components can import from '@/hooks/useAuth'
// per Phase 2 convention. The actual implementation lives in AuthContext.
export { useAuth } from '@/context/AuthContext';
