import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'

const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={messageType}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogVisible, setBlogVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
    userService.getAll().then(users =>
      setUsers(users)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username: userName, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUserName('')
      setPassword('')
    } catch (exception) {
      setMessageType('error')
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    console.log('logging in with', userName, password)
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUserName('')
    setPassword('')
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewAuthor('')
        setNewTitle('')
        setNewUrl('')
        setMessageType('success')
        setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch(error => {
        setMessageType('error')
        setMessage(error.message)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })

  }

  const sortBlogs = () => {
    blogs.sort((a, b) => a.likes - b.likes)
  }

  const updateBlog = (id, blogObject) => {
    console.log('id', id)
    console.log('blog', blogObject)
    blogService
      .update(id, blogObject)
      .then(
        blogService.getAll().then(blogs =>
          setBlogs( blogs )
        )
      )
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : returnedBlog))
      })
      .catch(error => {
        setMessageType('error')
        setMessage(error.message)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }

  const deleteBlog = (id) => {
    blogService
      .deleteBlog(id)

    const cleanedBlogs = blogs.filter(blog => blog.id !== id)
    setBlogs(cleanedBlogs)
  }

  const loginForm = () => {
    return (
      <div>
        <LoginForm handleLogin={handleLogin}
          handleUsernameChange={({ target }) => setUserName(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          userName={userName}
          password={password}
        />
      </div>
    )
  }

  const blogForm = () => {
    sortBlogs()
    return (
      <div>
        <h2>blogs</h2>
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>
            logout
          </button>
        </p>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} updateBlog={updateBlog} deleteBlog={deleteBlog} />
        )}
      </div>
    )
  }
  return (
    <div>
      <Notification message={message} messageType={messageType} />
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )
}

export default App