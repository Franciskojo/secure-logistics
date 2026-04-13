import Sidebar from './Sidebar';
import Topbar from './Topbar';


export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-[#070707] font-sans selection:bg-[#BAAB48]/30">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[#070707]">{children}</main>
      </div>
    </div>
  );
}