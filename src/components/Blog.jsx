import { useState } from 'react'

const Remove = ({ user, blog, deleteItem }) => {
  console.log('user', user.username)
  console.log('blog user', blog.user.username)
  if (user.username === blog.user.username) {
    const message = `Remove blog ${blog.title} by ${blog.author}`
    return (
      <div>
        <button onClick={(event) => deleteItem(event, blog.id, message)}>remove</button>
      </div>
    )
  }
}

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [showAll, setShowAll] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  const addLike = (event, id) => {
    event.preventDefault()
    // console.log(id)
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user
    }

    updateBlog(id, updatedBlog)
  }

  const deleteItem = (event, id, message) => {
    event.preventDefault()
    if (window.confirm(message)) {
      deleteBlog(id)
    }
  }

  if (!showAll) {
    return (
      <div style={blogStyle} className='blog' data-testid='simpleblog'>
        {blog.title} {blog.author} <button onClick={toggleShowAll}>view</button>
      </div>
    )
  } else {
    return (
      <div style={blogStyle} className='blog' data-testid='fullblog'>
        {blog.title} {blog.author} <button onClick={toggleShowAll}>hide</button><br />
        {blog.url}<br />
        {blog.likes} <button onClick={(event) => addLike(event, blog.id)}>like</button><br />
        {blog.user.name}
        <Remove user={user} blog={blog} deleteItem={deleteItem} />
      </div>
    )
  }
}

export default Blog