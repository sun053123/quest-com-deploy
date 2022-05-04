import React, {useState, useRef} from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import LoadingPage from '../components/LoadingPage';



function Home() {
    const [classes, setClasses] = useState({})
    const { isLoading, data, isSuccess, isError, error } = useQuery('classrooms', () => axios.get('http://localhost:8000/api/classroom'));

    React.useEffect(() => {
		if (isSuccess) {
			setClasses(data.data.classrooms);
            console.log(classes);
		}
	}, [isSuccess, data]);
    
    if (isLoading) {
        // set delay to show loading page
        return <LoadingPage />
    }
    




  return (
    <div >Home</div>
  )
}

export default Home