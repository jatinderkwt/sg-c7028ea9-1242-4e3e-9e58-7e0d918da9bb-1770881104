import { Calendar as CalendarIcon, Clock, MoreHorizontal } from "lucide-react"

export default function ScheduledPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Scheduled Actions</h1>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button className="px-4 py-1.5 bg-white text-gray-900 shadow-sm rounded-md text-sm font-medium">List View</button>
                    <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900 rounded-md text-sm font-medium">Calendar</button>
                </div>
            </div>

            <div className="grid gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-blue-600 h-fit">
                            <CalendarIcon size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Holiday Promo Campaign</h3>
                            <p className="text-gray-500 text-sm mb-2">Broadcast to 1,500 recipients</p>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center text-gray-600">
                                    <Clock size={16} className="mr-1" /> Returns in 3 days
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">Scheduled</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-medium text-gray-900">Dec 25, 2024</p>
                        <p className="text-sm text-gray-500">10:00 AM</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="bg-purple-50 p-3 rounded-lg text-purple-600 h-fit">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Follow-up: "Interest in Premium"</h3>
                            <p className="text-gray-500 text-sm mb-2">Individual message to +1 (555) 0123-4567</p>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center text-gray-600">
                                    <Clock size={16} className="mr-1" /> Tomorrow
                                </span>
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">Pending</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-medium text-gray-900">Oct 25, 2024</p>
                        <p className="text-sm text-gray-500">2:00 PM</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
