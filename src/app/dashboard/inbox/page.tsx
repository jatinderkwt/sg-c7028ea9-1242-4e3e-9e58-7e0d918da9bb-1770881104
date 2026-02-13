'use client'

export default function InboxPage() {
    return (
        <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="p-4 text-center text-gray-500">No conversations yet</div>
                </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-500">Choose a contact from the list to start chatting</p>
                </div>
            </div>
        </div>
    )
}
