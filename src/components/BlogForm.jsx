import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div className='formDiv'>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title:<input value={newTitle} data-testid='title' id='title-id' placeholder='write title' onChange={event => setNewTitle(event.target.value)} /><br />
        author:<input value={newAuthor} data-testid='author' placeholder='write author' onChange={event => setNewAuthor(event.target.value)} /><br />
        url:<input value={newUrl} data-testid='url' placeholder='write url' onChange={event => setNewUrl(event.target.value)} /><br />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm