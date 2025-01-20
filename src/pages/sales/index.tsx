import Sidebar from '../../components/Sidebar'
import styled from 'styled-components'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as XLSX from 'xlsx';
import UploadFile from './components/uploadFile';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState } from '../../types';
import { updateSheets } from '../../modules/sales';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from 'react-i18next';
import FilterPopup from './components/filterPopup';
import { FilterConfig } from './components/filterPopup';
import { createPlan, getPlanByDate, getPlanCalendar } from '../../modules/plan';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

// Add type definition for the fixed columns
// type SalesRow = {
//   '업체명': string;
//   '품명': string;
//   'L/N': string;
//   '소재 품번': string;
//   '소재 수량': number;
//   '가공 품번': string;
//   '가공 수량': number;
//   '출하일자': string;
//   '출하시간': string;
//   '비고': string;
// }

type SalesRow = {
  plan_date?: string;
  company_name: string;
  name: string;
  lot: string;
  material_name: string;
  material_amount: number;
  product_name: string;
  plan_amount: number;
  deadline_date: string;
  deadline_time: string;
  note: string;
}

const excelDateToJSDate = (excelDate: number) => {
  // Excel's date system has a bug where it thinks 1900 was a leap year
  // We need to adjust for this
  const EXCEL_DATE_OFFSET = 25569; // Days between 1/1/1900 and 1/1/1970
  const MILLISECONDS_PER_DAY = 86400000;
  
  return new Date((excelDate - EXCEL_DATE_OFFSET) * MILLISECONDS_PER_DAY);
};

