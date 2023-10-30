'use client';
import { useNavigate } from "react-router-dom";
import '../App.css'

type HistoryRowProps = {
  id: string;
  name: string;
  lastMessage: string;
  createdAt: string;
};

function truncate(str: string, max: number) {
  return str ? (str.length > max ? str.substr(0, max-1) + '…' : str) : null;
}

const getTime = (date: string) => {
  const d = new Date(date);
  return d.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
}

const HistoryRow = (props: HistoryRowProps) => {
  const { id, name, createdAt, lastMessage } = props;
  const navigate = useNavigate();

  const openJob = async () => {
    const job = {
      id
    };
    navigate('/job',{state: job})
  }

  return (
    <div
      className="historyrow flex items-center py-4 pl-4 group border-b border-b-solid border-b-1 border-b-slate-600"
    >
      <div className="text-sm cursor-default w-1/6 mr-5 flex-none">{getTime(createdAt)}</div>
      <div className="flex flex-col w-2/3 mr-2">
        <div className="text-xs text-indigo-500 cursor-default">{name}</div>
        <div className="cursor-default text-sm">{truncate(lastMessage, 80)}</div>
      </div>
      <div className="flex flex-col flex-none w-1/6">
      <span
        className="group-hover:inline-flex py-1 px-4 bg-zinc-800 hover:bg-indigo-600 rounded-md text-sm cursor-pointer"
        onClick={openJob}
      >
        Restore
      </span>
      </div>
    </div>
  );
}

export default HistoryRow;
