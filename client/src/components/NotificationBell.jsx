import { useState } from 'react';
import { Bell } from 'lucide-react';  
import { useMessageStore } from "../store/useMessageStore";
const NotificationBell = () => {
    const { notifications, removeNotification, clearAllNotifications } = useMessageStore();
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition-all"
            >
                <Bell size={24} className="text-gray-700" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {notifications.length}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                    <div className="p-4 flex justify-between items-center text-gray-700">
                        <span className="font-semibold">Notificaciones</span>
                        <button onClick={clearAllNotifications}>Limpiar</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="text-center p-4 text-gray-500">No tienes nuevas notificaciones.</p>
                        ) : (
                            notifications.map((notification) => (
                                <div key={notification.id} className="p-4 border-b border-gray-100">
                                    <p><strong>{notification.type === 'message' ? 'Nuevo mensaje:' : 'Nuevo match:'}</strong> {notification.content}</p>
                                    <small className="text-gray-500">De: {notification.sender}</small>
                                    <button onClick={() => removeNotification(notification.id)} className="text-red-500 hover:text-red-700">X</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
