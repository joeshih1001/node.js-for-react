import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import config from './Config';
import { useHistory } from 'react-router-dom';

function App() {
  const history = useHistory();
  const [data, setData] = useState({});

  const gotoPage = (page=1)=>{
    getData(page);
    history.push(`?page=${page}`);
  };

  const getData = async (page=1)=>{
    const obj = await (await fetch(config.AB_LIST + `?page=${page}`)).json();
    console.log(obj);
    setData(obj);
  };


  useEffect(()=>{
    getData();
  }, []);

  console.log(data);

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
      return (<tr><td></td></tr>);
    }
  };

  return (
    <div className="App">

      <div className="container">
      { (data.rows && data.rows.length) ? 
        (<nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={data.page===1 ? 'page-item disabled' : 'page-item'}>
              <a className="page-link" href="#/" onClick={(event)=>{
                event.preventDefault();
                gotoPage(data.page-1);
                }}>Previous</a>
            </li>
            {  Array(data.totalPages).fill(1).map((el, i)=>(
              <li className={data.page===i+1 ? 'page-item active' : 'page-item'} key={'pageLi'+i}>
                <a className="page-link" href="#/" onClick={(event)=>{
                  event.preventDefault();
                  gotoPage(i+1);
                  }}>{i+1}</a>
              </li>
              ))  
            }
            <li className={data.page===data.totalPages ? 'page-item disabled' : 'page-item'}>
              <a className="page-link" href="#/" onClick={(event)=>{
                event.preventDefault();
                gotoPage(data.page+1);
                }}>Next</a>
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
