import type { Idea } from "@/types";
import { Link } from "@tanstack/react-router";
import clsx from 'clsx'

const IdeaCard = ({idea, button = true}: {idea: Idea, button?: boolean}) => {
    const linkClasses = clsx({
        'text-blue-600 hover:underline mt-3': !button,
        'mt-6 w-full inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition': button,
    })
    return ( 
        <div
            key={idea._id}
            className="
                bg-white rounded-2xl border border-gray-300 shadow-sm hover:shadow-lg
                transition transform hover:-translate-y-1 p-6 flex flex-col justify-between"
            >
            <div>
                <h2 className="text-2xl font-semibold text-black mb-3">
                {idea.title}
                </h2>
                <p className="text-gray-600">
                {idea.summary}
                </p>
            </div>

            <Link to='/ideas/$ideaId' params={{ideaId: idea._id.toString()}}
                className={ linkClasses }
            >
                {button ? 'View Idea' : 'Read More →'}
            </Link>
        </div>
     );
}
 
export default IdeaCard;