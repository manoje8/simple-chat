import './App.css';
import AuthProvider from './context/AuthContext';
import SocketProvider from './context/SocketContext';


function App({children}) {
  return (
    <AuthProvider>
      <SocketProvider>
        {children}
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
