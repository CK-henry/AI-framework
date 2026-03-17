import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProjectOverview } from './pages/ProjectOverview'
import { ProjectHome } from './pages/ProjectHome'
import { ModuleBrowser } from './pages/ModuleBrowser'
import { APIDocCenter } from './pages/APIDocCenter'
import { SmartSearch } from './pages/SmartSearch'
import { AdminPanel } from './pages/AdminPanel'
import { useSkillIndex } from './hooks/useSkillIndex'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  const { loading, error } = useSkillIndex()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-muted-foreground">加载项目索引中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">加载失败</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="skill-gui min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<ProjectOverview />} />
            <Route path="/project" element={<ProjectHome />} />
            <Route path="/modules" element={<ModuleBrowser />} />
            <Route path="/modules/:moduleId" element={<ModuleBrowser />} />
            <Route path="/api" element={<APIDocCenter />} />
            <Route path="/api/:moduleId/:sectionId" element={<APIDocCenter />} />
            <Route path="/search" element={<SmartSearch />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </Layout>
      </div>
    </ErrorBoundary>
  )
}

export default App