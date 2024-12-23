import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'
import XLSX from 'xlsx'
import { updateSheets } from '../../../modules/sales'
import { useTranslation } from 'react-i18next';

interface UploadFileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch()


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

  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result
        // Parse the Excel file
        const workbook = XLSX.read(binaryStr, { type: 'binary' })
        
        // Get first worksheet
        const wsname = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[wsname]
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        console.log(jsonData)

        const updatedData = jsonData.map((row: any) => {
          return {
            // plan_date: row['작성 일자/주차'],
            company_name: row['업체명'],
            name: row['품명'],
            lot: row['L/N'],
            material_name: row['소재 품번'],
            material_amount: row['소재 수량'],
            product_name: row['가공 품번'],
            plan_amount: row['가공 수량'],
            deadline_date: excelDateToJSDate(row['출하일자']).toLocaleDateString(),
            deadline_time: excelTimeToString(row['출하시간']),
            note: row['비고']
          };
        });
        

        console.log(updatedData)

        // Commented out until redux action is implemented
        dispatch(updateSheets(updatedData))

        onClose()
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Upload File</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <DropzoneContainer {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>{t('sales.dropTheFilesHere')}</p>
          ) : (
            <p>{t('sales.dragAndDropFiles')}</p>
          )}
        </DropzoneContainer>
      </ModalContent>
    </ModalOverlay>
  )
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 400px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #ccc;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  
  &:hover {
    border-color: #000;
  }
`;

export default UploadFile