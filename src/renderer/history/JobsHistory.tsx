'use client';
import { useEffect, useState } from "react";
import HistoryRow from "./HistoryRow";
import { useNavigate } from "react-router-dom";
import { API, Auth } from "aws-amplify";
import '../App.css'
import IconBack from "../icons/IconBack";

const dayMap: {[key: number]: string} = {
  1: 'SUN',
  2: 'MON',
  3: 'TUE',
  4: 'WED',
  5: 'THU',
  6: 'FRI',
  7: 'SAT'
}

const monthMap: {[key: number]: string} = {
  1: 'JAN',
  2: 'FEB',
  3: 'MAR',
  4: 'APR',
  5: 'MAY',
  6: 'JUN',
  7: 'JUL',
  8: 'AUG',
  9: 'SEP',
  10: 'OCT',
  11: 'NOV',
  12: 'DEC'
}

const JobsHistory = () => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any>([]);
  const navigate = useNavigate();

  const getJobs = async () => {
    const url = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://indigo-api-dev.diffuze.ai';

    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('user2: ', user.attributes.sub);

      const jobs = await API.get('be1', '/jobs?grouped=true&createdBy='+user.attributes.sub, {
        headers: {
          custom_header: `Bearer ${user?.signInUserSession?.accessToken?.jwtToken}`, // get jwtToken
        },
      }).catch((error: any) => console.log(error.response));

      const {data} = jobs;

      const newJobs = data.map((job: any) => {
        const day = dayMap[job._id.dayOfWeek];
        const month = monthMap[job._id.month];
        const formattedDate = `${day} ${month} ${job._id.dayOfMonth}`;
        return {...job, formattedDate};
      })

      console.log('newJobs', newJobs);

      setJobs(newJobs);
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const gotJobs = getJobs();
  },[])

  return (
    <div className="p-4 flex flex-col h-screen" style={{width: '100%'}}>
      <div className="flex-grow" style={{overflowY: 'scroll'}}>
      {jobs.map((job: any, key: number) => {
        return (
          <div key={key}>
            <div className="text-gray-300 text-xs pl-2 my-2">
              <div className="text-gray-600 ">{job.formattedDate}</div>
              <div>{job.count}</div>
            </div>
            {job.jobs.map((j: any, key: number) => {
              return <HistoryRow
                        id={j.id}
                        name={j.recipe.name}
                        lastMessage={j.messages ? j.messages[j.messages.length - 1].data.content : null}
                        createdAt={j.createdAt}
                        key={key}
                      />
            })}
          </div>
        )
      })}
      </div>
      <div className="h-auto pt-2">
        <div onClick={() => navigate(-1)} className=' text-gray-600 cursor-pointer flex flex-row items-center'>

          <span className='mr-2'><IconBack/></span>
          <span className='text-gray-400 text-xs'>Back</span>

        </div>
      </div>
    </div>
  );
}

export default JobsHistory;
