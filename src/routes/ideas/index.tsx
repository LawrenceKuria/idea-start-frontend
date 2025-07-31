import { createFileRoute} from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { fetchIdeas } from '@/api/ideas';
import IdeaCard from '@/components/IdeaCard';

const ideasQueryOptions = () => queryOptions({
    queryKey: ['ideas'],
    queryFn: () => fetchIdeas()
})

export const Route = createFileRoute('/ideas/')({
  component: IdeasPage,
  loader: async ({ context: {queryClient} }) => {
    return queryClient.ensureQueryData(ideasQueryOptions())
  }
})

function IdeasPage() {
  const {data: ideas} = useSuspenseQuery(ideasQueryOptions())
  return (
        <> 
          <h1 className="text-4xl font-extrabold text-black mb-10">
            Ideas
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea}/>
            ))}
          </div>
        </>
  )
}
