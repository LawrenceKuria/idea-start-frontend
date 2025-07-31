import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery, useMutation } from '@tanstack/react-query';
import { fetchIdea, deleteIdea } from '@/api/ideas';
import { useAuth } from '@/context/AuthContext';

const ideaQueryOptions = (ideaId:string) => queryOptions({
    queryKey: ['idea', ideaId],
    queryFn: () => fetchIdea(ideaId)
})

export const Route = createFileRoute('/ideas/$ideaId/')({
  component: IdeaDetailsPage,
  loader: async ({ params, context: {queryClient} }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId))
  }
})

function IdeaDetailsPage() {
    const navigate = useNavigate() 
    const { user } = useAuth()
    const { ideaId } = Route.useParams()

    const { mutateAsync: deleteMutate ,isPending } = useMutation({
        mutationFn: () => deleteIdea(ideaId),
        onSuccess: () => {
          navigate({ to: '/ideas' })
        }
      })
    
    const handleDelete = async () => {
        try {
            await deleteMutate()
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
        }
    }
    
    const { data:idea } = useSuspenseQuery
    (ideaQueryOptions(ideaId))
    
    return <div className='p-4'>
        <Link to='/ideas' className='text-blue-500 unserline block mb-4'>
            Back to Ideas
        </Link>
        <h2 className="text-2xl font-bold">
            {idea.title}
        </h2>
        <p className='mt-2'>
            {idea.description}
        </p>
        
        {
           user && user.id === idea.user && (
            <>
                <div className='flex gap-6'>
                    <Link 
                        to='/ideas/$ideaId/edit'
                        params={{ideaId}} 
                        className="bg-yellow-500 text-white text-sm text-semibold text-center 
                        mt-4 p-2 cursor-pointer rounded-md hover:bg-yellow-600 transition disabled:opacity:50">
                        {isPending ? 'Editing...' : 'Edit Idea'}
                    </Link>
                    <button 
                        disabled={isPending}
                        onClick={handleDelete} 
                        className="bg-red-500 text-white text-sm text-semibold text-center 
                        mt-4 p-2 cursor-pointer rounded-md hover:bg-red-600 transition disabled:opacity:50">
                        {isPending ? 'Deleting...' : 'Delete Idea'}
                    </button> 
                </div>
            </>
           )
        }
    </div>
}
