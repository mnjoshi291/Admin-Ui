import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { config, PagesLimit, DataPerPage } from "../App";
import "./styles.css";

//components
import Pagination from "../components/Pagination/Pagination";
import Navbar from "../components/Navbar/index";
import DataTable from "../components/DataTable/index";

const HomePage = () => {
  const [tableValue, setTableValue] = useState([]);
  const [debounceTimeOut, setDebounceTimeOut] = useState(null);
  let [totalValue, setTotalValue] = useState([]);

  const PerformAPICall = async () => {
    try {
      const result = await axios.get(`${config.endPoint}`);
      setTableValue(result.data);
      setTotalValue(result.data);
    } catch (error) {
      return error.result.data.message;
    }
  };

  const performSearch = async (text) => {
    try {
      if (text !== "") {
        const newData = tableValue.filter(
          (item) =>
            item.name.includes(text) ||
            item.email.includes(text) ||
            item.role.includes(text)
        );
        if (newData) {
          setTableValue(newData);
        }else{
          setTableValue(totalValue);
        }
      }
      
    } catch (error) {
      setTableValue(tableValue);
    }
  };

  const deleteOneUser = (id) => {
    totalValue = totalValue.filter((el) => el.id !== id);
    setTableValue([...tableValue.filter((el) => el.id !== id)]);
  };

  const deleteMultiUser = (id) => {
    setTableValue([...tableValue.filter((el) => id.indexOf(el.id) < 0)]);
    totalValue = totalValue.filter((el) => id.indexOf(el.id) < 0);
  };

  const debounceSearch = (event, debounceTimeOut) => {
    const value = event.target.value;
    if (debounceTimeOut !== 0) {
      clearTimeout(debounceTimeOut);
    }
    const timer = setTimeout(async () => {
      await performSearch(value);
    }, 500);
    setDebounceTimeOut(timer);
  };

  useEffect(() => {
    PerformAPICall();
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <div className="search-bar">
          <input
            id="input-field"
            type="text"
            placeholder="Search by Name, Email or Role"
            onChange={(e) => debounceSearch(e, debounceTimeOut)}
          />
        </div>
          {totalValue.length > 0 ? (
            <Pagination
              data={tableValue}
              pageLimit={PagesLimit}
              dataLimit={DataPerPage}
              onDelete={deleteOneUser}
              onMultiDelete={deleteMultiUser}
              RenderComponent={DataTable}
            />
          ) : (
            <div>No Data</div>
          )}
      </Container>
    </>
  );
};

export default HomePage;