const excelTimeToString = (excelTime: number) => {
  const totalMinutes = Math.round(excelTime * 24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const Sales = () => {
  const { t } = useTranslation();
  const [rows, setRows] = React.useState<SalesRow[]>([]);
  const [num, setNum] = React.useState(5);
  const [isOpen, setIsOpen] = React.useState(false);
  const [renderedRows, setRenderedRows] = React.useState<any[]>([]);

  // Define fixed column order
  const fixedColumnOrder: { [key: string]: string } = {
    '업체명': 'company_name',
    '품명': 'name',
    'L/N': 'lot',
    '소재 품번': 'material_name',
    '소재 수량': 'material_amount',
    '가공 품번': 'product_name',
    '가공 수량': 'plan_amount',
    '출하일자': 'deadline_date',
    '출하시간': 'deadline_time',
    '비고': 'note'
  }
  //   '업체명',
  //   '품명',
  //   'L/N',
  //   '소재 품번',
  //   '소재 수량',
  //   '가공 품번',
  //   '가공 수량',
  //   '출하일자',
  //   '출하시간',
  //   '비고'
  // ];

  // Replace rowNames state with fixed column order
  const [rowNames] = React.useState<string[]>(Object.keys(fixedColumnOrder));

  const [insertIndex, setInsertIndex] = React.useState<number | null>(null);
  const [newRow, setNewRow] = React.useState<SalesRow>({
    // plan_date: '',
    company_name: '',
    name: '',
    lot: '',
    material_name: '',
    material_amount: 0,
    product_name: '',
    plan_amount: 0,
    deadline_date: '',
    deadline_time: '',
    note: ''
  });
  const [insertRow, setInsertRow] = React.useState(false);
  const sheets = useSelector((state: IAppState) => state.sales.sheets);
  const planCalendar = useSelector((state: IAppState) => state.plan.planCalendar);
  // Add new state for sorting
  const [sortConfig, setSortConfig] = React.useState<{
    key: string | null;
    direction: 'asc' | 'desc' | null;
  }>({ key: null, direction: null });
  const [startDate, setStartDate] = React.useState(new Date());
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<FilterConfig[]>([]);
  const [originalSheets, setOriginalSheets] = React.useState<any[]>([]);
  const [dateAttributes, setDateAttributes] = React.useState<any[]>([]);
  
  const dispatch = useDispatch<ThunkDispatch<IAppState, void, AnyAction>>();
 
  React.useEffect(() => {
    dispatch(getPlanCalendar(startDate.getFullYear().toString(), (startDate.getMonth() + 1).toString()));
  }, []);

  React.useEffect(() => { (async() =>{
    if (sheets.length > 0) {
      setRows(sheets);
      if (originalSheets.length === 0) {
        setOriginalSheets([...sheets]);
      }
    }
  })(); }, [sheets]);
  
  React.useEffect(() => {
    if (planCalendar) {
      // setDateAttributes(planCalendar);
      if (planCalendar.length > 0) {
        const dates = planCalendar.map((date: string) => {
          const year = parseInt(date.substring(0, 4));
          const month = parseInt(date.substring(5, 7)) -1; // Month is 0-based
          const day = parseInt(date.substring(8, 10));
          return new Date(year, month, day);
        });
        setDateAttributes([{
          dot: true,
          dates: dates
        }]);
      }
      else {
        setDateAttributes([]);
      }
    }
  }, [planCalendar]);

  // React.useEffect(() => {
  //   renderRow(rows);
  // }, [rows]);

  // const renderRow = (row: any) => {
  //   const newRowNames = new Set(rowNames);
  //   const renderedRows: any[] = [];
    
  //   row.forEach((r: any) => {
  //     const renderedRow: any[] = [];
  //     for (const key in r) {
  //       // if (!newRowNames.has(key)) {
  //       //   newRowNames.add(key);
  //       // }
  //       if (key === '출하일자') {
  //         renderedRow.push(excelDateToJSDate(r[key]).toLocaleDateString());
  //       } else if (key === '출하시간') {
  //         renderedRow.push(excelTimeToString(r[key]));
  //       } else {
  //         renderedRow.push(r[key]);
  //       }
  //     }
  //     renderedRows.push(renderedRow);
  //   });
    
  //   // setRowNames(Array.from(newRowNames));
  //   setRenderedRows(renderedRows);
  // }

  // console.log(renderedRows)

  const uploadExcel = () => {
    setIsOpen(true)
  }

  const exportExcel = () => {
    console.log('exportExcel');
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'sales.xlsx');
  };

  // Handle input change in the new row
  const handleNewRowChange = (columnName: string, value: string) => {
    setNewRow(prev => ({
      ...prev,
      [columnName]: value
    }));
  };

  // Handle clicking add row button
  const handleAddRow = (index: number) => {
    // setInsertIndex(index);
    setInsertRow(!insertRow);
    
    setNewRow({
      // plan_date: startDate.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, ''),
      company_name: '',
      name: '',
      lot: '',
      material_name: '',
      material_amount: 0,
      product_name: '',
      plan_amount: 0,
      deadline_date: '',
      deadline_time: '',
      note: ''
    });
  };


  const handleSaveData = () => {
    console.log(sheets); 
    // get plan date by current time in format YYYYMMDD
    const planDate = new Date().toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).split('.').map(part => part.trim()).join('');
    
    // console.log(planDate);

    sheets.forEach((sheet) => {
      const deadlineDate = new Date(sheet.deadline_date).toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }).split('.')
        .filter(part => part.trim())
        .map(part => part.trim())
        .join('-');
  
      const data = {
        plan_date: planDate,
        ...sheet,
        deadline_date: deadlineDate,
        deadline_time: sheet.deadline_time + ':00',
        lot: sheet.lot.toString()
      }
      console.log(data);
      dispatch(createPlan(data));
    });

    console.log(sheets);
  }

  // Handle saving the new row
  const handleSaveRow = () => {
    if (insertIndex === null) return;

    const updatedSheets = [...sheets];
    updatedSheets.splice(insertIndex + 1, 0, newRow);
    
    // Update Redux store
    dispatch(updateSheets(updatedSheets));
    
    // Reset local state
    setInsertIndex(null);
    setNewRow({
      company_name: '',
      name: '',
      lot: '',
      material_name: '',
      material_amount: 0,
      product_name: '',
      plan_amount: 0,
      deadline_date: '',
      deadline_time: '',
      note: ''
    });
    setInsertRow(false);
  };

  // Add deleteRow handler
  const handleDeleteRow = (index: number) => {
    if (insertIndex === null) return;

    if (window.confirm(`Delete row ${index + 1}?`)) {
      const updatedSheets = [...sheets];
      updatedSheets.splice(index, 1);
      dispatch(updateSheets(updatedSheets));
    }
  };

  // Add sorting function
  const handleSort = (columnName: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({ key: columnName, direction });

    if (direction === null) {
      dispatch(updateSheets([...originalSheets]));
      return;
    }

    const sortedSheets = [...originalSheets].sort((a, b) => {
      if (a[columnName] < b[columnName]) return direction === 'asc' ? -1 : 1;
      if (a[columnName] > b[columnName]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    dispatch(updateSheets(sortedSheets));
  };

  const applyFilters = (filters: FilterConfig[]) => {
    setActiveFilters(filters);
    
    if (filters.length === 0) {
      dispatch(updateSheets([...originalSheets]));
      return;
    }

    const filteredSheets = originalSheets.filter(sheet => {
      return filters.every(filter => {
        const value = sheet[filter.column]?.toString().toLowerCase();
        const filterValue = filter.value.toLowerCase();
        
        switch (filter.operator) {
          case 'equals':
            return value === filterValue;
          case 'contains':
            return value?.includes(filterValue);
          case 'greater':
            return Number(value) > Number(filterValue);
          case 'less':
            return Number(value) < Number(filterValue);
          default:
            return true;
        }
      });
    });

    dispatch(updateSheets(filteredSheets));
  };

  const handleMonthChange = (date: Date) => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    dispatch(getPlanCalendar(year, month));
  };

  console.log("dateAttributes", dateAttributes);

  const isFirstRowNull = sheets.every(sheet => sheet[rowNames[0]] === null);

  const handleSelectDate = (date: Date) => {
    setStartDate(date ?? new Date());

    // format date to YYYYMMDD

    const formattedDate = date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '').replace(/\ /g, '');
    console.log(formattedDate);

    dispatch(getPlanByDate(formattedDate));
  }
  
  return (
    <Container>
      <DatePickerContainer>
        <DatePickerText>{t('sales.selectDate')}</DatePickerText>
        <DatePicker 
        showIcon
        selected={startDate} 
        onChange={(date) => handleSelectDate(date ?? new Date())}
        onMonthChange={handleMonthChange}
        highlightDates={dateAttributes[0]?.dates}
        />
      </DatePickerContainer>
      <ButtonContainer>
        <FileUploadButton onClick={uploadExcel}>{t('sales.upload')}</FileUploadButton>
        <FileDownloadButton onClick={exportExcel}>{t('sales.download')}</FileDownloadButton>
        <UpdateRowButton onClick={() => handleAddRow(insertIndex ?? 0)}>{t('sales.add')}</UpdateRowButton>
        <UpdateRowButton onClick={() => handleDeleteRow(insertIndex ?? 0)}>{t('sales.delete')}</UpdateRowButton>
        <SaveButton onClick={handleSaveData}>{t('sales.save')}</SaveButton>
        <FilterButton onClick={() => setIsFilterOpen(true)}>
          {t('sales.filter')} {activeFilters.length > 0 && `(${activeFilters.length})`}
        </FilterButton>
      </ButtonContainer>
      <UploadFile isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        columns={rowNames}
        onApplyFilter={applyFilters}
      />
      <TableContainer>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>#</TableHeader>
              {rowNames.map((name, index) => (
                <TableHeader 
                  key={index} 
                  onClick={() => handleSort(name)}
                  isSortable={true}
                >
                  {name}
                  {sortConfig.key === name && (
                    <SortIcon>
                      {sortConfig.direction === 'asc' ? ' ↑' : sortConfig.direction === 'desc' ? ' ↓' : ''}
                    </SortIcon>
                  )}
                </TableHeader>
              ))}
            </TableRow>
          </thead>
          <tbody>
            {insertRow && insertIndex == null && (
              <TableRow>
                <TableCell> </TableCell>
                {rowNames.map((name, index) => (
                  <TableCell key={`new-${index}`}>
                    <Input
                      type="text"
                      value={newRow[name as keyof SalesRow] || ''}
                      onChange={(e) => handleNewRowChange(name, e.target.value)}
                      placeholder="Enter value..."
                    />
                  </TableCell>
                ))}
              </TableRow>
            )}
            {!isFirstRowNull && sheets.map((sheet, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <TableRow key={rowIndex} onClick={() => setInsertIndex(rowIndex)}
                  isSelected={insertIndex === rowIndex}
                >
                  <TableCell>{rowIndex + 1}</TableCell>
                  {rowNames.map((name, colIndex) => (
                    <TableCell key={`${rowIndex}-${colIndex}`}>
                      {sheet[fixedColumnOrder[name]]}
                    </TableCell>
                  ))}
                </TableRow>
                
                {insertIndex === rowIndex && insertRow && (
                  <TableRow>
                    <TableCell>
                      <RowSaveButton onClick={handleSaveRow}>{t('sales.save')}</RowSaveButton>
                    </TableCell>
                    {rowNames.map((name, index) => (
                      <TableCell key={`new-${index}`}>
                        <Input
                          type="text"
                          value={newRow[name as keyof SalesRow] || ''}
                          onChange={(e) => handleNewRowChange(name, e.target.value)}
                          placeholder="Enter value..."
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Sales;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

`;

const FileUploadButton = styled.button`
  background-color: white;
  color: #00CCC0;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #00CCC0;
    color: white;
  }
`;

const FileDownloadButton = styled.button`
  background-color: white;
  color: #FF4858;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #FF4858;
    color: white;
  }
`;

const UpdateRowButton = styled.button`
  background-color: white;
  color: #747F7F;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #747F7F;
    color: white;
  }
`;

const SaveButton = styled.button`
  background-color: white;
  color: #1B7F79;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #1B7F79;
    color: white;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const TableContainer = styled.div`
  margin-top: 20px;
  // width: 80%;
  overflow-x: auto;
  padding: 0 20px;
  display: flex;
  justify-content: center;
`;

const Table = styled.table`
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;


interface TableHeaderProps {
  isSortable?: boolean;
}

const TableHeader = styled.th<TableHeaderProps>`
  padding: 12px;
  text-align: left;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  color: #495057;
  font-weight: 600;
  ${props => props.isSortable && `
    cursor: pointer;
    user-select: none;
    &:hover {
      background-color: #e9ecef;
    }
  `}
`;

const SortIcon = styled.span`
  display: inline-block;
  margin-left: 4px;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #212529;
`;
interface TableRowProps {
  isSelected?: boolean;
}

const TableRow = styled.tr<TableRowProps>`
  &:hover {
    background-color: #f8f9fa;
  }
  cursor: pointer;
    ${props => props.isSelected && `
    background-color: #e2f8f7;
    &:hover {
      background-color: #e2f8f7;
    }
  `}
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #00CCC0;
    box-shadow: 0 0 0 2px rgba(0, 204, 192, 0.2);
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #FF4858;
  font-size: 18px;
  cursor: pointer;
  padding: 0 5px;
  
  &:hover {
    color: #ff1f33;
  }
`;

const DatePickerContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  .react-datepicker__day--highlighted {
    position: relative;
    background-color: transparent;
    color: black;
    
    &:hover {
      background-color: #f0f0f0;
    }

    /* Add dot under the date */
    &::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%);
      width: 0.5px;
      height: 0.5px;
      background-color: #00CCC0;
      border-radius: 50%;
    }
  }
`;

const DatePickerText = styled.div`
  margin-right: 10px;
  font-size: 15px;
  font-weight: 600;
`;

const FilterButton = styled.button`
  background-color: white;
  color: ${props => props.children && props.children.toString().includes('(') ? '#00CCC0' : '#747F7F'};
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: ${props => props.children && props.children.toString().includes('(') ? '#00CCC0' : '#747F7F'};
    color: white;
  }
`;

const RowSaveButton = styled.button`
  background-color: #1B7F79;
  color: white;
  white-space: nowrap;
  padding: 5px 10px;
  border: none;
  font-size: 11px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;