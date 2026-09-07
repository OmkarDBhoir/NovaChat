import { BrowserRouter, Routes, Route, } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Chat from "./components/pages/Chat";

function App() {

  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route element={<ProtectedRoute />}>

            <Route
              path="/chat"
              element={<Chat />}
            />

          </Route>

          <Route
            path="*"
            element={<Login />}
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;