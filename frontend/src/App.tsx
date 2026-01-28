import { RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";

import { store } from "./store";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastProvider";
import { router } from "./router";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
