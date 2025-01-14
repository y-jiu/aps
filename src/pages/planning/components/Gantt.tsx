import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timelinePlugin from '@fullcalendar/timeline';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
// import { useAuth } from '../../../hooks/useAuth';
import Achievement from './Achievement';
import { useGantt } from '../../../hooks/useGantt';
import { getFacilityList } from '../../../modules/information';
import { useDispatch, useSelector } from 'react-redux';
import './styles.css';
import DatePicker from 'react-datepicker';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { createGantt, getGantt, deleteGantt, updateGantt, getGanttCalendar } from '../../../modules/plan';

dayjs.extend(utc);
dayjs.extend(timezone);

interface GanttProps {
  onEventAchievementUpdated: () => void;
}

interface SortState {
  direction: 'asc' | 'desc' | 'none';
}

const Gantt: React.FC<GanttProps> = ({ onEventAchievementUpdated }) => {
  const [startDay, setStartDay] = useState<Date>(new Date());
  const [showAchievement, setShowAchievement] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  // const { getGanttData, updateGanttEvent, createGanttEvent } = useGantt();

  const gantt = useSelector((state: any) => state.plan.gantt);
  const createGanttData = useSelector((state: any) => state.plan.createGantt);
  const selectedPlanId = useSelector((state: any) => state.plan.selectedPlanId);
  const ganttCalendar = useSelector((state: any) => state.plan.ganttCalendar);
  const ganttDateToMove = useSelector((state: any) => state.plan.ganttDateToMove);

  const [dateAttributes, setDateAttributes] = useState<any>([]);
  const [sortState, setSortState] = useState<SortState>({ direction: 'none' });
  const [facilitySearch, setFacilitySearch] = useState('');

  useEffect(() => {
    if (gantt && ganttDateToMove && ganttDateToMove.length > 0) {
      const events = gantt.map((event: any) => ({
        id: event.id,
        resourceId: event.facility_id,
        title: event.process_name,
        start: dayjs(event.start_date).format('YYYY-MM-DDTHH:mm:ss'),
        end: dayjs(event.end_date).format('YYYY-MM-DDTHH:mm:ss'),
        allDay: false,
        backgroundColor: ganttDateToMove.some((moveEvent: any) => 
          moveEvent.processnode_id === event.processnode_id
        ) ? '#CDB4DB' : '#95B8D1',
        borderColor: 'transparent',
        extendedProps: {
          processId: event.processnode_id,
          facilityId: event.facility_id,
          planId: event.plan_id
        }
      }));

      setCalendarOptions((prevOptions: any) => ({
        ...prevOptions,
        events: events
      }));

      if (calendarRef.current && ganttDateToMove[0]?.start_date) {
        const firstDate = dayjs(ganttDateToMove[0].start_date).toDate();
        calendarRef.current.getApi().gotoDate(firstDate);
        setStartDay(firstDate);
      }
    }
  }, [ganttDateToMove]);

  const [calendarOptions, setCalendarOptions] = useState<any>({
    plugins: [
      dayGridPlugin,
      interactionPlugin,
      resourceTimelinePlugin,
      timelinePlugin
    ],
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    initialView: 'day',
    headerToolbar: {
      left: 'title',
      right: 'day,week,month'
    },
    views: {
      day: {
        type: 'resourceTimeline',
        duration: { days: 1 },
        slotDuration: '01:00:00',
        snapDuration: '00:05:00',
      },
      week: {
        type: 'resourceTimeline',
        duration: { days: 7 },
        slotDuration: '24:00:00',
        slotLabelFormat: [
          { month: 'short', day: 'numeric', weekday: 'short' },
        ]
      },
      month: {
        type: 'resourceTimeline',
        duration: { days: 30 },
        slotDuration: '24:00:00',
        slotLabelFormat: [
          { month: 'short', day: 'numeric', weekday: 'short' },
        ]
      }
    },
    editable: true,
    droppable: true,
    height: 'auto',
    resourceAreaWidth: 160,
    slotDuration: '01:00:00',
    snapDuration: '00:05:00',
    slotLabelFormat: [
      { month: 'long', year: 'numeric', day: 'numeric', weekday: 'short' }, // top level of text
      { hour: 'numeric', minute: '2-digit', hour12: false } // lower level of text
    ],
    eventResizableFromStart: true,
    resourceOrder: 'order',
    resources: [],
    events: [],
  });

  const facilityList = useSelector((state: any) => state.information.facilityList);
  
  useEffect(() => {
    dispatch(getFacilityList());
  }, []);

  useEffect(() => {
    if (facilityList) {
      const filteredFacilities = getFilteredAndSortedFacilities(facilityList);
      setCalendarOptions((prevOptions: any) => ({
        ...prevOptions,
        resources: filteredFacilities.map((facility: any, index: number) => ({ 
          id: facility.id, 
          title: facility.facility_name,
          order: index
        }))
      }));
    }
  }, [facilityList, sortState, facilitySearch]);

  useEffect(() => {
    const startDate = dayjs(startDay)
      .format('YYYYMMDD');

    dispatch(getGantt(startDate));

  }, []);

  useEffect(() => {
    if (gantt) {
      const events = gantt.map((event: any) => ({
        id: event.id,
        resourceId: event.facility_id,
        title: event.process_name,
        start: dayjs(event.start_date).format('YYYY-MM-DDTHH:mm:ss'),
        end: dayjs(event.end_date).format('YYYY-MM-DDTHH:mm:ss'),
        backgroundColor: '#95B8D1',
        borderColor: 'transparent',
        allDay: false,
        extendedProps: {
          processId: event.processnode_id,
          facilityId: event.facility_id,
          planId: event.plan_id
        }
      }));

      setCalendarOptions((prevOptions: any) => ({
        ...prevOptions,
        events: events,
      }));
    }
  }, [gantt]);

  useEffect(() => {
    dispatch(getGanttCalendar(String(startDay.getFullYear()), String(startDay.getMonth() + 1)));
    const handleDeleteEvent = (e: CustomEvent) => {
      const { eventId } = e.detail;
      handleEventDelete(eventId);
    };

    document.addEventListener('deleteGanttEvent', handleDeleteEvent as EventListener);
    return () => {
      document.removeEventListener('deleteGanttEvent', handleDeleteEvent as EventListener);
    };
  }, []);

  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleEventClick = (info: any) => {
    // Prevent opening menu if clicking on an already open menu
    if (menuPosition) {
      setMenuPosition(null);
      return;
    }

    // Get click coordinates
    const { pageX, pageY } = info.jsEvent;
    setSelectedEvent(info.event);
    setMenuPosition({ x: pageX, y: pageY });
  };

  const handleMenuSelect = (action: 'delete' | 'achievement') => {
    if (!selectedEvent) return;

    if (action === 'delete') {
      handleEventDelete(selectedEvent.id);
    } else if (action === 'achievement') {
      setShowAchievement(true);
    }

    // Close menu after selection
    setMenuPosition(null);
  };

  const handleEventDrop = async (info: any) => {
    try {
    const data = {
      id: Number(info.event.id),
      start_date: info.event.start,
      end_date: info.event.end,
      facility_id: info.event.extendedProps.facilityId
    }
    dispatch(updateGantt(data));

      onEventAchievementUpdated();
    } catch (error) {
      console.error('Failed to update event:', error);
      info.revert();
    }
  };

  const handleEventResize = async (info: any) => {

    const data = {
      id: Number(info.event.id),
      start_date: info.event.start,
      end_date: info.event.end,
      facility_id: info.event.extendedProps.facilityId
    }
    dispatch(updateGantt(data));
  }

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

      onEventAchievementUpdated();
    } catch (error) {
      console.error('Failed to create event:', error);
      info.revert();
    }
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      if (window.confirm('일정을 삭제하시겠습니까?')) {
        dispatch(deleteGantt(eventId));
        alert('일정이 삭제되었습니다.');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      // Revert UI if backend delete fails
      const startDate = dayjs(startDay).format('YYYYMMDD');
      dispatch(getGantt(startDate)); // Refresh data from server
      alert('일정 삭제에 실패했습니다.'); // "Failed to delete schedule"
    }
  };

  useEffect(() => {
    // Add listener for process drop events
    const handleProcessDrop = (e: CustomEvent) => {
      const calendar = calendarRef.current?.getApi();
      if (!calendar) return;

      const calendarEl = document.querySelector('.fc-timeline-slots');
      if (!calendarEl) return;

      const rect = calendarEl.getBoundingClientRect();
      const { x, y, processId, processnodeId, processName } = e.detail;

      // Update the selector to match the current FullCalendar class
      const resourceAreaEl = document.querySelector('.fc-datagrid-body');
      
      if (!resourceAreaEl) return;

      const resources = calendar.getResources();
      const resourceHeight = resourceAreaEl.getBoundingClientRect().height / resources.length;
      const relativeY = y - rect.top;
      const resourceIndex = Math.floor(relativeY / resourceHeight);
      const targetResource = resources[resourceIndex];

      if (!targetResource) return;

      // Get hit information at drop point
      const viewApi = calendar.view;
      const start = viewApi.activeStart;
      const end = viewApi.activeEnd;
      const timeMs = start.valueOf() + ((x - rect.left) / rect.width) * (end.valueOf() - start.valueOf());
      const date = new Date(timeMs);
      const endDate = dayjs(date).add(1, 'hour').toDate();

      if (date) {
        
        const data = {  
          processnode_id: processId,
          plan_id: selectedPlanId,
          start_date: date,
          end_date: endDate,
          facility_id: Number(targetResource.id),
        }

        if (data.processnode_id && data.plan_id && data.start_date && data.end_date && data.facility_id) {
          dispatch(createGantt(data));
        }
        
      }
    };

    document.addEventListener('processDrop', handleProcessDrop as EventListener);
    return () => {
      document.removeEventListener('processDrop', handleProcessDrop as EventListener);
    };
  }, [selectedPlanId]);

  const handleDateSearch = () => {
    if (startDay && calendarRef.current) {
      calendarRef.current.getApi().gotoDate(startDay);
    }
  };

  useEffect(() => {
    if (ganttCalendar) {
      if (ganttCalendar?.length > 0) {
        const dates = ganttCalendar.map((date: string) => {
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
    }
    if (ganttCalendar?.length === 0) {
      setDateAttributes([]);
    }
  }, [ganttCalendar]);

  const handleMonthChange = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    dispatch(getGanttCalendar(String(year), String(month)));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setStartDay(date);
    }
  };

  const getFilteredAndSortedFacilities = (facilities: any[]) => {
    if (!facilities) return [];
    
    let filtered = facilities.filter(facility => 
      facility.facility_name.toLowerCase().includes(facilitySearch.toLowerCase())
    );

    if (sortState.direction !== 'none') {
      filtered.sort((a, b) => {
        const comparison = a.facility_name.localeCompare(b.facility_name);
        return sortState.direction === 'asc' ? comparison : -comparison;
      });
    } else {
      // Default sort by facility_order
      filtered.sort((a, b) => a.facility_order - b.facility_order);
    }

    return filtered;
  };

  return (
    <GanttWrapper>
      <HeaderContainer>
        <FacilityFilterContainer>
          <SearchInput
            type="text"
            placeholder="설비 검색..."
            value={facilitySearch}
            onChange={(e) => setFacilitySearch(e.target.value)}
          />
          <SortButton
            onClick={() => setSortState(prev => ({
              direction: prev.direction === 'none' ? 'asc' : 
                         prev.direction === 'asc' ? 'desc' : 'none'
            }))}
          >
            정렬
            {sortState.direction === 'none' && '↕️'}
            {sortState.direction === 'asc' && '↑'}
            {sortState.direction === 'desc' && '↓'}
          </SortButton>
        </FacilityFilterContainer>
        <DateLabel>날짜</DateLabel>
        <DatePickerWrapper>
          <DatePicker
            selected={startDay}
            onChange={handleDateChange}
            onMonthChange={handleMonthChange}
            dateFormat="yyyy.MM.dd"
            placeholderText="Select date"
            highlightDates={dateAttributes[0]?.dates}
          />
        </DatePickerWrapper>
        <SearchButton onClick={handleDateSearch}>
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
            droppable={true}
            eventResize={handleEventResize}
          />
        </CalendarContainer>
      </div>

      {menuPosition && (
        <EventMenu x={menuPosition.x} y={menuPosition.y}>
          <MenuItem onClick={() => handleMenuSelect('achievement')}>실적 확인</MenuItem>
          <MenuItem onClick={() => handleMenuSelect('delete')}>삭제</MenuItem>
        </EventMenu>
      )}

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
  margin-right: 8px;
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

const EventMenu = styled.div<{ x: number; y: number }>`
  position: fixed;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    z-index: 999;
  }
  .react-datepicker-popper {
    z-index: 999;
  }

  .react-datepicker__day--highlighted {
    position: relative;
    background-color: transparent;
    color: black;
    
    &:hover {
      background-color: #f0f0f0;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 3px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px; 
      height: 4px;
      background-color: #00CCC0;
      border-radius: 50%;
    }
  }
`;

const FacilityFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 25px;
  background: #f5f5f5;
  border-radius: 0.25rem;
`;

const SearchInput = styled.input`
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 0.875rem;
`;

const SortButton = styled.button`
  background: transparent;
  border: 1px solid #ddd;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background: #e0e0e0;
  }
`;
