import React, { memo, useEffect, useState } from 'react';
import { createAchievement, deleteAchievement, getAchievement, updateAchievement } from '../../../modules/plan';
import { useDispatch, useSelector } from 'react-redux';

import { AnyAction } from 'redux';
import { GetUserList } from '../../../modules/user';
import { IAppState } from '../../../types';
import { ThunkDispatch } from 'redux-thunk';
import dayjs from 'dayjs';
import styled from 'styled-components';
// import { useAuth } from '../../../hooks/useAuth';
import { useAchievement } from '../../../hooks/useAchievement';

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 50%;
  z-index: 1000;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    background: #eee;
    text-align: center;
    padding: 0.5rem;
    font-size: 14px;
    font-weight: bold;
  }

  td {
    padding: 0.5rem;
    border: 1px solid #ddd;
  }
`;

const EditableCell = styled.td<{ isEditing?: boolean }>`
  background: ${props => props.isEditing ? '#fff3e0' : 'transparent'};
  cursor: ${props => props.isEditing ? 'text' : 'pointer'};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: auto;
  display: block;
  
  &:hover {
    opacity: 0.7;
  }
`;

const AddButton = styled.button`
  margin-bottom: 1rem;
  padding: 5px 10px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #45a049;
  }
`;

const ActionButton = styled.button`
  padding: 3px 8px;
  margin: 0 2px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &.edit {
    background: #2196F3;
    color: white;
    
    &:hover {
      background: #1976D2;
    }
  }

  &.delete {
    background: #F44336;
    color: white;
    
    &:hover {
      background: #D32F2F;
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
`;

interface AchievementProps {
  event: any;
  onClose: () => void;
  onUpdate: () => void;
}

const EditableRow = memo(({ 
  formData, 
  onFormChange, 
  onSave, 
  onCancel,
  workerList 
}: { 
  formData: any;
  onFormChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  workerList: any[];
}) => (
  <tr>
    <EditableCell>
      <input
        type="datetime-local"
        value={formData.workdate}
        onChange={(e) => onFormChange('workdate', e.target.value)}
      />
    </EditableCell>
    <EditableCell>
      <input
        value={formData.achievement}
        type="number"
        onChange={(e) => onFormChange('achievement', e.target.value)}
      />
    </EditableCell>

    <EditableCell>
      <select
        value={formData.worker}
        onChange={(e) => onFormChange('worker', e.target.value)}
      >
        <option value="">작업자 선택</option>
        {workerList.map((worker: any) => (
          <option key={worker.id} value={worker.id}>
            {worker.name}
          </option>
        ))}
      </select>
    </EditableCell>
    <EditableCell>
      <input
        value={formData.note}
        onChange={(e) => onFormChange('note', e.target.value)}
      />
    </EditableCell>
    <td>
      <ActionButton className="edit" onClick={onSave}>저장</ActionButton>
      <ActionButton className="delete" onClick={onCancel}>취소</ActionButton>
    </td>
  </tr>
));

const Achievement: React.FC<AchievementProps> = ({ event, onClose, onUpdate }) => {
  // const { role } = useAuth();
  // const { 
  //   // achievements,
  //   deleteAchievement,
  //   // createAchievement,
  //   updateAchievement,
  // } = useAchievement(event.id);

  // const achievements = [{
  //   id: 1,
  //   workdate: '2025-01-01',
  //   achievement: '100',
  //   note: 'test',
  //   worker: 'test',
  // }]
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRow, setNewRow] = useState(false);
  const [workerList, setWorkerList] = useState([]);

  const userList = useSelector((state: IAppState) => state.user.userList);
  const achievements = useSelector((state: IAppState) => state.plan.achievement);

  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  useEffect(() => {
    dispatch(GetUserList());
    dispatch(getAchievement(event.id));
  }, []);

  useEffect(() => {
    if (userList) {
      // const workerList = userList.filter((user: any) => user.role === 'Worker');
      setWorkerList(userList);
    }
  }, [userList]);
  
  // 새로운 행 추가를 위한 상태
  const [newRowData, setNewRowData] = useState({
    workdate: dayjs().format('YYYY-MM-DDTHH:mm'),
    achievement: '',
    note: '',
    worker: '',
  });

  // 기존 행 수정을 위한 상태
  const [editRowData, setEditRowData] = useState({
    workdate: '',
    achievement: '',
    note: '',
    worker: '',
  });

  const handleEdit = (achievement: any) => {
    setEditingId(achievement.id);
    setEditRowData({
      workdate: dayjs(achievement.workdate).format('YYYY-MM-DDTHH:mm'),
      achievement: achievement.accomplishment,
      note: achievement.note,
      worker: achievement.user_id,
    });
  };

  const handleSave = async () => {
    if (newRow) {
      // await createAchievement({
      //   eventId: event.id,
      //   ...newRowData,
      // });
      // dispatch(createAchievement({
      //   eventId: event.id,
      //   ...newRowData,
      // }));
      // console.log(newRowData);

      if (newRowData.achievement === '') {
        alert('실적을 입력해주세요.');
        return;
      }

      if (newRowData.worker === '') {
        alert('작업자를 선택해주세요.');
        return;
      }

      const data = {
        gantt_id: event.id,
        workdate: new Date(newRowData.workdate),
        accomplishment: parseInt(newRowData.achievement),
        note: newRowData.note,
        user_id: parseInt(newRowData.worker),
      }

      // console.log(data);
      dispatch(createAchievement(data));
    } else if (editingId) {
      // await updateAchievement(editingId, editRowData);
      // console.log(editRowData);

      if (editRowData.achievement === '') {
        alert('실적을 입력해주세요.');
        return;
      }

      if (editRowData.worker === '') {
        alert('작업자를 선택해주세요.');
        return;
      }
      const data = {
        id: editingId,
        workdate: new Date(editRowData.workdate),
        accomplishment: parseInt(editRowData.achievement),
        note: editRowData.note,
        user_id: parseInt(editRowData.worker),
      }
      // console.log(data);
      dispatch(updateAchievement(data));
    }
    
    setEditingId(null);
    setNewRow(false);
    setNewRowData({
      workdate: dayjs().format('YYYY-MM-DDTHH:mm'),
      achievement: '',
      note: '',
      worker: '',
    });
    setEditRowData({
      workdate: '',
      achievement: '',
      note: '',
      worker: '',
    });
    onUpdate();
  };

  const handleAddRow = () => {
    setNewRow(true);
    setEditingId(null);
    setNewRowData({
      workdate: dayjs().format('YYYY-MM-DDTHH:mm'),
      achievement: '',
      note: '',
      worker: '',
    });
  };

  const handleNewRowChange = (field: string, value: string) => {
    setNewRowData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditRowChange = (field: string, value: string) => {
    setEditRowData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal>
      <Header>
        <Title>실적 관리</Title>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </Header>
      <AddButton onClick={handleAddRow}>실적 추가</AddButton>
      <Table>
        <thead>
          <tr>
            <th>작업일</th>
            <th>실적</th>
            <th>작업자</th>
            <th>비고</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newRow && (
            <EditableRow 
              formData={newRowData}
              onFormChange={handleNewRowChange}
              onSave={handleSave}
              onCancel={() => {
                setNewRow(false);
                setNewRowData({
                  workdate: dayjs().format('YYYY-MM-DDTHH:mm'),
                  achievement: '',
                  note: '',
                  worker: '',
                });
              }}
              workerList={workerList}
            />
          )}
          {achievements.map((achievement: any) => (
            editingId === achievement.id ? (
              <EditableRow 
                key={achievement.id}
                formData={editRowData}
                onFormChange={handleEditRowChange}
                onSave={handleSave}
                onCancel={() => {
                  setEditingId(null);
                  setEditRowData({
                    workdate: '',
                    achievement: '',
                    note: '',
                    worker: '',
                  });
                }}
                workerList={workerList}
              />
            ) : (
              <tr key={achievement.id}>
                <td>{dayjs(achievement.workdate).format('YYYY-MM-DD HH:mm')}</td>
                <td>{achievement.accomplishment}</td>
                <td>{userList.find((user: any) => user.id === achievement.user_id)?.name}</td>
                <td>{achievement.note}</td>
                <td>
                  <ActionButton className="edit" onClick={() => handleEdit(achievement)}>수정</ActionButton>
                  <ActionButton className="delete" onClick={() => {
                    if(window.confirm('실적을 삭제하시겠습니까?')){
                      dispatch(deleteAchievement(achievement.id));
                    }
                  }}>삭제</ActionButton>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </Table>
    </Modal>
  );
};

export default Achievement;