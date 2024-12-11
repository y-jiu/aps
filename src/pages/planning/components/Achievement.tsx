import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
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
  max-width: 600px;
  width: 100%;
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

interface AchievementProps {
  event: any;
  onClose: () => void;
  onUpdate: () => void;
}

const Achievement: React.FC<AchievementProps> = ({ event, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  // const { role } = useAuth();
  const { 
    achievements,
    updateAchievement,
    deleteAchievement,
    addAchievement 
  } = useAchievement(event.id);

  const handleSave = async (id: string, field: string, value: any) => {
    await updateAchievement(id, field, value);
    setEditMode(prev => ({ ...prev, [id]: false }));
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      await deleteAchievement(id);
      onUpdate();
    }
  };

  return (
    <Modal>
      <Table>
        <thead>
          <tr>
            <th>작업일</th>
            <th>실적</th>
            <th>비고</th>
            <th>작업자</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {achievements.map((achievement: any) => (
            <tr key={achievement.id}>
              <EditableCell
                isEditing={editMode[`${achievement.id}-date`]}
                // role === 'Admin' && 
                onClick={() => setEditMode(prev => ({ 
                  ...prev, 
                  [`${achievement.id}-date`]: true 
                }))}
              >
                {editMode[`${achievement.id}-date`] ? (
                  <input
                    type="date"
                    value={dayjs(achievement.workdate).format('YYYY-MM-DD')}
                    onChange={(e) => handleSave(achievement.id, 'workdate', e.target.value)}
                    onBlur={() => setEditMode(prev => ({ 
                      ...prev, 
                      [`${achievement.id}-date`]: false 
                    }))}
                  />
                ) : (
                  dayjs(achievement.workdate).format('YYYY-MM-DD')
                )}
              </EditableCell>
              {/* Similar EditableCells for other fields */}
              <td>
                <button onClick={() => handleDelete(achievement.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Modal>
  );
};

export default Achievement;