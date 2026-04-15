import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ListPage from "./pages/ListPage"
import ArticlePage from "./pages/ArticlePage"
import ErrorPage from "./pages/ErrorPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/DLM' element={<ListPage filter={'dlm'} />} />
        <Route path='/NASCAR' element={<ListPage filter={'nascar'} />} />
        <Route path='/DSC' element={<ListPage filter={'dsc'} />} />
        <Route path='/photos' element={<ListPage filter={'photos'} />} />
        <Route path='/other' element={<ListPage filter={'other'} />} />
        <Route path='/article/:slug' element={<ArticlePage />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
