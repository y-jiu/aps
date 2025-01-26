import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import styled from 'styled-components'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from 'xlsx';
import UploadFile from './components/uploadFile';

//
import {
  Column,
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
  getSortedRowModel,
  ColumnFiltersState,
  SortingState,
  RowSelectionState,
  FilterFn,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next';
import { createPlan, getPlanByDate, getPlanCalendar, deletePlan, updatePlan } from '../../modules/plan';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState } from '../../types';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

declare module '@tanstack/table-core' {
  interface FilterFns {
    between: FilterFn<unknown>
  }
}

type SalesRow = {
  id?: number;
  plan_date?: string;
  company_name: string;
  // name: string;
  lot: string;
  material_name: string;
  material_amount: number;
  product_name: string;
  plan_amount: number;
  deadline_date: string;
  deadline_time: string;
  note: string;
}

const sales_data = [
  { company_name: '회사1', lot: 'L/N1', material_name: '소재 품번1', material_amount: 1, product_name: '가공 품번1', plan_amount: 1, deadline_date: '2025-01-01', deadline_time: '10:00', note: '비고1' },
  { company_name: '회사2', lot: 'L/N2', material_name: '소재 품번2', material_amount: 2, product_name: '가공 품번2', plan_amount: 2, deadline_date: '2025-01-02', deadline_time: '11:00', note: '비고2' },
]

const emptyRow: SalesRow = {
  company_name: '',
  // name: '',
  lot: '',
  material_name: '',
  material_amount: 0,
  product_name: '',
  plan_amount: 0,
  deadline_date: '',
  deadline_time: '',
  note: ''
};


const EditableCell = ({ 
  value: initialValue, 
  row: { index }, 
  column: { id }, 
  updateData 
}: { 
  value: string | number, 
  row: { index: number }, 
  column: { id: string }, 
  updateData: (index: number, id: string, value: string | number) => void 
}) => {
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <StyledInput
      type={typeof initialValue === 'number' ? 'number' : 'text'}
      value={value}
      onChange={(e) => setValue(
        typeof initialValue === 'number' ? Number(e.target.value) : e.target.value
      )}
      onBlur={onBlur}
    />
  );
};

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<SalesRow>> = {
  cell: ({ getValue, row, column, table }) => (
    <EditableCell
      value={getValue() as string | number}
      row={row}
      column={column}
      updateData={table.options.meta?.updateData as (index: number, id: string, value: string | number) => void}
    />
  ),
}

const DateCell = ({ value, row, column, updateData }: any) => {
  return (
    <StyledDatePicker>
      <DatePicker
      selected={value ? new Date(value) : null}
      onChange={(date: Date | null) => {
        updateData(row.index, column.id, date ? date.toISOString().split('T')[0] : '');
      }}
        dateFormat="yyyy-MM-dd"
      />
    </StyledDatePicker>
  );
};

const TimeCell = ({ value, row, column, updateData }: any) => {
  return (
    <StyledTimePicker>
      <DatePicker
        selected={value ? new Date(`2000-01-01T${value}`) : null}
        onChange={(date: Date | null) => {
          updateData(row.index, column.id, date ? date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '');
        }}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="HH:mm"
      />
    </StyledTimePicker>
  );
};

