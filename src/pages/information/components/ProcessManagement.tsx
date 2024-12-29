import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCompanyList, createCompany, updateCompany, deleteCompany, getProductList, updateProduct, createProduct, deleteProduct, getProcessList, getProcessManagement, receiveProcessManagement } from '../../../modules/information';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import ProcessManagementModal from './ProcessManagementModal';

const ProcessManagement = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const productList = useSelector((state: any) => state.information.productList);
  const selectedPlanId = useSelector((state: any) => state.plan.selectedPlanId);

  useEffect(() => {
    dispatch(getProductList());
    dispatch(getProcessList());
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    try {
      await dispatch(deleteProduct(Number(productId)));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
    dispatch(getProcessManagement(product.product_name));
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
    // dispatch(receiveProcessManagement({}));
  };

  return (
    <FacilityWrapper>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader 
                colSpan={5}
                onClick={() => setIsTableVisible(!isTableVisible)}
              >
                제품 목록
                {/* Add icon based on visibility state */}
              </TableHeader>
            </tr>
          </thead>
          {isTableVisible && (
            <tbody>
              <tr>
                <TableHeaderCell>제품 이름</TableHeaderCell>
                <TableHeaderCell>품번</TableHeaderCell>
                <TableHeaderCell>제품 분류</TableHeaderCell>
                <TableHeaderCell>비고</TableHeaderCell>
                <TableHeaderCell></TableHeaderCell>
              </tr>
              {productList.map((product: any) => (
                <tr key={product.id}>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.product_unit}</TableCell>
                  <TableCell>{product.product_family}</TableCell>
                  <TableCell>{product.product_note}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenModal(product)}>
                      공정 관리
                    </Button>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </TableContainer>

      {modalIsOpen && (
        <ProcessManagementModal 
          isOpen={modalIsOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </FacilityWrapper>
  );
};

export default ProcessManagement;


const FacilityWrapper = styled.div`
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const TableContainer = styled.div`
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e0e0e0;
  background: white;
`;

const TableHeader = styled.th<{ isVisible?: boolean }>`
  background-color: #e8f5e9;
  padding: 0.5rem;
  text-align: center;
  cursor: pointer;
  border-bottom: 2px solid #4CAF50;
  font-weight: 500;
  transition: background-color 0.2s ease;
  font-size: 13px;
  
  &:hover {
    background-color: rgba(76, 175, 80, 0.5);
  }
`;

const TableCell = styled.td`
  padding: 5px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
  font-size: 12px;
`;

const Button = styled.button`
  padding: 2px 6px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #4CAF50;
    transform: scale(1.05);
  }
  
  &:disabled {
    background-color: #4CAF50;
    cursor: not-allowed;
    transform: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: 5px;
  text-align: center;
  font-weight: 500;
  font-size: 13px;
`;
