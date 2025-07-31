import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { editIdea, fetchIdea } from '@/api/ideas'

const ideaQueryOptions = (ideaId:string) => queryOptions({
    queryKey: ['idea', ideaId],
    queryFn: () => fetchIdea(ideaId)
})

export const Route = createFileRoute('/ideas/$ideaId/edit')({
  component: EditIdeaPage,
  loader: async ({ params, context: {queryClient} }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId))
  }
})

function EditIdeaPage() {
  const navigate = useNavigate()
  const { ideaId } = Route.useParams()

  const { data:idea } = useSuspenseQuery(ideaQueryOptions(ideaId))

  const [title, setTitle] = useState(idea.title)
  const [summary, setSummary] = useState(idea.summary)
  const [description, setDescription] = useState(idea.description)
  const [tags, setTags] = useState(`${idea.tags}`)
  
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => editIdea(ideaId, {
          title,
          summary,
          description,
          tags: tags.split(',')
          .map((item) => item.trim())
          .filter((tag) => tag !== ''),
        }),
    onSuccess: () => {
      navigate({ to: '/ideas/$ideaId', params: {ideaId} })
    }
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!title.trim() || !summary.trim() || !description.trim() || !title.trim() || !title.trim()) {
        alert('Please fill in all fields')
        return
      }

      try {
        await mutateAsync()
      } catch (error) {
        console.error(error)
        alert('Something went wrong')
      }
  }
  
  return (
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h1 className="text-3xl font-extrabold text-black mb-8">
                Edit Idea
            </h1>
            <Link to='/ideas/$ideaId' params={{ideaId}} className='text-sm text-blue-600 hover:underline'>
                ← Back to Idea
            </Link>
            </div>
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
              {isPending ? 'Editing Idea...' : 'Edit Idea'}
            </button>
          </form>
        </div>
  )
}
