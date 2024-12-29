import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { getProductList, updateProduct, createProduct, deleteProduct } from '../../../modules/information';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const Product = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  // const { role } = useAuth();
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [addMode, setAddMode] = useState(false);

  const productList = useSelector((state: any) => state.information.productList);

  const selectedPlanId = useSelector((state: any) => state.plan.selectedPlanId);
  // const companyList = useSelector((state: any) => state.information.companyList);

  useEffect(() => {
    dispatch(getProductList());
  }, []);


  useEffect(() => {
    setEditMode({});
    setEditedValues({});
    setAddMode(false);
  }, [productList]);

  
  const isEditable = () => {
    return true;
  };

  const handleAddProduct = async () => {
    setAddMode(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;

    try {
      await dispatch(deleteProduct(Number(productId)));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleEditStart = (productId: string, field: string, value: string) => {
    setEditMode(prev => ({ ...prev, [`${productId}-${field}`]: true }));
    setEditedValues(prev => ({ ...prev, [`${productId}-${field}`]: value }));
  };

  const handleEditSave = async (productId: string, field: string) => {
    const newValue: any = {
      product_name: '',
      product_unit: '',
      product_family: '',
      product_note: ''
    };

    // Get existing values from companyList
    const product = productList.find((c: any) => c.id === productId);
    if (product) {
      Object.keys(newValue).forEach(key => {
        newValue[key] = product[key];
      });
    }

    // Update with edited values
    for (const key in editedValues) {
      if (key.includes(productId)) {
        newValue[key.split('-')[1]] = editedValues[key];
      }
    }
    
    try {
      await dispatch(updateProduct(Number(productId), newValue));
      setEditMode(prev => ({ ...prev, [`${productId}-${field}`]: false }));
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleEditCancel = (productId: string, field: string) => {
    setEditMode(prev => ({ ...prev, [`${productId}-${field}`]: false }));
    setEditedValues(prev => ({ ...prev, [`${productId}-${field}`]: '' }));
  };

  const handleAddSave = async () => {
    try {
      const newProductData = {
        product_name: editedValues['new-product_name'],
        product_unit: editedValues['new-product_unit'],
        product_family: editedValues['new-product_family'],
        product_note: editedValues['new-product_note']
      };
      
      await dispatch(createProduct(newProductData));
      setAddMode(false);
      setEditedValues({});
    } catch (error) {
      console.error('Failed to create product:', error);
    }
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
                <TableHeaderCell>삭제</TableHeaderCell>
              </tr>
              {productList.map((product: any) => (
                <tr key={product.id}>
                  <TableCell 
                    isEditing={editMode[`${product.id}-product_name`]}
                    onClick={() => isEditable() && handleEditStart(product.id, 'product_name', product.product_name)}
                  >
                    {editMode[`${product.id}-product_name`] ? (
                      <Input
                        value={editedValues[`${product.id}-product_name`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${product.id}-product_name`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(product.id, 'product_name')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(product.id, 'product_name')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(product.id, 'product_name')}
                        autoFocus
                      />
                    ) : product.product_name}
                  </TableCell>
                  <TableCell
                    isEditing={editMode[`${product.id}-product_unit`]}
                    onClick={() => isEditable() && handleEditStart(product.id, 'product_unit', product.product_unit)}
                  >
                    {editMode[`${product.id}-product_unit`] ? (
                      <Input
                        value={editedValues[`${product.id}-product_unit`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${product.id}-product_unit`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(product.id, 'product_unit')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(product.id, 'product_unit')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(product.id, 'product_unit')}
                        autoFocus
                      />
                    ) : product.product_unit}
                  </TableCell>
                  <TableCell
                    isEditing={editMode[`${product.id}-product_family`]}
                    onClick={() => isEditable() && handleEditStart(product.id, 'product_family', product.product_family)}
                  >
                    {editMode[`${product.id}-product_family`] ? (
                      <Input
                        value={editedValues[`${product.id}-product_family`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${product.id}-product_family`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(product.id, 'product_family')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(product.id, 'product_family')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(product.id, 'product_family')}
                        autoFocus
                      />
                    ) : product.product_family}

                  </TableCell>
                  <TableCell
                    isEditing={editMode[`${product.id}-product_note`]}
                    onClick={() => isEditable() && handleEditStart(product.id, 'product_note', product.product_note)}
                  >
                    {editMode[`${product.id}-product_note`] ? (
                      <Input
                        value={editedValues[`${product.id}-product_note`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${product.id}-product_note`]: e.target.value
                        }))}
                      onBlur={() => handleEditSave(product.id, 'product_note')}
                      onKeyPress={e => e.key === 'Enter' && handleEditSave(product.id, 'product_note')}
                      onKeyDown={e => e.key === 'Escape' && handleEditCancel(product.id, 'product_note')}
                      autoFocus
                      />
                    ) : product.product_note}
                  </TableCell>
                  <TableCell>
                    <DeleteButton
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={!isEditable()}
                    >
                      삭제
                    </DeleteButton>
                  </TableCell>
                </tr>
              ))}
              {addMode && (
                <tr>
                  <TableCell>
                    <Input
                      value={editedValues[`new-product_name`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-product_name`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedValues[`new-product_unit`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-product_unit`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedValues[`new-product_family`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-product_family`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedValues[`new-product_note`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-product_note`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                      <SaveButton onClick={() => handleAddSave()}>저장</SaveButton>
                  </TableCell>
                </tr>
              )}

              <tr>
                <TableCell colSpan={7} style={{ backgroundColor: '#E8F5E9' }}>
                  <AddButton
                    onClick={handleAddProduct}
                    disabled={!isEditable()}
                  >
                    +
                  </AddButton>
                </TableCell>
              </tr>
            </tbody>
          )}
        </Table>
      </TableContainer>
    </FacilityWrapper>
  );
};

export default Product;


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

const TableCell = styled.td<{ isEditing?: boolean }>`
  padding: 5px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  background-color: ${props => props.isEditing ? '#e8f5e9' : 'transparent'};
  cursor: ${props => props.isEditing ? 'text' : 'default'};
  transition: background-color 0.2s ease;
  font-size: 12px;
`;

const AddButton = styled.button`
  width: 20px;
  height: 20px;
  padding: 0;
  margin-bottom: 0.25rem;
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
    background-color: #e0e0e0;
    cursor: not-allowed;
    transform: none;
  }
`;

const DeleteButton = styled.button`
  padding: 2px 6px;
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #ff1744;
    transform: scale(1.05);
  }
  
  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
    transform: none;
  }
`;

const Input = styled.input`
  width: 100%;
  border: 2px solid #4CAF50;
  border-radius: 4px;
  font-size: 12px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
`;


const TableHeaderCell = styled.th`
  padding: 5px;
  text-align: center;
  font-weight: 500;
  font-size: 13px;
`;

const ActionCell = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-top: 4px;
`;

const SaveButton = styled.button`
  padding: 2px 6px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled.button`
  padding: 2px 6px;
  background-color: #9e9e9e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: #757575;
  }
`;