const Sales = () => {
  const columns = useMemo<ColumnDef<SalesRow>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <div style={{ textAlign: 'center' }}>
            <Checkbox
              type="checkbox"
              checked={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Checkbox
              type="checkbox"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 40,
      },
      {
        accessorKey: 'company_name',
        header: () => '회사명',
        footer: props => props.column.id,
        enableSorting: true,
      },
      // {
      //   accessorKey: 'name',
      //   header: () => '품명',
      //   footer: props => props.column.id,
      //   enableSorting: true,
      // },
      {
        accessorKey: 'product_name',
        header: () => '품명',
        footer: props => props.column.id,
        enableSorting: true,
      },
      {
        accessorKey: 'plan_amount',
        header: () => '계획 수량',
        footer: props => props.column.id,
        enableSorting: true,
        filterFn: 'between',
      },
      {
        accessorKey: 'material_name',
        header: () => '소재 품번',
        footer: props => props.column.id,
        enableSorting: true,
      },
      {
        accessorKey: 'material_amount',
        header: () => '소재 수량',
        footer: props => props.column.id,
        enableSorting: true,
        filterFn: 'between',
      },
      {
        accessorKey: 'lot',
        header: () => 'LOT',
        footer: props => props.column.id,
        enableSorting: true,
      },
      {
        accessorKey: 'deadline_date',
        header: () => '출하일자',
        footer: props => props.column.id,
        enableSorting: true,
        cell: ({ getValue, row, column, table }) => (
          <DateCell
            value={getValue()}
            row={row}
            column={column}
            updateData={table.options.meta?.updateData}
          />
        ),
      },
      {
        accessorKey: 'deadline_time',
        header: () => '출하시간',
        footer: props => props.column.id,
        enableSorting: true,
        cell: ({ getValue, row, column, table }) => (
          <TimeCell
            value={getValue()}
            row={row}
            column={column}
            updateData={table.options.meta?.updateData}
          />
        ),
      },
      {
        accessorKey: 'note',
        header: () => '비고',
        footer: props => props.column.id,
        enableSorting: true,
      },
    ],
    []
  )

  const dispatch = useDispatch<ThunkDispatch<IAppState, void, AnyAction>>();
 

  const [data, setData] = useState<SalesRow[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [startDate, setStartDate] = useState(new Date());
  const [dateAttributes, setDateAttributes] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const { t } = useTranslation();

  const planCalendar = useSelector((state: IAppState) => state.plan.planCalendar);
  const planData = useSelector((state: IAppState) => state.plan.planDatas);
  const sheets = useSelector((state: IAppState) => state.sales.sheets);

  const handleSelectDate = (date: Date) => {
    setStartDate(date);
    setDeleteIds([]);

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    dispatch(getPlanByDate(dateString));
    
  };

  useEffect(() => {
    const year = startDate.getFullYear().toString();
    const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const day = startDate.getDate().toString().padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    dispatch(getPlanByDate(dateString));
    dispatch(getPlanCalendar(startDate.getFullYear().toString(), (startDate.getMonth() + 1).toString()));
  }, [])

  useEffect(() => {
    if (sheets) {

      if (data.length != 0) {
        for (const row of data) {
          if (row.id) {
            setDeleteIds(prev => [...prev, row.id!]);
          }
        }
      }
      setData(sheets)
    }
  }, [sheets])

  console.log(data, deleteIds)

  useEffect(() => {
    if (planData) {
      setData(planData)
    }
  }, [planData])
    
  useEffect(() => {
    if (planCalendar) {
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

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      between: (row, columnId, value: [number, number]) => {
        const rowValue = Number(row.getValue(columnId));
        const [min, max] = value;
        if (min !== undefined && max !== undefined) {
          return rowValue >= min && rowValue <= max;
        } else if (min !== undefined) {
          return rowValue >= min;
        } else if (max !== undefined) {
          return rowValue <= max;
        }
        return true;
      },
    },
    state: {
      globalFilter,
      columnFilters,
      sorting,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    },
    // debugTable: true,
  })

  const addRow = () => {
    setData(old => [...old, { ...emptyRow }]);
  };

  const deleteSelectedRows = () => {
    Object.keys(rowSelection).forEach((key) => {
      if (data[Number(key)].id) {
        setDeleteIds(prev => [...prev, data[Number(key)].id!]);
      }
    })
    setData(old => old.filter((_, index) => !rowSelection[index]));
    setRowSelection({});
  };

  const handleMonthChange = (date: Date) => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    dispatch(getPlanCalendar(year, month));
  };


  const uploadExcel = () => {
    setIsOpen(true)
  }

  const exportExcel = () => {
    // key를 한국어로
    const sheetdata = data.map((row: any) => {
      return {
        '업체명': row.company_name,
        '품명': row.product_name,
        '계획수량': row.plan_amount,
        '소재품번': row.material_name,
        '소재수량': row.material_amount,
        'L/N': row.lot,
        '출하일자': row.deadline_date,
        '출하시간': row.deadline_time,
        '비고': row.note,
      }
    })
    const worksheet = XLSX.utils.json_to_sheet(sheetdata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'sales.xlsx');
  };

  const handleSaveData = () => {

    for (const id of deleteIds) {
      dispatch(deletePlan(id.toString()));
    }

    const planDate = startDate.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).split('.')
      .filter(part => part.trim())
      .map(part => part.trim())
      .join('');

    for (const row of data) {
      const deadlineDate = new Date(row.deadline_date).toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }).split('.')
        .filter(part => part.trim())
        .map(part => part.trim())
        .join('-');

      // add seconds to deadline_time
      const deadlineTime = row.deadline_time.split(':')[0] + ":" + row.deadline_time.split(':')[1] + ":00";
      if (row.id) {
        row.plan_date = planDate;
        row.deadline_date = deadlineDate;
        row.deadline_time = deadlineTime;
        dispatch(updatePlan(row));
      }
      else {
        row.plan_date = planDate;
        row.deadline_date = deadlineDate;
        row.deadline_time = deadlineTime;
        dispatch(createPlan(row));
      }
    }
    
    setDeleteIds([]);
    setRowSelection({});
    setGlobalFilter('');
    setColumnFilters([]);
    setSorting([]);
    dispatch(getPlanByDate(planDate));
    setStartDate(startDate);
  }

  return (
    <div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
        <AddButton onClick={addRow}>
          {t('sales.add')}
        </AddButton>
        <DeleteButton 
          onClick={deleteSelectedRows}
          disabled={Object.keys(rowSelection).length === 0}
        >
          {t('sales.delete')}
        </DeleteButton>

        <FileUploadButton onClick={uploadExcel}>{t('sales.upload')}</FileUploadButton>
        <FileDownloadButton onClick={exportExcel}>{t('sales.download')}</FileDownloadButton>
        <SaveButton onClick={handleSaveData}>{t('sales.save')}</SaveButton>
        </div>
        
        <SearchInput
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
        />
      </div>
      <TableWrapper>
        <StyledTable>
          <thead>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((column: any) => (
                  <StyledHeader 
                    key={column.id}
                    isCheckbox={column.id === 'select'}
                  >
                    <div
                      onClick={column.column.getToggleSortingHandler()}
                      style={{ cursor: 'pointer' }}
                    >
                      {flexRender(
                        column.column.columnDef.header,
                        column.getContext()
                      )}
                      <span>
                        {column.column.getIsSorted()
                          ? column.column.getIsSorted() === 'desc'
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </div>
                    {column.id !== 'select' && (
                      column.column.columnDef.filterFn === 'between' ? (
                        <NumberRangeFilter>
                          <ColumnFilter
                            type="number"
                            value={(column.column.getFilterValue() as [number, number])?.[0] ?? ''}
                            // style={{ width: '35px' }}
                            onChange={e => 
                              column.column.setFilterValue((old: [number, number]) => [
                                e.target.value ? Number(e.target.value) : undefined,
                                old?.[1]
                              ])
                            }
                            placeholder="Min"
                          />
                          <ColumnFilter
                            type="number"
                            value={(column.column.getFilterValue() as [number, number])?.[1] ?? ''}
                            // style={{ width: '35px' }}
                            onChange={e =>
                              column.column.setFilterValue((old: [number, number]) => [
                                old?.[0],
                                e.target.value ? Number(e.target.value) : undefined,
                              ])
                            }
                            placeholder="Max"
                          />
                        </NumberRangeFilter>
                      ) : (
                        <ColumnFilter
                          value={column.column.getFilterValue() as string ?? ''}
                          onChange={e => column.column.setFilterValue(e.target.value)}
                          placeholder="Filter..."
                        />
                      )
                    )}
                  </StyledHeader>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row: any) => (
              <StyledRow key={row.id}>
                {row.getVisibleCells().map((cell: any) => (
                  <StyledCell 
                    key={cell.id}
                    isCheckbox={cell.column.id === 'select'}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </StyledCell>
                ))}
              </StyledRow>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
      <UploadFile isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}


export default Sales;


const TableWrapper = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: auto;
  background: white;
  height: calc(100vh - 120px);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 12px;
`;

const StyledHeader = styled.th<{ isCheckbox?: boolean }>`
  padding: 8px;
  background-color: #f3f3f3;
  white-space: nowrap;
  border: 1px solid #e0e0e0;
  text-align: left;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 1;
  min-width: ${props => props.isCheckbox ? '30px' : '100px'};

  &:hover {
    background-color: #eaeaea;
  }

  div {
    margin-bottom: 2px;
  }
`;

const StyledCell = styled.td<{ isCheckbox?: boolean }>`
  padding: 4px 0;
  border: 1px solid #e0e0e0;
  min-width: ${props => props.isCheckbox ? '30px' : '100px'};
  background: white;
`;

const StyledRow = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
  &:nth-child(even) {
    background-color: #fafafa;
  }
`;

const StyledInput = styled.input`
  width: 90%;
  padding: 4px;
  border: 1px solid transparent;
  border-radius: 2px;
  font-size: 12px;
  
  &:focus {
    border-color: #1a73e8;
    outline: none;
    background-color: #fff;
    box-shadow: 0 0 0 2px rgba(26,115,232,0.2);
  }
`;

const SearchInput = styled.input`
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 200px;
  font-size: 13px;

  &:focus {
    border-color: #1a73e8;
    outline: none;
    box-shadow: 0 0 0 2px rgba(26,115,232,0.2);
  }
`;

const ColumnFilter = styled.input`
  width: calc(100% - 8px);
  padding: 4px;
  margin-top: 4px;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  font-size: 11px;

  &:focus {
    border-color: #1a73e8;
    outline: none;
  }
`;

const AddButton = styled.button`
  padding: 6px 16px;
  margin-left: 8px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const DeleteButton = styled(AddButton)`
  background-color: #dc3545;
  color: white;
  &:hover {
    background-color: #c82333;
  }
  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;

const Checkbox = styled.input`
  cursor: pointer;
  margin: 0;
  padding: 0;
`;

const NumberRangeFilter = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 4px;
`;


// Add styled components for the pickers
const StyledDatePicker = styled.div`
  .react-datepicker__input-container input {
    padding: 4px 4px;
    border: 1px solid transparent;
    border-radius: 2px;
    font-size: 12px;
    width: 90%;
    
    &:focus {
      border-color: #1a73e8;
      outline: none;
      background-color: #fff;
      box-shadow: 0 0 0 2px rgba(26,115,232,0.2);
    }
  }
`;

const StyledTimePicker = styled(StyledDatePicker)``;


const DatePickerContainer = styled.div`
  // margin-top: 20px;
  // margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;

  .react-datepicker__view-calendar-icon input {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
  }
  .react-datepicker-popper {
    z-index: 1000;
  }

  .react-datepicker__day--highlighted {
    position: relative;
    background-color: transparent;
    color: black;
    
    &:hover {
      background-color: #f0f0f0;
    }
    z-index: 2000;

    /* Add dot under the date */
    &::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background-color: #00CCC0;
      border-radius: 50%;
      z-index: 2000;
    }
  }
`;

const DatePickerText = styled.div`
  margin-right: 10px;
  margin-left: 10px;
  font-size: 14px;
  font-weight: 500;
`;

const FileUploadButton = styled(AddButton)`
  color: #00CCC0;
  &:hover {
    background-color: #00CCC0;
    color: white;
  }
`;

const FileDownloadButton = styled(AddButton)`
  color: #FF4858;
  &:hover {
    background-color: #FF4858;
    color: white;
  }
`;


const SaveButton = styled(AddButton)`
  color: #1B7F79;
  &:hover {
    background-color: #1B7F79;
    color: white;
  }


`;