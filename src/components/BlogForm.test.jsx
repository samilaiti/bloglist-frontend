import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('write title')
  const inputAuthor = screen.getByPlaceholderText('write author')
  const inputUrl = screen.getByPlaceholderText('write url')

  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'testing a form')
  await user.type(inputAuthor, 'Sami')
  await user.type(inputUrl, 'www.test.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form')
  expect(createBlog.mock.calls[0][0].author).toBe('Sami')
  expect(createBlog.mock.calls[0][0].url).toBe('www.test.com')

})