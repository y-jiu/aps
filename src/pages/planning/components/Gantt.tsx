import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
// import { useAuth } from '../../../hooks/useAuth';
import Achievement from './Achievement';
import { useGantt } from '../../../hooks/useGantt';
import './styles.css';

dayjs.extend(utc);
dayjs.extend(timezone);



interface GanttProps {
  onEventAchievementUpdated: () => void;
}

const Gantt: React.FC<GanttProps> = ({ onEventAchievementUpdated }) => {
  const [startDay, setStartDay] = useState<Date | null>(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const calendarRef = useRef<FullCalendar>(null);
  // const { role } = useAuth();
  const { getGanttData, updateGanttEvent, createGanttEvent } = useGantt();

  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, resourceTimelinePlugin],
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    initialView: 'resourceTimelineMonth',
    headerToolbar: {
      left: 'title',
      right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
    },
    editable: true,
    droppable: true,
    height: 'auto',
    resourceAreaWidth: 160,
    slotDuration: '24:00:00',
    eventResizableFromStart: true,
    resources: [
      { id: 'facility-1', title: '설비 1' },
      { id: 'facility-2', title: '설비 2' },
      { id: 'facility-3', title: '설비 3' },
      { id: 'facility-4', title: '설비 4' },
    ],
    events: [
      {
        id: '1',
        resourceId: 'facility-1',
        title: '생산 작업 #1',
        start: dayjs().format('YYYY-MM-DD'),
        end: dayjs().add(3, 'day').format('YYYY-MM-DD'),
        backgroundColor: '#4CAF50',
      },
      {
        id: '2',
        resourceId: 'facility-2',
        title: '유지보수',
        start: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        end: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        backgroundColor: '#FFA726',
      },
      {
        id: '3',
        resourceId: 'facility-3',
        title: '특별 주문',
        start: dayjs().add(2, 'day').format('YYYY-MM-DD'),
        end: dayjs().add(4, 'day').format('YYYY-MM-DD'),
        backgroundColor: '#42A5F5',
      },
    ],
  };

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
    setShowAchievement(true);
  };

  const handleEventDrop = async (info: any) => {
    try {
      const startDate = dayjs(info.event.start)
        .tz('Asia/Seoul')
        .format('YYYY-MM-DDTHH:mm:ss');
      const endDate = dayjs(info.event.end)
        .tz('Asia/Seoul')
        .format('YYYY-MM-DDTHH:mm:ss');

      await updateGanttEvent({
        id: info.event.id,
        start_date: startDate,
        end_date: endDate,
        facility_name: info.event._def.resourceIds[0],
      });

      onEventAchievementUpdated();
    } catch (error) {
      console.error('Failed to update event:', error);
      info.revert();
    }
  };

  const handleEventReceive = async (info: any) => {
    if (info.draggedEl.dataset.bomState !== 'Done') {
      alert('작성 완료 후 저장해주세요');
      info.revert();
      return;
    }

    try {
      const startDate = dayjs(info.event.start)
        .tz('Asia/Seoul')
        .format('YYYY-MM-DDTHH:mm:ss');
      const endDate = dayjs(info.event.start)
        .add(1, 'day')
        .tz('Asia/Seoul')
        .format('YYYY-MM-DDTHH:mm:ss');

      const newEvent = await createGanttEvent({
        bom_id: Number(info.draggedEl.dataset.id),
        start_date: startDate,
        end_date: endDate,
        facility_name: info.draggedEl.dataset.facility,
      });

      // Update the event with returned data
      info.event.setProp('id', newEvent.id);
      info.event.setDates(newEvent.start_date, newEvent.end_date);
      
      onEventAchievementUpdated();
    } catch (error) {
      console.error('Failed to create event:', error);
      info.revert();
    }
  };

  return (
    <GanttWrapper>
      <HeaderContainer>
        <DateLabel>시작날짜</DateLabel>
        <DateInput
          type="date"
          value={startDay ? dayjs(startDay).format('YYYY-MM-DD') : ''}
          onChange={(e) => setStartDay(new Date(e.target.value))}
        />
        <SearchButton onClick={() => getGanttData(startDay)}>
          검색
        </SearchButton>
      </HeaderContainer>

      <div id="calendar-container">
        <NavigationButtons>
          <DateChangeButton onClick={() => calendarRef.current?.getApi().prev()}>
            ◀
          </DateChangeButton>
          <DateChangeButton 
            onClick={() => calendarRef.current?.getApi().today()}
            style={{ margin: '0 0.25rem' }}
          >
            오늘
          </DateChangeButton>
          <DateChangeButton onClick={() => calendarRef.current?.getApi().next()}>
            ▶
          </DateChangeButton>
        </NavigationButtons>
        <CalendarContainer>
          <FullCalendar
            ref={calendarRef}
            {...calendarOptions}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventReceive={handleEventReceive}
          />
        </CalendarContainer>
      </div>

      {showAchievement && (
        <Achievement
          event={selectedEvent}
          onClose={() => setShowAchievement(false)}
          onUpdate={onEventAchievementUpdated}
        />
      )}
    </GanttWrapper>
  );
};

export default Gantt;

const GanttWrapper = styled.div`
  min-width: 512px;
  padding-bottom: 0.5rem;
  border: 1px solid #ddd;
`;

const HeaderContainer = styled.div`
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  margin: 0.5rem;
  margin-bottom: 0;
  border-radius: 0.25rem;
`;

const DateLabel = styled.p`
  font-size: 0.875rem;
  margin-right: 0.25rem;
  margin-bottom: 2px;
`;

const DateInput = styled.input`
  background: white;
  border: 1px solid #ddd;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;

const SearchButton = styled.button`
  background: #1976d2;
  color: white;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: #1565c0;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0.6rem;
`;

const DateChangeButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 13px;
  margin: 0 0.25rem;

  &:hover {
    background-color: black;
    color: white;
  }
`;

const CalendarContainer = styled.div`
  margin: 0.5rem;
`;