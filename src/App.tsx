import { Route, Routes } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { ThemeContext, useThemeState } from './hooks/useTheme'
import { Home } from './pages/Home'
import { Universities } from './pages/Universities'
import { UniversityDetail } from './pages/UniversityDetail'
import { About } from './pages/About'
import { Methodology } from './pages/Methodology'
import { Developer } from './pages/Developer'
import { Report } from './pages/Report'
import { Privacy } from './pages/Privacy'
import { NotFound } from './pages/NotFound'

function App() {
  const themeState = useThemeState()

  return (
    <ThemeContext.Provider value={themeState}>
      <div className="flex min-h-screen flex-col bg-[var(--bg)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-[var(--accent-text)]"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/universities/:id" element={<UniversityDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/developer" element={<Developer />} />
            <Route path="/report" element={<Report />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  )
}

export default App
