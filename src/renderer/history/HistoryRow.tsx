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
      className="historyrow flex items-center pl-2 pr-4 group hover:bg-gray-800 transition-all"
    >
      <div className="text-sm font-normal cursor-default w-20 mr-5">{getTime(createdAt)}</div>
      <div className="flex border-r border-solid border-indigo-500 h-20 mr-8 relative">
        <div className="w-2.5 h-2.5 bg-transparent border border-solid border-gray-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="flex flex-col w-2/3 mr-2 py-1.5">
        <div className="text-sm font-semibold cursor-default mb-1">{name}</div>
        <div className="cursor-default text-xs font-normal mr-5">{truncate(lastMessage, 90)}</div>
      </div>
      <div className="flex flex-col flex-none w-1/8">
      <span
        className="opacity-0 transition-all w-auto group-hover:opacity-100 py-1 px-4 bg-gray-800  border border-solid border-gray-700 text-center rounded-md text-xs cursor-pointer"
        onClick={openJob}
      >
        Restore
      </span>
      </div>
    </div>
  );
}

export default HistoryRow;
