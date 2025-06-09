import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import notificationApi from "../api/notification";
import {
  getAccessToken,
  getRefreshToken,
} from "../service/otherService/localStorage";

// Create context
const NotificationContext = createContext();

// Custom hook to use notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [eventSource, setEventSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch notifications - with debounce to prevent multiple calls
  const getPageNotification = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const page = await notificationApi.getPageNotification();
      setNotifications(page.result.content);

      const pageAll = await notificationApi.getAllNotification();
      const unreadCount = pageAll.result.filter((n) => !n.read).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Get all notifications
  const getAllNotification = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const page = await notificationApi.getAllNotification();
      setNotifications(page.result);
      const unreadCount = page.result.filter((n) => !n.read).length;
      setUnreadCount(unreadCount);
      return page.result;
    } catch (error) {
      console.error("Error fetching all notifications:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Mark notification as read
  const markAsRead = useCallback(async (id) => {
    try {
      await notificationApi.putNotification(id);

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.updateAllStatusRead();

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, []);

  // Setup SSE connection
  const setupSSEConnection = useCallback(() => {
    // Close existing connection if any
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }

    if (!getAccessToken()) return;

    const token = getAccessToken();
    const newEventSource = new EventSource(
      `http://localhost:8082/api/v1/sse/subscribe?token=${token}`
    );

    newEventSource.onerror = (event) => {
      console.error("SSE error:", event);
      if (newEventSource.readyState === EventSource.CLOSED) {
        newEventSource.close();
        setEventSource(null);
      }
    };

    newEventSource.onmessage = (event) => {
      try {
        console.log("New notification received");
        // Increment unread count
        setUnreadCount((prev) => prev + 1);
      } catch (error) {
        console.error("Error processing notification:", error);
      }
    };

    setEventSource(newEventSource);
  }, [eventSource]);

  // Initialize
  useEffect(() => {
    if (isInitialized) return;

    if (getRefreshToken()) {
      // Fetch notifications
      getPageNotification();

      // Setup SSE
      setupSSEConnection();

      setIsInitialized(true);
    }

    // Cleanup function
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isInitialized, setupSSEConnection, getPageNotification, eventSource]);

  // Value object to be provided to consumers
  const value = {
    notifications,
    unreadCount,
    isLoading,
    getPageNotification,
    getAllNotification,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
