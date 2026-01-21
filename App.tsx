import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import Home from './screens/Home';
import Tasks from './screens/Tasks';
import Calendar from './screens/Calendar';
import Profile from './screens/Profile';
import AddTask from './screens/AddTask';
import TaskDetail from './screens/TaskDetail';
import DocumentViewer from './screens/DocumentViewer';
import Sync from './screens/Sync';
import Welcome from './screens/Welcome';
import FocusMode from './screens/FocusMode';
import AlarmPopup from './components/AlarmPopup';
import NotificationToast from './components/NotificationToast';

// Create a wrapper component to consume the context
const AppContent = () => {
    const { activeAlarmTask, dismissAlarm, toggleTask } = useApp();

    const handleCompleteFromAlarm = () => {
        if (activeAlarmTask) {
            toggleTask(activeAlarmTask.id);
        }
    };

    return (
        <Router>
            <div className="w-full max-w-md mx-auto relative shadow-2xl min-h-screen bg-background-light dark:bg-background-dark overflow-hidden">
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/add" element={<AddTask />} />
                    <Route path="/task/:id" element={<TaskDetail />} />
                    <Route path="/document/:id" element={<DocumentViewer />} />
                    <Route path="/sync" element={<Sync />} />
                    <Route path="/focus/:taskId" element={<FocusMode />} />
                </Routes>
                <BottomNav />
                
                {/* Global Notification Toast */}
                <NotificationToast />

                {/* Global Alarm Popup */}
                {activeAlarmTask && (
                    <AlarmPopup 
                        task={activeAlarmTask} 
                        onDismiss={dismissAlarm} 
                        onComplete={handleCompleteFromAlarm} 
                    />
                )}
            </div>
        </Router>
    );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;