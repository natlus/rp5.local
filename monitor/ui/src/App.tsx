import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { ChartLineLabelCustom } from "./temp-chart";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="h-full w-full">
          <ChartLineLabelCustom />
        </div>
      </QueryClientProvider>
    </>
  );
}

export default App;
