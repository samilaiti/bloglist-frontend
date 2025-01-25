import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders title and author', () => {
  const blog = {
    title: 'Testing jsdom',
    author: 'Erkki Metsola',
    url: 'www.hoikka.fi',
    likes: 11,
    user: {
      username: 'samilai',
      name: 'Sami Laitinen'
    }
  }

  const user = {
    username: 'samilai',
    name: 'Sami Laitinen'
  }

  const { container } = render(<Blog blog={blog} user={user} />)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('Testing jsdom')
  expect(div).toHaveTextContent('Erkki Metsola')

})

test('shows url, likes and user when clicking view button', async () => {
  const user = userEvent.setup()

  const blog = {
    title: 'Testing jsdom',
    author: 'Erkki Metsola',
    url: 'www.hoikka.fi',
    likes: 11,
    user: {
      username: 'samilai',
      name: 'Sami Laitinen'
    }
  }

  const usr = {
    username: 'samilai',
    name: 'Sami Laitinen'
  }

  const { container } = render(<Blog blog={blog} user={usr} />)
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('www.hoikka.fi')
  expect(div).toHaveTextContent('11')
  expect(div).toHaveTextContent('Sami Laitinen')

})

test('clicking like button twice calls event handler twice', async () => {
  const user = userEvent.setup()

  const blog = {
    title: 'Testing jsdom',
    author: 'Erkki Metsola',
    url: 'www.hoikka.fi',
    likes: 11,
    user: {
      username: 'samilai',
      name: 'Sami Laitinen'
    }
  }

  const usr = {
    username: 'samilai',
    name: 'Sami Laitinen'
  }

  const updateBlog = vi.fn()

  const { container } = render(<Blog blog={blog} user={usr} updateBlog={updateBlog} />)
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')

  await user.click(likeButton)
  await user.click(likeButton)
  expect(updateBlog.mock.calls).toHaveLength(2)

})