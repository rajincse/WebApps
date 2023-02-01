import logo from './logo.svg';
import './App.css';
import { HooksList } from './hooks/HooksList';
import { UserContext, Users } from './utils/Users';

function App() {
  return (
    <UserContext.Provider value={Users.Nahid}>
      <div>      
        <HooksList/>
      </div>
    </UserContext.Provider>    
  );
}

export default App;
