import "react-datepicker/dist/react-datepicker.css"; // Required styles for react-datepicker

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AnyAction } from "redux";
// import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import DatePicker from "react-datepicker"; // react-datepicker library for date picking
import { IAppState } from "../../../types";
import { ThunkDispatch } from "redux-thunk";
import axios from "axios";
import dayjs from "dayjs";
import { getAchievementByDate } from "../../../modules/plan";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc); // Enable UTC plugin

const ProductionPerformance = () => {
  const { t } = useTranslation();
  const [startDay, setStartDay] = useState(new Date());
  const [endDay, setEndDay] = useState(new Date());
  const [keyword, setKeyword] = useState("");
  const [list, setList] = useState([]);
  const achievementByDate = useSelector((state: IAppState) => state.plan.achievementByDate);

  const dispatch = useDispatch<ThunkDispatch<IAppState, any, AnyAction>>();
  useEffect(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setStartDay(startOfMonth);
    setEndDay(endOfMonth);
    // fetchData(startOfMonth, endOfMonth, keyword);
  }, []);


  useEffect(() => {
    // console.log(achievementByDate);
    if (achievementByDate && achievementByDate.length > 0) {
      setList(achievementByDate);
    }
  }, [achievementByDate]);

  // const fetchData = async (start: Date, end: Date, name: string) => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/master`, {
  //       params: {
  //         start_date: dayjs(start).format("YYYY-MM-DD"),
  //         end_date: dayjs(end).format("YYYY-MM-DD"),
  //         name,
  //       },
  //     });
  //     setList(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const handleSearch = () => {
    // fetchData(startDay, endDay, keyword);
    dispatch(getAchievementByDate(dayjs(startDay).format("YYYYMMDD"), dayjs(endDay).format("YYYYMMDD")));
  };

  const formatDate = (dateString: string) => dayjs.utc(dateString).format("YYYY-MM-DD");
  const formatTime = (dateString: string) => dayjs(dateString).format("YYYY-MM-DD HH:mm");

  return (

    <Container>
      <Sheet>
        <Label>{t("performance.startDate")}</Label>
        <DatePicker
          selected={startDay}
          onChange={(date: Date | null) => setStartDay(date || new Date())}
          dateFormat="yyyy.MM.dd"
        />
        <Label>{t("performance.endDate")}</Label>
        <DatePicker
          selected={endDay}
          onChange={(date: Date | null) => setEndDay(date || new Date())}
          dateFormat="yyyy.MM.dd"
        />
        <Input
          type="text"
          placeholder={t("performance.searchKeyword")}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch}>{t("performance.search")}</Button>
        <SaveButton>{t("performance.save")}</SaveButton>
      </Sheet>

      <Table>
        <thead>
          <tr>
            <TableHeader>{t("performance.date")}</TableHeader>
            <TableHeader>{t("performance.worker")}</TableHeader>
            <TableHeader>{t("performance.company")}</TableHeader>
            <TableHeader>{t("performance.product")}</TableHeader>
            <TableHeader>{t("performance.process")}</TableHeader>
            <TableHeader>{t("performance.facility")}</TableHeader>
            <TableHeader>{t("performance.accomplishment")}</TableHeader>
            <TableHeader>{t("performance.note")}</TableHeader>
          </tr>
        </thead>
        <tbody>
          {list.map((data: any, index: number) => (
            <React.Fragment key={index}>
              {/* {index === 0 ||
              (index > 0 && formatDate(list[index - 1].workdate) !== formatDate(data.workdate)) ? (
                <DateRow>
                  <td colSpan="9">{formatDate(data.workdate)}</td>
                </DateRow>
              ) : null} */}
              <tr>
                
                <TableCell>{formatTime(data.workdate)}</TableCell>
                <TableCell>{data.user_name}</TableCell>
                <TableCell>{data.company_name}</TableCell>
                <TableCell>{data.product_name}</TableCell>
                <TableCell>{data.process_name}</TableCell>
                <TableCell>{data.facility_name}</TableCell>
                <TableCell>{data.accomplishment}</TableCell>
                <TableCell>{data.note}</TableCell>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProductionPerformance;


// Styled components
const Container = styled.div`
  max-width: 1000px;
  margin: 1rem auto;
`;

const Sheet = styled.div`
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled.label`

  margin-right: 10px;
  font-size: 15px;
  font-weight: 600;
  margin-left: 10px;
`;


const Input = styled.input`
  flex: 1;
  margin-left: 16px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  margin-left: 16px;
  padding: 0.5rem 1rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1565c0;
  }
`;

const SaveButton = styled.button`
  margin-left: 16px;
  padding: 0.5rem 1rem;
  background-color: #1B7F79;
  color: white;
  border: none;
  border-radius: 4px;
`;

const Table = styled.table`
  width: 100%;
  margin: 1rem auto;
  border-collapse: collapse;
  text-align: left;
`;


const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  color: #495057;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #212529;
`;

const DateRow = styled.tr`
  background-color: #eee;
  text-align: center;

  td {
    font-weight: bold;
  }
`;

