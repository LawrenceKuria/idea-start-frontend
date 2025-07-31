import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createIdea } from '@/api/ideas'

export const Route = createFileRoute('/ideas/new/')({
  component: NewIdeaPage,
})

function NewIdeaPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      navigate({ to: '/ideas' })
    }
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!title.trim() || !summary.trim() || !description.trim() || !title.trim() || !title.trim()) {
        alert('Please fill in all fields')
        return
      }

      try {
        await mutateAsync({
          title,
          summary,
          description,
          tags: tags.split(',')
          .map((item) => item.trim())
          .filter((tag) => tag !== ''),
        })
      } catch (error) {
        console.error(error)
        alert('Something went wrong')
      }
  }
  
  return (
        <div>
          <h1 className="text-3xl font-extrabold text-black mb-8">
            + New Idea
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-black font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="
                  w-full border border-gray-300
                  rounded-lg px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-transparent
                "
              />
            </div>
            <div>
              <label className="block text-black font-medium mb-1">
                Summary
              </label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                className="
                  w-full border border-gray-300
                  rounded-lg px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-transparent
                "
              />
            </div>
            <div>
              <label className="block text-black font-medium mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="
                  w-full border border-gray-300
                  rounded-lg px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-transparent
                "
              />
            </div>
            <div>
              <label className="block text-black font-medium mb-1">
                Tags <span className="text-sm text-gray-500">(comma‑separated)</span>
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="
                  w-full border border-gray-300
                  rounded-lg px-4 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-transparent
                "
              />
            </div>
            <button
              disabled={ isPending }
              type="submit"
              className="
                w-full bg-blue-600 hover:bg-blue-700
                text-white font-medium px-4 py-2
                rounded-lg shadow transition cursor-pointer
              "
            >
              {isPending ? 'Creating Idea...' : 'Create Idea'}
            </button>
          </form>
        </div>
  )
}
