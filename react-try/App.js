import './App.css';
import { useEffect, useState } from 'react';
import config from './Config';
import { useHistory, useLocation } from 'react-router-dom';

function App() {
  const history = useHistory();
  const location = useLocation();
  const [data, setData] = useState({});

  const getData = async (page)=>{
    const obj = await (await fetch(config.AB_LIST + `?page=${page}`)).json();
    console.log(obj);
    setData(obj);
  };

  useEffect(()=>{
    const usp = new URLSearchParams(location.search);
    const page = parseInt(usp.get('page'));
    console.log({page});
    getData(page || 1);
  }, [location.search]);

  const renderMe = (data)=>{
    if(data.rows && data.rows.length){
      return data.rows.map(el => (
        <tr key={'test' + el.sid}>
          <td>{el.sid}</td>
          <td>{el.name}</td>
          <td>{el.email}</td>
          <td>{el.mobile}</td>
          <td>{el.birthday}</td>
        </tr>)
      )
    } else {
      return null;
    }
  };

  return (
    <div className="App">

      <div className="container">
      { (data.rows && data.rows.length) ? 
        (<nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={data.page===1 ? 'page-item disabled' : 'page-item'}>
              <button className="page-link" onClick={()=>{
                history.push(`?page=${data.page-1}`);
                }}>Previous</button>
            </li>
            {  Array(data.totalPages).fill(1).map((el, i)=>(
              <li className={data.page===i+1 ? 'page-item active' : 'page-item'} key={'pageLi'+i}>
                <button className="page-link" onClick={()=>{
                  history.push(`?page=${i+1}`);
                  }}>{i+1}</button>
              </li>
              ))  
            }
            <li className={data.page===data.totalPages ? 'page-item disabled' : 'page-item'}>
              <button className="page-link" href="#/" onClick={()=>{
                history.push(`?page=${data.page+1}`);
                }}>Next</button>
            </li>
          </ul>
        </nav>)
      : null
      }
      </div>
      <div className="container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">name</th>
              <th scope="col">email</th>
              <th scope="col">mobile</th>
              <th scope="col">birthday</th>
            </tr>
          </thead>
          <tbody>
            { renderMe(data) }
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default App;
