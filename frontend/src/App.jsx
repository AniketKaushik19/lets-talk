import './App.css'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { Routes ,Route, Navigate } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import OnboardingPage from './pages/OnboardingPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import  { Toaster } from 'react-hot-toast'
import PageLoader from './components/PageLoader'
import useAuthUser from './hooks/useAuthUser'
import Layout from './components/Layout'
import { useThemeStore } from './store/useThemeStore'
import NotificationPage from './pages/NotificationPage'
import Friends from './pages/Friends'


function App() {

  //tanstack query for get req
  const {isLoading,authUser}=useAuthUser()

  const {theme}=useThemeStore()

  const isAuthenticated = Boolean(authUser)
  const isOnboarded=authUser?.isOnboarded

  if(isLoading) return <PageLoader/>
  return (
   <div className='h-screen' data-theme={theme}>
      <Routes>
        <Route path="/" 
              element={
                isAuthenticated && isOnboarded ?(
                <Layout showSidebar={true}>
                  <HomePage/>
                </Layout>)
                : 
                ( <Navigate to={!isAuthenticated? "/login":"/onboarding"}/>)}/>

        <Route path="/login" element={!isAuthenticated?<LoginPage/>: <Navigate to={isOnboarded? "/": "/onboarding"}/>}/>

        <Route path="/Signup" element={!isAuthenticated?<SignUpPage/>: <Navigate to={isOnboarded? "/" :"/onboarding"}/>}/>

        <Route path="/onboarding" element={isAuthenticated? (!isOnboarded ?<OnboardingPage/>:<Navigate to="/"/>): <Navigate to="login"/>}/>

        <Route path="/notification" 
        element={isAuthenticated && isOnboarded? (<Layout showSidebar={true}>
          <NotificationPage/>
          </Layout>
          ):
           <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>}/>

        <Route path="/friends" 
        element={isAuthenticated && isOnboarded? (<Layout showSidebar={true}>
          <Friends/>
          </Layout>
          ):
           <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>}/>

        <Route path="/chat/:id" element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={false}>
               <ChatPage/>
          </Layout>
        ): <Navigate to={!isAuthenticated ? "/login": "/onboarding"}/>}/>

        <Route path="/call/:id" element={isAuthenticated && isOnboarded? <CallPage/>: <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>}/>
      </Routes>
      <Toaster/>
   </div>
  )
}

export default App
