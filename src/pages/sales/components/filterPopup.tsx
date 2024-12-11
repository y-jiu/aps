import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import React from 'react';

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  columns: string[];
  onApplyFilter: (filters: FilterConfig[]) => void;
}

export interface FilterConfig {
  column: string;
  operator: 'equals' | 'contains' | 'greater' | 'less';
  value: string;
}

const FilterPopup: React.FC<FilterPopupProps> = ({ isOpen, onClose, columns, onApplyFilter }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = React.useState<FilterConfig[]>([]);

  const addFilter = () => {
    setFilters([...filters, { column: columns[0], operator: 'equals', value: '' }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, field: keyof FilterConfig, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  return isOpen ? (
    <Overlay onClick={onClose}>
      <PopupContent onClick={e => e.stopPropagation()}>
        <PopupHeader>
          <h3>{t('sales.customFilters')}</h3>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </PopupHeader>
        
        <FilterList>
          {filters.map((filter, index) => (
            <FilterRow key={index}>
              <Select
                value={filter.column}
                onChange={e => updateFilter(index, 'column', e.target.value)}
              >
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </Select>
              
              <Select
                value={filter.operator}
                onChange={e => updateFilter(index, 'operator', e.target.value)}
              >
                <option value="equals">{t('sales.equals')}</option>
                <option value="contains">{t('sales.contains')}</option>
                <option value="greater">{t('sales.greater')}</option>
                <option value="less">{t('sales.less')}</option>
              </Select>
              
              <Input
                value={filter.value}
                onChange={e => updateFilter(index, 'value', e.target.value)}
                placeholder={t('sales.filterValue')}
              />
              
              <RemoveButton onClick={() => removeFilter(index)}>
                &times;
              </RemoveButton>
            </FilterRow>
          ))}
        </FilterList>
        
        <ButtonContainer>
          <AddFilterButton onClick={addFilter}>
            {t('sales.addFilter')}
          </AddFilterButton>
          <ApplyButton onClick={() => {
            onApplyFilter(filters);
            onClose();
          }}>
            {t('sales.applyFilters')}
          </ApplyButton>
        </ButtonContainer>
      </PopupContent>
    </Overlay>
  ) : null;
};

export default FilterPopup;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const AddFilterButton = styled.button`
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #e0e0e0;
  }
`;

const ApplyButton = styled.button`
  padding: 8px 16px;
  background: #00CCC0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #00b3a8;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff4858;
  font-size: 20px;
  cursor: pointer;
  padding: 0 8px;
  
  &:hover {
    color: #ff1f33;
  }
`;