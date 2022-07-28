import About from "../pages/About";
import Error from "../pages/Error";
import Login from "../pages/Login";
import PostIdPage from "../pages/PostIdPage";
import Posts from "../pages/Posts";


export const privateRoutes = [
  {path: '/about', element: About, key: 'about'},
  {path: '/posts', element: Posts, key: 'post'},
  {path: '/posts/:id', element: PostIdPage, key: 'postIdPage'},
  {path: 'error', element: Error, key: 'error'}
]


export const publicRoutes = [
  {path: '/login', element: Login, key: 'login'},
]
