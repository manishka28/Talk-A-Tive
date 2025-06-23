
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Chat from './Components/Chat';
import ChatProvider from './context/ChatProvider';

function App() {
  return (
    
      <Router>
        <ChatProvider>
    
    
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chat />} />
        </Routes>
        </ChatProvider>
      </Router>
  );
}

export default App;
